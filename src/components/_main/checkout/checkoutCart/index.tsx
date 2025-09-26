import React from "react";
// next
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
// lodash
import { sum } from "lodash";
// formik
import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Card,
  Button,
  CardHeader,
  Typography,
  Box,
  Skeleton,
  Stack,
  CircularProgress,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCart,
  onNextStep,
  increaseQuantity,
  decreaseQuantity,
  getCart,
} from "src/redux/slices/product";
import CheckoutCard from "src/components/cards/checkoutCard";
import CheckoutProductList from "../checkoutProductList";

import RootStyled from "./styled";
// components
// const CheckoutCard = dynamic(() => import("src/components/cards/checkoutCard"));
// const CheckoutProductList = dynamic(() => import("../checkoutProductList"), {
//   loading: () => (
//     <Stack>
//       <Skeleton variant="rectangular" width="100%" height={300} />
//     </Stack>
//   ),
// });
const EmptyCart = dynamic(
  () => import("src/components/illustrations/emptyCart"),
  {
    loading: () => (
      <Stack>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Stack>
    ),
  }
);
// const RootStyled = dynamic(() => import("./styled"));
// ----------------------------------------------------------------------

export default function CheckoutCartComponent({ ...props }) {
  const { isLoading } = props;
  const { t } = useTranslation("checkout");
  const dispatch = useDispatch();
  const router = useRouter();
  const { symbol, unitRate } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [loaded, setLoaded] = React.useState(false);
  const { checkout } = useSelector(({ product }: { product: any }) => product);
  const { cart } = checkout;
  const isEmptyCart = cart.length === 0;
  const handleDeleteCart = (productId: string) => {
    dispatch(deleteCart(productId));
  };
  console.log(cart, "cart");
  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleIncreaseQuantity = (productId: string) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId: string) => {
    dispatch(decreaseQuantity(productId));
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { products: cart },
    onSubmit: () => {
      handleNextStep();
    },
  });
  const { values, handleSubmit } = formik;
  const totalItems = sum(values.products.map((item: any) => item.quantity));
  React.useEffect(() => {
    dispatch(getCart(cart));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);
  React.useEffect(() => {
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RootStyled>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card className="card-main">
            <CardHeader
              className="card-header"
              title={
                isLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1.5rem" }}
                    width={120}
                  />
                ) : (
                  <Typography variant="h4">
                    {t("cart")}
                    <Typography component="span" color="text.secondary">
                      &nbsp;({loaded ? totalItems : 0}{" "}
                      {loaded && totalItems > 1 ? t("items") : t("item")})
                    </Typography>
                  </Typography>
                )
              }
            />

            {!loaded ? (
              <Box py={4} textAlign="center">
                <CircularProgress />
              </Box>
            ) : !isEmptyCart ? (
              <>
                <CheckoutCard
                  formik={formik}
                  onDelete={handleDeleteCart}
                  onIncreaseQuantity={handleIncreaseQuantity}
                  onDecreaseQuantity={handleDecreaseQuantity}
                  symbol={symbol}
                  unitRate={unitRate}
                  loaded={loaded}
                />
                <Box className="product-list">
                  <CheckoutProductList
                    formik={formik}
                    onDelete={handleDeleteCart}
                    onIncreaseQuantity={handleIncreaseQuantity}
                    onDecreaseQuantity={handleDecreaseQuantity}
                    symbol={symbol}
                    unitRate={unitRate}
                    loaded={loaded}
                    isLoading={isLoading}
                  />
                </Box>
              </>
            ) : (
              <EmptyCart />
            )}
          </Card>

          <Button
            color="inherit"
            onClick={() => router.push("/")}
            startIcon={<ArrowBackRoundedIcon />}>
            {t("continue-shopping")}
          </Button>
        </Form>
      </FormikProvider>
    </RootStyled>
  );
}
