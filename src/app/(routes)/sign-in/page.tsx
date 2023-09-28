"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import axios from "axios"
import toast from "react-hot-toast"
import { useState } from "react"
import { sendEmail } from "@/helpers/mailer"

const page = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const userValidation = z.object({
    email: z.string().nonempty(),
    password: z.string().nonempty()
  })

  const form = useForm<z.infer<typeof userValidation>>({
    resolver: zodResolver(userValidation),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function onSubmit(values: z.infer<typeof userValidation>) {
    const formData = {
      email: values.email,
      password: values.password
    }

    try {
      setIsLoading(true)
      const res = await axios.post("/api/users/sign-in", formData)
      router.push("/profile")
    } catch (error: any) {
      toast.error(error.message)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-auto min-h-screen flex flex-col items-center justify-center">
      <div className="w-[550px] h-auto p-2">
        <div className="text-2xl">Sign In</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g johndoe@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="e.g root" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isLoading ? "Processing" : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="flex items-center my-2">
          <div className="mr-2 border border-r-black border-y-0 border-l-0 p-2 cursor-pointer">
            <Link href="/forgetPassword" className="underline">
              Forget Password
            </Link>
          </div>
          <div>
            New here ?
            <Link href="/sign-up" className="underline mx-2">
              sign-up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
