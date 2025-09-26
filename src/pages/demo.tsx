import React from "react";
import Image from "next/image";
import { Grid, Container, Box, Card, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import BlurImage from "src/components/blurImage";

// import DashboardImage from "../../public/images/dashboard-nextstore.png";
// import ClientImage from "../../public/images/nextstore-client-app.png";
import { getBlurDataURL } from "src/utils/getBlurDataURL";
import { MainLogo } from "src/components";

export default function LivePreview() {
  const router = useRouter();
  const abcd = async () => {
    const abc = await getBlurDataURL(
      "https://res.cloudinary.com/techgater/image/upload/v1677779585/my-uploads/wehodsbrpbopwhizash2.jpg"
    );
    console.log(abc);
  };
  React.useEffect(() => {
    abcd();
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            boxShadow: "none",
            bgcolor: "transparent",
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            "& .MuiToolbar-root": {
              minHeight: "66px",
            },
          }}>
          <Toolbar>
            <MainLogo />

            <Box ml="auto">
              <Button onClick={() => router.push("/demo")} color="primary">
                Home
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    "https://documentations-nextstore.vercel.com/",
                    "_ blank"
                  )
                }
                sx={{
                  color: "text.primary",
                }}>
                Documentation
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Container>
        <Typography
          variant="h2"
          color="text.primary"
          my={4}
          sx={{ textAlign: "center" }}>
          Live Preview
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Card sx={{ textAlign: "center", p: 3 }}>
              <Box
                position="relative"
                sx={{
                  width: 300,
                  height: 200,
                  mx: "auto",
                }}>
                <BlurImage
                  src="/images/commercehope-client-app.png"
                  alt="banner-2"
                  layout="fill"
                  objectFit="contain"
                  placeholder="blur"
                  blurDataURL="/images/nextstore-client-app.png"
                />
              </Box>
              <Typography variant="h3" color="text.primary">
                Front-end
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The Front-end Application is designed for users to buy products
                online.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ my: 2 }}
                onClick={() => router.push("/")}>
                View Demo
              </Button>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card sx={{ textAlign: "center", p: 3, mb: 5 }}>
              <Box
                position="relative"
                sx={{
                  width: 300,
                  height: 200,
                  mx: "auto",
                }}>
                <BlurImage
                  src="/images/dashboard-commercehope.png"
                  alt="Nextstore app esktop"
                  layout="fill"
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL="/images/dashboard-commercehope.png"
                />
              </Box>
              <Typography variant="h3" color="text.primary">
                Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The Admin Dashboard is Designed for the admin to manage products
                and sales.
              </Typography>
              <a
                href="https://e-cosmetics-admin.vercel.app"
                target="_blank"
                style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ my: 2 }}>
                  View Demo
                </Button>
              </a>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
