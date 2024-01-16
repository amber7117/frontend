// react
import * as React from "react";
// next
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

// loadash
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

// config
import config from "src/layout/config.json";

// styles
import RootStyled from "./styled";

const getIcon = (
  href: string,
  isLoading: boolean,
  totalItems: number,
  data: any
) => {
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
          sx={{ zIndex: 0, span: { top: "4px", right: "-2px" } }}>
          <ShoppingBasketOutlinedIcon />
        </Badge>
      );
    case "/products":
      return <StorefrontIcon />;
    default:
      return <PersonOutlinedIcon />;
  }
};

const getActiveIcon = (
  href: string,
  isLoading: boolean,
  totalItems: number,
  data: any
) => {
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
          sx={{ zIndex: 0, span: { top: "4px", right: "-2px" } }}>
          <ShoppingBasketIcon />
        </Badge>
      );
    case "/products":
      return <StorefrontIcon />;
    default:
      return <PersonIcon />;
  }
};

export default function SimpleBottomNavigation() {
  const { mobile_menu } = config;
  const { pathname, push } = useRouter();
  const { t } = useTranslation("common");
  const {
    product,
    user,
    notification: data,
  } = useSelector((state: any) => state);

  const [index, setIndex] = React.useState(0);
  const [state, setState] = React.useState<any>({
    product: null,
    user: null,
    notification: null,
  });

  const totalItems = sum(
    state.product?.checkout.cart.map((item: any) => item.quantity)
  );
  const onChangeMenu = (href: string, i: number) => () => {
    push(href);
    setIndex(i);
  };
  const isLoading = !data.notifications;

  React.useEffect(() => {
    const isActiveIndex = () => {
      setState({
        product,
        user,
        notification: data,
      });
      const index =
        pathname.includes("/auth") || pathname.includes("/profile")
          ? 4
          : pathname.includes("/checkout")
          ? 3
          : pathname.includes("/products")
          ? 2
          : pathname.includes("/search")
          ? 1
          : 0;
      return index;
    };
    setIndex(isActiveIndex());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RootStyled>
      <Box className="appbar-wrapper">
        {mobile_menu.map((v, i) => (
          <Button
            variant={index === i ? "contained" : "text"}
            color={index === i ? "primary" : "inherit"}
            startIcon={
              index === i
                ? getActiveIcon(
                    v.href,
                    isLoading,
                    totalItems,
                    state.notification
                  )
                : getIcon(v.href, isLoading, totalItems, state.notification)
            }
            key={Math.random()}
            size="large"
            className="nav-button"
            sx={{
              borderRadius:
                i === 0 ? "0 6px 0 0" : i === 4 ? "6px 0 0 0" : "6px 6px 0 0",
              fontWeight: index === i ? 600 : 400,
            }}
            onClick={onChangeMenu(
              user?.isAuthenticated && v.isUser ? "/profile" : v.href,
              i
            )}>
            {t(v.name)}
          </Button>
        ))}
      </Box>
    </RootStyled>
  );
}
