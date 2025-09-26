import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const sizesParam = searchParams.get("sizes");
  const [state, setstate] = useState<StateProps>({
    sizes: [],
    isLoaded: false,
  });

  const updateURL = (sizesArray: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sizesArray.length > 0) {
      params.set('sizes', sizesArray.join('_'));
    } else {
      params.delete('sizes');
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const handleChange = (size: any, e: any) => {
    let newSizes = [...state.sizes];
    
    if (e.target.checked) {
      newSizes = [...newSizes, size];
    } else {
      newSizes = newSizes.filter(s => s !== size);
    }

    setstate({ ...state, sizes: newSizes });
    updateURL(newSizes);
  };

  const handleReset = () => {
    setstate({ ...state, sizes: [] });
    updateURL([]);
  };

  useEffect(() => {
    if (sizesParam) {
      setstate({
        ...state,
        sizes: isString(sizesParam) ? [...sizesParam.split("_")] : [],
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
  }, [sizesParam]);
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
          {sizesParam && isString(sizesParam) && "(" + sizesParam.split("_").length + ")"}
        </Typography>
        <Zoom in={Boolean(sizesParam)}>
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
