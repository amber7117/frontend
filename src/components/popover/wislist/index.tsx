// react
import React from "react";

// next
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/navigation";

// material
import {
  Box,
  List,
  Badge,
  Stack,
  ListItem,
  Skeleton,
  IconButton,
  Divider,
  Typography,
  ListItemText,
  ListItemAvatar,
  TextField,
  Button,
} from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

// components
import MenuPopover from "src/components/popover/popover";

// redux
import { setWishlist } from "src/redux/slices/wishlist";
import { useDispatch, useSelector } from "react-redux";

// api
import * as api from "src/services";
import { useMutation } from "react-query";

// list
import ListWishlist from "src/components/lists/wishlist";
import { useSession } from "next-auth/react";
// ----------------------------------------------------------------------
export default function NotificationsPopover() {
  const router = useRouter();
  const sesstion = useSession();

  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  const [state, setState] = React.useState({
    wishlist: [],
    loading: true,
  });

  const { wishlist } = useSelector(
    ({ wishlist }: { wishlist: any }) => wishlist
  );
  const { isAuthenticated } = useSelector(({ user }: { user: any }) => user);

  const { mutate } = useMutation(api.getWishlist, {
    onSuccess: (data) => {
      dispatch(setWishlist(data.data));
      setState({ wishlist: data.data, loading: false });
    },
  });

  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    if (isAuthenticated) {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  React.useEffect(() => {
    setState({ wishlist: wishlist, loading: false });
  }, [wishlist]);

  return (
    <>
      <IconButton
        ref={anchorRef}
        color={open ? "primary" : "default"}
        onClick={handleOpen}
      >
        <Badge
          showZero={false}
          badgeContent={
            state.loading || !isAuthenticated ? 0 : state.wishlist?.length
          }
          color="warning"
        >
          <FavoriteBorderRoundedIcon />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{
          width: 420,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{t("header.wishlist")}</Typography>
          </Box>
          {isAuthenticated && (
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => {
                router.push("/profile");
                handleClose();
              }}
            >
              View all
            </Button>
          )}
        </Box>

        <Divider />
        {!state.loading && state.wishlist?.length === 0 ? (
          <Typography variant="subtitle1" color="text.secondary" sx={{ p: 3 }}>
            {t("header.no-wishlist-found")}
          </Typography>
        ) : (
          <Box sx={{ height: { xs: 340, sm: 400, md: 460 }, overflow: "auto" }}>
            <List
              disablePadding
              sx={{ "& .MuiListItemAvatar-root": { mt: 0 } }}
            >
              {!state.loading &&
                state.wishlist?.map((item) => (
                  <ListWishlist
                    key={Math.random()}
                    isLoading={state.loading}
                    item={item}
                    t={t}
                    onClose={() => handleClose()}
                  />
                ))}
            </List>
          </Box>
        )}
      </MenuPopover>
    </>
  );
}
