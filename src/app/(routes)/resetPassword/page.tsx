"use client"
import React, { useEffect, useState } from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/ui/form"
import { Input } from "@/ui/input"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const page = () => {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [isError, setIsError] = useState("")

  const formSchema = z.object({
    password: z.string().nonempty(),
    confirmPassword: z.string().nonempty()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password === values.confirmPassword) {
      await axios.post("/api/users/forgetpassword", {
        token,
        password: values.password
      })
      toast.success("Password changed sucessfully")
      router.push("/sign-in")
    } else {
      toast.error("Password do not match")
    }
  }

  useEffect(() => {
    const url = window.location.search.split("=")[1]
    setToken(url || "")
  }, [])

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-[550px] h-auto p-2">
        <div className="title flex">Reset Password</div>
        {token ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a new password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Renter a new password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        ) : (
          "No token"
        )}
      </div>
    </div>
  )
}

export default page
