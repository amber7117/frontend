import React from "react";
import * as Yup from "yup";
import { uniqueId } from "lodash";
import { useFormik, Form, FormikProvider } from "formik";
import useTranslation from "next-translate/useTranslation";
// material
import {
  Stack,
  Button,
  Divider,
  Checkbox,
  TextField,
  Dialog,
  DialogActions,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
//
import PhoneAutocomplete from "src/components/phoneAutocomplete";
import countries from "./countries.json";
import { useMutation } from "react-query";
import * as api from "src/services";
// redux
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
// ----------------------------------------------------------------------

export default function CheckoutNewAddressForm({ ...props }) {
  const { open, onClose, onNextStep, onCreateBilling, apicall } = props;
  const { t } = useTranslation("checkout");
  const { user } = useSelector(({ user }: { user: any }) => user);
  const [loading, setloading] = React.useState<boolean>(false);
  const { mutate } = useMutation(["create"], api.createAddress, {
    onSuccess: () => {
      setloading(false);
      toast.success(t("common:added-address"));

      formik.resetForm();
      apicall((prev: boolean) => !prev);
      onClose();
      onNextStep();
    },
  });
  const NewAddressSchema = Yup.object().shape({
    address: Yup.string().required(t("address-required")),
    city: Yup.string().required(t("city-required")),
    state: Yup.string().required(t("state-required")),
    country: Yup.string().required(),
    phone: Yup.string().required("Phone is required"),
    zip: Yup.number().required(t("postal-require")),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      address: "",
      city: "",
      state: "",
      country: countries[0].label,
      zip: "",
      phone: "",
      active: false,
    },
    validationSchema: NewAddressSchema,
    onSubmit: async (values) => {
      try {
        setloading(true);
        const id = uniqueId();
        onCreateBilling({
          _id: id,
          receiver: user?.name,
          phone: values.phone || user?.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          zip: values.zip,
        });
        handleCreate(id);
      } catch (error) {
        console.error(error);
        setloading(false);
      }
    },
  });

  const {
    errors,
    values,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;
  const handleCreate = async (id: string) => {
    const data = {
      ...values,
      _id: id,
      user: user?._id,
    };
    await mutate(data);
  };

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        ".MuiPaper-root": {
          bgcolor: "background.paper",
        },
      }}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={{ xs: 2, sm: 3 }} p={3}>
            <TextField
              fullWidth
              label={t("address")}
              {...getFieldProps("address")}
              error={Boolean(touched.address && errors.address)}
              helperText={touched.address && errors.address}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {/* <TextField
                fullWidth
                label={t("alternative-phone")}
                {...getFieldProps("phone")}
                type="number"
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone && errors.phone}
              /> */}
              <PhoneAutocomplete
                setFieldValue={setFieldValue}
                phone={values.phone}
                inputError={touched.phone && errors.phone}
              />

              <TextField
                fullWidth
                label={t("Town-City")}
                {...getFieldProps("city")}
                error={Boolean(touched.city && errors.city)}
                helperText={touched.city && errors.city}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label={t("state")}
                {...getFieldProps("state")}
                error={Boolean(touched.state && errors.state)}
                helperText={touched.state && errors.state}
              />
              <TextField
                fullWidth
                label={t("zip-postal-code")}
                type="number"
                {...getFieldProps("zip")}
                error={Boolean(touched.zip && errors.zip)}
                helperText={touched.zip && errors.zip}
              />
            </Stack>

            <TextField
              select
              fullWidth
              label={t("country")}
              placeholder={t("country")}
              {...getFieldProps("country")}
              SelectProps={{ native: true }}
              error={Boolean(touched.country && errors.country)}
              helperText={touched.country && errors.country}
            >
              {countries.map((option) => (
                <option key={option.code} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.active}
                  {...getFieldProps("active")}
                />
              }
              label={t("address-as-default")}
              sx={{ mt: 3 }}
            />
          </Stack>
          <Divider />
          <DialogActions>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {t("deliver-address")}
            </LoadingButton>
            <Button
              type="button"
              color="inherit"
              variant="outlined"
              onClick={onClose}
            >
              {t("cancel")}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
