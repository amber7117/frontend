import dynamic from "next/dynamic";
// material
import {
  Box,
  Card,
  Stack,
  IconButton,
  Divider,
  CardHeader,
  Tooltip,
  Typography,
  CardContent,
} from "@mui/material";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
// utils
import useCurrency from "src/hooks/useCurrency";
import useTranslation from "next-translate/useTranslation";
// components
const RootStyled = dynamic(() => import("./styled"));
// ----------------------------------------------------------------------

export default function CheckoutSummary({ ...props }) {
  const {
    total,
    onEdit,
    subtotal,
    shipping,
    totalItems,
    discount,
    enableEdit = false,
  } = props;
  // const displayShipping = Boolean(shipping) ? "Free" : shipping;
  const { t } = useTranslation("checkout");
  return (
    <RootStyled>
      <CardHeader
        className="card-header"
        title={t("checkout-summary")}
        action={
          enableEdit && (
            <Tooltip title="Edit summary">
              <IconButton
                size="small"
                type="button"
                color="primary"
                onClick={onEdit}
              >
                <ModeEditRoundedIcon />
              </IconButton>
            </Tooltip>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.primary">
              {t("sub-total")}
            </Typography>
            <Typography variant="subtitle2">{useCurrency(subtotal)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.primary">
              {t("shipping")}
            </Typography>
            <Typography variant="subtitle2">
              {useCurrency(
                totalItems !== 0 ? Number(process.env.SHIPPING_FEE) || 0 : 0
              )}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">{t("total")}</Typography>
            <Box textAlign="right">
              <Typography variant="subtitle1" color="error.main">
                {useCurrency(total)}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </RootStyled>
  );
}
