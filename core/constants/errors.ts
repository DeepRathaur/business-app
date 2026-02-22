/**
 * Error message constants - No hardcoded strings in services
 */

export const ERROR_MESSAGES = {
  REQUIRED: "This field is required.",
  EMAIL_INVALID: "Enter a valid e-mail address",
  PASSWORD_MIN: "Password must be at least 6 characters",
  OTP_INVALID: "Please enter a valid OTP",
  SOMETHING_WENT_WRONG: "Something went wrong",
} as const;
