import { styled, alpha } from "@mui/material/styles";
import RadioGroup from "@mui/material/RadioGroup";

const RootStyled = styled(RadioGroup)(({ theme }) => ({
  "& .radio-wrapper": {
    padding: "5px",
    color: "transparent",
    "&:hover": { opacity: 0.72 },
    "& .icon-color": {
      height: 30,
      padding: 8,
      display: "flex",
      borderRadius: "4px",
      position: "relative",
      alignItems: "center",
      textTransform: "Uppercase",
      justifyContent: "center",
      backgroundColor: theme.palette.divider,
      transition: theme.transitions.create("all", {
        duration: theme.transitions.duration.shortest,
      }),
      "&.active": {
        backgroundColor: theme.palette.primary.main,
        p: {
          fontWeight: 600,
        },
      },
    },
  },
}));
export default RootStyled;
