import React from "react";
import Image from "src/components/blutImage.tsx";
import { Paper, Grid, Typography, Stack, Button } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
function SellingCard({ ...props }) {
  const theme = useTheme();
  const router = useRouter();
  const { item } = props;
  const { label, title, message, img, link } = item;
  return (
    <Paper
      sx={{
        bgcolor: "background.neutral",
        px: 3,
        py: 1,
        borderColor: (theme) => theme.palette.divider,
        borderWidth: 1,
        borderStyle: "solid",
        position: "relative",
        "&:hover": {
          "& .stack-animation": {
            "-webkit-transform": "scale(1)",
            "-ms-transform": "scale(1)",
            transform: "scale(1)",
            opacity: 1,
          },
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={8} md={7}>
          <Stack justifyContent="center" height={1}>
            <Typography variant="h6" color="text.primary" fontWeight={500}>
              {label}
            </Typography>
            <Typography
              variant="h3"
              color="text.primary"
              lineHeight={1.1}
              my={0.5}
              sx={{
                [theme.breakpoints.down("sm")]: {
                  fontSize: 18,
                },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              fontWeight={400}
              lineHeight={1.2}
              sx={{
                [theme.breakpoints.down("sm")]: {
                  fontSize: 18,
                },
              }}
            >
              {message}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={4} md={5}>
          <Image
            src={img}
            alt={title}
            width="100%"
            height="100%"
            layout="responsive"
          />
        </Grid>
      </Grid>
      <Stack
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
          overflow: "hidden",
          width: "100%",
          height: "100%",
          "-webkit-transform": "scale(0.7)",
          "-ms-transform": "scale(0.7)",
          transform: "scale(0.7)",
          "-webkit-transition": ".3s ease",
          transition: ".3s ease",
          opacity: 0,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
        }}
        height={1}
        className="stack-animation"
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push(link)}
        >
          Order Now
        </Button>
      </Stack>
    </Paper>
  );
}

export default SellingCard;
