import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Typography, Divider, Stack, IconButton, Avatar } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useDispatch, useSelector } from "react-redux";
import useTranslation from "next-translate/useTranslation";
import MenuPopover from "src/components/popover/popover";
import { useRouter, usePathname } from "next/navigation";
import { PATH_PAGE } from "src/routes/paths";
import { UserList } from "src/components/lists";
import RootStyled from "./styled";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
// react-query
import { useMutation } from "react-query";
// api
import * as api from "src/services";
import { setLogin } from "src/redux/slices/user";

function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function UserSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { mutate } = useMutation(api.getProfile, {
    onSuccess: (data) => {
      const { createdAt, joined, ...others } = data.data;
      dispatch(setLogin(others));
    },
    onError: (err: any) => {
      toast.error(t("common:errors." + err.response.data.message));
      // signOut();
    },
  });
function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find((key) => object[key] === value);
}
  

  const isAuthPath = getKeyByValue(PATH_PAGE.auth, pathname);
  const isHomePath = pathname === "/";
  const { t } = useTranslation("common");
  const { data }: any = useSession();
  const { isAuth, user } = useSelector(({ user }: { user: any }) => user);
  
  const anchorRef = React.useRef(null);
  const [openUser, setOpen] = React.useState(false);
  const [initialize, setInitialize] = useState(false);
  const handleOpenUser = () => {
    if (!isAuth) {
      router.push("/auth/login");
    } else {
      setOpen(true);
    }
  };

  const handleCloseUser = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isAuth) {
      setInitialize(true);
      setTimeout(() => {
        mutate();
      }, 1000);
    } else {
      setInitialize(false);
    }
  }, [isAuth]);

  return (
    <RootStyled>
      {!initialize ? (
        <IconButton
          color={"default"}
          onClick={() =>
            router.push(
              `/auth/login${
                isAuthPath || isHomePath ? "" : `?redirect=${pathname}`
              }`
            )
          }
        >
          <PersonOutlinedIcon />
        </IconButton>
      ) : (
        <>
          <IconButton
            color={"default"}
            ref={anchorRef}
            onClick={handleOpenUser}
            sx={{ p: 0 }}
          >
            <Avatar
              src={user?.cover?.url}
              alt={user?.fullName}
              sx={{ height: 40, width: 40 }}
            />
          </IconButton>
          <MenuPopover
            open={openUser}
            onClose={handleCloseUser}
            anchorEl={anchorRef.current}
            sx={{
              width: 300,
            }}
          >
            <UserList
              openUser={openUser}
              user={user}
              setOpen={() => setOpen(false)}
              t={t}
            />
          </MenuPopover>
        </>
      )}
    </RootStyled>
  );
}
