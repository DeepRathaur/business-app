/**
 * Validation utilities - Reusable validation logic
 */

/** Standard email regex - RFC 5322 simplified */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidEmail(email: string): boolean {
  if (!email?.trim()) return false;
  return EMAIL_REGEX.test(email.trim());
}

/** Returns translation key or null */
export function validateEmail(email: string): string | null {
  if (!email?.trim()) return "ErrorMesaage.REQUIRED";
  if (!isValidEmail(email)) return "ErrorMesaage.EMAIL";
  return null;
}

/** Returns translation key or null */
export function validatePassword(password: string): string | null {
  if (!password) return "ErrorMesaage.REQUIRED";
  if (password.length < 6) return "ErrorMesaage.MIN_LENGTH";
  return null;
}

/** Returns translation key or null */
export function validateOtp(otp: string, expectedLength: number): string | null {
  if (!otp || otp.length !== expectedLength) return "message_constant.INVALID_OTP";
  if (!/^\d+$/.test(otp)) return "message_constant.INVALID_OTP";
  return null;
}
