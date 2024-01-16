// react
import React from "react";

// next
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// material
import { Box, Toolbar, Skeleton, Stack } from "@mui/material";

// redux
import { useSelector } from "src/redux/store";

// styles
import RootStyled from "./styled";

// config
import config from "src/layout/config.json";
import { MainLogo } from "src/components";

const CartWidget = dynamic(() => import("src/components/cartWidget"), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />,
});
const UserSelect = dynamic(() => import("src/components/select/userSelect"), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />,
});
const WishlistPopover = dynamic(
  () => import("../../components/popover/wislist"),
  {
    loading: () => <Skeleton variant="circular" width={40} height={40} />,
  }
);
const Search = dynamic(() => import("src/components/searchDialog"), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />,
});
const MenuDesktop = dynamic(() => import("./menuDesktop"), {
  loading: () => (
    <Stack direction="row">
      <Skeleton
        variant="rectangular"
        width={44}
        height={22}
        sx={{ borderRadius: "4px", mx: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        width={96}
        height={22}
        sx={{ borderRadius: "4px", mx: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        width={34.5}
        height={22}
        sx={{ borderRadius: "4px", mx: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        width={54}
        height={22}
        sx={{ borderRadius: "4px", mx: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        width={34}
        height={22}
        sx={{ borderRadius: "4px", mx: "6px" }}
      />
    </Stack>
  ),
});

// ----------------------------------------------------------------------

export default function MainNavbar() {
  const { menu } = config;
  const { pathname } = useRouter();
  const isHome: boolean = pathname === "/";
  const { checkout } = useSelector(({ product }: { product: any }) => product);
  return (
    <RootStyled position="sticky">
      <Toolbar disableGutters className="toolbar">
        <Stack width={167}>
          <MainLogo />
        </Stack>
        <MenuDesktop isHome={isHome} navConfig={menu} />
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Search />
          <CartWidget checkout={checkout} />
          <WishlistPopover />
          <UserSelect />
        </Box>
      </Toolbar>
    </RootStyled>
  );
}
