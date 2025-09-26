import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import _, { isString } from "lodash";
// material
import { Box, Tooltip, Typography, Button, Stack, Zoom } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import useTranslation from "next-translate/useTranslation";
import FormatColorFillOutlinedIcon from "@mui/icons-material/FormatColorFillOutlined";
// data
import { capitalCase } from "change-case";

interface StateProps {
  colors: string[];
  isLoaded: boolean;
}

export default function ColorsFilter({ ...props }) {
  const { colors: filterColors } = props;

  const { t } = useTranslation("listing");
  const router = useRouter();
  const searchParams = useSearchParams();
  const colorsParam = searchParams.get("colors");
  const [state, setstate] = useState<StateProps>({
    colors: [],
    isLoaded: false,
  });

  const updateURL = (colorsArray: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (colorsArray.length > 0) {
      params.set('colors', colorsArray.join('_'));
    } else {
      params.delete('colors');
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const handleChange = (color: any, val: any) => () => {
    let newColors = [...state.colors];

    if (val) {
      newColors = [...newColors, color];
    } else {
      newColors = newColors.filter(c => c !== color);
    }

    setstate({ ...state, colors: newColors });
    updateURL(newColors);
  };

  const handleReset = () => {
    setstate({ ...state, colors: [] });
    updateURL([]);
  };

  useEffect(() => {
    if (colorsParam) {
      setstate({
        ...state,
        colors: isString(colorsParam) ? [...colorsParam.split("_")] : [],
        isLoaded: true,
      });
    } else {
      setstate({
        ...state,
        colors: [],
        isLoaded: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorsParam]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            mb: 1,
            display: "flex",
            gap: 1,
          }}
          color="text.primary"
        >
          <FormatColorFillOutlinedIcon fontSize="small" /> {t("color")}{" "}
          {state.isLoaded && colorsParam && isString(colorsParam) &&
            "(" + colorsParam.split("_").length + ")"}
        </Typography>
        <Zoom in={Boolean(colorsParam)}>
          <Button
            onClick={handleReset}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ float: "right", mt: "-3px" }}
          >
            {t("reset")}
          </Button>
        </Zoom>
      </Stack>

      <Stack gap={1} direction="row" sx={{ flexWrap: "wrap", mt: 3 }}>
        {filterColors?.map((v: any) => (
          <Tooltip title={capitalCase(v)} key={v}>
            <Box
              key={v}
              sx={{
                cursor: "pointer",
                width: 24,
                height: 24,
                bgcolor: v,
                borderRadius: "4px",
                border: (theme) =>
                  state.colors.includes(v)
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleChange(v, !state.colors.includes(v))}
            >
              <Zoom in={state.colors.includes(v)}>
                <CheckRoundedIcon color="primary" sx={{ fontSize: 16 }} />
              </Zoom>
            </Box>
          </Tooltip>
        ))}
      </Stack>
    </>
  );
}
