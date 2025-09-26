import React from "react";
import dynamic from "next/dynamic";
// material
import {
  Card,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Skeleton,
  Tooltip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import useTranslation from "next-translate/useTranslation";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
// filters

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useRouter } from "next/navigation";

const BrandsFilter = dynamic(() => import("./filters/brandsFilter"), {
  loading: () => (
    <Stack>
      <Typography variant="body1" sx={{ width: 130 }}>
        <Skeleton variant="text" />
      </Typography>

      <Stack spacing={0.8}>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
      </Stack>
    </Stack>
  ),
});
const GenderFilter = dynamic(() => import("./filters/genderFilter"), {
  loading: () => (
    <Stack>
      <Typography variant="body1" sx={{ width: 130 }}>
        <Skeleton variant="text" />
      </Typography>

      <Stack direction="row" gap={1} sx={{ mt: 0.8 }}>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
      </Stack>
      <Stack direction="row" gap={1} mt={0.8}>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
      </Stack>
    </Stack>
  ),
});

const ColorsFilter = dynamic(() => import("./filters/colorsFilter"), {
  loading: () => (
    <Stack>
      <Typography variant="body1" sx={{ mb: 1.2, width: 100 }}>
        <Skeleton variant="text" />
      </Typography>

      <Stack direction="row" gap={1} sx={{ mt: "18.1px" }}>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
            <Skeleton
              key={Math.random()}
              variant="rectangular"
              sx={{ borderRadius: "4px", minWidth: 24 }}
              width={24}
              height={24}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  ),
});

const SizesFilter = dynamic(() => import("./filters/sizesFilter"), {
  loading: () => (
    <Stack>
      <Typography variant="body1" sx={{ width: 130 }}>
        <Skeleton variant="text" />
      </Typography>

      <Stack direction="row" gap={1} sx={{ mt: 3 }}>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
      </Stack>
      <Stack direction="row" gap={1} mt={1}>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
      </Stack>
      <Stack direction="row" gap={1} mt={1}>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
        <Stack direction="row" gap={1} alignItems="center" width="100%">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton height={12} width={"50%"} />
        </Stack>
      </Stack>
    </Stack>
  ),
});

const Slider = dynamic(() => import("src/components/slider"), {
  loading: () => (
    <Stack>
      <Typography variant="body1" sx={{ mb: 1.2, width: 124 }}>
        <Skeleton variant="text" />
      </Typography>

      <Stack direction="row" gap={1} sx={{ my: "18.1px" }}>
        <Skeleton
          variant="rectangular"
          sx={{ borderRadius: "4px", minWidth: 24 }}
          width={294}
          height={27}
        />
      </Stack>
    </Stack>
  ),
});

export default function Filter({ ...props }) {
  const { isMobile, onClose, filteres } = props;
  const { t } = useTranslation("listing");
  const router = useRouter();
  return (
    <Card
      sx={{
        width: !isMobile ? "100%" : "300px",
        // width: "100%",
        ...(!isMobile
          ? { position: "sticky", top: "81px", my: 2 }
          : { borderWidth: 0 }),
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}>
        <Typography variant="h5" color="text.primary">
          {t("filter")}
        </Typography>
        <Tooltip title="Remove filters">
          <IconButton
            aria-label="remove-all"
            onClick={() => router.push("/products")}
            sx={{ display: { md: "flex", xs: "none" } }}>
            <CloseRoundedIcon />
          </IconButton>
        </Tooltip>
        {isMobile && (
          <IconButton onClick={() => onClose()}>
            <ClearIcon />
          </IconButton>
        )}
      </Box>
      <Box
        sx={{
          ...(isMobile && { height: "calc(100vh - 100px)", overflowY: "auto" }),
        }}>
        {Boolean(filteres?.brands.length) && (
          <Box p={2}>
            <BrandsFilter brands={filteres?.brands} t={t} />
          </Box>
        )}
        {Boolean(filteres?.genders.length) && (
          <>
            <Divider />
            <Box p={2}>
              <GenderFilter genders={filteres?.genders} t={t} />
            </Box>
          </>
        )}
        {Boolean(filteres?.colors.length) && (
          <>
            <Divider />
            <Box p={2}>
              <ColorsFilter colors={filteres?.colors} />
            </Box>
          </>
        )}
        {Boolean(filteres?.sizes.length) && (
          <>
            <Divider />
            <Box p={2}>
              <SizesFilter sizes={filteres?.sizes} />
            </Box>
          </>
        )}
        <Divider />
        <Box p={2}>
          <Slider prices={filteres?.prices} />
        </Box>
      </Box>
    </Card>
  );
}
