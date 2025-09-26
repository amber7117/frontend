import React from "react";

// material
import { Container, Grid, Box, Skeleton } from "@mui/material";

export default function SecondarySlider() {
  return (
    <Container fixed>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Box
            sx={{
              mt: 2,
              position: "relative",
              "&:after": {
                content: `""`,
                display: "block",
                pb: "100%",
              },
            }}
          >
            <Skeleton
              vairant="rounded"
              width="100%"
              height="100%"
              sx={{
                position: "absolute",
                transform: "none",
              }}
            />
          </Box>
        </Grid>
        <Grid item md={6} xs={12}>
          <Box
            sx={{
              mt: 2,
              position: "relative",
              "&:after": {
                content: `""`,
                display: "block",
                pb: "48.5%",
              },
            }}
          >
            <Skeleton
              vairant="rounded"
              width="100%"
              height="100%"
              sx={{
                position: "absolute",
                transform: "none",
              }}
            />
          </Box>
          <Box
            sx={{
              mt: 2,
              position: "relative",
              "&:after": {
                content: `""`,
                display: "block",
                pb: "48.5%",
              },
            }}
          >
            <Skeleton
              vairant="rounded"
              width="100%"
              height="100%"
              sx={{
                position: "absolute",
                transform: "none",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
