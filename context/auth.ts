// types/auth.ts
export type AuthResult =
  | { ok: true } // success
  | { ok: false; error: string }; // failure
