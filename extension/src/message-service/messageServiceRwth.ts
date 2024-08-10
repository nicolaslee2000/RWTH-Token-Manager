import { receiveFromContent, sendToContent } from "./messageService";

const VERIFICATION_CODE_KEY = "bongoManagerVerificationCode";

export const sendVerificationCodeRwth = (otp: string) => {
  sendToContent({ [VERIFICATION_CODE_KEY]: otp });
};

export const receiveVerificationCodeRwth = (
  callback: (otp: string) => void
) => {
  receiveFromContent(VERIFICATION_CODE_KEY, callback);
};
