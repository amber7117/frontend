import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
// material
import {
  Container,
  Card,
  Typography,
  CardContent,
  Stack,
  Skeleton,
  Divider,
  Table,
  Box,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
// components
import OrderDetailsTable from "../tableDetails";
import RootStyled from "./styled";
import OrderCard from "../orderCard";

export default function TableCard({ ...props }) {
  const { t } = useTranslation("order");
  const { data, isLoading } = props;
  const items = data?.items;
  return (
    <RootStyled>
      {isLoading ? (
        <Skeleton variant="text" width={100} className="skeleton-h5" />
      ) : (
        <Typography variant="h5" p={2}>
          {items?.length} {items?.length > 1 ? t("items") : t("item")}
        </Typography>
      )}
      <OrderDetailsTable
        currency={data?.currency}
        data={items}
        isLoading={isLoading}
      />
      <Divider />
      <Table>
        <TableBody>
          <TableRow className="body-row">
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton
                  variant="text"
                  className="skeleton-text"
                  width={100}
                />
              ) : (
                <strong>{t("subtotal")}</strong>
              )}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton
                  variant="text"
                  className="skeleton-text"
                  width={100}
                />
              ) : (
                <strong>
                  {data?.currency} {data?.subTotal}
                </strong>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton
                  variant="text"
                  className="skeleton-text"
                  width={100}
                />
              ) : (
                <strong>{t("shipping-fee")}</strong>
              )}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton
                  variant="text"
                  className="skeleton-text"
                  width={100}
                />
              ) : (
                <strong>
                  {data?.currency} {data?.shipping}
                </strong>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton
                  variant="text"
                  className="skeleton-text"
                  width={100}
                />
              ) : (
                <strong>{t("total")}</strong>
              )}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton
                  variant="text"
                  className="skeleton-text"
                  width={100}
                />
              ) : (
                <strong>
                  {data?.currency} {data?.total}
                </strong>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </RootStyled>
  );
}
