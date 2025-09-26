import PropTypes from "prop-types";
// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
// material
import { alpha, styled } from "@mui/material/styles";
import {
  Box,
  Table,
  Stack,
  Divider,
  TableRow,
  Radio,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  Skeleton,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
// utils
import getColorName from "src/utils/getColorName";
//components
const RootStyled = dynamic(() => import("./styled"));
const Incrementer = dynamic(() => import("src/components/incrementer"));
// ----------------------------------------------------------------------

interface ProductProps {
  _id: string;
  variantName: string;
  images: any;
  sku: string;
  name: string;
  size: string;
  priceSale: string;
  color: string;
  cover: string;
  quantity: number;
  available: string;
}

const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 48,
  height: 48,

  objectFit: "cover",
  marginRight: theme.spacing(2),
  // borderRadius: theme.shape.borderRadiusSm,
  borderRadius: "8px",
  border: `1px solid ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

ProductList.propTypes = {};
const formatNumbers = (number: number, unitRate: string | number) => {
  const converted = (number * Number(unitRate)).toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
  return converted;
};

export default function ProductList({ ...props }) {
  const {
    formik,
    symbol,
    unitRate,
    loaded,
    isLoading,
    variants,
    variantId,
    setFieldValue,
  } = props;
  const { t } = useTranslation("checkout");
  //   const { products } = formik.values;
  return (
    <RootStyled>
      <Stack>
        {variants?.map((product: ProductProps) => {
          const { _id, variantName, size, images, color } = product;
          const active = variantId === _id;
          return (
            <Stack>
              {/* <Typography variant="h4" color="text.primary" mb={2}>
                Variants
              </Typography> */}
              <Stack
                onClick={() => setFieldValue("variantId", _id)}
                className="product-sec"
                direction={"row"}
                justifyContent={"space-between"}
                sx={{
                  mb: 1,
                  border: (theme) =>
                    `1px solid ${
                      active
                        ? theme.palette.primary.main
                        : theme.palette.divider
                    }`,
                  p: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  bgcolor: (theme) =>
                    active
                      ? alpha(theme.palette.primary.main, 0.2)
                      : "transparent",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  },
                }}
                // gap={1}
              >
                <Stack direction="row" alignItems="center">
                  {isLoading ? (
                    <Skeleton variant="rounded" width={48} height={48} />
                  ) : (
                    <ThumbImgStyle alt="product image" src={images[0].url} />
                  )}
                  <Box>
                    <Typography
                      noWrap
                      variant="subtitle1"
                      className="subtitle"
                      // component={"span"}
                      flexWrap="nowrap"
                      // width={100}
                      sx={{
                        fontSize: {
                          md: "auto",
                          xs: 12,
                        },
                      }}>
                      {isLoading ? (
                        <Skeleton variant="text" width={83} />
                      ) : (
                        variantName
                      )}
                    </Typography>
                    <Stack direction="row" gap={2}>
                      <Typography
                        noWrap
                        variant="body2"
                        className="subtitle"
                        color="text.secondary"
                        component={"span"}
                        flexWrap="nowrap"
                        sx={{
                          fontSize: {
                            md: "auto",
                            xs: 10,
                          },
                        }}
                        // width={100}
                      >
                        {isLoading && size ? (
                          <Skeleton variant="text" width={83} />
                        ) : (
                          "Size: " + size
                        )}
                      </Typography>
                      <Typography
                        noWrap
                        variant="body2"
                        className="subtitle"
                        color="text.secondary"
                        component={"span"}
                        flexWrap="nowrap"
                        sx={{
                          fontSize: {
                            md: "auto",
                            xs: 10,
                          },
                        }}
                        // width={100}
                      >
                        {isLoading && size ? (
                          <Skeleton variant="text" width={83} />
                        ) : (
                          "Color: " + color
                        )}
                      </Typography>
                    </Stack>
                  </Box>
                  {/* <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        divider={<Divider orientation="vertical" />}
                      >
                        <Typography variant="body2">
                          {isLoading ? (
                            <Skeleton variant="text" width={46} />
                          ) : (
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                {t("size")}:&nbsp;
                              </Typography>
                              {size}
                            </>
                          )}
                        </Typography>
                        <Typography variant="body2">
                          {isLoading ? (
                            <Skeleton variant="text" width={46} />
                          ) : (
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                {t("color")}:&nbsp;
                              </Typography>
                              {getColorName(color)}
                            </>
                          )}
                        </Typography>
                      </Stack> */}
                </Stack>
                <Radio
                  size="small"
                  checked={active}
                  //   onChange={handleChange}
                  value={active}
                  name="radio-buttons"
                  inputProps={{ "aria-label": _id }}
                />
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </RootStyled>
  );
}
