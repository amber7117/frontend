import React from "react";
import * as Yup from "yup";
import { useCallback } from "react";
import { Form, FormikProvider, useFormik } from "formik";
// material
import {
  Box,
  Grid,
  Card,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Skeleton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// hooks
import UploadAvatar from "src/components/upload/UploadAvatar";
import * as api from "src/services";
import { useMutation, useQuery } from "react-query";
import { singleFileUploader, singleFileDelete } from "src/utils/r2-uploader";
import { useDispatch } from "react-redux";
import { setLogin } from "src/redux/slices/user";
import { jwtDecode } from "src/utils/jwt";
import { toast } from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";
import PhoneAutocomplete from "src/components/phoneAutocomplete";
import { useSession } from "next-auth/react";
// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { t } = useTranslation("profile");
  const { data: session, update } = useSession();

  const [loadingUpload, setLoadingUpload] = React.useState(false);
  const dispatch = useDispatch();
  const { data, isLoading: profileLoading } = useQuery(
    "user profile",
    api.getUser,
    {
      onSuccess: ({ data }) => {
        setAvatarId(data?.cover?._id || null);
      },
    }
  );

  const { mutate, isLoading: updateLoading } = useMutation(api.updateUser, {
    onSuccess: (data) => {
      dispatch(setLogin(data.data));
      update({
        ...session,
        user: {
          ...user,
          name: data.data?.firstName + " " + data.data?.lastName,
        },
      });

      toast.success(t(data.message));
    },
  });
  const { mutate: avatarMutate, isLoading: avatarLoading } = useMutation(
    api.singleDeleteFile,
    {
      onSuccess: () => {},
      onError: (error: any) => {
        toast.error(t(error.message));
      },
    }
  );
  const isLoading = profileLoading;
  const user = data?.data || {};
  const [loading, setLoading] = React.useState(100);
  const [avatarId, setAvatarId] = React.useState(null);
  const callbackLoading = useCallback(
    (value: any) => {
      setLoading(value);
    },
    [setLoading]
  );
  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required("First-name-required"),
    lastName: Yup.string().required("Last-name-required"),
    phoneNumber: Yup.string().required("phone-required"),
    gender: Yup.string().required("gender-required"),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      photoURL: user?.cover?.url || "",
      phoneNumber: user?.phone || "",
      gender: user?.gender || "",
      about: user?.about || "",
      file: "",
      cover: user?.cover,
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values) => {
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        fullName: values.firstName + " " + values.lastName,
        phone: values.phoneNumber,
        about: values.about,
        gender: values.gender,
        cover: values.cover,
        // photoURL: values.photoURL,
        id: user._id,
      };
      mutate(data);
    },
  });

  const {
    values,
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;
  const handleDrop = async (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    if (file) {
      setLoadingUpload(true);
      setFieldValue("file", file);
      setFieldValue("photoURL", {
        ...file,
        preview: URL.createObjectURL(file),
      });

      try {
        const result = await singleFileUploader(file);
        setFieldValue("cover", {
          _id: result._id,
          url: result.url,
        });
        
        // Delete old avatar if exists
        if (avatarId) {
          await singleFileDelete(avatarId);
        }
        
        setLoadingUpload(false);
      } catch (error) {
        setLoadingUpload(false);
        toast.error(t("common:upload-failed"));
        console.error('Upload error:', error);
      }
    }
  };
  console.log(values, "value");
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 11.8, px: 3, textAlign: "center" }}>
              {isLoading || avatarLoading || loadingUpload ? (
                <Stack alignItems="center">
                  <Skeleton variant="circular" width={142} height={142} />
                  <Skeleton variant="text" width={150} sx={{ mt: 1 }} />
                  <Skeleton variant="text" width={150} />
                </Stack>
              ) : (
                <UploadAvatar
                  accept="image/*"
                  file={values.photoURL}
                  loading={loading}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.photoURL && errors.photoURL)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: "auto",
                        display: "block",
                        textAlign: "center",
                        color: "text.secondary",
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {3145728}
                    </Typography>
                  }
                />
              )}

              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {touched.photoURL && (errors.photoURL as string)}
              </FormHelperText>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              {isLoading ? (
                <>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} sx={{ mt: "0 !important" }}>
                    <Grid item xs={12} md={6}>
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        width="100%"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                  <Skeleton
                    variant="rectangular"
                    height="125px"
                    width="100%"
                    sx={{ mt: 3 }}
                  />
                </>
              ) : (
                <Stack spacing={{ xs: 2, md: 3 }}>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label={t("first-name")}
                      {...getFieldProps("firstName")}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={
                        touched.firstName && (errors.firstName as string)
                      }
                    />
                    <TextField
                      fullWidth
                      label={t("last-name")}
                      {...getFieldProps("lastName")}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={
                        touched.lastName && (errors.lastName as string)
                      }
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    disabled
                    label={t("email")}
                    {...getFieldProps("email")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <PhoneAutocomplete
                      setFieldValue={setFieldValue}
                      phone={values.phoneNumber}
                      inputError={touched.phoneNumber && errors.phoneNumber}
                    />
                    <TextField
                      select
                      fullWidth
                      label={t("gender")}
                      placeholder={t("gender")}
                      {...getFieldProps("gender")}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.gender && errors.gender)}
                      helperText={touched.gender && (errors.gender as string)}
                    >
                      <option value="male">{t("male")}</option>
                      <option value="female">{t("female")}</option>
                    </TextField>
                  </Stack>
                  <TextField
                    {...getFieldProps("about")}
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={4}
                    label={t("about")}
                  />
                </Stack>
              )}
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                {isLoading ? (
                  <Skeleton variant="rectangular" height={36} width={124} />
                ) : (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={updateLoading || avatarLoading || loadingUpload}
                  >
                    {t("save")}
                  </LoadingButton>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
