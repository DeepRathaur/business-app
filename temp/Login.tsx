"use client";

import { ChangeEvent, useContext, useEffect, useState } from "react";
import Password from "@/shared/components/password/password";
import CustomOtpBoxes from "@/shared/components/custom-otp-boxes/CustomOtpBoxes";
import ShowError from "@/shared/components/show-error/ShowError";
import { ConfigContext } from "../../context/ConfigContext";
import Email from "@/shared/components/email/email";
import { UserService } from "@/core/service/user/UserService";
import { SendOtpModel } from "@/core/interface/user/user";
import { CommunicationTypeEnum } from "@/core/enum/communication.enum";
import { LoginModel } from "@/core/model/login.model";
import { errorMsg } from "@/core/constant/error.constants";
import { CryptoService } from "@/core/service/CipherService";
import { LoginResponseModel } from "@/core/model/response-model/login-response.model";
import { ResponseCodeEnum } from "@/shared/enum";
import { SendotpResponseModel } from "@/core/model/response-model/send-otp-response.model";
import { actionType, LanguageMessageEnum } from "@/core/enum";
import { OpcoConfig, PatternModel, validationModel } from "@/shared/models";
import { Ievent } from "@/core/interface";
import { ReSendOtpModel, VerifyOtpModel } from "@/core/enum/send-otp.model";
import { VerifyOtpResponseModel } from "@/core/model/response-model/verify-otp-response.model";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ToastType } from "@/shared/enum/toaster.enum";
import { message_constant } from "@/shared/constant/message.constant";
import { useMaskedEmail, useTranslate } from "@/hooks";
import { useToast } from "@/context/ToastProvider";
import { loginUser, sendOtpLogin } from "@/services/masterService";
import { fetchClient } from "@/core/api/fetchClient";
// import * as Sentry from '@sentry/nextjs';
import Spinner from "@/shared/components/Spinner/Spinner";
import Link from "next/link";
import BackButtonAuth from "@/shared/components/back-button/BackButtonAuth";
import { WaveCard } from "@/shared/components/WaveCard";
import { useLayout } from "@/context/LayoutContext";


