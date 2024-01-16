import { styled, alpha } from "@mui/material/styles";
const RootStyled = styled("div")(({ theme }) => ({
  "& .select-text": {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "color 0.2s ease-in-out",
    "&:hover": {
      color: theme.palette.primary.main,
    },
    "&.active": {
      color: theme.palette.primary.main,
    },
  },
  "& .heading": {
    padding: theme.spacing(2, 2.5),
  },

  [theme.breakpoints.down("md")]: {
    "& .is-desktop": {
      display: "none",
    },
  },
}));
export default RootStyled;
