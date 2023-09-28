"use client"
import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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
import { Button } from "@/ui/button"
import { useForm } from "react-hook-form"
import axios from "axios"
import toast from "react-hot-toast"

const page = () => {
  const formSchema = z.object({
    email: z.string().email()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await axios.post("/api/users/sendforgetemail", {
      email: values.email
    })

    toast.success("Email sent, check your inbox")
  }
  return (
    <div className="w-auto min-h-screen flex flex-col items-center justify-center">
      <div className="w-[550px] h-auto p-2">
        <div className="text-2xl">Forget Password</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address :</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g harryPotter@hogwarts.gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter email address to change password, you will receive
                    email about changing password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page
