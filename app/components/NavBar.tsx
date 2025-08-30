// components/NavBar.tsx
"use client";


import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/app/components/ui/button";


export default function NavBar() {
const { user, signOut } = useAuth();


return (
<header className="border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
<Link href="/" className="font-semibold">Polling App</Link>
<nav className="flex items-center gap-3">
{user ? (
<>
<span className="text-sm text-muted-foreground">{user.email}</span>
<Button variant="outline" onClick={signOut}>Sign out</Button>
</>
) : (
<>
<Link href="/auth/login" className="text-sm underline">Login</Link>
<Link href="/auth/register" className="text-sm underline">Register</Link>
</>
)}
</nav>
</div>
</header>
);
}