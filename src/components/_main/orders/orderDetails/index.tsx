import React from "react";
// material
import {
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Grid,
  Skeleton,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import useTranslation from "next-translate/useTranslation";
// styles
import RootStyled from "./styled";

export default function Details({ ...props }) {
  const { data, isLoading } = props;
  const { t } = useTranslation("order");
  const user = data?.user;
  return (
    <RootStyled>
      <CardContent>
        <Stack direction="row" alignItems="center" pb={1}>
          {isLoading ? (
            <>
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={170} className="skeleton" />
            </>
          ) : (
            <>
              <Typography variant="h6">{t("order-details")}</Typography>
              <Typography ml="auto" variant="body1">
                {t("order-id")}: {data?._id}
              </Typography>
            </>
          )}
        </Stack>
        <Divider />
        <Stack mt={4}>
          <Grid spacing={2} container>
            <Grid item xs={12} md={4}>
              <Card className="detail-card">
                <CardContent>
                  <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center">
                    {isLoading ? (
                      <>
                        <Skeleton
                          variant="rectangular"
                          width={50}
                          height={50}
                        />
                        <Skeleton variant="text" width={150} />
                      </>
                    ) : (
                      <>
                        <Button
                          className="detail-card-btn"
                          variant="contained"
                          color="primary">
                          <Person2RoundedIcon />
                        </Button>
                        <Typography variant="h6">
                          {t("customor-details")}
                        </Typography>
                      </>
                    )}
                  </Stack>
                  <Stack spacing={isLoading ? 0 : 1} mt={3}>
                    {isLoading ? (
                      <>
                        <Skeleton variant="text" width={200} />
                        <Skeleton variant="text" width={200} />
                        <Skeleton variant="text" width={200} />
                      </>
                    ) : (
                      <>
                        <Typography variant="body2">
                          <strong>{t("name")}</strong>: {user?.fullName}
                        </Typography>
                        <Typography variant="body2">
                          <strong>{t("phone")}</strong>: {user?.phone}
                        </Typography>
                        <Typography className="email-haeding" variant="body2">
                          <strong>{t("email")}</strong>: {user?.email}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="detail-card">
                <CardContent>
                  <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center">
                    {isLoading ? (
                      <>
                        <Skeleton
                          variant="rectangular"
                          width={50}
                          height={50}
                        />
                        <Skeleton variant="text" width={150} />
                      </>
                    ) : (
                      <>
                        <Button
                          className="detail-card-btn"
                          variant="contained"
                          color="primary">
                          <LocalShippingRoundedIcon />
                        </Button>
                        <Typography variant="h6">
                          {t("shipping-address")}
                        </Typography>
                      </>
                    )}
                  </Stack>
                  <Stack spacing={isLoading ? 0 : 1} mt={3}>
                    {isLoading ? (
                      <>
                        <Skeleton variant="text" width={200} />
                        <Skeleton variant="text" width={200} />
                        <Skeleton variant="text" width={200} />
                      </>
                    ) : (
                      <>
                        <Typography variant="body2">
                          <strong>{t("address")}</strong>: {user?.address}{" "}
                          {user?.zip}, {user?.city} {user?.state},{" "}
                          {user?.country}
                        </Typography>
                        <Typography variant="body2">
                          <strong>{t("order-date")}</strong>:{" "}
                          {data?.createdAt &&
                            new Date(data?.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                minute: "numeric",
                                hour: "numeric",
                              }
                            )}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="detail-card">
                <CardContent>
                  <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center">
                    {isLoading ? (
                      <>
                        <Skeleton
                          variant="rectangular"
                          width={50}
                          height={50}
                        />
                        <Skeleton variant="text" width={150} />
                      </>
                    ) : (
                      <>
                        <Button
                          className="detail-card-btn"
                          variant="contained"
                          color="primary">
                          <MonetizationOnRoundedIcon />
                        </Button>
                        <Typography variant="h6">
                          {t("payment-method")}
                        </Typography>
                      </>
                    )}
                  </Stack>
                  <Stack spacing={isLoading ? 0 : 1} mt={3}>
                    {isLoading ? (
                      <>
                        <Skeleton variant="text" width={200} />
                        <Skeleton variant="text" width={200} />
                        <Skeleton variant="text" width={200} />
                      </>
                    ) : (
                      <>
                        <Typography variant="body2">
                          <strong>{t("method")}</strong>:{" "}
                          {data?.paymentMethod === "COD"
                            ? t("cash-on-delivery")
                            : t("credit-card")}
                        </Typography>
                        <Typography variant="body2" textTransform="capitalize">
                          <strong>{t("status")}</strong>: {data?.status}
                        </Typography>
                        <Typography variant="body2" textTransform="capitalize">
                          <strong>{t("shipping-fee")}</strong>: {data?.currency}{" "}
                          {data?.shipping}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </RootStyled>
  );
}
