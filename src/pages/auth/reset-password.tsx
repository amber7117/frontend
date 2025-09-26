import React from "react";

// next
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useTranslation from "next-translate/useTranslation";

// material
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  Stack,
  Skeleton,
} from "@mui/material";

// guest guard
import { getSession } from "next-auth/react";
import { isValidToken } from "src/utils/jwt";
import jwtDecode from "jwt-decode";
import { toast } from "react-hot-toast";
// components
const ResetPasswordForm = dynamic(
  () => import("src/components/_main/auth/resetPasswordForm"),
  {
    loading: () => (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={56} />
      </Stack>
    ),
  }
);

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);
  const token = context.query.token;
  if (session || !token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const check = Boolean(token) ? isValidToken(token as string) : null;
  const data = check ? jwtDecode(token as string) : null;

  return {
    props: {
      session,
    },
  };
}

export default function ResetPassword({ ...props }) {
  const { data } = props;
  const router = useRouter();
  const { t } = useTranslation("reset-password");
  return (
    <Box className="auth-pages" mb={5}>
      <Box className="gradient">
        <Typography
          textAlign="center"
          variant="h3"
          fontWeight={300}
          lineHeight={0.7}
          color="primary.contrastText">
          {t("welcome")}
        </Typography>
        <Typography
          textAlign="center"
          variant="h2"
          color="primary.contrastText"
          className="company-name">
          {t("company")}
        </Typography>
        <Typography
          textAlign="center"
          variant="body1"
          lineHeight={0.9}
          color="primary.contrastText">
          {t("slogan")}
        </Typography>
      </Box>
      <Container>
        <Card className="password-card">
          <>
            <Typography textAlign="center" mb={1} variant="h4" gutterBottom>
              {t("reset-password")}
            </Typography>
            <Typography
              color="text.secondary"
              mb={5}
              textAlign="center"
              lineHeight={0.9}>
              {t("update")}
            </Typography>
            <ResetPasswordForm t={t} />
            <Button
              fullWidth
              size="large"
              onClick={() => router.push("/auth/login")}
              className="full-width-btn">
              {t("back")}
            </Button>
          </>
        </Card>
      </Container>
    </Box>
  );
}
