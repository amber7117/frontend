import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import _ from "lodash";

// material
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Button,
  Zoom,
  Stack,
} from "@mui/material";
// data
import FormatSizeRoundedIcon from "@mui/icons-material/FormatSizeRounded";
import useTranslation from "next-translate/useTranslation";
import { isString } from "lodash";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

interface StateProps {
  sizes: string[];
  isLoaded: boolean;
}

export default function SizesFilter({ ...props }) {
  const { sizes: filterSizes } = props;
  const { t } = useTranslation("listing");
  const { query, push } = useRouter();
  const { sizes } = query;
  const [state, setstate] = useState<StateProps>({
    sizes: [],
    isLoaded: false,
  });

  const handleChange = (props: any, e: any) => {
    var data: any = state.sizes;
    if (e.target.checked) {
      data = [...data, props];
      setstate({ ...state, sizes: [...state.sizes, props] });
      push(
        {
          query: { ...query, sizes: [...state.sizes, props].join("_") },
        },
        undefined,
        { shallow: true }
      );
    } else {
      const index = data.indexOf(props);
      data.splice(index, 1);
      if (data.length > 0) {
        const filtered = state.sizes.filter((sizes) => sizes !== props);
        setstate({ ...state, sizes: filtered });
        push(
          {
            query: { ...query, sizes: filtered.join("_") },
          },
          undefined,
          { shallow: true }
        );
      } else {
        const updatedQuery = _.omit(query, "sizes");
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
    if (params.has("sizes")) {
      let sizes = params.get("sizes");
      setstate({
        ...state,
        sizes: isString(sizes) ? [...sizes.split("_")] : [],
        isLoaded: true,
      });
    } else {
      setstate({
        ...state,
        sizes: [],
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
          <FormatSizeRoundedIcon fontSize="small" /> {t("size")}{" "}
          {isString(sizes) && "(" + sizes.split("_").length + ")"}
        </Typography>
        <Zoom in={Boolean(sizes)}>
          <Button
            onClick={() => {
              const updatedQuery = _.omit(query, "sizes");
              setstate({ ...state, sizes: [] });
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

      <Grid container>
        {filterSizes?.map((v: any) => (
          <Grid key={Math.random()} item xs={6}>
            <FormGroup>
              <FormControlLabel
                sx={{ textTransform: "capitalize" }}
                name="sizes"
                checked={state.sizes.includes(v)}
                onChange={(e) => handleChange(v, e)}
                control={<Checkbox {...label} />}
                label={v}
              />
            </FormGroup>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
