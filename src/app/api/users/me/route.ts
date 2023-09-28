import { connect } from "@/dbconfig/dbconfig"
import { getTokenData } from "@/helpers/getDataFromToken"
import User from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    connect()
    const token = await getTokenData(request)

    const user = await User.findById(token).select("-password")

    return NextResponse.json({
      message: "User found",
      user
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
