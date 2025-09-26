import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// material
import { styled, useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

const RootStyle = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100000,
  top: 2,
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down("md")]: {
    height: "calc(100% - 63px)",
  },
}));

export default function LogoLoading() {
  const theme = useTheme();
  const icon = {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: "rgba(255, 255, 255, 0)",
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: theme.palette.primary.main,
    },
  };

  return (
    <RootStyle>
      <Box
        width={200}
        height={200}
        sx={{ svg: { transform: "translate(0px, -37px)" } }}
      >
        <Box
          component={motion.svg}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 5000.000000 1366.000000"
          width="42px"
          sx={{
            overflow: "visible",
            stroke: theme.palette.primary.main,
            strokeWidth: 200,
            strokeLinejoin: "round",
            strokeLinecap: "round",
          }}
        >
          <motion.path
            d="M5520 16555 l-5515 -5515 5515 -5515 5515 -5515 2168 2168 c1193
                  1192 2272 2274 2398 2404 l230 237 -775 778 -775 779 2330 2330 2329 2329
                  -2337 2338 -2338 2338 785 779 785 779 -2400 2400 -2400 2401 -5515 -5515z
                  m5953 -99 c405 -396 737 -722 737 -725 0 -3 -1052 -1058 -2337 -2343 l-2337
                  -2337 2338 -2341 2337 -2341 -110 -117 c-60 -64 -409 -416 -775 -782 l-666
                  -665 -3123 3123 -3122 3122 3109 3109 3110 3110 50 -47 c28 -25 383 -370 789
                  -766z"
            variants={icon}
            initial="hidden"
            animate="visible"
            transition={{
              default: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2,
              },
              fill: {
                duration: 2,
                ease: [1, 0, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 2,
              },
            }}
          />
          <motion.path
            d="M16415 16673 c-336 -328 -690 -676 -788 -772 l-177 -176 2340 -2340
                  2340 -2340 -2340 -2340 -2340 -2340 780 -780 780 -780 3120 3120 3120 3120
                  -3113 3113 -3112 3112 -610 -597z"
            variants={icon}
            initial="hidden"
            animate="visible"
            transition={{
              default: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2,
              },
              fill: {
                duration: 2,
                ease: [1, 0, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 2,
              },
            }}
          />
        </Box>
      </Box>
    </RootStyle>
  );
}
