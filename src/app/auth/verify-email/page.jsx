"use client";
import { Suspense } from "react";
import VerifyContent from "./VerifyContent";

// Wajib dibungkus Suspense karena pakai useSearchParams
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}