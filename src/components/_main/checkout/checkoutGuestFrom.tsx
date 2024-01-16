import React from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
// material
import {
  Stack,
  Button,
  Box,
  TextField,
  Card,
  CardHeader,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
//
import countries from "./countries.json";
import { useSelector, useDispatch } from "react-redux";
import { onBackStep } from "src/redux/slices/product";
import useTranslation from "next-translate/useTranslation";
import { uniqueId } from "lodash";
//
import PhoneAutocomplete from "src/components/phoneAutocomplete";
// ----------------------------------------------------------------------

export default function CheckoutGuestForm({ ...props }) {
  const { onNextStep, onCreateBilling, handleStepBack } = props;
  const { t } = useTranslation("checkout");
  const { checkout } = useSelector(({ product }: { product: any }) => product);

  const [billing, setBilling] = React.useState<any>({});
  const [loading, setloading] = React.useState(false);
  const dispatch = useDispatch();

  const NewAddressSchema = Yup.object().shape({
    firstName: Yup.string().required(t("first-name-required")),
    lastName: Yup.string().required(t("last-name-required")),
    phone: Yup.string().required("phone-required"),
    email: Yup.string().email(t("email-valid")).required(t("email-required")),
    address: Yup.string().required(t("address-required")),
    city: Yup.string().required(t("city-required")),
    state: Yup.string().required(t("state-required")),
    country: Yup.string().required(t("state-required")),
    zip: Yup.string().required(t("postal-required")),
  });

  const formik = useFormik({
    initialValues: {
      firstName: billing?.firstName || "",
      lastName: billing?.lastName || "",
      phone: billing?.phone || "",
      email: billing?.email || "",
      address: billing?.address || "",
      city: billing?.city || "",
      state: billing?.state || "",
      country: billing?.country || countries[0].label,
      zip: billing?.zip || "",
    },
    enableReinitialize: true,
    validationSchema: NewAddressSchema,
    onSubmit: async (values) => {
      try {
        setloading(true);
        const id = uniqueId();
        onCreateBilling({
          _id: id,
          firstName: values.firstName,
          lastName: values.lastName,
          fullName: values.firstName + " " + values.lastName,
          phone: values.phone,
          email: values.email,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          zip: values.zip,
        });
        setloading(false);
        onNextStep();
      } catch (error) {
        console.error(error);
        setloading(false);
      }
    },
  });
  const handleBackStep = () => {
    dispatch(onBackStep());
    handleStepBack();
  };
  const {
    errors,
    values,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;

  React.useEffect(() => {
    setBilling(checkout.billing);
  }, [checkout]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardHeader
            title={
              <Typography variant="h4">{t("guest-information")}</Typography>
            }
            // sx={{ mb: 1 }}
          />
          <Stack spacing={{ xs: 2, sm: 3 }} p={3} mt={1}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label={t("first-name")}
                {...getFieldProps("firstName")}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && (errors.firstName as string)}
                type="text"
              />
              <TextField
                fullWidth
                label={t("last-name")}
                {...getFieldProps("lastName")}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && (errors.lastName as string)}
                type="text"
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label={t("email")}
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && (errors.email as string)}
              />
              <PhoneAutocomplete
                setFieldValue={setFieldValue}
                phone={values.phone}
                inputError={touched.phone && errors.phone}
              />
              {/* <TextField
                fullWidth
                label="Phone"
                {...getFieldProps("phone")}
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone && (errors.phone as string)}
                type="number"
              /> */}
            </Stack>
            <TextField
              fullWidth
              label={t("address")}
              {...getFieldProps("address")}
              error={Boolean(touched.address && errors.address)}
              helperText={touched.address && (errors.address as string)}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label={t("Town-City")}
                {...getFieldProps("city")}
                error={Boolean(touched.city && errors.city)}
                helperText={touched.city && (errors.city as string)}
              />

              <TextField
                fullWidth
                label={t("state")}
                {...getFieldProps("state")}
                error={Boolean(touched.state && errors.state)}
                helperText={touched.state && (errors.state as string)}
              />

              <TextField
                fullWidth
                label={t("zip-postal-code")}
                {...getFieldProps("zip")}
                error={Boolean(touched.zip && errors.zip)}
                helperText={touched.zip && (errors.zip as string)}
                type="number"
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
              helperText={touched.country && (errors.country as string)}
            >
              {countries.map((option) => (
                <option key={option.code} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
            >
              {t("deliver-address")}
            </LoadingButton>
          </Stack>
        </Card>
        <Box mt={2}>
          <Button
            onClick={handleBackStep}
            type="button"
            color="inherit"
            size="small"
            startIcon={<ArrowBackRoundedIcon />}
          >
            {t("back")}
          </Button>
        </Box>
      </Form>
    </FormikProvider>
  );
}
