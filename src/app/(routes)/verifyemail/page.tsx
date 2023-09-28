"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

const page = () => {
  const [token, setToken] = useState("")
  const [verifed, setVerified] = useState(false)
  const [error, setError] = useState(false)

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token })
      setVerified(true)
    } catch (error: any) {
      setError(true)
      console.log(error.response.message)
    }
  }

  useEffect(() => {
    const url = window.location.search.split("=")[1]
    setToken(url || "")
  }, [])

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail()
    }
  }, [token])
  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-2">
      <h1 className="text-4xl my-5">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : "No token"}
      </h2>

      {verifed && (
        <div className="my-5 flex flex-col justify-around">
          <h2>Email Verified</h2>
          <Link
            href="/sign-in"
            className="my-5 py-2 bg-black hover:opacity-0.5 text-white rounded-lg text-center"
          >
            Sign-in
          </Link>
        </div>
      )}

      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">Error</h2>
        </div>
      )}
    </div>
  )
}

export default page
