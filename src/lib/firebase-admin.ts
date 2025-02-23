import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    // @ts-expect-error there is always a SERVICE_ACCOUNT
    Buffer.from(process.env.SERVICE_ACCOUNT, "base64").toString("utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sharedrop-9ea85-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

export { admin };
