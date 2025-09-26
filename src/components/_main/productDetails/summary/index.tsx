// react
import { useState, useEffect, MouseEvent } from "react";
import { useMutation } from "react-query";

// next
import { useRouter } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";

// formik
import { useFormik, Form, FormikProvider, useField } from "formik";

// redux
import { useDispatch, useSelector } from "src/redux/store";
import { addCart, onGotoStep } from "src/redux/slices/product";
import { setWishlist } from "src/redux/slices/wishlist";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "next-share";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// react toast notification
import { toast } from "react-hot-toast";
const CheckoutProductList = dynamic(
  () =>
    import("src/components/_main/productDetails/variantsSummary/variantTable"),
  {
    loading: () => (
      <Stack>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Stack>
    ),
  }
);
// material
import {
  Box,
  Stack,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  FormHelperText,
  Skeleton,
  Rating,
  Fab,
  Tooltip,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

// api
import * as api from "src/services";

// styles
import RootStyled from "./styled";

// ----------------------------------------------------------------------
const formatNumbers = (number: number, unitRate: string, symbol?: string) => {
  const converted = (number * Number(unitRate)).toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
  return converted;
};

const Incrementer = ({ ...props }) => {
  const { available } = props;
  const [field, , helpers] = useField(props as any);
  // eslint-disable-next-line react/prop-types

  const { value } = field;
  const { setValue } = helpers;

  const incrementQuantity = () => {
    setValue(value + 1);
  };
  const decrementQuantity = () => {
    setValue(value - 1);
  };

  return (
    <Box className="incrementer">
      <IconButton
        size="small"
        color="inherit"
        disabled={value <= 1}
        onClick={decrementQuantity}>
        <RemoveRoundedIcon />
      </IconButton>
      <Typography variant="body2" component="span" className="text">
        {value}
      </Typography>
      <IconButton
        size="small"
        color="inherit"
        disabled={value >= available}
        onClick={incrementQuantity}>
        <AddRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default function ProductDetailsSumary({ ...props }) {
  const {
    product,
    isLoading,
    id,
    category,
    brand,
    isDialog,
    unitRate,
    symbol,
    totalRating,
    totalReviews,
  } = props;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const router = useRouter();
  const { t } = useTranslation("common");
  const dispatch = useDispatch();

  const { checkout } = useSelector(({ product }: { product: any }) => product);

  const { wishlist } = useSelector(
    ({ wishlist }: { wishlist: any }) => wishlist
  );
  const { isAuthenticated } = useSelector(({ user }: { user: any }) => user);

  const [isLoadingWishlist, setLoading] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const { mutate } = useMutation(api.updateWishlist, {
    onSuccess: (data) => {
      toast.success(t(data.message));
      setLoading(false);
      dispatch(setWishlist(data.data));
    },
    onError: (err) => {
      setLoading(false);
      toast.error("common:something-wrong");
    },
  });

  const isMaxQuantity =
    !isLoading &&
    checkout.cart
      .filter((item: any) => item._id === product?._id)
      .map((item: any) => item.quantity)[0] >= product?.available;

  const onAddCart = (param: any) => {
    toast.success(t("common:added-to-cart"));
    dispatch(addCart(param));
  };

  const handleBuyNow = () => {
    dispatch(onGotoStep(0));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pid: product?._id,
      cover: product?.cover,
      variantId:
        product?.variants[product?.selectedVariant]._id ||
        product?.variants[0]._id,
      quantity: 1,
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const alreadyProduct =
          !isLoading &&
          checkout.cart.filter((item: any) => item._id === variantId);

        if (!Boolean(alreadyProduct.length)) {
          const filtered = product?.variants.find(
            (v: any) => v._id === variantId
          );
          const { images, inventoryType, sold, ...others } = filtered;
          onAddCart({
            ...others,
            quantity: values.quantity,
            pid: values.pid,
            price:
              filtered?.priceSale === 0 ? filtered?.price : filtered?.priceSale,
            cover: images[0].url,
            subtotal: product?.priceSale * product?.quantity,
          });
          setFieldValue("quantity", 1);
        }

        setSubmitting(false);
        handleBuyNow();
        router.push("/checkout");
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  const { values, touched, errors, setFieldValue, handleSubmit } = formik;
  const handleAddCart = (variant: any) => {
    const { images, inventoryType, sold, ...others } = variant;
    onAddCart({
      ...others,
      cover: images[0].url,
      quantity: values.quantity,
      pid: values.pid,
      price: variant?.priceSale === 0 ? variant?.price : variant?.priceSale,
      subtotal: (variant.priceSale || variant?.price) * values.quantity,
    });
    setFieldValue("quantity", 1);
  };

  const onClickWishList = async (event: MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      event.stopPropagation();
      setLoading(true);
      await mutate({
        pid: id,
      });
    }
  };

  const isLiked = wishlist?.filter((v: any) => v._id === id).length > 0;
  useEffect(() => {
    setLoaded(true);
  }, []);
  const isBrowser = () => typeof window !== "undefined";
  const { variantId } = values;
  const currentVariant = product?.variants.find(
    (item: any) => item._id === variantId
  );
  return (
    <RootStyled>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          {/* <Typography
            variant="subtitle1"
            color="text.secondary"
            fontWeight={400}
          >
            <span>{product?.category}</span>
          </Typography> */}
          <Typography variant="h4" paragraph className="heading">
            {product?.name}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            className="rating-wrapper"
            spacing={1}>
            <Rating value={totalRating} precision={0.1} size="small" readOnly />
            <Typography variant="body1">
              {" "}
              {totalReviews}{" "}
              <span>
                {Number(totalReviews) > 1 ? t("reviews") : t("review")}
              </span>
            </Typography>

            <Typography variant="h4" className="text-price">
              {currentVariant?.price <= currentVariant?.priceSale ? null : (
                <Box component="span" className="old-price">
                  {!isLoading &&
                    isLoaded &&
                    symbol +
                      " " +
                      formatNumbers(currentVariant?.price, unitRate)}
                </Box>
              )}
              <Box component="span">
                &nbsp;
                {!isLoading &&
                  isLoaded &&
                  symbol +
                    " " +
                    formatNumbers(currentVariant?.priceSale, unitRate)}{" "}
              </Box>
            </Typography>
          </Stack>
          <Stack spacing={1} mb={3}>
            <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
              <Typography variant="subtitle1">{t("brand")}:</Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight={400}>
                {brand?.name || "Nextstore"}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1">{t("category")}:</Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight={400}>
                {category?.name || "Nextstore"}
              </Typography>
            </Stack>
            {currentVariant?.price > currentVariant?.priceSale && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1">{t("discount")}:</Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  fontWeight={400}
                  className="text-discount">
                  {!isLoading &&
                    isLoaded &&
                    symbol +
                      " " +
                      formatNumbers(
                        currentVariant?.price - currentVariant?.priceSale,
                        unitRate
                      )}{" "}
                  {
                    <span>
                      (
                      {(
                        100 -
                        (currentVariant?.priceSale / currentVariant?.price) *
                          100
                      ).toFixed(0)}
                      % {t("discount")})
                    </span>
                  }
                </Typography>
              </Stack>
            )}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1">{t("available")}:</Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight={400}>
                {currentVariant?.available} {t("items")}
              </Typography>
            </Stack>
            {product?.variants.length === 1 && (
              <>
                {currentVariant?.color && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1">{t("color")}:</Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      fontWeight={400}>
                      {currentVariant?.color}
                    </Typography>
                  </Stack>
                )}
                {currentVariant?.size && (
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Typography variant="subtitle1">{t("size")}:</Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      fontWeight={400}>
                      {currentVariant?.size}
                    </Typography>
                  </Stack>
                )}
              </>
            )}
          </Stack>
          {product?.variants.length > 1 && (
            <CheckoutProductList
              formik={formik}
              variantId={variantId}
              setFieldValue={setFieldValue}
              symbol={symbol}
              unitRate={unitRate}
              loaded={isLoaded}
              variants={product?.variants}
              isLoading={isLoading}
            />
          )}

          <Stack
            direction="row"
            gap={2}
            justifyContent="space-between"
            className="incrementer-wrapper">
            {isLoading ? (
              <Box sx={{ float: "right" }}>
                <Skeleton variant="rounded" width={120} height={40} />
              </Box>
            ) : (
              <div>
                <Incrementer
                  name="quantity"
                  available={currentVariant?.available as number}
                />

                <FormHelperText error>
                  {touched.quantity && errors.quantity}
                </FormHelperText>
              </div>
            )}
          </Stack>
          <Stack spacing={2} className="detail-actions-wrapper">
            <Stack
              spacing={2}
              direction={{ xs: "row", sm: "row" }}
              className="contained-buttons">
              <Button
                fullWidth
                disabled={isMaxQuantity || isLoading || product?.available < 1}
                size={isDialog ? "medium" : "large"}
                type="button"
                color="primary"
                variant="contained"
                onClick={() => handleAddCart(currentVariant)}
                className="cart-button">
                {t("add-to-cart")}
              </Button>
              <Button
                disabled={isLoading || product?.available < 1}
                fullWidth
                size={isDialog ? "medium" : "large"}
                type="submit"
                variant="contained"
                color="warning">
                {t("buy-now")}
              </Button>
            </Stack>

            <Stack direction="row" justifyContent="center">
              {/* <Stack direction="row">
                <IconButton
                  aria-label="copy"
                  onClick={() => {
                    navigator.clipboard.writeText(window?.location.href);
                    toast.success("Link copied.");
                  }}>
                  <ContentCopyIcon />
                </IconButton>
                <WhatsappShareButton
                  url={
                    typeof window !== "undefined" ? window?.location.href : ""
                  }>
                  <IconButton
                    sx={{
                      color: "#42BC50",
                    }}
                    aria-label="facebook">
                    <WhatsAppIcon />
                  </IconButton>
                </WhatsappShareButton>
                <FacebookShareButton
                  url={
                    typeof window !== "undefined" ? window?.location.href : ""
                  }>
                  <IconButton
                    sx={{
                      color: "#1373EC",
                    }}
                    aria-label="facebook">
                    <FacebookRoundedIcon />
                  </IconButton>
                </FacebookShareButton>
                <TwitterShareButton
                  url={
                    typeof window !== "undefined" ? window?.location.href : ""
                  }>
                  <IconButton
                    sx={{
                      color: "#169CF1",
                    }}
                    aria-label="facebook">
                    <TwitterIcon />
                  </IconButton>
                </TwitterShareButton>
                <LinkedinShareButton
                  url={
                    typeof window !== "undefined" ? window?.location.href : ""
                  }>
                  <IconButton
                    sx={{
                      color: "#0962B7",
                    }}
                    aria-label="facebook">
                    <LinkedInIcon />
                  </IconButton>
                </LinkedinShareButton>
              </Stack> */}
              <Stack direction="row">
                <IconButton
                  aria-label="copy"
                  onClick={() => {
                    navigator.clipboard.writeText(window?.location.href);
                    toast.success("Link copied.");
                  }}>
                  <ContentCopyIcon />
                </IconButton>
                {isClient && (
                  <>
                    <WhatsappShareButton url={window?.location.href || ""}>
                      <IconButton
                        sx={{ color: "#42BC50" }}
                        aria-label="whatsapp">
                        <WhatsAppIcon />
                      </IconButton>
                    </WhatsappShareButton>
                    <FacebookShareButton url={window?.location.href || ""}>
                      <IconButton
                        sx={{ color: "#1373EC" }}
                        aria-label="facebook">
                        <FacebookRoundedIcon />
                      </IconButton>
                    </FacebookShareButton>
                    <TwitterShareButton url={window?.location.href || ""}>
                      <IconButton
                        sx={{ color: "#169CF1" }}
                        aria-label="twitter">
                        <TwitterIcon />
                      </IconButton>
                    </TwitterShareButton>
                    <LinkedinShareButton url={window?.location.href || ""}>
                      <IconButton
                        sx={{ color: "#0962B7" }}
                        aria-label="linkedin">
                        <LinkedInIcon />
                      </IconButton>
                    </LinkedinShareButton>
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Form>
      </FormikProvider>
    </RootStyled>
  );
}
