"use client"

import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "../../lib/utils"
import { useSearchParams, useRouter } from "next/navigation"
import { Icons } from "../../components/icons"
import { useToast } from "../../components/ui/use-toast"
import { signIn } from "next-auth/react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const LoginForm = React.forwardRef<HTMLDivElement, LoginFormProps>(({ className, ...props }, ref) => {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        })

        if (res?.error) {
          toast({
            title: "Error",
            description: "Invalid credentials.",
            variant: "destructive",
          })
          return
        }

        router.replace(callbackUrl)
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Card className={cn("w-[350px]", className)} {...props} ref={ref}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
        <p className="text-gray-400">Sign in to MuslimInfluencers.io</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="mail@example.com" type="email" {...form.register("email")} />
          {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="Password" type="password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={isPending} onClick={form.handleSubmit(onSubmit)}>
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </CardFooter>
    </Card>
  )
})

LoginForm.displayName = "LoginForm"

export { LoginForm }
