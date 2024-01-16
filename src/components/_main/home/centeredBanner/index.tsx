import { Box, Skeleton, Typography } from "@mui/material";
import React from "react";

import Link from "next/link";
import BlurImage from "src/components/blurImage";

export default function secondarySlider({ ...props }) {
  const { data } = props;
  const isEmpty = !data || !Boolean(data.length);

  return (
    <>
      <Box
        key={Math.random()}
        sx={{
          mt: 3,
          // height: { md: 416, xs: 300 },
          borderRadius: "8px",
          boxShadow:
            "0px 10px 32px -4px rgba(19, 25, 39, 0.10), 0px 6px 14px -6px rgba(19, 25, 39, 0.12)",
          position: "relative",
          width: "100%",
          overflow: "hidden",
          bgcolor: "background.neutral",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          img: {
            boxShadow: (theme) => theme.shadows[3],
            transition: "all .3s ease-in-out,-webkit-filter .3s ease-in-out",
            transform: "scale(1)",
            "&:hover": {
              filter: "blur(2px)!important",
              transform: "scale(1.07)",
            },
          },
          "&:after": {
            content: `""`,
            display: "block",
            pb: { md: "40%", xs: "50%" },
          },
        }}>
        {isEmpty ? (
          <Typography variant="h5" color="text.secondary">
            Banner is not uploaded yet!
          </Typography>
        ) : (
          <Link href={data[0]?.centeredBanner.url || ""}>
            <BlurImage
              src={data[0]?.centeredBanner.cover.url}
              alt="centered-banner"
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={data[0]?.centeredBanner.cover.blurDataUrl}
            />
          </Link>
        )}
      </Box>
    </>
  );
}
