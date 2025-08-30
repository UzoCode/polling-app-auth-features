// app/auth/login/page.tsx
"use client";


import {LoginForm} from "@/app/components/LoginForm";


export default function LoginPage() {
return (
<div className="space-y-6">
<h2 className="text-2xl font-semibold">Login</h2>
<LoginForm />
</div>
);
}