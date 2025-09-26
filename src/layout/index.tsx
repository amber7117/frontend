import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
// material
import { Fab, Box } from "@mui/material";

import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
// redux
// ----------------------------------------------------------------------
import SettingsComponent from "src/components/settings";
   import ThemeModeSetting from "src/components/settings/themeModeSetting";
  import ColorSetting from "src/components/settings/colorSetting";
   import FullscreenSetting from "src/components/settings/fullscreenSetting";
    import CurrencySelect from "src/components/select/currencySelect";
    import LanguageSelect from "src/components/select/languageSelect";  


const Settings = dynamic(() => import("src/components/settings"), {
  ssr: false,
});

import NoInternet from "src/components/noInternet";
import MainNavbar from "./mainAppbar";
import RootStyled from "./styled";
import { setCurrency, setUnitRate } from "src/redux/slices/settings";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "src/redux/slices/categories";
import { setNotifications } from "src/redux/slices/notification";
import { useQuery } from "react-query";
import * as api from "src/services";
import { toast } from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";
import { useMutation } from "react-query";

const MobileAppbar = dynamic(() => import("./mobileAppbar"));
const Footer = dynamic(() => import("./footer"));

export default function MainLayout({ ...props }) {
  const { children } = props;
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const { mutate } = useMutation(api.getRates, {
    onSuccess: (res: any) => {
      dispatch(setUnitRate(res));
    },
  });
  const { currency } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  useQuery("home-data", () => api.getHeaderData(), {
    onSuccess: (data) => {
      dispatch(setCategories(data.categories));
      dispatch(setNotifications(data.notifications));
    },
    onError: (err: any) => {
      toast.error(t("common:errors." + err.response.data.message));
    },
  });
  const [isOnline, setIsOnline] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const checkIsOnline =
    typeof window !== "undefined" ? !window.navigator.onLine : null;
  useEffect(() => {
    if (checkIsOnline) {
      setIsOnline(false);
    } else {
      setIsOnline(true);
    }
  }, [checkIsOnline]);

  if (!isOnline) {
    return <NoInternet />;
  }
  useEffect(() => {
    mutate(currency);
  }, []);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <RootStyled>
      <MainNavbar />
      <MobileAppbar />
      <Box className="layout-main">
        <Fab
          onClick={toggleOpen}
          color="primary"
          size="large"
          aria-label="language"
        >
          <TuneRoundedIcon />
        </Fab>
      </Box>
      <Settings isOpen={isOpen} toggleOpen={toggleOpen} />
      <Box className="layout-children">{children}</Box>
      <Box className="children-height" />
      <Box
        sx={{
          display: {
            md: "block",
            xs: "none",
          },
        }}
      >
        <Footer />
      </Box>
    </RootStyled>
  );
}
