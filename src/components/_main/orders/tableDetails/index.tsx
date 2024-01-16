import React from "react";
// material
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  Box,
  Skeleton,
  Stack,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useTranslation from "next-translate/useTranslation";
import RootStyled from "./styled";
const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: "cover",
  // margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadius,
  border: "1px solid" + theme.palette.divider,
}));
export default function ItemsTable({ ...props }) {
  const theme = useTheme();
  const { data, isLoading, currency } = props;
  const { t } = useTranslation("order");
  return (
    <RootStyled>
      <TableContainer>
        <Table className="table-main">
          <TableHead>
            <TableRow className="head-row">
              <TableCell className="head-row-cell">{t("product")}</TableCell>
              <TableCell className="head-row-cell active">
                {t("color")}
              </TableCell>
              <TableCell className="head-row-cell">{t("quantity")}</TableCell>
              <TableCell className="head-row-cell active">
                {t("size")}
              </TableCell>
              <TableCell className="head-row-cell">{t("Price")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(isLoading ? Array.from(new Array(3)) : data)?.map(
              (row: any, i: any) => (
                <TableRow key={`row-${i}`}>
                  <TableCell>
                    {row ? (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <ThumbImgStyle
                          alt={row?.variantName}
                          src={row?.cover}
                        />
                        <Stack spacing={0.5}>
                          <Typography
                            variant={"subtitle2"}
                            noWrap
                            fontSize={{ xs: "12px", sm: "0.875rem" }}>
                            {row?.variantName.slice(0, 50)}
                          </Typography>
                          <Stack
                            spacing={1}
                            direction="row"
                            alignItems="center"
                            sx={{ display: { xs: "flex", sm: "none" } }}>
                            <Typography variant="body2" fontSize={10}>
                              <b>Color :</b> {row.color ? row.color : "N/A"}
                            </Typography>
                            <Typography variant="body2" fontSize={10}>
                              <b>Size :</b> {row.size ? row.size : "N/A"}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton
                          variant="rectangular"
                          width={64}
                          height={64}
                        />
                        <Skeleton variant="text" width={100} />
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell className="body-column-cell">
                    {row ? (
                      row.color ? (
                        row.color
                      ) : (
                        "N/A"
                      )
                    ) : (
                      <Skeleton variant="text" width={100} />
                    )}
                  </TableCell>

                  <TableCell>
                    {row ? (
                      row?.quantity
                    ) : (
                      <Skeleton variant="text" width={100} />
                    )}
                  </TableCell>
                  <TableCell className="body-column-cell">
                    {row ? (
                      row?.size ? (
                        row?.size
                      ) : (
                        "N/A"
                      )
                    ) : (
                      <Skeleton variant="text" width={100} />
                    )}
                  </TableCell>
                  <TableCell>
                    {row ? (
                      `${currency} ${row?.priceSale || row?.price}`
                    ) : (
                      <Skeleton variant="text" width={100} />
                    )}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </RootStyled>
  );
}
