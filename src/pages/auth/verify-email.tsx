import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useMutation } from "react-query";
import { isValidToken } from "src/utils/jwt";
// api
import * as api from "src/services";
// notification
import { toast } from "react-hot-toast";
import jwtDecode from "jwt-decode";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Card,
  Stack,
  Link,
  Container,
  Typography,
  Skeleton,
  Button,
  Collapse,
} from "@mui/material";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { getSession } from "next-auth/react";
export default function VerifyEmail({ ...props }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const { mutate } = useMutation(api.verify, {
    retry: false,
    onSuccess: async () => {
      setLoading(false);
      setError(false);
    },
    onError: (err: any) => {
      toast.error("Something went wrong!");
      setLoading(false);
      setError(true);
    },
  });

  React.useEffect(() => {
    if (token) {
      mutate({
        token: token,
      });
    } else {
      setLoading(false);
      setError(true);
    }
  }, [token]);

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
              {t("verify-email")}
            </Typography>
            <Typography textAlign="center" color="text.secondary" mb={2}>
              {loading
                ? t("verify-description")
                : !error
                ? t("verify-success")
                : t("verify-error")}
            </Typography>
            {loading ? (
              <Skeleton
                variant="circular"
                width={100}
                height={100}
                sx={{ mx: "auto" }}
              />
            ) : !error ? (
              <CheckCircleOutlineRoundedIcon
                color="success"
                sx={{
                  fontSize: 100,
                  mx: "auto",
                }}
              />
            ) : (
              <HighlightOffRoundedIcon
                color="error"
                sx={{
                  fontSize: 100,
                  mx: "auto",
                }}
              />
            )}
            {
              <Collapse in={!loading && !error}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => router.push("/auth/login")}>
                  Login
                </Button>
              </Collapse>
            }
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);
  const token = context.query.token;
  if (!token) {
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
