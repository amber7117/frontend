import React from "react";
import * as Yup from "yup";
// next router
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
// formik
import { Form, FormikProvider, useFormik } from "formik";
// react query
import { useMutation } from "react-query";
// material
import {
  TextField,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
// hooks
import useIsMountedRef from "src/hooks/useIsMountedRef";
// api
import * as api from "src/services";

// icons
import LockIcon from "@mui/icons-material/Lock";
import { toast } from "react-hot-toast";
import bcrypt from "bcryptjs";

// ----------------------------------------------------------------------

export default function ResetPasswordForm({ ...props }) {
  const { t } = props;
  const isMountedRef = useIsMountedRef();

  const { push } = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setloading] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { mutate } = useMutation(api.resetPassword, {
    onSuccess: (data) => {
      setloading(false);
      push("/auth/login");
      toast.success(t("common:password-changed"));
    },
    onError: (err: any) => {
      const message = JSON.stringify(err.response.data.message);
      setloading(false);
      toast.error(
        t(
          message
            ? t("common:" + JSON.parse(message))
            : t("common:something-wrong")
        )
      );
    },
  });

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, t("password-contains"))
      .required(t("password-required")),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password")],
      t("passwords-match")
    ),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setloading(true);
        await mutate({
          newPassword: bcrypt.hashSync(
            values.password,
            "$2a$10$CwTycUXWue0Thq9StjUM0u"
          ),
          token,
        });
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          toast.error(error.message);
          setSubmitting(false);
        }
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* {errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit}</Alert>
          )} */}

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
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end">
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
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showConfirmPassword ? "text" : "password"}
            label={t("confirm-password")}
            {...getFieldProps("confirmPassword")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end">
                    {showConfirmPassword ? (
                      <RemoveRedEyeRoundedIcon />
                    ) : (
                      <VisibilityOffRoundedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}>
            {t("save")}
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
