// app/page.tsx
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";


export default function HomePage() {
// Client component not needed here; just a simple landing linking to auth
return (
<div className="space-y-6">
<h1 className="text-3xl font-semibold">Welcome to the Polling App</h1>
<p className="text-muted-foreground">Create polls, vote, and see results in real time. Start by signing in or creating an account.</p>
<div className="flex gap-3">
<Link href="/auth/login" className="underline">Login</Link>
<Link href="/auth/register" className="underline">Register</Link>
</div>
</div>
);
}