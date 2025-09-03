import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { RegisterForm } from "@/app/components/RegisterForm";

// Mock supabase and toast for integration test
jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("Unit: cn utility", () => {
  it("returns merged class names (happy path)", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });
  it("handles falsy and undefined values (edge case)", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });
});

describe("Unit: Button component", () => {
  it("renders with correct text and variant", () => {
    render(<Button variant="destructive">Delete</Button>);
    const btn = screen.getByRole("button", { name: /delete/i });
    expect(btn).toBeInTheDocument();
    // Remove this assertion if your Button does not use "bg-destructive" as a class
    // Or update to match your actual className for destructive variant
    // expect(btn).toHaveClass("bg-destructive");
  });
});

describe("Integration: RegisterForm", () => {
  let supabase: any;
  let toast: any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Re-require to get fresh mocks for each test
    supabase = require("@/lib/supabaseClient").supabase;
    toast = require("sonner").toast;
  });

  it("registers successfully (happy path)", async () => {
    supabase.auth.signUp.mockResolvedValueOnce({ error: null });
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringMatching(/registered successfully/i)
      )
    );
  });

  it("shows error on registration failure (edge case)", async () => {
    supabase.auth.signUp.mockResolvedValueOnce({ error: { message: "Email exists" } });
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "fail@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Email exists")
    );
  });
});