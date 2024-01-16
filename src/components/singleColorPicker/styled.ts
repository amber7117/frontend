import { styled, alpha } from "@mui/material/styles";
import RadioGroup from "@mui/material/RadioGroup";

const RootStyled = styled(RadioGroup)(({ theme }) => ({
  "& .icon-color": {
    width: 20,
    height: 20,
    display: "flex",
    borderRadius: "4px",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "currentColor",
    transition: theme.transitions.create("all", {
      duration: theme.transitions.duration.shortest,
    }),
    "&.is-white": {
      border: `solid 1px ${theme.palette.divider}`,
    },
    "&.checked-icon": {
      transform: "scale(1.4)",
      "&:before": {
        opacity: 0.48,
        width: "100%",
        content: "''",
        height: "100%",
        borderRadius: "50%",
        position: "absolute",
        boxShadow: "1px 2px 8px 0 currentColor",
      },
      "& svg": { width: 18, height: 18, color: theme.palette.common.white },
      "&.is-white": {
        border: `solid 1px ${theme.palette.divider}`,
        boxShadow: `4px 4px 8px 0 ${alpha(theme.palette.grey[500], 0.24)}`,
        "& svg": { width: 18, height: 18, color: theme.palette.common.black },
      },
    },
  },
}));
export default RootStyled;
