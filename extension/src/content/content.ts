import browser from "webextension-polyfill";
import $ from "jquery";
// on document load
const init = async () => {
  const url = window.location.href;
  if (url.endsWith("1")) {
    loginPage1();
  } else if (url.endsWith("2")) {
    loginPage2();
  } else if (url.endsWith("3")) {
    loginPage3();
  }
};

const loginPage1 = () => {
  $("#login").on("click", (e) => {
    const studentId = $($("#username")[0] as HTMLInputElement).val();
    if (!studentId) {
      alert("Bongo Manager: no studentId detected");
    }
    browser.storage.local.set({ studentId: studentId });
  });
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
      $("button[type='submit'").first().click();
    });
};

const selectToken = (tokenId: string) => {
  const options = $("#fudis_selected_token_ids_input option");
  for (const option of options) {
    if ($(option).val()?.toString() === tokenId) {
      $(option).attr("selected", "selected");
      $("button[type='submit'").first().click();
    }
  }
};

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    init();
  }
});
