import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { paramCase } from "change-case";
import Link from "next/link";
import { useRouter } from "next/navigation";
// material
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Zoom,
  IconButton,
  Skeleton,
  useTheme,
} from "@mui/material";

import useTranslation from "next-translate/useTranslation";
// utils
// import useCurrency from "src/hooks/useCurrency";
//----------------------------------------------------------------------
import { addCart } from "src/redux/slices/product";
import { useDispatch } from "src/redux/store";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ColorPreview from "src/components/colorPreview";
import Label from "src/components/label";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useMutation } from "react-query";
// api
import * as api from "src/services";
// notification
import { setWishlist } from "src/redux/slices/wishlist";
import { useSelector } from "react-redux";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ThumbDownOffAltRoundedIcon from "@mui/icons-material/ThumbDownOffAltRounded";
import { toast } from "react-hot-toast";

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

const formatNumbers = (number: number, unitRate: string) => {
  const converted = (number * Number(unitRate)).toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
  return converted;
};

export default function ShopProductCard({ ...props }) {
  const {
    product,
    category,
    loading,
    isMobile,
    loadingRedux,
    onClickCart,
    symbol,
    unitRate,
  } = props;

  const router = useRouter();
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  // type error
  const { wishlist } = useSelector(
    ({ wishlist }: { wishlist: any }) => wishlist
  );
  const { isAuthenticated } = useSelector(({ user }: { user: any }) => user);

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { mutate } = useMutation(api.updateWishlist, {
    onSuccess: (data) => {
      toast.success(t(data.message));
      setLoading(false);
      dispatch(setWishlist(data.data));
    },
    onError: (err: any) => {
      setLoading(false);
      const message = JSON.stringify(err.response.data.message);
      toast.error(
        t(
          message
            ? t("common:" + JSON.parse(message))
            : t("common:something-wrong")
        )
      );
    },
  });
  const {
    slug,
    name,
    cover,
    price,
    colors,
    status,
    priceSale,
    totalRating,
    likes,
    totalReview,
    _id,
  } = !loading && product;
  const linkTo = category ? "/categories/abc" : `/product/${slug ? slug : ""}`;

  const onAddCart = () => {
    if (category) {
      router.push("/categories/abc");
    } else {
      const productData = {
        available: product.available,
        color: product.colors[0] || "any",
        cover: product.images[0].url,
        id: product.id,
        name: product.name,
        price: product.price,
        priceSale:
          product?.priceSale !== 0 ? product?.priceSale : product?.price,
        quantity: product.available < 1 ? 0 : 1,
        size: product.sizes[0] || "any",
      };
      toast.success(t("common:added-to-cart"));
      dispatch(
        addCart({
          ...productData,
          subTotal: product.priceSale * product.quantity,
        })
      );
    }
  };

  const onClickWishList = async (event: any) => {
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push("/auth/login");
    } else {
      event.stopPropagation();
      setLoading(true);
      await mutate({
        pid: _id,
      });
    }
  };

  return (
    <Card
      sx={{
        display: "block",
      }}>
      <Box sx={{ position: "relative" }}>
        {price > priceSale && (
          <Label
            variant="filled"
            color={"primary"}
            sx={{
              top: 16,
              left: 16,
              zIndex: 9,
              position: "absolute",
              textTransform: "uppercase",
            }}>
            {/* {loading ? (
              <Skeleton variant="text" />
            ) : theme.direction === "rtl" ? (
              `${
                100 - ((product?.priceSale / product?.price) * 100).toFixed(0)
              }%-`
            ) : (
              `-${
                100 - ((product?.priceSale / product?.price) * 100).toFixed(0)
              }%`
            )} */}
          </Label>
        )}
        {status && product?.available < 1 && (
          <Label
            variant="filled"
            color={"error"}
            sx={{
              top: 16,
              left: 16,
              zIndex: 9,
              position: "absolute",
              textTransform: "uppercase",
            }}>
            {loading ? <Skeleton variant="text" /> : "Out of Stock"}
          </Label>
        )}
        <Box
          onClick={() =>
            !loading && product?.available > 0 && router.push(linkTo)
          }
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          sx={{
            bgcolor: "common.white",
            position: "relative",
            cursor: "pointer",
            img: {
              transition: "all 0.2s ease-in",
              objectFit: "cover",
              borderRadius: "8px 8px 0 0!important",
            },
            "&:hover": {
              img: {
                filter: "blur(2px)",
              },
            },
            "&:after": {
              content: `""`,
              display: "block",
              paddingBottom: "100%",
            },
            width: "100%",
          }}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              sx={{
                height: "100%",
                position: "absolute",
              }}
            />
          ) : (
            <Image src={cover} alt={name} fill sizes="100vw" />
          )}
          {!loading && (
            <>
              <Zoom in={open}>
                {isLoading ? (
                  <CircularProgress
                    sx={{
                      width: "20px!important",
                      height: "20px!important",
                      position: "absolute",
                      top: 12,
                      right: 20,
                      zIndex: 11,
                    }}
                  />
                ) : wishlist?.filter((v: { _id: string }) => v._id === _id)
                    .length > 0 ? (
                  <IconButton
                    onClick={onClickWishList}
                    size="small"
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: 7,
                      right: 14,
                      zIndex: 11,
                    }}>
                    <FavoriteRoundedIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={onClickWishList}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 7,
                      right: 14,
                      zIndex: 11,
                    }}>
                    <FavoriteBorderIcon fontSize="small" />
                  </IconButton>
                )}
              </Zoom>
              {/* style={{ transitionDelay: open ? "500ms" : "0ms" }} */}
              <Zoom
                in={open}
                style={{ transitionDelay: open ? "150ms" : "0ms" }}>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onClickCart();
                  }}
                  size="small"
                  sx={{ position: "absolute", top: 41, right: 14, zIndex: 11 }}>
                  <RemoveRedEyeOutlinedIcon fontSize="small" />
                </IconButton>
              </Zoom>
            </>
          )}
        </Box>
      </Box>

      <Stack
        spacing={0.5}
        justifyContent="center"
        sx={{
          p: 1,
          width: "100%",
          a: {
            color: "text.primary",
            textDecoration: "none",
          },
        }}>
        <Link href={linkTo}>
          <Box sx={{ display: "grid" }}>
            {" "}
            <Typography
              sx={{
                cursor: "pointer",
                textTransform: "capitalize",
                fontWeight: 500,
              }}
              variant={"subtitle1"}
              noWrap>
              {loading ? <Skeleton variant="text" /> : name}
            </Typography>
          </Box>
        </Link>

        <Stack
          sx={{ mt: "0!important" }}
          justifyContent="space-between"
          direction="row"
          alignItems="center">
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              span: {
                pl: 0.3,
                fontSize: 14,
              },
              svg: {
                color: "primary.main",
                width: 22,
              },
            }}>
            {loading ? (
              <Skeleton variant="text" width="60px" />
            ) : (
              <>
                <ThumbDownOffAltRoundedIcon
                  fontSize="small"
                  sx={{ transform: "rotate(180deg)" }}
                />{" "}
                <span>{likes}</span>
              </>
            )}
          </Stack>

          {loading ? (
            <Skeleton variant="text" width="60px" />
          ) : (
            <ColorPreview colors={colors} className="color-preview" />
          )}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mt: "0!important",
            "& .color-preview": {
              display: { sm: "flex", xs: "none" },
            },
          }}
          pb={0.5}>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              span: {
                pl: 0.3,
                fontSize: 14,
              },
              svg: {
                color: "warning.main",
                width: 22,
              },
            }}>
            {loading ? (
              <Skeleton variant="text" width="60px" />
            ) : (
              <>
                <StarRoundedIcon />{" "}
                <span>
                  {totalReview && totalRating
                    ? (totalRating / totalReview).toFixed(1)
                    : 0}
                </span>
              </>
            )}
          </Stack>
          <Typography
            variant={isMobile ? "body2" : "subtitle1"}
            component="p"
            sx={{
              span: {
                fontSize: 14,
                fontWeight: 400,
                textDecoration:
                  loading || loadingRedux ? "none" : "line-through",
                display: { md: "flex", xs: "none" },
              },
            }}>
            {loading || loadingRedux ? (
              <Skeleton variant="text" width="50px" />
            ) : (
              <>
                {symbol}{" "}
                {formatNumbers(product?.priceSale || product?.price, unitRate)}
              </>
            )}
          </Typography>
        </Stack>
        <Stack flexDirection="row" justifyContent="space-between">
          {loading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={40}
              sx={{ borderRadius: "8px" }}
            />
          ) : (
            <Button
              variant="contained"
              color="primary"
              size={isMobile ? "small" : "medium"}
              fullWidth
              disabled={loading || product?.available < 1}
              onClick={() => onAddCart()}>
              {t("add-to-cart")}
            </Button>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
