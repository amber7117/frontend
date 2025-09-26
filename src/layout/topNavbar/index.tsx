// react
import React from "react";

// next
import Link from "next/link";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";

// material
import { Stack, Typography, Divider, Skeleton } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import RootStyled from "./styled";

// dynamic imports
const CurrencySelect = dynamic(
  () => import("src/components/select/currencySelect"),
  {
    loading: () => (
      <Skeleton
        variant="rectangular"
        width={41.6}
        height={18.9}
        sx={{ borderRadius: "4px" }}
      />
    ),
  }
);
const LanguageSelect = dynamic(
  () => import("src/components/select/languageSelect"),
  {
    loading: () => (
      <Skeleton
        variant="rectangular"
        width={58.9}
        height={18.9}
        sx={{ borderRadius: "4px" }}
      />
    ),
  }
);
const UserSelect = dynamic(() => import("src/components/select/userSelect"), {
  loading: () => (
    <Stack direction="row" gap={2}>
      <Skeleton
        variant="rectangular"
        width={29.4}
        height={18.9}
        sx={{ borderRadius: "4px" }}
      />
      <Divider orientation="vertical" flexItem />
      <Skeleton
        variant="rectangular"
        width={48.4}
        height={18.9}
        sx={{ borderRadius: "4px" }}
      />
    </Stack>
  ),
});

export default function TopNavbar() {
  const { t } = useTranslation("common");
  return (
    <RootStyled direction="row" justifyContent="space-between">
      <Stack direction="row" gap={2}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "flex",
            alignItems: "center",
          }}>
          <LocationOnOutlinedIcon sx={{ mt: "-2px", fontSize: 16 }} />{" "}
          {t("header.address")}
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Link href="mailto: support@gogogm.com">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              transition: ".2s ease-in",
              "&:hover": {
                color: "primary.main",
              },
            }}>
            <MailOutlineRoundedIcon
              sx={{ mr: 0.5, mt: "-2px", fontSize: 16 }}
            />
            support@gogogm.com
          </Typography>
        </Link>
      </Stack>
      <Stack direction="row" gap={2}>
        <CurrencySelect />
        <Divider orientation="vertical" flexItem />
        <LanguageSelect />
        <Divider orientation="vertical" flexItem />
      </Stack>
    </RootStyled>
  );
}
