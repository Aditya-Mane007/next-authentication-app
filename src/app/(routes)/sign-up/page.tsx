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
import { useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"

const page = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const userValidation = z.object({
    email: z.string().nonempty(),
    password: z.string().nonempty(),
    username: z.string().nonempty()
  })

  const form = useForm<z.infer<typeof userValidation>>({
    resolver: zodResolver(userValidation),
    defaultValues: {
      email: "",
      password: "",
      username: ""
    }
  })

  async function onSubmit(values: z.infer<typeof userValidation>) {
    try {
      setIsLoading(true)
      await axios.post("/api/users/sign-up", {
        email: values.email,
        password: values.password,
        username: values.username
      })

      toast.success("Please verify your email,check your inbox")
      router.push(`/profile/`)
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
        <div className="text-2xl">Sign Up</div>
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
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g johndoe@27"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isLoading ? "Processing..." : "Sign Up"}
            </Button>
          </form>
        </Form>
        <div className="my-2">
          Already have account ?
          <Link href="/sign-in" className="underline mx-2">
            sign-in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default page
