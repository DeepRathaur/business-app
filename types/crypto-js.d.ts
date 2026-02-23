declare module "crypto-js" {
  interface WordArray {
    toString(encoder?: unknown): string;
  }
  export const AES: {
    encrypt(message: string, key: string): WordArray;
    decrypt(cipherText: string, key: string): WordArray;
  };
  export const enc: {
    Utf8: unknown;
  };
}
