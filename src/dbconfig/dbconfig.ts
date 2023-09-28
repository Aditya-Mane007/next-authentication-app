import mongoose from "mongoose"

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!)
    const conn = mongoose.connection

    conn.on("connected", () => {
      console.log("MongoDB connected succesfully")
    })

    conn.on("error", (err) => {
      console.log(`MongoDB Error: ${err}`)
      process.exit(1)
    })
  } catch (error: any) {
    console.log("Something went wrong")
    console.log(`Error: ${error}`)
  }
}
