// react
import React from "react";

// next
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

// material
import {
  Stack,
  Typography,
  Box,
  Divider,
  Select,
  FormControl,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

// popover
import MenuPopover from "src/components/popover/popover";

// list
import { LanguageList } from "src/components/lists";

// styles
import RootStyled from "./styled";

// config
import config from "src/layout/config.json";

export default function LanguageSelect({ ...props }) {
  const { isDrawer } = props;
  const { languages } = config;
  const router = useRouter();
  const { t } = useTranslation("common");
  const { pathname, asPath, query, locale } = router;
  const [selectedLocale, setSelectedLocale] = React.useState<any>(locale);

  const anchorRefLocale = React.useRef(null);
  const [openLocale, setOpenLocale] = React.useState<any>(false);
  const handleOpenLocale = () => {
    setOpenLocale(true);
  };

  const handleCloseLocale = () => {
    setOpenLocale(false);
  };

  return (
    <RootStyled>
      {isDrawer ? (
        <Box>
          <FormControl fullWidth>
            <Select
              id="language-select"
              value={selectedLocale}
              onChange={(e) => {
                setSelectedLocale(e.target.value);
                router.push({ pathname, query }, asPath, {
                  locale: e.target.value,
                });
              }}
              fullWidth
              size="small"
              native
            >
              {languages.map((lang) => (
                <option key={Math.random()} value={lang.key}>
                  {lang.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Box className="is-desktop">
          <Typography
            variant="body2"
            color="text.secondary"
            className={`select-text ${openLocale && "active"}`}
            ref={anchorRefLocale}
            onClick={handleOpenLocale}
          >
            {selectedLocale === "ar" ? "عربي" : "English"}
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
          </Typography>
          <MenuPopover
            open={openLocale}
            onClose={handleCloseLocale}
            anchorEl={anchorRefLocale.current}
            sx={{
              width: 300,
            }}
          >
            <Stack>
              <Typography variant="h6" color="text.primary" p={2}>
                {t("header.select-language")}
              </Typography>
            </Stack>
            <Divider />
            <LanguageList
              languages={languages}
              handleCloseLocale={() => handleCloseLocale()}
              setSelectedLocale={(v: string) => setSelectedLocale(v)}
              locale={locale}
              router={router}
            />
          </MenuPopover>
        </Box>
      )}
    </RootStyled>
  );
}
