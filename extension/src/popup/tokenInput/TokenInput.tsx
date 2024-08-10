import React, { useState } from "react";
import Button from "../button/Button";
import "./tokenInput.css";
import { setTokenInfo, TokenInfo } from "../../storage/storage";
import { authenticator } from "otplib";
import { sendToContent } from "../../message-service/messageService";
import { sendVerificationCodeRwth } from "../../message-service/messageServiceRwth";

export default function TokenInput() {
  const [info, setInfo] = useState<TokenInfo>({
    tokenId: "",
    tokenSecret: "",
  });
  const [running, setRunning] = useState(false);
  const [otp, setOtp] = useState("");

  const handleOnClick = async () => {
    if (info.tokenId.length === 0 || info.tokenSecret.length === 0) {
      return;
    }
    setRunning(true);
    setTokenInfo(info);
    const otp = authenticator.generate(info.tokenSecret);
    setOtp(otp);
    sendVerificationCodeRwth(otp);
    setRunning(false);
  };
  return (
    <div id="token-input-container">
      <h3 id="subtitle">Create new token</h3>
      <div className="input-text-container">
        <label className="input-label">Token ID: </label>
        <input
          type="text"
          className="input-text"
          placeholder="TOTP46817608"
          value={info.tokenId}
          onChange={(e) => {
            setInfo({ ...info, tokenId: e.target.value });
          }}
        ></input>
      </div>
      <div className="input-text-container">
        <label className="input-label">Secret Key: </label>
        <input
          type="password"
          className="input-text"
          placeholder="JMKQF7D7BG730AVK3QHHUIFJRP2TZXE2"
          value={info.tokenSecret}
          onChange={(e) => {
            setInfo({ ...info, tokenSecret: e.target.value });
          }}
        ></input>
      </div>
      <Button onclick={handleOnClick} id="create-button" disabled={running}>
        Create
      </Button>
      {otp.length > 0 ? (
        <div>
          <label>Verification Code:</label>
          <div>{otp}</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
