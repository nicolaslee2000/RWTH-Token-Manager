import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { HttpsError, onRequest } from "firebase-functions/v2/https";
import { authenticator, totp } from "otplib";

initializeApp();

// cors TODO
const httpOptions = { cors: true };

exports.getToken = onRequest(httpOptions, async (req, res) => {
  const tokenId: string = req.body.id;
  if (!tokenId) {
    throw new HttpsError(
      "invalid-argument",
      "invalid-argument: no id or secret"
    );
  }
  const snapshot = await getFirestore().collection("tokens").doc(tokenId).get();
  if (!snapshot.exists) {
    res.status(404).send("no token found");
  }
  const secret = snapshot.data();
  if (!secret) {
    throw new HttpsError("unknown", "no secret found");
  }
  const otp = totp.generate(secret.toString());
  res.status(200).send(otp);
});

exports.setToken = onRequest(httpOptions, async (req, res) => {
  const tokenId: string = req.body.id;
  const secret: string = req.body.secret;
  if (!tokenId || !secret) {
    throw new HttpsError("invalid-argument", "no id or secret");
  }
  const otp = authenticator.generate(secret);
  await getFirestore()
    .collection("tokens")
    .doc(tokenId)
    .set({ secret: secret, createdAt: Timestamp.now() });
  res.status(200).send(otp);
});
