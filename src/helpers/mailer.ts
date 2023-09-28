import nodemailer from "nodemailer"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Create a hash token
    const hashedToken = await bcrypt.hash(userId.toString(), 10)

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000
      })
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgetPaPasswordToken: hashedToken,
        forgetPasswordTokenExpiry: Date.now() + 3600000
      })
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "bb41d9609bdb5b",
        pass: "c644a35177e9a6"
      }
    })

    const mailOptions = {
      from: "adityamane27023@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email." : "Resest your password",
      html:
        emailType === "VERIFY"
          ? `
      <p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
              emailType === "VERIFY" ? "verify email" : "reset your password"
            } or copy paste the below link in your browser 
      <br>
      ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>
      `
          : `
      <p>Click <a href="${
        process.env.DOMAIN
      }/resetPassword?token=${hashedToken}">here</a> to ${
              emailType === "VERIFY" ? "verify email" : "reset your password"
            } or copy paste the below link in your browser 
      <br>
      ${process.env.DOMAIN}/resetPassword?token=${hashedToken}
      </p>
      `
    }

    const mailresponse = await transporter.sendMail(mailOptions)

    return mailresponse
  } catch (error: any) {
    throw new Error(error.message)
  }
}
