import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import _ from "lodash";

// material
import {
  FormGroup,
  FormControlLabel,
  Collapse,
  Grid,
  RadioGroup,
  Radio,
  Typography,
  Button,
  Zoom,
  Stack,
  IconButton,
} from "@mui/material";
// data
import FormatSizeRoundedIcon from "@mui/icons-material/FormatSizeRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useTranslation from "next-translate/useTranslation";

interface StateProps {
  brands: string[];
  isLoaded: boolean;
}

const RadioList = ({ brands }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSlug, setSelectedSlug] = useState("");

  const handleChange = (event: any) => {
    const slug = event.target.value;
    setSelectedSlug(slug);
    
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('brand', slug);
    } else {
      params.delete('brand');
    }
    
    // Update URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  useEffect(() => {
    const brand = searchParams.get('brand');
    setSelectedSlug(brand || "");
  }, [searchParams]);

  return (
    <div>
      <RadioGroup value={selectedSlug} onChange={handleChange}>
        {brands?.map((brand: any) => (
          <FormControlLabel
            key={brand.slug}
            value={brand.slug}
            control={<Radio />}
            label={brand.name}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default function brandsFilter({ ...props }) {
  const { brands: brandsData } = props;
  const { t } = useTranslation("listing");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('brand');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            display: "flex",
            gap: 1,
          }}
          color="text.primary"
        >
          <FormatSizeRoundedIcon fontSize="small" /> {t("brand")}{" "}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Zoom in={Boolean(searchParams.get('brand'))}>
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
          <IconButton size="small" onClick={handleChange}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Collapse in={checked}>
        <RadioList brands={brandsData} />
      </Collapse>
    </>
  );
}
