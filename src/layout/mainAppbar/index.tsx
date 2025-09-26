'use client';

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Box, Toolbar, Skeleton, Stack } from "@mui/material";
import { useSelector } from "src/redux/store";
import { shallowEqual } from "react-redux";
import RootStyled from "./styled";
import config from "src/layout/config.json";
import { MainLogo } from "src/components";

// No inline loading in dynamic; we’ll wrap with <Suspense>
const CartWidget = dynamic(() => import("src/components/cartWidget"));
const UserSelect = dynamic(() => import("src/components/select/userSelect"));
const WishlistPopover = dynamic(() => import("../../components/popover/wislist"));
const Search = dynamic(() => import("src/components/searchDialog"));
const MenuDesktop = dynamic(() => import("./menuDesktop"));

const MenuSkeleton = (
  <Stack direction="row">
    <Skeleton variant="rectangular" width={44} height={22} sx={{ borderRadius: "4px", mx: "6px" }} />
    <Skeleton variant="rectangular" width={96} height={22} sx={{ borderRadius: "4px", mx: "6px" }} />
    <Skeleton variant="rectangular" width={34.5} height={22} sx={{ borderRadius: "4px", mx: "6px" }} />
    <Skeleton variant="rectangular" width={54} height={22} sx={{ borderRadius: "4px", mx: "6px" }} />
    <Skeleton variant="rectangular" width={34} height={22} sx={{ borderRadius: "4px", mx: "6px" }} />
  </Stack>
);

const IconSkeleton = <Skeleton variant="circular" width={40} height={40} />;

type Checkout = { cart?: Array<{ quantity: number }> };

const MainNavbarContent: React.FC = () => {
  const { menu } = config;
  const pathname = usePathname();
  const checkout: Checkout | undefined = useSelector(
    (s: any) => s.product?.checkout,
    shallowEqual
  );
  const isHome = pathname === "/";

  return (
    <RootStyled position="sticky">
      <Toolbar disableGutters className="toolbar">
        <Stack width={167}><MainLogo /></Stack>

        <Suspense fallback={MenuSkeleton}>
          <MenuDesktop isHome={isHome} navConfig={menu} />
        </Suspense>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Suspense fallback={IconSkeleton}><Search /></Suspense>
          <Suspense fallback={IconSkeleton}><CartWidget checkout={checkout as any} /></Suspense>
          <Suspense fallback={IconSkeleton}><WishlistPopover /></Suspense>
          <Suspense fallback={IconSkeleton}><UserSelect /></Suspense>
        </Box>
      </Toolbar>
    </RootStyled>
  );
};

export default React.memo(MainNavbarContent);
