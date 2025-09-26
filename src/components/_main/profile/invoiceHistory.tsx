import React from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import * as api from "src/services";
import useTranslation from "next-translate/useTranslation";
const Table = dynamic(() => import("src/components/table/table"));
const OrderRow = dynamic(
  () => import("src/components/table/tableRows/orderRow")
);
const OrderCard = dynamic(() => import("src/components/cards/orderCard"));

export default function InvoiceHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation("profile");
  const pageParam = searchParams.get("page");
  const { data, isLoading } = useQuery(
    ["user-details", pageParam],
    () => api.getUserProfile(`?page=${pageParam || 1}`),
    {
      retry: false,
      onError: (error: any) => {
        if (!error.response.data.success) {
          router.push("/404");
        }
      },
    }
  );
  const orders = (function () {
    if (isLoading) {
      return null;
    } else {
      const { orders } = data?.data;
      return orders;
    }
  })();
  const tableData = { data: orders, count: data?.data.count };

  const TABLE_HEAD = [
    { id: "name", label: t("product"), alignRight: false },
    { id: "quantity", label: t("quantity"), alignRight: false },
    { id: "total", label: t("total"), alignRight: false, sort: true },
    { id: "inventoryType", label: t("status"), alignRight: false, sort: true },
    { id: "createdAt", label: t("date"), alignRight: true, sort: true },
  ];

  return (
    <Box width={1}>
      <Table
        headData={TABLE_HEAD}
        data={tableData}
        isLoading={isLoading}
        row={OrderRow}
        mobileRow={OrderCard}
      />
    </Box>
  );
}
