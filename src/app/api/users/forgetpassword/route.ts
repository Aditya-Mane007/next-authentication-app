import { connect } from "@/dbconfig/dbconfig"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    connect()
    const reqBody = await request.json()

    const { token, password } = reqBody

    const user = await User.findOne({
      forgetPaPasswordToken: token,
      forgetPasswordTokenExpiry: { $gt: Date.now() }
    })

    if (!user) {
      return NextResponse.json({
        status: 500,
        message: "User not found"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.forgetPaPasswordToken = undefined
    user.forgetPasswordTokenExpiry = undefined
    await user.save()

    return NextResponse.json({
      status: 201,
      message: "Password has been changed"
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message
    })
  }
}
