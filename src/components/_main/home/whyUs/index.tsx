// react
import React from "react";

// next translation
import useTranslation from "next-translate/useTranslation";

// material
import { Fab, Typography, Card, Grid } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import SettingsBackupRestoreRoundedIcon from "@mui/icons-material/SettingsBackupRestoreRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";

// styles
import RootStyled from "./styled";

export default function WhyUs() {
  const { t } = useTranslation("home");
  const data = [
    { title: t(`free-shipping`), icon: <LocalShippingOutlinedIcon /> },
    { title: t(`support`), icon: <SupportAgentRoundedIcon /> },
    { title: t(`return`), icon: <SettingsBackupRestoreRoundedIcon /> },
    { title: t(`payment`), icon: <AttachMoneyRoundedIcon /> },
  ];
  return (
    <RootStyled container spacing={3} justifyContent="center">
      {data.map((v) => (
        <Grid item md={3} xs={6} key={Math.random()}>
          <Card className="card">
            <Fab color="primary">{v.icon}</Fab>
            <Typography
              variant="h4"
              fontWeight={500}
              color="text.primary"
              mt={2}
              mb={1}>
              {v.title}
            </Typography>
          </Card>
        </Grid>
      ))}
    </RootStyled>
  );
}
