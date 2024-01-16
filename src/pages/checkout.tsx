import React, { useEffect, useState } from "react";

// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";

// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Step,
  Stepper,
  Container,
  StepLabel,
  Button,
  StepConnector,
  Collapse,
} from "@mui/material";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import ShoppingBasketRoundedIcon from "@mui/icons-material/ShoppingBasketRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";

// redux
import { useDispatch, useSelector } from "react-redux";
import { getCart, createBilling, onGotoStep } from "src/redux/slices/product";

// hooks
import useIsMountedRef from "src/hooks/useIsMountedRef";

// stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// api
import * as api from "src/services";
import { useQuery } from "react-query";

// components
import { Page } from "src/components";



// ----------------------------------------------------------------------

import CheckoutCart from "src/components/_main/checkout/checkoutCart";
const CheckoutBillingAddress = dynamic(
  () => import("src/components/_main/checkout/checkoutBillingAccount")
);
const CheckoutSummary = dynamic(
  () => import("src/components/_main/checkout/checkoutSummary")
);

import CheckoutPayment from "src/components/_main/checkout/checkoutPayment";
const STEPS = ["cart", "billing-address", "payment"];
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg, ${theme.palette.primary.dark} 0%, 50%,${theme.palette.primary.light} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg, ${theme.palette.primary.dark} 0%, 50%,${theme.palette.primary.light} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  "&.active": {
    backgroundImage: `linear-gradient( 136deg,  ${theme.palette.primary.dark} 0%,  50%, ${theme.palette.primary.light} 100%)`,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  "&.completed": {
    backgroundImage: `linear-gradient( 136deg,  ${theme.palette.primary.dark} 0%,  50%, ${theme.palette.primary.light} 100%)`,
  },
}));

function ColorlibStepIcon({ ...props }) {
  const { active, completed } = props;
  // alert(completed);
  const icons: any = {
    1: <ShoppingBasketRoundedIcon />,
    2: <ReceiptRoundedIcon />,
    3: <PaidRoundedIcon />,
  };

  return (
    <ColorlibStepIconRoot
      className={`${active && "active"} ${completed && "completed"}`}
    >
      {icons[props.icon]}
    </ColorlibStepIconRoot>
  );
}

const RootStyles = styled(Page)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  padding: "40px 0",
  backgroundColor: theme.palette.background.paper,
}));

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY as string);

export default function EcommerceCheckout() {
  const { t } = useTranslation("checkout");
  const { product, user: userState } = useSelector((state: any) => state);
  const user = userState?.user;
  const [apicall, setapicall] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  const { data, isLoading } = useQuery(
    ["address", user, apicall],
    () => api.getAddress(user._id),
    {
      enabled: Boolean(user),
    }
  );
  const addresses = data?.data || [];

  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const [statestep, setStateStep] = useState(0);
  const { cart, activeStep, total, shipping, subtotal, discount } =
    product.checkout;
  const isComplete = activeStep === STEPS.length;

  useEffect(() => {
    if (isMountedRef.current) {
      dispatch(getCart(cart));
      setActive(Boolean(cart.length));
      setStateStep(activeStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isMountedRef, cart, activeStep]);
  useEffect(() => {
    if (user && addresses.length > 0) {
      const billing = addresses.find(
        (address: { active: boolean }) => address.active
      );
      if (billing) {
        dispatch(
          createBilling({
            _id: billing._id,
            receiver: user?.name,
            phone: billing.phone || user?.phone,
            address: billing.address,
            city: billing.city,
            country: billing.country,
            state: billing.state,
            zip: billing.zip,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, addresses.length > 0]);

  return (
    <Elements stripe={stripePromise}>
      <RootStyles
        title="Checkout | NEXTSTORE"
        description="NEXTSTORE is a leading open source reactjs ecommerce script software based on Nextjs and Mongodb that can be used to sell your products online. We are a team of developers and designers who are passionate about creating a great user experience for your customers."
        canonical="checkout"
      >
        <Container>
          <Box py={5}>
            <Grid
              container
              justifyContent={isComplete ? "center" : "flex-start"}
            >
              <Grid item xs={12} md={12} sx={{ mb: 5 }}>
                <Stepper
                  alternativeLabel
                  activeStep={statestep}
                  connector={<ColorlibConnector />}
                >
                  {STEPS.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>
                        {t(label)}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
            </Grid>
            <>
              <Collapse in={statestep !== 2}>
                <Grid container spacing={3}>
                  <Grid item md={8} xs={12}>
                    <Collapse in={statestep === 0}>
                      <CheckoutCart />
                    </Collapse>
                    <Collapse in={statestep === 1}>
                      <CheckoutBillingAddress
                        addresses={addresses}
                        isLoading={isLoading}
                        setapicall={setapicall}
                        handleStepBack={() => setStateStep(activeStep - 1)}
                        handleAddStep={() => setStateStep(activeStep + 1)}
                      />
                    </Collapse>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <CheckoutSummary
                      total={total}
                      totalItems={cart?.length}
                      // enableDiscount
                      discount={discount}
                      subtotal={subtotal}
                      shipping={shipping}
                    />

                    <Collapse in={statestep === 0}>
                      <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        onClick={() => {
                          dispatch(onGotoStep(activeStep + 1));
                          setStateStep(activeStep + 1);
                        }}
                        disabled={!active}
                      >
                        {t("checkout")}
                      </Button>
                    </Collapse>
                  </Grid>
                </Grid>
              </Collapse>
              <Collapse in={statestep === 2}>
                <CheckoutPayment
                  onChangeBackStep={() => setStateStep(activeStep - 1)}
                  onChangegoToStep={(step: number) => setStateStep(step)}
                />
              </Collapse>
            </>
          </Box>
        </Container>
      </RootStyles>
    </Elements>
  );
}
