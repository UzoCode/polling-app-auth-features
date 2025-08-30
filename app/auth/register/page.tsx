// app/auth/register/page.tsx
"use client";


import {RegisterForm} from "@/app/components/RegisterForm";


export default function RegisterPage() {
return (
<div className="space-y-6">
<h2 className="text-2xl font-semibold">Create an account</h2>
<RegisterForm />
</div>
);
}// app/auth/register/page.tsx