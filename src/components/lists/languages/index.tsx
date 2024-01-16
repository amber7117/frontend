// react
import React from "react";

// next
import Image from "next/image";

// material
import {
  ListItemIcon,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import FileDownloadDoneRoundedIcon from "@mui/icons-material/FileDownloadDoneRounded";

// styles
import RootStyled from "./styled";

// icons
import UKFlag from "../../../../public/icons/uk.png";
import SAFlag from "../../../../public/icons/sa.png";

const getFlagIcon = (key: string) => {
  switch (key) {
    case "en":
      return UKFlag;
    default:
      return SAFlag;
  }
};
export default function LanguageList({ ...props }) {
  const { languages, handleCloseLocale, setSelectedLocale, locale, router } =
    props;
  const { pathname, query, asPath } = router;
  return (
    <RootStyled>
      {languages.map((item: any) => (
        <ListItem
          key={item.key}
          disablePadding
          onClick={() => {
            handleCloseLocale();
            setSelectedLocale(item.key);
            router.push({ pathname, query }, asPath, {
              locale: item.key,
            });
          }}
          className={locale === item.key ? "active" : ""}
        >
          <ListItemButton>
            <ListItemIcon>
              <Image
                src={getFlagIcon(item.key)}
                alt={item.key}
                layout="responsive"
                width={24}
                placeholder="blur"
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <>
                  {item.name}

                  {locale === item.key && (
                    <FileDownloadDoneRoundedIcon className="icon" />
                  )}
                </>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </RootStyled>
  );
}
