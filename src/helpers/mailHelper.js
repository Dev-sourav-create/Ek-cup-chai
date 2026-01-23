// import nodemailer from "nodemailer";
// import { v4 as uuidv4 } from "uuid";
// import dbConnect from "@/dbConnect/dbConnect";
// import User from "@/models/userSchema";

// await dbConnect();
// export const sendEmail = async ({ email, emailType, userID }) => {
//   try {
//     const hashedtoken = uuidv4();

//     if ((emailType = "VERIFY")) {
//       await User.findByIdAndUpdate(userID, {
//         verifyToken: hashedtoken,
//         verifyTokenExpiry: Date.now() + 3600000,
//       });
//     } else if ((emailType = "RESET")) {
//       await User.findByIdAndUpdate(userID, {
//         forgotPasswordToken: hashedtoken,
//         forgotPasswordTokenExpiry: Date.now() + 36000000,
//       });
//     }
//     const transporter = nodemailer.createTransport({
//       host: "smtp.example.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: "Ekcupchai@support.com",
//       to: email,
//       subject:
//         emailType === "VERIFY" ? "Verify your email" : "Reset your password",
//       html: `
//         <p>
//           Click <a href="${
//             process.env.DOMAIN
//           }/${emailType === "VERIFY" ? "verifyemail" : "resetpassword"}?token=${hashedtoken}">
//           here</a> to ${
//             emailType === "VERIFY" ? "verify your email" : "reset your password"
//           }
//         </p>
//       `,
//     };

//     const response = await transporter.sendMail(mailOptions);
//     return response;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
