import User from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server"
import { connect } from "@/dbconfig/dbconfig"
import { sendEmail } from "@/helpers/mailer"

export async function POST(request: NextRequest) {
  try {
    connect()

    const reqBody = await request.json()

    const { email } = reqBody

    console.log(email)

    const user = await User.findOne({
      email
    })

    if (!user) {
      return NextResponse.json({
        status: 400,
        message: "User not found"
      })
    }

    await sendEmail({ email, emailType: "RESET", userId: user._id })

    return NextResponse.json({
      status: 201,
      message: "Email sent, check your inbox"
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message
    })
  }
}