type errorType = {
  email?: string;
  password?: string;
  otp?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", otp: "" });
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [errorForm, setErrorForm] = useState<errorType>({
    email: "",
    password: "",
    otp: "",
  });
  const { config, loading, error } = useContext(ConfigContext);
  const [isEncrypted, setIsEncrypted] = useState<boolean | undefined>();

  const [loginPass, setLoginPass] = useState<any>(false);

  const [validation, setValidation] = useState<validationModel | null>(null);
  const [opcoConfig, setOpcoConfig] = useState<OpcoConfig>();
  const [minute, setMinute] = useState<number>();
  const [pattern, setPattern] = useState<PatternModel>();
  const [cipher] = useState(new CryptoService());
  const [userService] = useState(new UserService());
  const [otpId, setOtpId] = useState<string>("");
  const [otpLength, setOtpLength] = useState<number>();
  const [isUserValid, setIsUserValid] = useState<boolean>(false);
  const [secretKey, setSecretKey] = useState<string>();
  const t = useTranslate();
  const { showToast } = useToast();
  const emailHint = 'An OTP has been sent to ';

  const maskedEmail = useMaskedEmail(form.email ?? '', {
    prefix: 3,       // "moh"
    maskLength: 4,   // "XXXX"
    maskChar: '*',
    lowercaseDomain: true,
  });

  const { setHideHeader } = useLayout();


  useEffect(() => {
    const configuration = config?.result?.public;
    setHideHeader(false);
    if (configuration) {
      const opcoConfig = configuration.OPCO_CONFIG;
      const validations = opcoConfig?.VALIDATIONS;
      const pattern = configuration.PATTERN;

      if (opcoConfig && validations && pattern) {
        setValidation(validations as validationModel);
        setIsEncrypted(opcoConfig.ENCRYPTION as boolean | undefined);
        setOpcoConfig(opcoConfig);
        setMinute(opcoConfig.OTP_EXPIRY_TIME);
        setOtpLength(validations.otpMaxlength);
        setPattern(pattern);
      }
    }
  }, [config]);

  const { loginAuth } = useAuth();
  const validateEmail = (email: string) => {
    const regex = new RegExp(pattern?.VALID_EMAIL as string);
    return regex.test(email);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (form.email !== value) setIsUserValid(false);
    setForm({ ...form, email: e.target.value });

    if (!validateEmail(value)) {
      setErrorForm({ ...errorForm, email: errorMsg.EMAIL });
    } else {
      setErrorForm({ ...errorForm, email: "" });
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setErrorForm({ ...errorForm, password: errorMsg.REQUIRED });
    } else {
      setErrorForm({ ...errorForm, password: "" });
    }
    setForm({ ...form, password: e.target.value });
  };

  const getErrorMessage = (key: string, value: string) => {
    // Simulate error message mapping
    return value;
  };

  const getText = (message: string) => {
    // Simulate language translation
    return message;
  };

  const validate = () => {
    const validation: errorType = {
      email: "",
      password: "",
    };
    validateEmailPassword(validation);
    if (!validation.email && !validation.password) {
      const input = new LoginModel("", "");
      input.password = form.password;
      input.username = form.email.toLowerCase().trim();
      // this.f.terms.setValue(true);
      login(input);
    }
  };

  const validateEmailPassword = (validation: errorType) => {
    // Basic validation
    if (!form.email) {
      validation.email = errorMsg.REQUIRED;
    } else if (!validateEmail(form.email)) {
      validation.email = errorMsg.EMAIL;
    }

    if (!form.password) {
      validation.password = errorMsg.REQUIRED;
    }
    else if (form.password.length < 6) {
      // validation.password = errorMsg.PASSWORD_TOO_SHORT;
    }

    // If there are validation errors, set them and stop
    if (validation.email || validation.password) {
      setIsDisable(false);
      setErrorForm(validation);
      return;
    }
  };

  const login = async (input: LoginModel) => {
    if (isEncrypted) {
      cipher
        .encrypt(JSON.stringify(input))
        .then((encrypted) => performLogin(encrypted))
        .catch((error) => {
          // Sentry.captureException(error);
        });
    } else {
      performLogin(input);
    }
  };

  const performLogin = async (input: string | LoginModel) => {
    const isEnableUms2 =
      config?.result?.public?.OPCO_CONFIG?.ENABLE_UMS_2 || false;

    setIsDisable(true);
    await loginUser(input, isEncrypted ?? false, isEnableUms2)
      .then((response: LoginResponseModel) => {
        switch (response.statusCode) {
          case ResponseCodeEnum.LOGIN_SUCCESS:
          case ResponseCodeEnum.UMS2_LOGIN_SUCCESS:
            setLoginPass(true);
            setErrorForm({
              email: "",
              password: "",
            });
            const subscriber = response.result?.subscribers;
            const secretKey = response.result?.secretKey;
            setSecretKey(secretKey);
            sendOtp(secretKey);
            break;
          case ResponseCodeEnum.INCORRECT_USERNAME_PASSWORD:
          case ResponseCodeEnum.INCORRECT_USERNAME:
            setErrorForm({
              email: "",
              password: response.message,
            });
            showToast(
              response.message || message_constant.SOMETHING_WENT_WRONG,
              ToastType.error
            );
            setIsDisable(false);
            break;
          case ResponseCodeEnum.FAILED_TO_AUTHENTICATE:
          case ResponseCodeEnum.AUTH_FAILED:
            setIsDisable(false);
            showToast(
              response.message || message_constant.SOMETHING_WENT_WRONG,
              ToastType.error
            );
            break;

          case ResponseCodeEnum.FAILE:
            showToast(
              response.message || message_constant.SOMETHING_WENT_WRONG,
              ToastType.error
            );
            setIsDisable(false);
            break;

          case ResponseCodeEnum.SECRET_KEY_USED:
            showToast(
              response.message || message_constant.SOMETHING_WENT_WRONG,
              ToastType.error
            );
            setIsDisable(false);
            break;

          default:
            showToast(
              response.message || message_constant.SOMETHING_WENT_WRONG,
              ToastType.error
            );
            setIsDisable(false);
            break;
        }
      })
      .catch((error) => {
        setErrorForm({
          email: "",
          password: errorMsg.error,
        });
        setIsDisable(false);
        showToast(
          error.message || message_constant.SOMETHING_WENT_WRONG,
          ToastType.error
        );
        // Sentry.captureException(error);
      });
  };

  const getAccountDetails = async (secretKey: string = "") => {
    try {
      const data = await fetchClient("/account/details", {
        method: "GET",
      });
      console.log(data);
    } catch (err) {
      console.error("Failed to fetch account details", err);
    }
  };

  const sendOtp = async (secretKey: string = "") => {
    const isEnableUms2 =
      config?.result?.public?.OPCO_CONFIG?.ENABLE_UMS_2 || false;
    console.log(isEnableUms2);
    // try {
    //   let input: any;
    //   if (form.email) {
    //     input = {
    //       communicationType: CommunicationTypeEnum.EMAIL,
    //       username: form.email,
    //       secretKey: secretKey,
    //     };
    //     setLoginPass(false);
    //     const response = await fetchClient("/bfe/web/userm/api/user-mngmnt/v3/send-otp", {
    //       method: "POST",
    //       body: input,
    //     });
    //     if (response && response.statusCode === ResponseCodeEnum.SUCCESS) {
    //       showToast(response.message, ToastType.success);
    //       const isUserValid = true;
    //       const otpId = response.result?.otpId ?? "";
    //       setOtpId(otpId);
    //       setIsDisable(false);
    //       setIsUserValid(isUserValid);
    //     } else {
    //       showToast(response.message, ToastType.error);
    //     }
    //   }
    // } catch (err) {
    //   console.error("Failed to fetch account details", err);
    //   Sentry.captureException(err);
    // }

    try {
      let input: SendOtpModel;
      if (form.email) {
        input = {
          communicationType: CommunicationTypeEnum.EMAIL,
          username: form.email,
          secretKey: secretKey
        }
        setLoginPass(false);
        const response = await sendOtpLogin(input, isEnableUms2);
        setLoginPass(true);
        if (response && response.statusCode === ResponseCodeEnum.SUCCESS) {
          showToast(response.message, ToastType.success);
          const isUserValid = true;
          const otpId = response.result?.otpId ?? '';
          setOtpId(otpId);
          setIsDisable(false)
          setIsUserValid(isUserValid);
          setHideHeader(true);
          setMinute(opcoConfig?.OTP_EXPIRY_TIME);
        } else {
          showToast(response.message, ToastType.error);
        }
      } else {
        showToast('Form Email not found', ToastType.error);
        // Sentry.captureException(err);
      }
    } catch (error) {

      getAccountDetails(secretKey);

      setIsDisable(false);
      setLoginPass(error);
      showToast(`In Send Otp Cache ${error}`, ToastType.error);
      setErrorForm({
        email: '',
        password: errorMsg.error
      });
      // Sentry.captureException(error);
    } finally {
    }
  };

  const onOtpEvent = (event: Ievent) => {
    switch (event.actionType) {
      case actionType.RE_SEND_OTP:
        onResendClick();
        break;

      case actionType.SEND_OTP:
        let otp = "";
        if (event?.otp && event?.otp?.length === validation?.otpMaxlength) {
          otp = event.otp;
        } else {
          otp = "";
        }
        setForm({ ...form, otp: otp });
        break;
    }
  };

  const verifyOtp = () => {
    if (form.otp.length === otpLength) {
      const isEnableUms2 =
        config?.result?.public?.OPCO_CONFIG?.ENABLE_UMS_2 || false;
      setIsDisable(true);
      const input = new VerifyOtpModel();
      input.otp = form.otp;
      input.otpId = otpId;
      input.username = form.email.toLowerCase().trim();
      input.secretKey = secretKey as string;

      userService
        .verifyLoginOtp(input, isEnableUms2)
        .then((response: VerifyOtpResponseModel) => {
          setIsDisable(false);
          switch (response.statusCode) {
            case ResponseCodeEnum.SUCCESS:
              setHideHeader(true);
              showToast(response.message, ToastType.success);
              const token = `${response.result?.tokenType} ${response.result?.accessToken}`;
              loginAuth(token as string);
              router.push("/fetch-permission");
              break;
            case ResponseCodeEnum.INVALID_OTP:
            case ResponseCodeEnum.UMS2_INVALID_OTP:
            case ResponseCodeEnum.VERIFY_OTP_FAIL:
              showToast(
                response.message || message_constant.SOMETHING_WENT_WRONG,
                ToastType.error
              );
              break;
            case ResponseCodeEnum.UMS2_OTP_EXPIRED:
              showToast(
                response.message || message_constant.SOMETHING_WENT_WRONG,
                ToastType.error
              );
              break;
            case ResponseCodeEnum.SECRET_KEY_EXPIRED:
              showToast(
                response.message || message_constant.SOMETHING_WENT_WRONG,
                ToastType.error
              );
              break;
            case ResponseCodeEnum.UMS2_DOWNSTREAM_ISSUE:
              showToast(
                response.message || message_constant.SOMETHING_WENT_WRONG,
                ToastType.error
              );
              break;
            default:
              showToast(
                response.message || message_constant.SOMETHING_WENT_WRONG,
                ToastType.error
              );
              break;
          }
        })
        .catch((error) => {
          setIsDisable(false);
          // Sentry.captureException(error);
        });
    }
  };

  const onResendClick = () => {
    setMinute(0);
    const isEnableUms2 =
      config?.result?.public?.OPCO_CONFIG?.ENABLE_UMS_2 || false;

    setIsDisable(true);
    if (!errorForm.email && !errorForm.password) {
      // this._loader.show();
      const input = new ReSendOtpModel();
      if (!opcoConfig?.ENABLE_UMS_2) input.otpId = otpId;
      input.communicationType = CommunicationTypeEnum.EMAIL;
      input.username = form.email.toLowerCase().trim();
      userService.resendOtp(input, isEnableUms2).then(
        (response: SendotpResponseModel) => {
          // this._loader.hide();
          if (response.statusCode === ResponseCodeEnum.SUCCESS) {
            let otpId = response?.result?.otpId as string;
            setOtpId(otpId);
            setMinute(opcoConfig?.OTP_EXPIRY_TIME as number);
            setIsDisable(false);

            showToast(LanguageMessageEnum.OTP_RESEND_SUCCESS, ToastType.success);
          } else {
            setIsDisable(false);
            showToast(LanguageMessageEnum.OTP_RESEND_FAILED, ToastType.error);
          }
        },
        (error: any) => {
          setIsDisable(false);
          setErrorForm({
            email: "",
            password: error,
          });
          // this._loader.hide();
          // this._toaster.show(ToastType.error, error.message || message_constant.SOMETHING_WENT_WRONG);
        }
      );
    }
  };

  const [agreed, setAgreed] = useState(true);

  const handleCheckboxChange = () => {
    setAgreed(!agreed);
  };

  const onBack = () => {
    setIsUserValid(false);
    setHideHeader(false);
  }

  const navigateToPayBill = () => {
    console.log(123)
    router.push("/pay-bill");
  }

  return (
    <>
      {
        !isUserValid && (
          <>
            <section className="mt-6 rounded-xl bg-white px-4 pb-3 pt-3 mx-2.5 shadow-lg">
              <Email
                form={form}
                errorForm={errorForm}
                handleEmailChange={handleEmailChange}
                getErrorMessage={getErrorMessage}
                getText={getText}
                headerText={t('USER_REGISTRATION.EMAILID')}
              />
              <Password handlePasswordChange={handlePasswordChange} />
              <div className='pt-2'>
                <Link href="/forgot-password" className="text-right text-xs text-[#2286FF]"> 
                  <span className="text-right w-full block">
                    {t("USER_LOGIN.FORGOT_PASSWORD")}
                  </span>
                </Link>
              </div>
              <button
                type="button"
                disabled={isDisable}
                className={`w-[100%] text-sm flex justify-center button mt-6 mb-6 ${isDisable ? "button-disabled " : ''}`}
                onClick={!isUserValid ? validate : verifyOtp}
              >
                {isDisable ? (
                  <Spinner />
                ) : !isUserValid ? (
                  t('BUTTONS.VALIDATE_GET_OTP')
                ) : (
                  t('BUTTONS.LOGIN')
                )}
              </button>

            </section>


            <section>
              <div className="relative z-[1] flex h-full items-start justify-center">
                <h1 className="mt-6 text-center text-sm text-gray-700">
                  New to the Ecare?  <a href="/register"
                    className="red-color font-bold hover:underline">{t("USER_LOGIN.REGISTER_NOW")}</a>
                </h1>
              </div>

              <div className="w-full relative md:relative vh700:absolute vh700:bottom-0 vh700:left-0 vh700:right-0 relative">
                {/* back wave */}
                <svg
                  className="absolute inset-x-0 top-0 w-full"
                  viewBox="0 0 390 225"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="wave_back" x1="195" y1="0" x2="195" y2="225" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#DB3C3B" stopOpacity="0.03" />
                      <stop offset="1" stopColor="#6E1E1E" stopOpacity="0.03" />
                    </linearGradient>
                  </defs>
                  {/* <path
                    d="M0 26.181C0 26.181 18.6376 0 54.6682 0C81.4304 0 108.194 28.481 135.915 28.481C163.637 28.481 199.463 8.915 225.546 8.915C268.623 8.915 261.721 21.291 277.585 25.054C293.449 28.817 360.087 -7.18401 389.999 11.736C389.999 38.923 389.999 225 389.999 225H0V26.181Z"
                    fill="url(#wave_back)"
                  /> */}
                </svg>

                {/* front wave */}
                <svg
                  className="absolute inset-x-0 h-[100%] w-full"
                  viewBox="0 0 390 225"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="wave_front" x1="195" y1="0" x2="195" y2="225" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#DB3C3B" stopOpacity="0.05" />
                      <stop offset="1" stopColor="#6E1E1E" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 40C20 22 40 6 70 10c26 3 61 34 92 34 34 0 66-21 103-20 32 1 41 13 58 18 16 5 37-12 67 6V225H0V40Z"
                    fill="url(#wave_front)"
                  />
                </svg>


                {/* content */}
                <div className="px-6 pt-17 pb-10 relative z-10">
                  <div className="mb-6 flex items-center gap-3 text-sm text-neutral-500">
                    <span className="h-px flex-1 bg-neutral-300/70" />
                    <span className="text-sm font-medium tracking-wide text-black">Quick Actions</span>
                    <span className="h-px flex-1 bg-neutral-300/70" />
                  </div>

                  <button
                    type="button"
                    className="mt-5 w-full rounded-md bg-[#141a2a] text-white py-3 text-sm font-medium hover:opacity-95 transition"
                    onClick={navigateToPayBill}
                  >
                    Pay Bill
                  </button>

                  <p className="mt-6 text-center text-sm text-gray-600">Need Support?</p>
                </div>

              </div>

            </section>
          </>
        )
      }
      {
        isUserValid && (
          <>
            <section>
              <div className="sticky z-[100] p-4 w-full">
                <BackButtonAuth
                  title="Back"
                  onBack={() => onBack()}
                />
              </div>
            </section>
            <section>
              <div className="mt-6 text-center">
                <h1 className="text-sm font-semibold text-gray-800 max-[320px]:text-[16px]">
                  OTP Verification
                </h1>
                <p className="mt-2 text-sm text-gray-600 max-[320px]:text-[13px] max-[300px]:text-[12px]">
                  {emailHint + maskedEmail
                  }
                </p>
              </div>
            </section>
            <section>
              <div>
                <CustomOtpBoxes
                  timer={minute}
                  otpLength={otpLength}
                  onOtpEvent={onOtpEvent}
                />
              </div>
            </section>
            <section className="px-5">
              <button
                type="button"
                disabled={isDisable}
                className={`w-[100%] text-sm flex justify-center button mt-5 ${isDisable ? "button-disabled " : ''}`}
                onClick={!isUserValid ? validate : verifyOtp}
              >
                {isDisable ? (
                  <Spinner />
                ) : !isUserValid ? (
                  t('BUTTONS.VALIDATE_GET_OTP')
                ) : (
                  t('BUTTONS.LOGIN')
                )}
              </button>
            </section>
          </>
        )
      }
    </>
  );
}
