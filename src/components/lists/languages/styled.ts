import List from "@mui/material/List";
import { styled, alpha } from "@mui/material/styles";
const RootStyled = styled(List)(({ theme }) => ({
  overflow: "auto",
  "& .MuiListItem-root": {
    "&.active": {
      background: alpha(
        theme.palette.primary.main,
        theme.palette.mode === "light" ? 0.03 : 0.1
      ),
      position: "relative",
    },
    span: { fontWeight: 500 },
    "& .icon": {
      color: theme.palette.primary.main,
      position: "absolute",
      top: 18,
      right: 12,
    },
  },
}));
export default RootStyled;
