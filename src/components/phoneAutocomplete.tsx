import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import Box from "@mui/material/Box";
import { useParams } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import Typography from "@mui/material/Typography";
import { Stack, useTheme } from "@mui/material";

export default function phoneAutocomplete({ ...props }) {
  const { setFieldValue, phone, inputError } = props;
  const [focus, setfocus] = React.useState(false);
  const theme = useTheme();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { t } = useTranslation("checkout");
  console.log(locale, "phone");

  return (
    <Stack spacing={1} width={"100%"}>
      <Box sx={{
          direction: locale === "ar" ? "rtl" : "ltr",
          "& .special-label": {
            bgcolor: theme.palette.background.paper,
            left: locale === "ar" ? 8 : 8,
            right: locale === "ar" ? "auto" : "auto",
            color: inputError
              ? theme.palette.error.main
              : theme.palette.grey[500],
            ...(focus && {
              color: theme.palette.primary.main,
            }),
          },
          input: {
            bgcolor: theme.palette.background.paper + "!important",
            borderColor: inputError
              ? theme.palette.error.main + "!important"
              : theme.palette.divider + "!important",
            borderRadius: "8px !important",
            height: 56,
            width: "100%!important",
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.text.primary + "!important",
            },
            "&:focus": {
              borderColor: theme.palette.primary.main + "!important",
            },
          },
          "& .country-list ": {
            bgcolor: theme.palette.background.default + "!important",
            border: "1px solid " + theme.palette.primary.main,
            px: 1,
          },
          "& .country-list .country:hover, .country.highlight": {
            bgcolor: theme.palette.primary.light + "!important",
            // border: "1px solid " + theme.palette.primary.main,
            borderRadius: "8px",
          },
        }}>
        <PhoneInput
          specialLabel={t("Phone")}
          country={"us"}
          onBlur={() => setfocus(false)}
          onFocus={() => setfocus(true)}
          inputProps={{
            error: true,
            required: true,
          }}
          value={phone}
          onChange={(v) => setFieldValue("phone", v)}
        />
      </Box>
      {inputError && (
        <Typography variant="body2" color="error" fontSize={"0.625rem"}>
          Phone Number is requried
        </Typography>
      )}
    </Stack>
  );
}
