import PropTypes from "prop-types";
// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Table,
  Stack,
  Divider,
  TableRow,
  TableBody,
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
import RootStyled from "./styled";
const Incrementer = dynamic(() => import("src/components/incrementer"));
// ----------------------------------------------------------------------

interface ProductProps {
  sku: string;
  variantName: string;
  name: string;
  size: string;
  priceSale: string;
  color: string;
  cover: string;
  quantity: number;
  available: string;
}

const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: "cover",
  marginRight: theme.spacing(2),
  // borderRadius: theme.shape.borderRadiusSm,
  borderRadius: "8px",
  border: `1px solid ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

ProductList.propTypes = {
  onDelete: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
};
const formatNumbers = (number: number, unitRate: string | number) => {
  const converted = (number * Number(unitRate)).toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
  return converted;
};

export default function ProductList({ ...props }) {
  const {
    formik,
    onDelete,
    onIncreaseQuantity,
    onDecreaseQuantity,
    symbol,
    unitRate,
    loaded,
    isLoading,
  } = props;
  const { t } = useTranslation("checkout");
  const { products } = formik.values;
  return (
    <RootStyled>
      <Table>
        <TableHead>
          <TableRow className="table-head-row">
            <TableCell>
              {isLoading ? (
                <Skeleton variant="text" width={47} />
              ) : (
                t("product")
              )}
            </TableCell>
            <TableCell align="left">
              {isLoading ? <Skeleton variant="text" width={30} /> : t("price")}
            </TableCell>
            <TableCell align="left">
              {isLoading ? (
                <Skeleton variant="text" width={54} />
              ) : (
                t("quantity")
              )}
            </TableCell>
            <TableCell>
              {isLoading ? (
                <Skeleton variant="text" width={63} />
              ) : (
                t("total-price")
              )}
            </TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product: ProductProps) => {
            const {
              sku,
              name,
              variantName,
              size,
              priceSale,
              color,
              cover,
              quantity,
              available,
            } = product;

            return (
              <TableRow key={Math.random()}>
                <TableCell>
                  <Box className="product-sec">
                    {isLoading ? (
                      <Skeleton
                        variant="rounded"
                        width={64}
                        height={64}
                        sx={{ mr: 2 }}
                      />
                    ) : (
                      <ThumbImgStyle alt="product image" src={cover} />
                    )}
                    <Box>
                      <Typography
                        noWrap
                        variant="subtitle2"
                        className="subtitle">
                        {isLoading ? (
                          <Skeleton variant="text" width={83} />
                        ) : (
                          variantName
                        )}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        divider={<Divider orientation="vertical" />}>
                        {size && (
                          <Typography variant="body2">
                            {isLoading ? (
                              <Skeleton variant="text" width={46} />
                            ) : (
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary">
                                  {t("size")}:&nbsp;
                                </Typography>
                                {size}
                              </>
                            )}
                          </Typography>
                        )}
                        {color && (
                          <Typography variant="body2">
                            {isLoading ? (
                              <Skeleton variant="text" width={46} />
                            ) : (
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary">
                                  {t("color")}:&nbsp;
                                </Typography>
                                {getColorName(color)}
                              </>
                            )}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  {isLoading ? (
                    <Skeleton variant="text" width={38} />
                  ) : (
                    <>
                      {loaded && symbol}{" "}
                      {loaded && formatNumbers(Number(priceSale), unitRate)}
                    </>
                  )}
                </TableCell>
                <TableCell align="left">
                  <Incrementer
                    quantity={quantity}
                    available={available}
                    onDecrease={() => onDecreaseQuantity(sku)}
                    onIncrease={() => onIncreaseQuantity(sku)}
                  />
                </TableCell>
                <TableCell>
                  {isLoading ? (
                    <Skeleton variant="text" width={38} />
                  ) : (
                    <>
                      {loaded && symbol}{" "}
                      {loaded &&
                        formatNumbers(Number(priceSale) * quantity, unitRate)}
                    </>
                  )}
                </TableCell>
                <TableCell align="right">
                  {isLoading ? (
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      sx={{ ml: "auto" }}
                    />
                  ) : (
                    <IconButton
                      aria-label="delete"
                      color="primary"
                      onClick={() => onDelete(sku)}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </RootStyled>
  );
}
