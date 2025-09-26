import React from "react";
// next
import dynamic from "next/dynamic";
const CheckoutGestAddressForm = dynamic(() => import("./checkoutGuestFrom"));

export default function CheckoutGuest({ ...props }) {
  const { onNextStep, onCreateBilling, handleStepBack } = props;

  return (
    <CheckoutGestAddressForm
      onNextStep={onNextStep}
      onCreateBilling={onCreateBilling}
      handleStepBack={handleStepBack}
    />
  );
}
