import { useState } from "react";
import _ from "lodash";
import Image from "next/image";
import BlurImage from "src/components/blurImage";

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
  Rating,
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

const formatNumbers = (number: number, unitRate: number) => {
  console.log("number:", number);
  console.log("unitRate:", unitRate);
  const converted = (number * Number(unitRate)).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  console.log("converted:", converted);
  return converted;
};
export default function ShopProductCard({ ...props }) {
  const {
    product,
    category,
    loading,
    isMobile,
    isLoaded,
    loadingRedux,
    onClickCart,
    symbol,
    unitRate,
  } = props;
  const theme = useTheme();
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

  const { name, slug, cover, status, averageRating, likes, reviews, _id } =
    !loading && product;
  const linkTo = category ? "/categories/abc" : `/product/${slug ? slug : ""}`;

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
      onClick={() =>
        !loading &&
        product?.variants[product?.selectedVariant]?.available > 0 &&
        router.push(linkTo)
      }
      sx={{
        display: "block",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ position: "relative" }}>
        {!loading &&
          product?.variants[product?.selectedVariant]?.price >
            product?.variants[product?.selectedVariant]?.priceSale && (
            <Label
              variant="filled"
              color={"primary"}
              sx={{
                top: 16,
                left: 16,
                zIndex: 9,
                position: "absolute",
                textTransform: "uppercase",
                borderRadius: 20,
              }}
            >
              {loading ? (
                <Skeleton variant="text" />
              ) : theme.direction === "rtl" ? (
                `${(
                  100 -
                  (product?.variants[product?.selectedVariant]?.priceSale /
                    product?.variants[product?.selectedVariant]?.price) *
                    100
                ).toFixed(0)}%-`
              ) : (
                `-${(
                  100 -
                  (product?.variants[product?.selectedVariant]?.priceSale /
                    product?.variants[product?.selectedVariant]?.price) *
                    100
                ).toFixed(0)}%`
              )}
            </Label>
          )}
        {status &&
          product?.variants[product?.selectedVariant]?.available < 1 && (
            <Label
              variant="filled"
              color={"error"}
              sx={{
                top: 16,
                left: 16,
                zIndex: 9,
                position: "absolute",
                textTransform: "uppercase",
                borderRadius: 20,
              }}
            >
              {loading ? <Skeleton variant="text" /> : "Out of Stock"}
            </Label>
          )}
        <Box
          // onClick={() =>
          //   !loading &&
          //   product?.variants[product?.selectedVariant]?.available > 0 &&
          //   router.push(linkTo)
          // }
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          sx={{
            bgcolor: isLoading || loading ? "transparent" : "#F1F1F1",
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
          }}
        >
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
            <BlurImage alt={name} src={cover} fill sizes="100vw" />
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
                    }}
                  >
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
                    }}
                  >
                    <FavoriteBorderIcon fontSize="small" />
                  </IconButton>
                )}
              </Zoom>
              <Zoom
                in={open}
                style={{ transitionDelay: open ? "150ms" : "0ms" }}
              >
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onClickCart();
                  }}
                  size="small"
                  sx={{ position: "absolute", top: 41, right: 14, zIndex: 11 }}
                >
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
          cursor: "pointer",
          p: 1.5,
          width: "100%",
          a: {
            color: "text.primary",
            textDecoration: "none",
          },
        }}
      >
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
              noWrap
            >
              {loading ? <Skeleton variant="text" /> : name}
            </Typography>
          </Box>
        </Link>

        <Stack
          sx={{ mt: "0!important" }}
          justifyContent="space-between"
          direction="row"
          alignItems="center"
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              span: {
                fontSize: { xs: 14, md: 18 },
              },
            }}
          >
            {loading ? (
              <Skeleton variant="text" width="60px" />
            ) : (
              <>
                <Rating
                  name="read-only"
                  value={averageRating || 0}
                  readOnly
                  sx={{ display: { xs: "none", md: "flex" } }}
                />
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    display: { xs: "flex", md: "none" },
                    svg: {
                      color: "warning.main",
                      width: 22,
                    },
                  }}
                >
                  <StarRoundedIcon /> <span>{averageRating || 0}</span>
                </Stack>
              </>
            )}
          </Stack>
          {loading ? (
            <Skeleton variant="text" width="60px" />
          ) : (
            <ColorPreview
              colors={product.variants.map(({ color }: { color: string }) => {
                return color;
              })}
              className="color-preview"
            />
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
        >
          <Typography
            variant={isMobile ? "body2" : "h6"}
            sx={{
              fontWeight: 500,
              "& > span": {
                fontSize: 14,
                fontWeight: 400,
                textDecoration:
                  loading || loadingRedux ? "none" : "line-through",
                display: { md: "flex", xs: "none" },
              },
            }}
          >
            {loading || loadingRedux ? (
              <Skeleton variant="text" width="50px" />
            ) : (
              <>
                {symbol}{" "}
                {isLoaded &&
                  formatNumbers(
                    product?.variants[product?.selectedVariant]?.priceSale ||
                      product?.variants[product?.selectedVariant]?.price,
                    unitRate
                  )}
              </>
            )}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
