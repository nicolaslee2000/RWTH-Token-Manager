import React, { useEffect, useState } from "react";
import "./App.css";
import browser from "webextension-polyfill";
import ReactSwitch from "react-switch";
import TokenInput from "./tokenInput/TokenInput";

export default function App() {
  const [enabled, setEnabled] = useState<boolean>(false);
  useEffect(() => {
    browser.storage.local.get("status").then((item) => {
      setEnabled(item.status ?? true);
    });
  });

  const handleOnClick = async () => {
    const tabs = await browser.tabs.query({ active: true });
    await browser.storage.local.set({ status: !enabled });
    setEnabled(!enabled);
    await browser.tabs.reload(tabs[0].id);
  };
  return (
    <div id="app">
      <div id={enabled ? "" : "overlay"}></div>
      <div id="flex-container">
        <div id="title-container">
          <h2 id="title">Token Manager</h2>
          <ReactSwitch
            checked={enabled}
            onChange={handleOnClick}
            offColor="#818183"
            onColor="#644dde"
            checkedIcon={false}
            uncheckedIcon={false}
            height={20}
            width={40}
          />
        </div>
        <div className="divider"></div>
        <TokenInput></TokenInput>
      </div>
    </div>
  );
}
