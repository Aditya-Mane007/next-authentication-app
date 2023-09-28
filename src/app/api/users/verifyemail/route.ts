import { connect } from "@/dbconfig/dbconfig"
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/user.model"

export async function POST(request: NextRequest) {
  try {
    connect()
    const reqBody = await request.json()

    const { token } = reqBody

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() }
    })

    if (!user) {
      return NextResponse.json({
        status: 500,
        error: "Invalid token"
      })
    }

    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined
    await user.save()

    return NextResponse.json({
      message: "Email verified",
      status: 201
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      error: error.message
    })
  }
}
