import React from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Stack,
  Button,
  Divider,
  Checkbox,
  TextField,
  DialogActions,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMutation } from "react-query";
import * as api from "src/services";
import { useSelector } from "react-redux";
import countries from "src/components/_main/checkout/countries.json";
import { toast } from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";
import _ from "lodash";
import PhoneAutocomplete from "src/components/phoneAutocomplete";
//
// ----------------------------------------------------------------------

export default function AccountAddressForm({ ...props }) {
  const { onClose, address, apicall } = props;
  const [loading, setloading] = React.useState(false);
  const { t } = useTranslation("common");
  const { user } = useSelector(({ user }: { user: any }) => user);
  const NewAddressSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    phone: Yup.number().required("Phone is required"),
    country: Yup.string().required("Countary is required"),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      address: address ? address.address : "",
      city: address ? address.city : "",
      state: address ? address.state : "",
      country: address ? address.country : countries[0].label,
      zip: address ? address.zip : "",
      phone: address ? address.phone : "",
      active: address ? address.active : false,
    },
    validationSchema: NewAddressSchema,
    onSubmit: async () => {
      setloading(true);
      try {
        if (address) {
          handleUpdate();
        } else {
          handleCreate();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
  const { mutate } = useMutation(["update"], api.updateAddress, {
    onSuccess: (data) => {
      apicall((prev: any) => ({ ...prev, apicall: !prev.apicall }));
      setloading(false);
      toast.success(t(data.message));
      formik.resetForm();

      onClose();
    },
    onError: () => setloading(false),
  });
  const { mutate: createMutate } = useMutation(["create"], api.createAddress, {
    onSuccess: () => {
      setloading(false);
      toast.success(t("added-address"));
      formik.resetForm();

      onClose();
    },
    onError: () => setloading(false),
  });
  const {
    errors,
    values,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;
  const handleCreate = async () => {
    const id = _.uniqueId();
    const data = {
      ...values,
      _id: id,
      user: user?._id,
    };
    await createMutate(data);
    apicall((prev: any) => ({ ...prev, apicall: !prev.apicall }));
  };
  const handleUpdate = async () => {
    const data = {
      ...values,
      _id: address._id,
      user: user?._id,
    };
    await mutate(data);
    apicall((prev: any) => ({ ...prev, apicall: !prev.apicall }));
  };
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={{ xs: 2, sm: 3 }} sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Address"
            {...getFieldProps("address")}
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && (errors.address as string)}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <PhoneAutocomplete
              setFieldValue={setFieldValue}
              phone={values.phone}
              inputError={touched.phone && errors.phone}
            />
            {/* <TextField
              fullWidth
              label="Alternative Phone"
              {...getFieldProps("phone")}
              type="number"
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && (errors.phone as string)}
            /> */}

            <TextField
              fullWidth
              label="Town / City"
              {...getFieldProps("city")}
              error={Boolean(touched.city && errors.city)}
              helperText={touched.city && (errors.city as string)}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="State"
              {...getFieldProps("state")}
              error={Boolean(touched.state && errors.state)}
              helperText={touched.state && (errors.state as string)}
            />
            <TextField
              fullWidth
              label="Zip / Postal Code"
              type="number"
              {...getFieldProps("zip")}
              error={Boolean(touched.zip && errors.zip)}
              helperText={touched.zip && (errors.zip as string)}
            />
          </Stack>

          <TextField
            select
            fullWidth
            label="Country"
            placeholder="Country"
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
          <FormControlLabel
            control={
              <Checkbox checked={values.active} {...getFieldProps("active")} />
            }
            label="Use this address as default."
            sx={{ mt: 3 }}
          />
        </Stack>
        <Divider />
        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Save Address
          </LoadingButton>
          <Button
            type="button"
            color="inherit"
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
