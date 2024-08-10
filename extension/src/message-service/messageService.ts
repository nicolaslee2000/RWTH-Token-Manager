import browser from "webextension-polyfill";

export const sendToContent = async (msg: Record<string, string>) => {
  const [tab] = await browser.tabs.query({ active: true });
  if (tab.id === undefined) {
    return;
  }
  browser.tabs.sendMessage(tab.id, msg);
};

export const receiveFromContent = async (
  key: string,
  callback: (value: string) => void
) => {
  browser.runtime.onMessage.addListener((req) => {
    if (req[key]) {
      callback(req[key]);
    }
  });
};
