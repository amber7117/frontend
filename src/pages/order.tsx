import React, { useState } from "react";
import { useQuery } from "react-query";
import useTranslation from "next-translate/useTranslation";
// material
import { Container, Typography, Skeleton, Button, Box } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
// components
import { Page } from "src/components";
import OrderDetails from "src/components/_main/orders/orderDetails";
import TableCard from "src/components/_main/orders/tableCard";
// api
import * as api from "src/services";
// utils

import { useRouter, useSearchParams } from "next/navigation";

// redux
import { useDispatch } from "react-redux";
import { resetCart } from "src/redux/slices/product";
import OrderCard from "src/components/_main/orders/orderCard";
//

// ----------------------------------------------------------------------
export default function OrderDetail() {
  const { t } = useTranslation("order");
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('oid');
  const dispatch = useDispatch();

  const { data: singleOrder, isLoading } = useQuery(
    ["order", id],
    () => api.getSingleOrder(id),
    {
      enabled: Boolean(id),
      retry: 2,
      onError: (error: any) => {
        if (!error.response.data.success) {
          router.push("/404");
        }
      },
    }
  );
  const data = singleOrder?.data;
  React.useEffect(() => {
    dispatch(resetCart());
  }, []);

  return (
    // <Page title={`Order created | ${process.env.DOMAIN_NAME}`}>
    <Page title={`Order created | Nextstore`}>
      <Container>
        <Box mb={5}>
          <Typography variant="h3" mt={5} mb={2}>
            {isLoading ? (
              <Skeleton variant="text" width={170} />
            ) : (
              t("order-created")
            )}
          </Typography>
          <OrderDetails
            data={data}
            isLoading={isLoading}
            currency={data?.currency}
          />
          {/* <OrderCard
          data={data?.items}
          isLoading={isLoading}
          currency={data?.currency}
        /> */}
          <TableCard data={data} isLoading={isLoading} />
          {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            my: 2,
          }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => router.push("/")}
            // startIcon={<ArrowBackRoundedIcon />}
          >
            {t("continue-shopping")}
          </Button>
        </Box> */}
        </Box>
      </Container>
    </Page>
  );
}
