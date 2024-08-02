import browser from "webextension-polyfill";
import $, { Event } from "jquery";
// on document load
const init = async () => {
  const enabled = await browser.storage.local
    .get("status")
    .then((item) => item.status);
  if (!enabled) {
    return;
  }
  const url = window.location.href;

  if (url.startsWith("https://moodle.rwth-aachen.de")) {
    loginPage0();
  } else if (url.endsWith("1")) {
    loginPage1();
  } else if (url.endsWith("2")) {
    loginPage2();
  } else if (url.endsWith("3")) {
    loginPage3();
  }
};

const loginPage0 = () => {
  const btn = $('a[href="auth/shibboleth/index.php"]');
  if (btn.length === 0) {
    return;
  }
  window.location.href = "auth/shibboleth/index.php";
};

const loginPage1 = async () => {
  const studentId = $("#username");
  const password = $("#password");
  const loginButton = $("#login");
  loginButton.on("click", (e) => {
    browser.storage.local.set({ studentId: studentId.first().val() });
  });
  if (
    (studentId.first().val() as string).length !== 0 &&
    (password.first().val() as string).length !== 0
  ) {
    loginButton.trigger("click");
  }
};
const loginPage2 = async () => {
  const URL = "https://gettoken-75peuefsoq-uc.a.run.app";

  const studentId = (await browser.storage.local.get("studentId")).studentId;
  await fetch(URL, {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      studentId: studentId,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      selectToken(json.tokenId);
    });
};
const loginPage3 = async () => {
  const URL = "https://gettoken-75peuefsoq-uc.a.run.app";
  const studentId = (await browser.storage.local.get("studentId")).studentId;
  await fetch(URL, {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      studentId: studentId,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      $("#fudis_otp_input").val(json.totp);
      $("button[type='submit'").first().trigger("click");
    });
};

const selectToken = (tokenId: string) => {
  const options = $("#fudis_selected_token_ids_input option");
  for (const option of options) {
    if ($(option).val()?.toString() === tokenId) {
      $(option).attr("selected", "selected");
      $("button[type='submit'").first().trigger("click");
    }
  }
};

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    init();
  }
});
