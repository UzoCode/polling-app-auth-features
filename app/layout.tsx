// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import NavBar from "@/app/components/NavBar";
import { ToasterProvider } from "@/app/components/providers/ToasterProvider";


export const metadata: Metadata = {
title: "Polling App",
description: "Polling App with Auth (Next.js + Supabase)",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="min-h-dvh bg-background text-foreground antialiased">
<AuthProvider>
<ToasterProvider />
<NavBar />
<main className="mx-auto w-full max-w-xl px-4 py-8">{children}</main>
</AuthProvider>
</body>
</html>
);
}