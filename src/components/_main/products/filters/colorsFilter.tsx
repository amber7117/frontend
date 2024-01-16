import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  const { query, push } = useRouter();
  const { colors } = query;
  const [state, setstate] = useState<StateProps>({
    colors: [],
    isLoaded: false,
  });

  const handleChange = (props: any, val: any) => () => {
    var data: any = state.colors;

    if (val) {
      data = [...data, props];

      setstate({ ...state, colors: [...data] });
      push(
        {
          query: { ...query, colors: [...data].join("_") },
        },
        undefined,
        { shallow: true }
      );
    } else {
      const index = data.indexOf(props);
      data.splice(index, 1);
      if (data.length > 0) {
        const filtered = state.colors.filter((colors) => colors !== props);
        setstate({ ...state, colors: filtered });
        push(
          {
            query: { ...query, colors: filtered.join("_") },
          },
          undefined,
          { shallow: true }
        );
      } else {
        const updatedQuery = _.omit(query, "colors");
        push(
          {
            query: updatedQuery,
          },
          undefined,
          { shallow: true }
        );
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("colors")) {
      let colors = params.get("colors");
      setstate({
        ...state,
        colors: isString(colors) ? [...colors.split("_")] : [],
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
  }, [query]);
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
          {state.isLoaded &&
            isString(colors) &&
            "(" + colors.split("_").length + ")"}
        </Typography>
        <Zoom in={Boolean(colors)}>
          <Button
            onClick={() => {
              const updatedQuery = _.omit(query, "colors");
              setstate({ ...state, colors: [] });
              push(
                {
                  query: updatedQuery,
                },
                undefined,
                { shallow: true }
              );
            }}
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
