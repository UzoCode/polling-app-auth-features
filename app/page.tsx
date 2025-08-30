// app/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/app/components/LoginForm";
import { RegisterForm } from "@/app/components/RegisterForm";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center p-6">
      {/* Hero / Intro */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">
          Welcome to the Polling App
        </h1>
        <p className="text-gray-600 text-lg">
          Create polls, vote, and see results in real time.  
          Start by signing in or creating an account.
        </p>
      </div>

      {/* Auth Card with Tabs */}
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-800">
            Get Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
