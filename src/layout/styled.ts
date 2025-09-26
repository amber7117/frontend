import { styled } from "@mui/material/styles";

const RootStyled = styled("div")(({ theme }) => ({
  "& .layout-main": {
    position: "fixed",
    bottom: 30,
    right: 30,
    zIndex: 10000,
  },
  "& .layout-children": {
    marginBottom: theme.spacing(0),
  },
  "& .children-height": {
    height: 0,
  },
  "& .fab-btn": {
    background: theme.palette.success.main,
    color: "#fff",
    position: "fixed",
    bottom: 20,
    left: 20,
    zIndex: 100,
    "&.active": {
      right: 20,
    },
    "&:hover": {
      background: theme.palette.success.dark,
    },
    svg: {
      fontSize: 40,
    },
    display: "flex",
  },
  [theme.breakpoints.down("md")]: {
    "& .layout-main": {
      top: 130,
      right: 0,
      padding: theme.spacing(0.5, 1, 0.5, 0.5),
      background: theme.palette.common.white,
      borderRadius: "30px 0 0 30px",
      boxShadow:
        "0px 10px 32px -4px rgba(19, 25, 39, 0.10), 0px 6px 14px -6px rgba(19, 25, 39, 0.12)",
      height: 45,
      display: "flex",
      alignItems: "center",
      button: {
        height: 36,
        width: 36,
      },
    },
    "& .layout-children": {
      marginBottom: theme.spacing(6),
    },
    "& .children-height": {
      height: 40,
    },
    "& .fab-btn": {
      display: "none",
    },
  },
}));
export default RootStyled;
