// import { initializeApp, cert } from "firebase-admin/app";
// import dotenv from "dotenv";

// dotenv.config();

// const serviceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
// };

// const firebaseAdmin = initializeApp({
//   credential: cert(serviceAccount),
// });

// export default firebaseAdmin;

import { initializeApp, cert } from "firebase-admin/app";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
    "base64"
  ).toString("utf8")
);

const firebaseAdmin = initializeApp({
  credential: cert(serviceAccount),
});

export default firebaseAdmin;