import { connect } from "@/dbconfig/dbconfig"
import User from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    connect()

    const reqBody = await request.json()

    const { email, password } = reqBody

    const userExists = await User.findOne({ email: email })

    if (!userExists) {
      throw new Error("User not found")
    }

    if (userExists && (await bcryptjs.compare(password, userExists.password))) {
      const tokenData = {
        id: userExists._id,
        email: userExists.email,
        username: userExists.username
      }

      const response = NextResponse.json({
        message: "Login successfully",
        status: 201
      })

      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
        expiresIn: "1d"
      })

      response.cookies.set("token", token, {
        httpOnly: true
      })
      return response
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
