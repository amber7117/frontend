// react
import React, { useRef, useEffect, useState } from "react";

// next
import useTranslation from "next-translate/useTranslation";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "src/redux/slices/user";
import { createBilling } from "src/redux/slices/product";

// motion
import { motion } from "framer-motion";

// material

import {
  Divider,
  Typography,
  Stack,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// components
import ThemeModeSetting from "./themeModeSetting";
import ColorSetting from "./colorSetting";
import FullscreenSetting from "./fullscreenSetting";
import LogoutIcon from "@mui/icons-material/Logout";
import LocaleSelect from "../select/currencySelect";
import LanguageSelect from "../select/languageSelect";

// styles
import RootStyled from "./styled";
import { signOut } from "next-auth/react";

const useDimensions = ({ ...props }) => {
  const { ref } = props;
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = ref?.current.offsetWidth;
    dimensions.current.height = ref?.current.offsetHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dimensions?.current;
};

export default function Settings({ ...props }) {
  const { isOpen, toggleOpen } = props;
  const { direction } = useTheme();
  const [settingPoint, setSettingPoint] = useState(false);

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(({ user }: { user: any }) => user);
  const [auth, setAuth] = useState(false);
  const { t } = useTranslation("common");
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const isRTL = direction === "rtl";

  useEffect(() => {
    // This runs only on the client side
    const mediaQuery = window.matchMedia("(max-width:900px)");
    setSettingPoint(mediaQuery.matches);
    
    const handleResize = () => {
      setSettingPoint(mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);
  const sidebar = {
    open: (height = 1000) =>
      settingPoint
        ? {
            clipPath: `circle(${height * 2 + 200}px at ${
              isRTL ? "28px" : "272px"
            } 153px)`,
            transition: {
              type: "spring",
              stiffness: 20,
              restDelta: 2,
            },
          }
        : {
            clipPath: `circle(${height * 2 + 200}px at ${
              isRTL ? "32px" : "242px"
            } calc(100vh - 58px))`,
            transition: {
              type: "spring",
              stiffness: 20,
              restDelta: 2,
            },
          },
    closed: settingPoint
      ? {
          clipPath: `circle(0px at ${isRTL ? "28px" : "272px"} 153px)`,
          transition: {
            delay: 0,
            type: "spring",
            stiffness: 400,
            damping: 40,
          },
        }
      : {
          clipPath: `circle(0px at ${
            isRTL ? "32px" : "242px"
          } calc(100vh - 58px))`,
          transition: {
            delay: 0,
            type: "spring",
            stiffness: 400,
            damping: 60,
          },
        },
  };
  // const sidebar = {
  //   open: (height = 1000) => ({
  //     clipPath: `circle(${height * 2 + 200}px at ${
  //       isRTL ? "32px" : "242px"
  //     } calc(100vh - 58px))`,
  //     transition: {
  //       type: "spring",
  //       stiffness: 20,
  //       restDelta: 2,
  //     },
  //   }),
  //   closed: {
  //     clipPath: `circle(0px at ${isRTL ? "32px" : "242px"} calc(100vh - 58px))`,
  //     transition: {
  //       delay: 0,
  //       type: "spring",
  //       stiffness: 400,
  //       damping: 60,
  //     },
  //   },
  // };

  useEffect(() => {
    setAuth(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <RootStyled>
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}>
        {
          <motion.div variants={sidebar}>
            {isOpen && (
              <>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ py: 1.7, pr: 1, pl: 2.5 }}>
                  <Typography variant="subtitle1">
                    {t("header.settings")}
                  </Typography>
                  <IconButton onClick={() => toggleOpen()}>
                    <CloseRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Stack>
                <Divider />

                <Stack spacing={4} sx={{ p: 3 }}>
                  <Stack direction="row" className="language-wrapper">
                    <Stack spacing={1.5} sx={{ width: "100%" }}>
                      <Typography variant="subtitle2">
                        {t("header.language")}
                      </Typography>
                      <LanguageSelect isDrawer />
                    </Stack>
                    <Stack spacing={1.5} sx={{ width: "100%" }}>
                      <Typography variant="subtitle2">
                        {t("header.currency")}
                      </Typography>
                      <LocaleSelect isDrawer />
                    </Stack>
                  </Stack>
                  <Stack spacing={1.5} className="mode-wrapper">
                    <Typography variant="subtitle2">
                      {t("header.mode")}
                    </Typography>
                    <ThemeModeSetting />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">
                      {t("header.color")}
                    </Typography>
                    <ColorSetting />
                  </Stack>
                  <div>
                    {/* <FullscreenSetting /> */}
                    {auth && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        startIcon={<LogoutIcon />}
                        onClick={() => {
                          signOut();
                          dispatch(setLogout());
                          dispatch(createBilling(null));
                          toggleOpen();
                        }}
                        className="logout-wrapper">
                        {t("header.logout")}
                      </Button>
                    )}
                  </div>
                </Stack>
              </>
            )}
          </motion.div>
        }
      </motion.nav>
    </RootStyled>
  );
}
