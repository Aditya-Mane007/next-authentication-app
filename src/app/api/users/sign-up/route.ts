import { connect } from "@/dbconfig/dbconfig"
import User from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer"

connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { username, email, password } = reqBody

  

    //check if user already exists
    const user = await User.findOne({ email })

    if (user) {
      throw new Error("User already exists")
    }

    //hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    const savedUser = await newUser.save()

    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
