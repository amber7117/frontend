import PropTypes from "prop-types";
// material
import { alpha, styled } from "@mui/material/styles";
import { Box, Typography, useMediaQuery } from "@mui/material";

// ----------------------------------------------------------------------

const RootStyle = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

const IconStyle = styled("div")(({ theme }) => ({
  marginLeft: -4,
  borderRadius: "50%",
  width: theme.spacing(2.7),
  height: theme.spacing(2.7),
  border: `solid 2px ${theme.palette.background.paper}`,
  boxShadow: `inset -1px 1px 2px ${alpha(theme.palette.common.black, 0.24)}`,
  [theme.breakpoints.down("sm")]: {
    width: theme.spacing(1.7),
    height: theme.spacing(1.7),
  },
}));

// ----------------------------------------------------------------------

ColorPreview.propTypes = {
  colors: PropTypes.array.isRequired,
  limit: PropTypes.number,
};

export default function ColorPreview({ ...props }) {
  const { colors, limit = 3, ...other } = props;

  const matches = useMediaQuery("(min-width:600px)");
  const showColor = colors?.slice(0, limit);
  const moreColor = colors?.length - limit;

  return (
    <RootStyle component="span" {...other}>
      {showColor.map((color: string, index: number) => (
        <IconStyle key={color + index} sx={{ bgcolor: color }} />
      ))}

      {colors.length > limit && (
        <Typography
          variant={!matches ? "body2" : "subtitle2"}
          fontWeight={600}
        >{`+${moreColor}`}</Typography>
      )}
    </RootStyle>
  );
}
