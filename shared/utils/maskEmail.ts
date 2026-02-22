/**
 * Mask email for display (e.g., moh***@example.com)
 */

export interface MaskEmailOptions {
  prefix?: number;
  maskLength?: number;
  maskChar?: string;
  lowercaseDomain?: boolean;
}

export function maskEmail(
  email: string,
  options: MaskEmailOptions = {}
): string {
  const {
    prefix = 3,
    maskLength = 4,
    maskChar = "*",
    lowercaseDomain = true,
  } = options;

  if (!email?.trim()) return "";

  const parts = email.split("@");
  if (parts.length !== 2) return email;

  const [local, domain] = parts;
  const maskedLocal =
    local.length <= prefix
      ? local
      : `${local.slice(0, prefix)}${maskChar.repeat(maskLength)}`;
  const finalDomain = lowercaseDomain ? domain.toLowerCase() : domain;

  return `${maskedLocal}@${finalDomain}`;
}
