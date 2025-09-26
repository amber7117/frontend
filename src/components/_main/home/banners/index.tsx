// react
import React from "react";

// next
import Image from "next/image";
import Link from "next/link";

// material
import {
  Container,
  Stack,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";

// style overrides
import RootStyled from "./styled";
import BlurImage from "src/components/blurImage";

export default function secondarySlider({ ...props }) {
  const { data } = props;
  const isEmpty = !data || !Boolean(data.length);

  return (
    <RootStyled>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card className="main-card">
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={4}
                  justifyContent="space-between">
                  <Box>
                    <Typography variant="body1" color="text.secondary" mb={1}>
                      EXPLORE NEW ARRIVED
                    </Typography>
                    <Typography variant="h4" color="text.primary" mb={1.5}>
                      Shop the latest <br /> from top brands
                    </Typography>
                    <Button variant="contained" color="primary">
                      Show Me All
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      position: "relative",
                      height: { xs: 110, sm: 180 },
                      width: { xs: 110, sm: 180 },
                    }}>
                    <BlurImage
                      src="/images/headphones.png"
                      alt="banner-2"
                      fill
                      style={{ objectFit: "contain" }}
                      placeholder="blur"
                      blurDataURL="/images/headphones.png"
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="main-card-1">
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={4}
                  justifyContent="space-between">
                  <Box>
                    <Typography variant="body1" color="text.secondary" mb={1}>
                      EXPLORE NEW ARRIVED
                    </Typography>
                    <Typography variant="h4" color="text.primary" mb={1.5}>
                      Shop the latest
                      <br /> from top brands
                    </Typography>
                    <Button variant="contained" color="warning">
                      Show Me All
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      position: "relative",
                      height: { xs: 110, sm: 180 },
                      width: { xs: 110, sm: 180 },
                    }}>
                    <BlurImage
                      src="/images/shirts.png"
                      alt="banner-2"
                      fill
                      style={{ objectFit: "contain" }}
                      placeholder="blur"
                      blurDataURL="/images/shirts.png"
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* <Stack direction="row" gap={2} className="wrapper">
          <Box className="banner-wrapper first">
            {isEmpty ? (
              <Typography variant="h5" color="text.secondary">
                Banner is not uploaded yet!
              </Typography>
            ) : (
              <Link
                href={data[0]?.bannerAfterSlider1 || ""}
                className="box-link">
                <BlurImage
                  src={data[0]?.bannerAfterSlider1.cover.url}
                  alt="banner-1"
                  fill
                  style={{ objectFit: "cover" }}
                  placeholder="blur"
                  blurDataURL={data[0]?.bannerAfterSlider1.cover.blurDataUrl}
                />
              </Link>
            )}
          </Box>
          <Box className="second-wrapper">
            <Box className="banner-wrapper second">
              {isEmpty ? (
                <Typography variant="h5" color="text.secondary">
                  Banner is not uploaded yet!
                </Typography>
              ) : (
                <Link href={data[0]?.bannerAfterSlider2.url || ""}>
                  <BlurImage
                    src={data[0]?.bannerAfterSlider2.cover.url}
                    alt="banner-2"
                    fill
                    style={{ objectFit: "cover" }}
                    placeholder="blur"
                    blurDataURL={data[0]?.bannerAfterSlider2.cover.blurDataUrl}
                  />
                </Link>
              )}
            </Box>
            <Box className="banner-wrapper third">
              {isEmpty ? (
                <Typography variant="h5" color="text.secondary">
                  Banner is not uploaded yet!
                </Typography>
              ) : (
                <Link href={data[0]?.bannerAfterSlider3.url || ""}>
                  <BlurImage
                    src={data[0]?.bannerAfterSlider3.cover.url}
                    alt="banner-3"
                    fill
                    style={{ objectFit: "cover" }}
                    placeholder="blur"
                    blurDataURL={data[0]?.bannerAfterSlider3.cover.blurDataUrl}
                  />
                </Link>
              )}
            </Box>
          </Box>
        </Stack> */}
      </Container>
    </RootStyled>
  );
}
