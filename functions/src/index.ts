import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { HttpsError, onRequest } from "firebase-functions/v2/https";
import { authenticator } from "otplib";

initializeApp();

// cors TODO
const httpOptions = { cors: true };
exports.testfunction = onRequest(async (req, res) => {
  res.status(200).send("all working");
});

exports.getToken = onRequest(httpOptions, async (req, res) => {
  const studentId: string = req.body.studentId;
  if (!studentId) {
    throw new HttpsError("invalid-argument", "invalid-argument: no student id");
  }
  const snapshot = await getFirestore()
    .collection("tokens")
    .doc(studentId)
    .get();
  if (!snapshot.exists) {
    res.status(404).send("no token found");
  }
  const secret = snapshot.data()!.secret;
  const tokenId = snapshot.data()!.tokenId;
  if (!secret || !tokenId) {
    throw new HttpsError("unknown", "no secret found");
  }
  const otp = authenticator.generate(secret.toString());
  res.status(200).json({ tokenId: tokenId, totp: otp });
});

exports.setToken = onRequest(httpOptions, async (req, res) => {
  const studentId: string = req.body.studentId;
  const tokenId: string = req.body.tokenId;
  const secret: string = req.body.secret;
  if (!tokenId || !secret || !studentId) {
    throw new HttpsError("invalid-argument", "no id or secret");
  }
  const otp = authenticator.generate(secret);
  await getFirestore()
    .collection("tokens")
    .doc(studentId)
    .set({ tokenId: tokenId, secret: secret, createdAt: Timestamp.now() });
  res.status(200).send(otp);
});
