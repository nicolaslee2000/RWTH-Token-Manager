import $ from "jquery";
import { authenticator } from "otplib";
import { isExtensionEnabled } from "../storage/storage";
import { receiveFromContent } from "../message-service/messageService";
import { receiveVerificationCodeRwth } from "../message-service/messageServiceRwth";

const init = async () => {
  console.log("Bongo Manager initialized");
  if (!(await isExtensionEnabled())) {
    return;
  }

  const url = window.location.href;
  if (url.startsWith("https://idm.rwth-aachen.de")) {
    tokenManagerPage();
  } else if (url.startsWith("https://moodle.rwth-aachen.de")) {
    loginPage0();
  } else if ($("#password").length !== 0) {
    loginPage1();
  } else if ($("#fudis_selected_token_ids_input").length !== 0) {
    loginPage2();
  } else if ($("#fudis_otp_input").length !== 0) {
    loginPage3();
  }
};

const tokenManagerPage = async () => {
  const match = $("div")
    .filter(function (i, e) {
      return (
        $(this).text().startsWith("Der Token mit der Seriennummer") ||
        $(this).text().startsWith("A token with serial number")
      );
    })
    .first()
    .text()
    .match(/\bTOTP\w*\b/);
  const tokenId = match ? match[0] : "";

  const tokenSecretBtn = $(
    "a:contains('Token secret'), a:contains('Token-Geheimnis')"
  );
  let secret = tokenSecretBtn.next().children().eq(1).children().first().text();
  if (!secret) {
    tokenSecretBtn.get(0)?.click();
    secret = tokenSecretBtn.next().children().eq(1).children().first().text();
  }
  receiveVerificationCodeRwth((token) => {
    $("input[name=otpTestInput]").val(token);
  });
};

const loginPage0 = () => {
  const btn = $('a[href="auth/shibboleth/index.php"]');
  if (btn.length === 0) {
    return;
  }
  window.location.href = "auth/shibboleth/index.php";
};

const loginPage1 = async () => {
  // const test = await getTokenInfoLocal();
  // console.log(test);
  // const studentId = $("#username").first().val()?.toString() ?? "";
  // const password = $("#password").first().val()?.toString() ?? "";
  // $("form").on("submit", () => {
  //   setTokenInfoSession({ rwthStudentId: studentId });
  // });
  // if (studentId.length !== 0 && password.length !== 0) {
  //   $("#login").trigger("click");
  // }
};

const loginPage2 = async () => {
  // const URL = "https://gettoken-75peuefsoq-uc.a.run.app";
  // const { _, tokenId, secret } = await getTokenInfoLocal();
  // if (!tokenId || !secret) {
  // }
  // studentId = (await browser.storage.local.get("studentId")).studentId;
  // await fetch(URL, {
  //   headers: { "content-type": "application/json" },
  //   method: "POST",
  //   body: JSON.stringify({
  //     studentId: studentId,
  //   }),
  // })
  //   .then((res) => res.json())
  //   .then((json) => {
  //     selectToken(json.tokenId);
  //   });
};
const loginPage3 = async () => {
  // const URL = "https://gettoken-75peuefsoq-uc.a.run.app";
  // const studentId = (await browser.storage.local.get("studentId")).studentId;
  // await fetch(URL, {
  //   headers: { "content-type": "application/json" },
  //   method: "POST",
  //   body: JSON.stringify({
  //     studentId: studentId,
  //   }),
  // })
  //   .then((res) => res.json())
  //   .then((json) => {
  //     $("#fudis_otp_input").val(json.totp);
  //     $("button[type='submit'").first().trigger("click");
  //   });
};

const selectToken = (tokenId: string) => {
  // const options = $("#fudis_selected_token_ids_input option");
  // for (const option of options) {
  //   if ($(option).val()?.toString() === tokenId) {
  //     $(option).attr("selected", "selected");
  //     $("button[type='submit'").first().trigger("click");
  //   }
  // }
};

init();
