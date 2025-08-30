"use client";


import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";


const schema = z.object({
email: z.string().email(),
password: z.string().min(6),
});


type FormData = z.infer<typeof schema>;


export function LoginForm() {
const form = useForm<FormData>({ resolver: zodResolver(schema) });


const onSubmit = async (data: FormData) => {
const { error } = await supabase.auth.signInWithPassword({
email: data.email,
password: data.password,
});


if (error) toast.error(error.message);
else toast.success("Logged in successfully");
};


return (
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
<div>
<Label>Email</Label>
<Input type="email" {...form.register("email")} />
</div>
<div>
<Label>Password</Label>
<Input type="password" {...form.register("password")} />
</div>
<Button type="submit">Login</Button>
</form>
);
}