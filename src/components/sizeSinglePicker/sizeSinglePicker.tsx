// material
import { Box, Radio, Typography } from "@mui/material";

// styles
import RootStyled from "./styled";
// ----------------------------------------------------------------------

function IconColor({ ...props }) {
  const { value, className, ...other } = props;
  return (
    <Box className={`icon-color ${className}`} {...other}>
      <Typography variant="body2" color="text.primary">
        {value}
      </Typography>
    </Box>
  );
}

export default function SizeSinglePicker({ ...props }) {
  const { sizes, ...other } = props;
  return (
    <RootStyled row {...other}>
      {sizes?.map((color: string) => {
        return (
          <Radio
            key={color}
            className="radio-wrapper"
            value={color}
            color="default"
            disableRipple
            icon={<IconColor value={color} />}
            checkedIcon={<IconColor className="active" value={color} />}
          />
        );
      })}
    </RootStyled>
  );
}
