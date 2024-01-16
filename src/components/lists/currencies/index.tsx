import React from "react";

// redux
import { useDispatch } from "react-redux";
import { setCurrency, setUnitRate } from "src/redux/slices/settings";

// material
import {
  Stack,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import FileDownloadDoneRoundedIcon from "@mui/icons-material/FileDownloadDoneRounded";

// styles
import RootStyled from "./styled";

export default function CurrenciesList({ ...props }) {
  const {
    currencies,
    handleCloseCurrency,
    setSelectedCurrency,
    selectedCurrency,
    t,
  } = props;
  const dispatch = useDispatch();
  return (
    <RootStyled>
      {currencies.map((item: any) => (
        <ListItem
          key={item.prefix}
          disablePadding
          onClick={() => {
            handleCloseCurrency();
            setSelectedCurrency(item.prefix);
            dispatch(setCurrency({ prefix: item.prefix, symbol: item.symbol }));
            dispatch(setUnitRate(item.unitRate));
            // mutate(item.prefix);
          }}
          className={selectedCurrency === item.prefix ? "active" : ""}
        >
          <ListItemButton>
            <ListItemText
              primary={
                <>
                  {t(`header.${item.name}`)}{" "}
                  <Stack direction="row">
                    <Typography variant="body1" color="text.secondary">
                      {item.prefix} -{" "}
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                      {" "}
                      {item.symbol}
                    </Typography>
                  </Stack>
                  {selectedCurrency === item.prefix && (
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
