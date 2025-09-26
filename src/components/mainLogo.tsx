import { Box, useTheme, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function MainLogo() {
  const theme = useTheme();
  return (
    <Box
      component={Link}
      sx={{
        position: "relative",
      }}
      href="/">
      {theme.direction === "rtl" ? (
        <Typography
          variant="h5"
          color="text.primary"
          sx={{
            span: {
              color: "primary.main",
            },
          }}>
          <span>نكست</span>ستور
        </Typography>
      ) : (
        <Typography
          variant="h4"
          color="text.primary"
          sx={{
            span: {
              color: "primary.main",
            },
          }}>
          <span>GOGOGM</span>
        </Typography>
      )}
    </Box>
  );
}
