import * as Yup from "yup";
import { useState } from "react";
import RouterLink from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useFormik, Form, FormikProvider } from "formik";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
// material
import {
  Link,
  Skeleton,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
//
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import bcrypt from "bcryptjs";
// ----------------------------------------------------------------------

export default function LoginForm() {
  const { t } = useTranslation("common");
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [loading, setloading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email(t("valid-email")).required(t("email-required")),
    password: Yup.string().required(t("password-required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const { email, password } = values;
      setloading(true);
      const res = await signIn("credentials", {
        email: email,
        password: bcrypt.hashSync(password, "$2a$10$CwTycUXWue0Thq9StjUM0u"),
        redirect: false,
      });
      setloading(false);
    if ((res as any).ok) {
        toast.success(t("errors.login-success"));
        push(redirect || "/");
      } else {
        toast.error(t("errors.incorrect-email-password"));
      }
    },
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label={t("email-address")}
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label={t("password")}
            {...getFieldProps("password")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? (
                      <RemoveRedEyeRoundedIcon />
                    ) : (
                      <VisibilityOffRoundedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                {...getFieldProps("remember")}
                checked={values.remember}
              />
            }
            label={t("remember-me")}
          />

          <Link
            component={RouterLink}
            variant="subtitle2"
            href="/auth/forget-password">
            {t("forgot-password")}
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loading}>
          {t("login")}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
