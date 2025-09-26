import { useState } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
// react query
import { useMutation } from "react-query";
// formik
import { Form, FormikProvider, useFormik } from "formik";
// material
import {
  TextField,
  Skeleton,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EmailIcon from "@mui/icons-material/Email";
// hooks
import useIsMountedRef from "src/hooks/useIsMountedRef";
// api
import * as api from "src/services";
// notification
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
};

export default function ResetPasswordForm({ ...props }) {
  const { onSent, onGetEmail, t } = props;
  const isMountedRef = useIsMountedRef();
  const [loading, setloading] = useState(false);
  const { mutate } = useMutation(api.forgetPassword, {
    onSuccess: (data) => {
      onSent();

      toast.success(t(data.message));
      setloading(false);
    },
    onError: (err: any) => {
      const message = JSON.stringify(err.response.data.message);
      setloading(false);
      toast.error(
        message
          ? t("common:" + JSON.parse(message))
          : t("common:something-went-wrong")
      );
    },
  });

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email(t("enter-email")).required(t("email-required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        setloading(true);
        onGetEmail(values.email);
        await mutate(values.email);
      } catch (error) {
        if (isMountedRef.current) {
          toast.error(error.message);
        }
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            {...getFieldProps("email")}
            type="email"
            label={t("email-address")}
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

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}>
            {t("send-email")}
          </LoadingButton>
        </Stack>
      </Form>
      {/* )} */}
    </FormikProvider>
  );
}
