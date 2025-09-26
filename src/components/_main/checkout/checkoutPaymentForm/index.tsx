// react / next
import React from "react";
import dynamic from "next/dynamic";
// components
const RootStyled = dynamic(() => import("./styled"));
// stripe
import CheckoutForm from "src/components/stripe/Form";

export default function CheckoutPaymentForm({ error }: { error: string }) {
  return (
    <RootStyled>
      <CheckoutForm
        error={error}
        // onSuccessfulCheckout={() => console.log("success")}
      />
    </RootStyled>
  );
}
