// react
import * as React from "react";
// next
import { useRouter } from "next/navigation";
import useTranslation from "next-translate/useTranslation";

// lodash
import { sum } from "lodash";

// material
import { Box, Badge, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";

// redux
import { useSelector } from "src/redux/store";
// If you have RootState type, prefer:
// import { RootState } from "src/redux/store";

// config
import config from "src/layout/config.json";

// styles
import RootStyled from "./styled";

const getIcon = (href: string, isLoading: boolean, totalItems: number) => {
  switch (href) {
    case "/":
      return <HomeOutlinedIcon />;
    case "/search":
      return <SearchIcon />;
    case "/checkout":
      return (
        <Badge
          showZero
          badgeContent={isLoading ? 0 : totalItems}
          color="error"
          max={99}
          sx={{ zIndex: 0, span: { top: "4px", right: "-2px" } }}
        >
          <ShoppingBasketOutlinedIcon />
        </Badge>
      );
    case "/products":
      return <StorefrontIcon />;
    default:
      return <PersonOutlinedIcon />;
  }
};

const getActiveIcon = (href: string, isLoading: boolean, totalItems: number) => {
  switch (href) {
    case "/":
      return <HomeIcon />;
    case "/search":
      return <SearchIcon />;
    case "/checkout":
      return (
        <Badge
          showZero={false}
          badgeContent={isLoading ? 0 : totalItems}
          color="error"
          max={99}
          sx={{ zIndex: 0, span: { top: "4px", right: "-2px" } }}
        >
          <ShoppingBasketIcon />
        </Badge>
      );
    case "/products":
      return <StorefrontIcon />;
    default:
      return <PersonIcon />;
  }
};

function MobileAppbarContent() {
  const { mobile_menu } = config;
  const router = useRouter();
  const { t } = useTranslation("common");

  // ✅ Select only what you need (avoid returning root state)
  const product = useSelector((s: any /* RootState */) => s.product);
  const user = useSelector((s: any /* RootState */) => s.user);
  const notifications = useSelector(
    (s: any /* RootState */) => s.notification?.notifications
  );

  // ✅ Null-safe, memoized cart items total
  const totalItems = React.useMemo(
    () => sum(product?.checkout?.cart?.map((i: any) => i.quantity) ?? []),
    [product?.checkout?.cart]
  );

  const isLoading = !notifications;

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    // This runs only on the client side
    const pathname = window.location.pathname;
    if (pathname.includes("/auth") || pathname.includes("/profile")) {
      setActiveIndex(4);
    } else if (pathname.includes("/checkout")) {
      setActiveIndex(3);
    } else if (pathname.includes("/products")) {
      setActiveIndex(2);
    } else if (pathname.includes("/search")) {
      setActiveIndex(1);
    } else {
      setActiveIndex(0);
    }
  }, []);

  const onChangeMenu = (href: string) => () => {
    const target =
      user?.isAuthenticated && (href === "/profile" || href === "/auth")
        ? "/profile"
        : href;
    if (window.location.pathname !== target) router.push(target);
  };

  return (
    <RootStyled>
      <Box className="appbar-wrapper">
        {mobile_menu.map((v: any, i: number) => (
          <Button
            key={v.href} // ✅ stable key
            variant={activeIndex === i ? "contained" : "text"}
            color={activeIndex === i ? "primary" : "inherit"}
            startIcon={
              activeIndex === i
                ? getActiveIcon(v.href, isLoading, totalItems)
                : getIcon(v.href, isLoading, totalItems)
            }
            size="large"
            className="nav-button"
            sx={{
              borderRadius:
                i === 0
                  ? "0 6px 0 0"
                  : i === mobile_menu.length - 1
                  ? "6px 0 0 0"
                  : "6px 6px 0 0",
              fontWeight: activeIndex === i ? 600 : 400,
            }}
            onClick={onChangeMenu(v.href)}
          >
            {t(v.name)}
          </Button>
        ))}
      </Box>
    </RootStyled>
  );
}

export default function SimpleBottomNavigation() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient) {
    return (
      <RootStyled>
        <Box className="appbar-wrapper">
          {config.mobile_menu.map((v: any, i: number) => (
            <Button
              key={v.href}
              variant="text"
              color="inherit"
              startIcon={<HomeOutlinedIcon />}
              size="large"
              className="nav-button"
              sx={{
                borderRadius:
                  i === 0
                    ? "0 6px 0 0"
                    : i === config.mobile_menu.length - 1
                    ? "6px 0 0 0"
                    : "6px 6px 0 0",
                fontWeight: 400,
              }}
            >
              {v.name}
            </Button>
          ))}
        </Box>
      </RootStyled>
    );
  }

  return <MobileAppbarContent />;
}
