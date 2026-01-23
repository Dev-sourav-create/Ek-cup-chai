// import Dbconnect from "@/lib/Dbconnect";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import { sendEmail } from "@/helper/mailHelper";
// import User from "@/models/userSchema";

// await Dbconnect();

// export async function POST(request) {
//   try {
//     const reqBody = await request.json();
//     console.log(reqBody);
//     const { username, email, password } = reqBody;

//     const user = await User.findOne(username);

//     if (user) {
//       return NextResponse.json(
//         { error: "user already exists" },
//         { status: 400 },
//       );
//     }
//     const salt = await bcryptjs.genSalt();
//     const hashedpassword = await bcryptjs.hash(password, salt);

//     const newUser = {
//       username,
//       email,
//       password: hashedpassword,
//     };

//     const savedUser = await newUser.save();
//     console.log(savedUser);

//     //send verification mail
//     await sendEmail({ email, emailType: "VERIFY", userID: savedUser._id });

//     return NextResponse.json({
//       message: "User registered successfully",
//       succes: true,
//       savedUser,
//     });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
