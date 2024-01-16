import React from "react";
import * as Yup from "yup";

import { useFormik, Form, FormikProvider } from "formik";
// material
import { Stack, Card, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// redux
import { useSelector } from "react-redux";
import * as api from "src/services";
import { useMutation } from "react-query";
import { toast } from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";
import bcrypt from "bcryptjs";

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const [loading, setloading] = React.useState(false);
  const { t } = useTranslation("profile");
  const { user } = useSelector(({ user }: { user: any }) => user);
  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t),
    newPassword: Yup.string()
      .min(6, t("password-must-be-at-least-6-characters"))
      .required(t("new-password-is-required")),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword")],
      t("passwords-must-match")
    ),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values) => {
      setloading(true);
      const data = {
        password: bcrypt.hashSync(
          values.oldPassword,
          "$2a$10$CwTycUXWue0Thq9StjUM0u"
        ),
        newPassword: bcrypt.hashSync(
          values.newPassword,
          "$2a$10$CwTycUXWue0Thq9StjUM0u"
        ),
        id: user._id,
      };
      mutate(data);
    },
  });

  const { mutate } = useMutation(api.changerPassword, {
    onSuccess: ({ data }) => {
      setloading(false);
      formik.resetForm();
      toast.success(t(data.message));
    },
    onError: (err: any) => {
      setloading(false);
      toast.error(t("common:errors." + err.response.data.message));
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="overline" sx={{ color: "text.secondary", width: 1 }}>
        {t("change-password")}
      </Typography>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end" mt={2}>
            <TextField
              {...getFieldProps("oldPassword")}
              fullWidth
              autoComplete="on"
              type="password"
              label={t("old-password")}
              error={Boolean(touched.oldPassword && errors.oldPassword)}
              helperText={touched.oldPassword && errors.oldPassword}
            />
            <TextField
              {...getFieldProps("newPassword")}
              fullWidth
              autoComplete="on"
              type="password"
              label={t("new-password")}
              error={Boolean(touched.newPassword && errors.newPassword)}
              helperText={
                (touched.newPassword && errors.newPassword) ||
                t("password-must-be-minimum-6+")
              }
            />

            <TextField
              {...getFieldProps("confirmNewPassword")}
              fullWidth
              autoComplete="on"
              type="password"
              label={t("confirm-new-password")}
              error={Boolean(
                touched.confirmNewPassword && errors.confirmNewPassword
              )}
              helperText={
                touched.confirmNewPassword && errors.confirmNewPassword
              }
            />

            <LoadingButton type="submit" variant="contained" loading={loading}>
              {t("save")}
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </Card>
  );
}
