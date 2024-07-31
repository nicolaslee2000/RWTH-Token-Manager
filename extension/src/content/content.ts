import browser from "webextension-polyfill";
// on document load
const init = async () => {
  const url = window.location.href;
  if (!url.endsWith("e1s2")) {
    return;
  }
};

window.addEventListener("load", init);
