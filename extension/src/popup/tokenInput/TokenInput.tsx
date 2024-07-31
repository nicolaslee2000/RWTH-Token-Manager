import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import "./tokenInput.css";
import browser from "webextension-polyfill";

export default function TokenInput() {
  const SET_TOKEN_URL = "https://settoken-75peuefsoq-uc.a.run.app";
  const [running, setRunning] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [secret, setSecret] = useState("");

  useEffect(() => {
    browser.storage.local.get("studentId").then((obj) => {
      if (Object.keys(obj).length !== 0 && obj.studentId) {
        setStudentId(obj.studentId);
      }
    });
  }, []);

  const handleOnClick = async () => {
    setRunning(true);
    if (studentId.length !== 0) {
      browser.storage.local.set({ studentId: studentId });
    }
    await fetch(SET_TOKEN_URL, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        studentId: studentId,
        tokenId: tokenId,
        secret: secret,
      }),
    }).then((res) => {
      if (!res.ok) {
        alert("ERROR " + res.body);
        console.log(res);
      }
    });
    setRunning(false);
  };
  return (
    <div id="token-input-container">
      <h3 id="subtitle">Create new token</h3>
      <div className="input-text-container">
        <label className="input-label">Student ID: </label>
        <input
          type="text"
          className="input-text"
          placeholder="ab123456"
          value={studentId}
          onChange={(e) => {
            setStudentId(e.target.value);
          }}
        ></input>
      </div>
      <div className="input-text-container">
        <label className="input-label">Token ID: </label>
        <input
          type="text"
          className="input-text"
          placeholder="TOTP46817608"
          value={tokenId}
          onChange={(e) => {
            setTokenId(e.target.value);
          }}
        ></input>
      </div>
      <div className="input-text-container">
        <label className="input-label">Secret Key: </label>
        <input
          type="password"
          className="input-text"
          placeholder="JMKQF7D7BG730AVK3QHHUIFJRP2TZXE2"
          value={secret}
          onChange={(e) => {
            setSecret(e.target.value);
          }}
        ></input>
      </div>
      <Button onclick={handleOnClick} id="create-button" disabled={running}>
        Create
      </Button>
    </div>
  );
}
