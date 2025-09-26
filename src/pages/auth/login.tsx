// next
import React, { useState } from "react";
import dynamic from "next/dynamic";
import RouterLink from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
// ----------------------------------------------------------------------
// material
import {
  Box,
  Card,
  Stack,
  Link,
  Container,
  Typography,
  Skeleton,
} from "@mui/material";
import { getSession } from "next-auth/react";
// ----------------------------------------------------------------------
// components
const LoginForm = dynamic(() => import("src/components/_main/auth/loginForm"), {
  loading: () => (
    <>
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={56} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}>
          <Skeleton variant="text" width={170} />
          <Skeleton variant="text" width={140} />
        </Stack>
        <Skeleton variant="rounded" height={56} />
      </Stack>
    </>
  ),
});

// ----------------------------------------------------------------------

export default function Login() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  
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
          variant="body2"
          lineHeight={0.9}
          fontSize={18}
          fontWeight={400}
          color="primary.contrastText">
          {t("slogan")}
        </Typography>
      </Box>
      <Container maxWidth="sm">
        <Card className="card">
          <Stack>
            <Typography textAlign="center" mb={2} variant="h4" gutterBottom>
              {t("login")}
            </Typography>
            <Typography textAlign="center" color="text.secondary" mb={5}>
              {t("login-account")}
            </Typography>
          </Stack>
          <LoginForm />
          <Typography variant="body2" align="center" mt={3}>
            {t("Dont-account")}&nbsp;
            <Link
              variant="subtitle2"
              component={RouterLink}
              href={`/auth/register${
                redirect
                  ? "?redirect=" + redirect
                  : ""
              }`}>
              {t("get-started")}
            </Link>
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
