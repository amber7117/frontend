import React from "react";
import RootStyled from "./styled";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 40,
  height: 40,
  minWidth: 40,
  objectFit: "cover",
  marginRight: theme.spacing(2),
  // borderRadius: theme.shape.borderRadiusSm,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
}));

export default function OrderCard({ ...props }) {
  const { currency, data, isLoading } = props;
  return (
    <RootStyled spacing={2}>
      {data?.map((row: any) => (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center">
                <ThumbImgStyle alt={row?.variantName} src={row?.cover} />
                <Typography variant="subtitle1" color="text.primary" noWrap>
                  {row?.variantName.slice(0, 50)}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="end"
                justifyContent="space-between">
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.primary">
                    <b>color :</b> {row?.color}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <b>Quantity :</b> {row?.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <b>size :</b> {row?.size}
                  </Typography>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography
                    variant="subtitle1"
                    // fontWeight={500}
                    color="text.primary">
                    {currency} {row?.priceSale || row?.price}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </RootStyled>
  );
}
