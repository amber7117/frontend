import React from "react";
import { useTheme, styled } from "@mui/material/styles";
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Avatar,
} from "@mui/material";
// components
import Label from "src/components/label";
import { fDateTime } from "src/utils/formatTime";
import useCurrency from "src/hooks/useCurrency";

const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 44,
  height: 44,
  minWidth: 44,
  objectFit: "cover",
  margin: theme.spacing(0, 1),
  // borderRadius: theme.shape.borderRadiusSm,
  borderRadius: "8px",
}));
export default function OrderRowas({ ...props }) {
  const { isLoading, row } = props;
  const theme = useTheme();

  return (
    <TableRow hover>
      <TableCell component="th" padding="none">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            maxWidth: 300,
          }}
        >
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              width={44}
              height={44}
              sx={{ borderRadius: 1, margin: (theme) => theme.spacing(0, 1) }}
            />
          ) : row?.items.length > 0 ? (
            <ThumbImgStyle
              alt={row?.items[0].fullName}
              src={row?.items[0].cover}
            />
          ) : (
            <Avatar>{row?.items[0].variantName}</Avatar>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? (
              <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
            ) : (
              row?.items[0].variantName
            )}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        {" "}
        {isLoading ? <Skeleton variant="text" /> : row?.items.length}
      </TableCell>
      <TableCell>
        {" "}
        {/* type error */}
        {isLoading ? <Skeleton variant="text" /> : useCurrency(row?.total)}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Label
            variant={theme.palette.mode === "light" ? "ghost" : "filled"}
            color={
              (row?.status === "delivered" && "success") ||
              (row?.status === "ontheway" && "warning") ||
              (row?.status === "pending" && "info") ||
              "error"
            }
          >
            {row?.status}
          </Label>
        )}
      </TableCell>
      <TableCell align="right">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <>{fDateTime(row?.createdAt)}</>
        )}
      </TableCell>
    </TableRow>
  );
}
