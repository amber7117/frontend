import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import useTranslation from "next-translate/useTranslation";

// material
import { styled } from "@mui/material/styles";
import { Box, Typography, IconButton } from "@mui/material";
// utils
//

const IncrementerStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  // border: `solid 1px ${theme.palette.grey[500_32]}`,
  border: `solid 1px ${theme.palette.divider}`,
}));

function Incrementer({ ...props }) {
  const { available, quantity, onIncrease, onDecrease } = props;
  const { t } = useTranslation("checkout");

  return (
    <Box sx={{ width: 96, textAlign: "right" }}>
      <IncrementerStyle>
        <IconButton
          size="small"
          color="inherit"
          onClick={onDecrease}
          disabled={quantity <= 1}
        >
          <RemoveRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
        {quantity}
        <IconButton
          size="small"
          color="inherit"
          onClick={onIncrease}
          disabled={quantity >= available}
        >
          <AddRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </IncrementerStyle>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {t("available")}: {available}
      </Typography>
    </Box>
  );
}

export default Incrementer;
