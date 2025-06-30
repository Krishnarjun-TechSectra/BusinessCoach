"use client";

import type React from "react";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: "Authentication Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const session = await getSession();
   

    // 🔁 Force full reload for consistent session
    if (session?.user?.role === "admin") {
      window.location.href = "/admin-dashboard/dashboard";
    } else if (session?.user?.role === "client") {
      window.location.href = "/client-dashboard";
    } else {
      window.location.href = "/unauthorized";
    }

  } catch (error) {
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     const result = await signIn("credentials", {
//       email,
//       password,
//       callbackUrl: "/redirect", // handle role-based redirect here
//     });

//     if (result?.error) {
//       toast({
//         title: "Authentication Failed",
//         description: "Invalid email or password",
//         variant: "destructive",
//       });
//     }
//   } catch (error) {
//     toast({
//       title: "Error",
//       description: "An unexpected error occurred",
//       variant: "destructive",
//     });
//   } finally {
//     setLoading(false);
//   }
// };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
