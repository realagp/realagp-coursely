import React, { Suspense } from "react";
import VerifyEmail from "./_components/VerifyEmail";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}