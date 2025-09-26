import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import _, { isString } from "lodash";
import Diversity1Icon from "@mui/icons-material/Diversity1";
// material
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Button,
  Stack,
  Zoom,
} from "@mui/material";
// data
import Person4OutlinedIcon from "@mui/icons-material/Person4Outlined";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";
import TransgenderOutlinedIcon from "@mui/icons-material/TransgenderOutlined";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
interface StateProps {
  genders: string[];
  isLoaded: boolean;
}
const icons: any = {
  men: <Person4OutlinedIcon />,
  women: <Person3OutlinedIcon />,
  kids: <ChildCareOutlinedIcon />,
  others: <TransgenderOutlinedIcon />,
};
export default function GenderFilter({ ...props }) {
  const { genders, t } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const genderParam = searchParams.get("gender");
  const [state, setstate] = React.useState<StateProps>({
    genders: [],
    isLoaded: false,
  });

  const updateURL = (gendersArray: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (gendersArray.length > 0) {
      params.set('gender', gendersArray.join('_'));
    } else {
      params.delete('gender');
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const handleChange = (gender: string, e: any) => {
    let newGenders = [...state.genders];
    
    if (e.target.checked) {
      newGenders = [...newGenders, gender];
    } else {
      newGenders = newGenders.filter(g => g !== gender);
    }

    setstate({ ...state, genders: newGenders });
    updateURL(newGenders);
  };

  const handleReset = () => {
    setstate({ ...state, genders: [] });
    updateURL([]);
  };

  React.useEffect(() => {
    if (genderParam) {
      setstate({
        ...state,
        genders: isString(genderParam) ? [...genderParam.split("_")] : [],
        isLoaded: true,
      });
    } else {
      setstate({
        ...state,
        genders: [],
        isLoaded: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderParam]);

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
          <Diversity1Icon fontSize="small" /> {t("gender")}{" "}
          {genderParam && isString(genderParam) && "(" + genderParam.split("_").length + ")"}
        </Typography>
        {
          <Zoom in={Boolean(genderParam)}>
            <Button
              onClick={handleReset}
              variant="outlined"
              color="primary"
              size="small"
              sx={{ float: "right" }}
            >
              {t("reset")}
            </Button>
          </Zoom>
        }
      </Stack>

      <Grid container>
        {genders?.map((v: any) => (
          <Grid key={Math.random()} item xs={6}>
            <FormGroup>
              <FormControlLabel
                sx={{ textTransform: "capitalize" }}
                name="gender"
                defaultChecked={state.genders.includes(v)}
                checked={state.genders.includes(v)}
                onChange={(e) => handleChange(v, e)}
                control={
                  <Checkbox
                    {...label}
                    icon={icons[v.toLowerCase()]}
                    checkedIcon={icons[v.toLowerCase()]}
                  />
                }
                label={t(v.toLowerCase())}
              />
            </FormGroup>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
