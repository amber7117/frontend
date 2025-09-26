// react
import React from "react";

// next
import useTranslation from "next-translate/useTranslation";

// redux
import { setCurrency, setUnitRate } from "src/redux/slices/settings";
import { useDispatch, useSelector } from "react-redux";

// api
import { useMutation } from "react-query";
import * as api from "src/services";

// material
import {
  Stack,
  Typography,
  Box,
  Divider,
  FormControl,
  Select,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

//  list
import { CurrenciesList } from "src/components/lists";

// components
import { Popover } from "src/components/popover";
import config from "src/layout/config.json";

// styles
import RootStyled from "./styled";

export default function LocaleSelect({ ...props }) {
  const { isDrawer } = props;
  const { currencies } = config;
  const dispatch = useDispatch();
  const { mutate } = useMutation(api.getRates, {
    onSuccess: (res: any) => {
      dispatch(setUnitRate(res));
    },
  });
  const anchorRefCurrency = React.useRef(null);
  const { t: _t, lang } = useTranslation("common");
  const { currency } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [openCurrency, setOpenCurrency] = React.useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>(
    currency || "USD"
  );

  const handleOpenCurrency = () => {
    setOpenCurrency(true);
  };

  const handleCloseCurrency = () => {
    setOpenCurrency(false);
  };
  React.useEffect(() => {
    mutate(currency);
    setSelectedCurrency(currency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const t = React.useMemo(
    () => _t,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  );
  return (
    <RootStyled>
      {isDrawer ? (
        <Box className="is-mobile">
          <FormControl fullWidth>
            <Select
              id="currencies-select"
              value={selectedCurrency}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCurrency(val);
                mutate(val);
                const filtered = currencies.find((v) => v.prefix === val);
                dispatch(
                  setCurrency({ prefix: val, symbol: filtered?.symbol })
                );
                // dispatch(setUnitRate(filtered?.unitRate));
              }}
              fullWidth
              size="small"
              native
            >
              {currencies.map((cur) => (
                <option key={Math.random()} value={cur.prefix}>
                  {cur.prefix}
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
            className={`select-text ${openCurrency && "active"}`}
            ref={anchorRefCurrency}
            onClick={handleOpenCurrency}
          >
            {selectedCurrency}
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
          </Typography>
          <Popover
            open={openCurrency}
            onClose={handleCloseCurrency}
            anchorEl={anchorRefCurrency.current}
            sx={{
              width: 340,
            }}
          >
            <Stack className="popover-heading">
              <Typography variant="h6" color="text.primary" p={2}>
                {t("select-currency")}
              </Typography>
            </Stack>
            <Divider />
            <CurrenciesList
              currencies={currencies}
              handleCloseCurrency={() => handleCloseCurrency()}
              setSelectedCurrency={(v: string) => {
                setSelectedCurrency(v);
                const filtered = currencies.find((v: any) => v.prefix === v);
                mutate(v);

                dispatch(setCurrency({ prefix: v, symbol: filtered?.symbol }));
              }}
              selectedCurrency={selectedCurrency}
              t={t}
            />
          </Popover>
        </Box>
      )}
    </RootStyled>
  );
}
