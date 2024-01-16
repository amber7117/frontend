import { useMemo, useEffect, useState } from "react";
// material
import {
  alpha,
  useTheme,
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
//
import componentsOverride from "../theme/overrides";
import { useSelector } from "react-redux";
import { setColor } from "./settings/colorSetting";
// ----------------------------------------------------------------------

export default function ThemePrimaryColor({ ...props }) {
  const { children } = props;
  const defaultTheme = useTheme();
  const { themeColor } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [themeState, setThemeState] = useState<string | null>(null);
  const primaryColor = setColor(themeState);
  const themeOptions = useMemo(
    () => ({
      ...defaultTheme,
      palette: {
        ...defaultTheme.palette,
        primary: primaryColor,
      },
      customShadows: {
        // ...defaultTheme.customShadows,
        primary: `0 8px 16px 0 ${alpha(primaryColor.main, 0.24)}`,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultTheme, themeState]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);
  useEffect(() => {
    setThemeState(themeColor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeColor]);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
