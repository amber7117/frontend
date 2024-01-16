import React from "react";
import { useRouter } from "next/router";
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

  const { query, push } = useRouter();
  const { gender } = query;
  const [state, setstate] = React.useState<StateProps>({
    genders: [],
    isLoaded: false,
  });

  const handleChange = (props: string, e: any) => {
    var data: any = state.genders;
    if (e.target.checked) {
      data = [...data, props];
      setstate({ ...state, genders: [...state.genders, props] });
      push(
        {
          query: { ...query, gender: [...state.genders, props].join("_") },
        },
        undefined,
        { shallow: true }
      );
    } else {
      const index = data.indexOf(props);
      data.splice(index, 1);
      if (data.length > 0) {
        const filtered = state.genders.filter((gen) => gen !== props);
        setstate({ ...state, genders: filtered });
        push(
          {
            query: { ...query, gender: filtered.join("_") },
          },
          undefined,
          { shallow: true }
        );
      } else {
        const updatedQuery = _.omit(query, "gender");
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

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("gender")) {
      let gender: string | null = params.get("gender");
      setstate({
        ...state,
        genders: isString(gender) ? [...gender.split("_")] : [],
      });
    } else {
      setstate({
        ...state,
        genders: [],
        isLoaded: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender]);

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
          {isString(gender) && "(" + gender.split("_").length + ")"}
        </Typography>
        {
          <Zoom in={Boolean(gender)}>
            <Button
              onClick={() => {
                const updatedQuery = _.omit(query, "gender");
                setstate({ ...state, genders: [] });
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
