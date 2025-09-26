// next
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import RouterLink from "next/link";
// material
import {
  Box,
  Card,
  Link,
  Container,
  Typography,
  Stack,
  Skeleton,
} from "@mui/material";

import { getSession } from "next-auth/react";
// components
const RegisterForm = dynamic(
  () => import("src/components/_main/auth/registerForm"),
  {
    loading: () => (
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Skeleton variant="rounded" height={56} width="100%" />
          <Skeleton variant="rounded" height={56} width="100%" />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Skeleton variant="rounded" height={56} width="100%" />
          <Skeleton variant="rounded" height={56} width="100%" />
        </Stack>
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

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { t } = useTranslation("register");
  return (
    <Box className="auth-pages" mb={5}>
      <Box className="gradient">
        <Typography
          textAlign="center"
          variant="h3"
          fontWeight={300}
          lineHeight={1}
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
          lineHeight={1.2}
          color="primary.contrastText">
          {t("slogan")}
        </Typography>
      </Box>
      <Container>
        <Card className="card">
          <Typography variant="h4" gutterBottom textAlign="center">
            {t("get-started")}
          </Typography>
          <Typography color="text.secondary" mb={5} textAlign="center">
            {t("create-account")}
          </Typography>
          <RegisterForm />

          <Typography variant="subtitle2" mt={3} textAlign="center">
            {t("already-login")}&nbsp;
            <Link
              href={`/auth/login${
                redirect
                  ? "?redirect=" + redirect
                  : ""
              }`}
              component={RouterLink}>
              {t("login")}
            </Link>
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mt={2}>
            {t("by-registering")}&nbsp;
            <Link underline="always" color="text.primary" href="#">
              {t("Terms")}
            </Link>
            &nbsp;{t("and")}&nbsp;
            <Link underline="always" color="text.primary" href="#">
              {t("privacy-policy")}
            </Link>
            .
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}
