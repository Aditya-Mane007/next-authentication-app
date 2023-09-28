"use client"
import { sendEmail } from "@/helpers/mailer"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const page = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>("")

  async function logout() {
    try {
      setIsLoading(true)
      await axios.get("/api/users/logout")
      router.push("/sign-in")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }


  async function getDetails() {
    const res = await axios.get("/api/users/me")
    setData(res.data.user)
  }

  useEffect(() => {
    getDetails()
  }, [])

  return (
    <div className="w-full min-h-screen flex flex-col items-start">
      <div
        className="w-auto h-15 m-5 px-5 py-3 bg-black hover:opacity-75 rounded-lg text-white font-semibold tracking-wide cursor-pointer flex justify-end"
        onClick={logout}
      >
        {isLoading ? "Logging out" : "Logout"}
      </div>

    </div>
  )
}

export default page
