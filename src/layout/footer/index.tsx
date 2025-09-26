// react
import React from "react";
import * as Yup from "yup";
// react query
import { useMutation } from "react-query";
// formik
import { Form, FormikProvider, useFormik } from "formik";
// next
import Link from "next/link";
import { useRouter } from "next/navigation";
// api
import * as api from "src/services";
// notification
import useTranslation from "next-translate/useTranslation";
import { toast } from "react-hot-toast";

// material
import {
  Grid,
  Typography,
  Container,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  useTheme,
  InputAdornment,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

// styles
import RootStyled from "./styled";

// logo
import { MainLogo } from "src/components";

// social icons
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";

// config
import config from "src/layout/config.json";

const getSocialIcon = (name: string) => {
  switch (name) {
    case "FaceBook":
      return <FacebookOutlinedIcon />;
    case "Instagram":
      return <InstagramIcon />;

    case "Linkedin":
      return <LinkedInIcon />;

    default:
      return <PinterestIcon />;
  }
};
export default function Footer() {
  const { footer_links, company, social } = config;
  const theme = useTheme();
  const router = useRouter();
  const [loading, setloading] = React.useState(false);
  const { t } = useTranslation("common");

  const ChangePassWordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required(t("email-required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values) => {
      setloading(true);
      mutate(values);
    },
  });

  const { mutate } = useMutation(api.sendNewsletter, {
    onSuccess: (data) => {
      toast.success(t(data.message));

      setloading(false);
      formik.resetForm();
    },
    onError: (err: any) => {
      setloading(false);
      toast.error(t("common:errors." + err.response.data.message));
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;
  return (
    <RootStyled>
      <Container>
        <Grid container spacing={3} className="grid-container">
          <Grid item lg={3} md={3} sm={6} xs={12}>
            <MainLogo />
            <Typography variant="body2" color="text.primary" mt={1}>
              {t("address")}
            </Typography>
            <Typography
              href={`mailto:${company.email}`}
              target="_blank"
              component={Link}
              variant="body2"
              color="text.secondary"
              mt={1}
              mb={0.8}
              className="text-link">
              <EmailRoundedIcon fontSize="small" /> {company.email}
            </Typography>
            <Typography
              href={`tel:${company.phone}`}
              component={Link}
              variant="body2"
              color="text.secondary"
              className="text-link">
              <LocalPhoneRoundedIcon fontSize="small" /> {company.phone}
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Grid container spacing={2}>
              {footer_links.map((v) => (
                <Grid item md={4} xs={4} key={Math.random()}>
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    mt={1}
                    mb={2}>
                    {t(v.headline)}
                  </Typography>
                  <nav aria-label="secondary mailbox folders">
                    <List>
                      {v.children.map((val) => (
                        <ListItem disablePadding dense key={Math.random()}>
                          <ListItemButton
                            component="a"
                            href={val.href}
                            className="list-button">
                            <ListItemText primary={t(val.name)} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </nav>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={12}>
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack className="newsletter-main">
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    mt={1}
                    mb={1.5}>
                    {t("newsletter")}
                  </Typography>
                  <TextField
                    id="newslatter"
                    fullWidth
                    size="small"
                    placeholder={t("enter-email")}
                    variant="outlined"
                    {...getFieldProps("email")}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    className="newsletter-textfield"
                    sx={{
                      ".MuiInputBase-root": {
                        pr: "4px",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <LoadingButton
                            loading={loading}
                            size="small"
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                              minWidth: 36,
                              p: "4px",
                            }}>
                            <SendRoundedIcon />
                          </LoadingButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Form>
            </FormikProvider>
            <Typography variant="subtitle1" color="text.primary" mt={1.5}>
              {t("follow-us")}
            </Typography>
            <Stack spacing={1} direction="row" className="social-main">
              {social.map((social) => (
                <IconButton
                  key={Math.random()}
                  sx={{ color: social.color }}
                  onClick={() => router.push(social.href)}>
                  {getSocialIcon(social.name)}
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </RootStyled>
  );
}
