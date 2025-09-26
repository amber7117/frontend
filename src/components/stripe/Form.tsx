import { useState } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { StripeCardElementOptions } from "@stripe/stripe-js";
import CheckoutError from "../prebuilt/CheckoutError.jsx";

import { Card } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CheckoutForm = ({ error }: { error: string }) => {
  const theme = useTheme();
  const [checkoutError, setCheckoutError] = useState<null | string>(null);

  // TIP
  // use the cardElements onChange prop to add a handler
  // for setting any errors:

  const handleCardDetailsChange = (ev: any) => {
    ev.error ? setCheckoutError(ev.error.message) : setCheckoutError(null);
  };

  // Learning
  // A common ask/bug that users run into is:
  // How do you change the color of the card element input text?
  // How do you change the font-size of the card element input text?
  // How do you change the placeholder color?
  // The answer to all of the above is to use the `style` option.
  // It's common to hear users confused why the card element appears impervious
  // to all their styles. No matter what classes they add to the parent element
  // nothing within the card element seems to change. The reason for this is that
  // the card element is housed within an iframe and:
  // > styles do not cascade from a parent window down into its iframes

  const iframeStyles = {
    base: {
      color: theme.palette.text.primary,
      fontSize: "16px",
      //   backgroundColor: "red",
      iconColor: theme.palette.text.primary,
      "::placeholder": {
        color: theme.palette.text.secondary,
      },
    },
    invalid: {
      iconColor: theme.palette.error.main,
      color: theme.palette.error.main,
    },
    complete: {
      iconColor: theme.palette.success.main,
      color: theme.palette.text.primary,
    },
  };

  const cardElementOpts: StripeCardElementOptions = {
    iconStyle: "solid",
    style: iframeStyles,
    hidePostalCode: true,
  };

  return (
    <>
      <Card
        sx={{
          height: 40,
          display: "flex",
          alignItems: "center",
          "& .StripeElement": {
            width: "100%",
            padding: "15px",
          },
        }}
      >
        <CardElement
          options={cardElementOpts}
          onChange={handleCardDetailsChange}
        />
      </Card>
      {error && <CheckoutError>{error}</CheckoutError>}
    </>
  );
};

export default CheckoutForm;
