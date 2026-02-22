"use client";

import React, {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

/** OTP event types for parent handling */
export type OtpActionType = "SEND_OTP" | "RE_SEND_OTP";

export interface OtpEvent {
  actionType: OtpActionType;
  otp: string;
}

interface CustomOtpBoxesProps {
  timer?: number;
  otpLength?: number;
  onOtpEvent: (event: OtpEvent) => void;
  /** Label for resend button - use t() for i18n */
  resendLabel?: string;
}

/**
 * CustomOtpBoxes - Reusable OTP input component
 * Handles: digit input, paste, backspace, countdown timer, resend
 */
export default function CustomOtpBoxes({
  timer = 1,
  otpLength = 6,
  onOtpEvent,
  resendLabel = "Resend OTP",
}: CustomOtpBoxesProps) {
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(""));
  const [displayTime, setDisplayTime] = useState<string>("");
  const [remSeconds, setRemSeconds] = useState<number | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const notifyOtp = useCallback(
    (value: string) => {
      onOtpEvent({ actionType: "SEND_OTP", otp: value });
    },
    [onOtpEvent]
  );

  const startTimer = useCallback(() => {
    let seconds = (timer ?? 1) * 60;
    setRemSeconds(seconds);

    const interval = setInterval(() => {
      seconds -= 1;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      setDisplayTime(`${m}:${s < 10 ? "0" : ""}${s}`);
      setRemSeconds(seconds);

      if (seconds <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }, [timer]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (index < otpLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    notifyOtp(newOtp.join(""));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      notifyOtp(newOtp.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    if (!/^\d+$/.test(pasted) || pasted.length < otpLength) return;

    const digits = pasted.slice(0, otpLength).split("");
    setOtp(digits);
    notifyOtp(digits.join(""));
    inputsRef.current[Math.min(digits.length, otpLength - 1)]?.focus();
  };

  const handleResend = () => {
    if (remSeconds !== null && remSeconds > 0) return;
    onOtpEvent({ actionType: "RE_SEND_OTP", otp: "" });
    startTimer();
  };

  React.useEffect(() => {
    if (timer && timer > 0) startTimer();
  }, [timer, startTimer]);

  return (
    <div className="mt-4" role="group" aria-labelledby="otp-sent-hint">
      <div
        className="flex w-full flex-nowrap justify-between gap-2 max-[385px]:gap-1"
        role="group"
        aria-label="OTP input"
      >
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            className="size-11 min-h-[44px] shrink-0 text-center border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 text-black text-base
              text-2xl max-[320px]:text-xl font-semibold text-gray-800
              outline-none bg-white"
            aria-label={`OTP digit ${idx + 1} of ${otpLength}`}
            aria-describedby={idx === 0 ? "otp-sent-hint" : undefined}
            tabIndex={idx === 0 ? 0 : -1}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-end text-sm gap-4">
        <span className="text-[#1F2436]">
          {remSeconds !== null && remSeconds > 0 ? (
            <span className="text-xs" aria-live="polite">
              {displayTime}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="hover:underline text-primary min-h-[44px] px-2 -ml-2"
              aria-label={`${resendLabel} OTP`}
            >
              {resendLabel} OTP
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
