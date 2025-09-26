import * as React from "react";
import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import { useSelector } from "react-redux";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import useTranslation from "next-translate/useTranslation";
function ValueLabelComponent({ ...props }) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
};

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginTop: 20,
  height: 27,
  padding: "13px 0",
  "& .MuiSlider-thumb": {
    height: 27,
    width: 27,
    borderRadius: "8px",
    backgroundColor: "#fff",
    border: "1px solid currentColor",

    "& .airbnb-bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  "& .MuiSlider-track": {
    height: 27,
    borderRadius: "8px",
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiSlider-rail": {
    color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
    opacity: theme.palette.mode === "dark" ? undefined : 1,
    height: 27,
    borderRadius: "8px",
  },
}));

function AirbnbThumbComponent({ ...props }) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}
AirbnbThumbComponent.propTypes = {
  children: PropTypes.node,
};

const valueLabelFormat = (symbol: string) => (value: number) => {
  return `${symbol}${value}`;
};

export default function CustomizedSlider({ ...props }) {
  const { prices: filterPrices } = props;
  const { t } = useTranslation("listing");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { unitRate, symbol } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [status, setstatus] = React.useState<number[]>([0, 10000]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("prices")) {
      let prices: any = params.get("prices");
      setstatus(prices.split("_"));
    } else {
      setstatus([0, filterPrices[1] * Number(unitRate)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 400,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
        color="text.primary"
      >
        <BarChartRoundedIcon /> {t("price-range")}
      </Typography>
      <Box px={1}>
        <AirbnbSlider
          valueLabelDisplay="auto"
          onChangeCommitted={(e: any, value: number | number[]) => {
            const prices = typeof value === "object" ? value.join("_") : value.toString();
            
            // 创建新的URLSearchParams对象
            const params = new URLSearchParams(searchParams.toString());
            params.set('prices', prices);
            
            // 构建新的URL
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            router.push(newUrl, { scroll: false });
          }}
          valueLabelFormat={valueLabelFormat(symbol)}
          max={filterPrices[1] || 1 * Number(unitRate)}
          components={{ Thumb: AirbnbThumbComponent }}
          value={status}
          onChange={(e: any, v: number | number[]) => setstatus(v as number[])}
        />
      </Box>
    </>
  );
}
