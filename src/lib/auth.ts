
import { NextAuthOptions, User, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Extend NextAuth types to include 'role'
declare module "next-auth" {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      role?: string
    }
  }
}

// Generate a secure JWT secret - use this in your .env.local
export const JWT_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"

interface ExcelUser {
  email: string
  name: string
  password: string
  role: string
}

async function fetchUserFromExcel(email: string): Promise<ExcelUser | null> {
  try {
    // Replace with your Google Apps Script Web App URL
    const response = await fetch(
      `${process.env.GOOGLE_APPS_SCRIPT_URL}?action=getUser&email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch user")
    }

    const data = await response.json()
    return data.user || null
  } catch (error) {
    console.error("Error fetching user from Excel:", error)
    return null
  }
}

async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  // For demo purposes, we'll do simple comparison
  // In production, use proper password hashing like bcrypt
  return plainPassword === hashedPassword
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Excel Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            // Missing form fields -> credentials error
            throw new Error("CredentialsSignin")
          }

          const excelUser = await fetchUserFromExcel(credentials.email)

          if (!excelUser) {
            // Email not found ⇒ credentials error
            throw new Error("CredentialsSignin")
          }

          const isValid = await verifyPassword(credentials.password, excelUser.password ?? "")
          if (!isValid) {
            // Wrong password ⇒ credentials error
            throw new Error("CredentialsSignin")
          }

          // Success – always return a plain-JS object
          return {
            id: excelUser.email, // 🔑 required
            email: excelUser.email,
            name: excelUser.name,
            role: excelUser.role,
          }
        } catch (err) {
          // Log unexpected problems then surface as OAuth error
          console.error("[ExcelAuth] authorize() failed:", err)
          if (err instanceof Error && err.message === "CredentialsSignin") {
            // Let NextAuth show the credentials error page
            throw err
          }
          // Anything else → generic sign-in error page
          throw new Error("OAuthSignin")
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
}
