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
  deleteCart,
  onNextStep,
  increaseQuantity,
  decreaseQuantity,
  getCart,
} from "src/redux/slices/product";

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

// dynamic imports
// const SizeSinglePicker = dynamic(
//   () => import("src/components/sizeSinglePicker/sizeSinglePicker")
// );
// const ColorSinglePicker = dynamic(
//   () => import("src/components/singleColorPicker/colorSinglePicker")
// );

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
  const { product, isLoading, id, isDialog, unitRate, symbol } = props;

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
    onError: (err: any) => {
      setLoading(false);
      toast.error(t("common:errors." + err.response.data.message));
    },
  });

  const alreadyProduct =
    !isLoading &&
    checkout.cart.map((item: any) => item._id).includes(product?._id);

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
      _id: product?._id,
      cover: product?.cover,
      quantity:
        product?.variants[product?.selectedVariant].available < 1 ? 0 : 1,
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!alreadyProduct) {
          onAddCart({
            ...values,
            subtotal: product?.priceSale * product?.quantity,
          });
        }
        setSubmitting(false);
        handleBuyNow();
        router.push("/checkout");
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  const { values, touched, errors, getFieldProps, handleSubmit } = formik;
  const handleAddCart = (variant: any) => {
    const { images, inventoryType, sold, ...others } = variant;
    onAddCart({
      ...others,
      priceSale: variant?.priceSale === 0 ? variant?.price : variant?.priceSale,
      quantity: variant?.available < 1 ? 0 : 1,
      subtotal: (variant.priceSale || variant.price) * values.quantity,
    });
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

  const handleDeleteCart = (productId: string) => {
    dispatch(deleteCart(productId));
  };

  const handleIncreaseQuantity = (productId: string) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId: string) => {
    dispatch(decreaseQuantity(productId));
  };

  const isLiked = wishlist?.filter((v: any) => v._id === id).length > 0;
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <RootStyled>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            fontWeight={400}>
            <span>{product?.category}</span>
          </Typography>
          <Typography variant="h4" paragraph className="heading">
            {product?.name}
          </Typography>
          <Stack direction="row" alignItems="center" className="rating-wrapper">
            <Rating
              value={product?.totalRating / product?.totalReview}
              precision={0.1}
              size="small"
              readOnly
            />
            <Typography variant="body1">
              {" "}
              {product?.totalRating && product?.totalReview
                ? (product?.totalReview).toFixed(0)
                : 0}{" "}
              <span>
                {Number(product?.totalReview) > 1 ? t("reviews") : t("review")}
              </span>
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
            <Typography variant="subtitle1">{t("brand")}:</Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              fontWeight={400}>
              {product?.brand || "Nextstore"}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1">{t("sku")}:</Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              fontWeight={400}>
              {product?.variants[product?.selectedVariant].sku}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1">{t("available")}:</Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              fontWeight={400}>
              {product?.variants[product?.selectedVariant].sold} {t("items")}
            </Typography>
          </Stack>
          {product?.variants[product?.selectedVariant].color && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1">{t("color")}:</Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight={400}>
                {product?.variants[product?.selectedVariant].color} {t("items")}
              </Typography>
            </Stack>
          )}
          {product?.variants[product?.selectedVariant].size && (
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Typography variant="subtitle1">{t("size")}:</Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight={400}>
                {product?.variants[product?.selectedVariant].size}
              </Typography>
            </Stack>
          )}

          <CheckoutProductList
            formik={formik}
            onDelete={handleDeleteCart}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            symbol={symbol}
            unitRate={unitRate}
            loaded={isLoaded}
            variants={product?.variants}
            isLoading={isLoading}
          />

          <Stack
            spacing={2}
            direction={{ xs: "column", md: "row" }}
            className="detail-actions-wrapper">
            <Stack
              spacing={2}
              direction={{ xs: "row", sm: "row" }}
              className="contained-buttons">
              <Button
                fullWidth
                disabled={isMaxQuantity || isLoading || product?.available < 1}
                size={isDialog ? "medium" : "large"}
                type="button"
                color="warning"
                variant="outlined"
                onClick={() =>
                  handleAddCart(product?.variants[product?.selectedVariant])
                }
                className="cart-button">
                {t("add-to-cart")}
              </Button>
              <Button
                disabled={isLoading || product?.available < 1}
                fullWidth
                size={isDialog ? "medium" : "large"}
                type="submit"
                variant="contained">
                {t("buy-now")}
              </Button>
            </Stack>
            {!isDialog && isLoaded && (
              <>
                {isLoading || isLoadingWishlist ? (
                  <Box width="48px" height="48px">
                    <CircularProgress className="progress" />
                  </Box>
                ) : isLiked ? (
                  <>
                    <Tooltip title={t("remove-from-wishlist")}>
                      <Fab
                        color="primary"
                        onClick={onClickWishList}
                        aria-label="heart-selected"
                        className="wishlist-fab">
                        <FavoriteRoundedIcon />
                      </Fab>
                    </Tooltip>
                    <Tooltip title={t("remove-from-wishlist")}>
                      <Button
                        variant="contained"
                        onClick={onClickWishList}
                        color={"primary"}
                        aria-label="heart-selected"
                        className="wishlist-button">
                        Remove from wishlist
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title={t("add-to-wishlist")}>
                      <Fab
                        onClick={onClickWishList}
                        aria-label="heart"
                        className="wishlist-fab">
                        <FavoriteBorderRoundedIcon />
                      </Fab>
                    </Tooltip>
                    <Tooltip title={t("add-to-wishlist")}>
                      <Button
                        variant="text"
                        onClick={onClickWishList}
                        color={"primary"}
                        aria-label="heart"
                        className="wishlist-button bg-grey">
                        Add to wishlist
                      </Button>
                    </Tooltip>
                  </>
                )}
              </>
            )}
          </Stack>
        </Form>
      </FormikProvider>
    </RootStyled>
  );
}
