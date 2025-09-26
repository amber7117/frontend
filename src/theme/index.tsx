import React from "react";
import { useMemo, useState, useEffect } from "react";
// material
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";
import shadows from "./shadows";
//  { customShadows }
import componentsOverride from "./overrides";
import { CacheProvider } from "@emotion/react";
import { useRouter } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import * as locales from "@mui/material/locale";
import shape from "./shape";
import breakpoints from "./breakpoints";

import { useSelector } from "src/redux/store";
const Localization = (lang: string) => {
  switch (lang) {
    case "zh":
      return "zhCN";
    case "fr":
      return "frFR";
    case "en":
      return "enUS";
    default:
      return "frFR";
  }
};
function ThemeConfig({ children }: { children: React.ReactNode }) {
  const { lang } = useTranslation();
  const locale = Localization(lang as string);
  const [mode, setMode] = useState(null);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const { themeMode } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const isDark = mode === "dark";

  // Create style cache
  const styleCache = createCache({
    key: dir === "rtl" ? "muirtl" : "css",
    stylisPlugins: dir === "rtl" ? [prefixer, rtlPlugin] : [],
  });
  // styleCache.compat = true;
  const FONT_PRIMARY: string = "'Poppins', sans-serif"; // Google Font
  const FONT_SECONDARY: string = "'Noto Kufi Arabic', sans-serif"; // Google Font

  const themeWithLocale = useMemo(
    () =>
      createTheme(
        {
          palette: isDark
            ? { ...palette.dark, mode: "dark" }
            : { ...palette.light, mode: "light" },
          shape,
          typography: {
            ...typography,
            fontFamily: dir === "rtl" ? FONT_SECONDARY : FONT_PRIMARY,
          },
          breakpoints,
          direction: dir,
          shadows: isDark ? shadows.dark : shadows.light,
          // customShadows: isDark ? customShadows.light : customShadows.dark,
        },
        locales[locale]
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, isDark, mode]
  );
  useEffect(() => {
    setMode(themeMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeMode]);

  themeWithLocale.components = componentsOverride(themeWithLocale);

  return (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={themeWithLocale}>
        <CssBaseline />
        <main dir={dir}>{children}</main>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default ThemeConfig;
