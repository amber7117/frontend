import React, { useState } from "react";
// material
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import useTranslation from "next-translate/useTranslation";
import { toast } from "react-hot-toast";

const VirtualProductCardStyled = styled(Card)(({ theme }) => ({
  borderRadius: "8px",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

interface VirtualProductCardProps {
  order: any;
  onCodeRetrieved?: (code: string) => void;
}

export default function VirtualProductCard({ order, onCodeRetrieved }: VirtualProductCardProps) {
  const { t } = useTranslation("order");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>("");

  // Check if order has virtual products
  const hasVirtualProducts = order?.virtualCodes && order.virtualCodes.length > 0;
  
  if (!hasVirtualProducts) {
    return null;
  }

  const handleRetrieveCode = (code: string) => {
    setSelectedCode(code);
    setOpenDialog(true);
    if (onCodeRetrieved) {
      onCodeRetrieved(code);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedCode);
    toast.success(t("common:copied-to-clipboard"));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCode("");
  };

  return (
    <>
      <VirtualProductCardStyled>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CardGiftcardRoundedIcon color="primary" />
              <Typography variant="h6" color="primary">
                {t("virtual-products")}
              </Typography>
            </Stack>
            
            <Alert severity="info" variant="outlined">
              <Typography variant="body2">
                {t("virtual-product-info")}
              </Typography>
            </Alert>

            {order.virtualCodes.map((virtualCode: any, index: number) => (
              <Box key={index} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">
                      {t("gift-card")} #{index + 1}
                    </Typography>
                    <Chip 
                      label={virtualCode.status} 
                      size="small"
                      color={
                        virtualCode.status === 'active' ? 'success' :
                        virtualCode.status === 'pending' ? 'warning' :
                        virtualCode.status === 'used' ? 'default' : 'error'
                      }
                    />
                  </Stack>
                  
                  {virtualCode.status === 'active' && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleRetrieveCode(virtualCode.code)}
                      sx={{
                        backgroundColor: '#4CAF50',
                        '&:hover': {
                          backgroundColor: '#45a049',
                        },
                      }}
                    >
                      {t("retrieve-code")}
                    </Button>
                  )}
                  
                  {virtualCode.status === 'pending' && (
                    <Typography variant="body2" color="text.secondary">
                      {t("pending-activation")}
                    </Typography>
                  )}
                  
                  {virtualCode.status === 'used' && (
                    <Typography variant="body2" color="text.secondary">
                      {t("already-used")}
                    </Typography>
                  )}
                  
                  {virtualCode.status === 'expired' && (
                    <Typography variant="body2" color="error">
                      {t("expired")}
                    </Typography>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </VirtualProductCardStyled>

      {/* Code Display Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CardGiftcardRoundedIcon color="primary" />
            <Typography variant="h6">{t("your-gift-card-code")}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Alert severity="success">
              <Typography variant="body2">
                {t("code-ready-message")}
              </Typography>
            </Alert>
            
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
              <Typography variant="h5" align="center" fontFamily="monospace" color="primary">
                {selectedCode}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" align="center">
              {t("copy-code-instruction")}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {t("common:close")}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCopyCode}
            startIcon={<ContentCopyRoundedIcon />}
            color="primary"
          >
            {t("copy-code")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
