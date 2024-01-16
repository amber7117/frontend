// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";

// material
import {
  Box,
  Stack,
  Grid,
  Radio,
  Collapse,
  Typography,
  RadioGroup,
  CardHeader,
  CardContent,
  FormHelperText,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"; //

// components
const CheckoutPaymentForm = dynamic(() => import("../checkoutPaymentForm"));
const RootStyled = dynamic(() => import("./styled"));
// ----------------------------------------------------------------------

const OptionStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2.5),

  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create("all"),
  // border: `solid 1px ${theme.palette.grey[500_32]}`,
  border: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------
interface PaymentProps {
  value: string;
  title: string;
  icons: string[];
  description: string;
}

export default function CheckoutPaymentMethods({ ...props }) {
  const { paymentOptions, formik, error } = props;
  const { errors, touched, values, getFieldProps } = formik;
  const { t } = useTranslation("checkout");
  return (
    <RootStyled>
      <CardHeader className="card-header" title={t("payment-options")} />
      <CardContent>
        <RadioGroup row {...getFieldProps("payment")}>
          {/* spacing={2} */}
          <Grid container>
            {paymentOptions.map((method: PaymentProps, i: number) => {
              const { value, title, icons, description } = method;
              const hasChildren = value === "credit_card";
              return (
                <Grid key={title} item xs={12}>
                  <OptionStyle
                    sx={{
                      mb: i === 0 ? 2 : 0,
                      ...(values.payment === value && {
                        border: (theme) =>
                          `1px solid ${theme.palette.primary.main}`,
                      }),
                      ...(hasChildren && { flexWrap: "wrap" }),
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormControlLabel
                        value={value}
                        control={
                          <Radio checkedIcon={<CheckCircleRoundedIcon />} />
                        }
                        label={
                          <Box ml={1}>
                            <Typography variant="subtitle2" textAlign="left">
                              {t(title)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t(description)}
                            </Typography>
                          </Box>
                        }
                        className="form-control-label"
                      />

                      <Box className="img-icon">
                        {icons.map((icon: any, index: number) => (
                          <Box
                            key={icon}
                            component="img"
                            alt="logo card"
                            src={icon}
                            className={`${index === 0 && "logo-card"}`}
                          />
                        ))}
                      </Box>
                    </Stack>
                    {hasChildren && (
                      <Collapse
                        in={values.payment === "credit_card"}
                        className="credit_card"
                      >
                        <CheckoutPaymentForm error={error} />
                      </Collapse>
                    )}
                  </OptionStyle>
                </Grid>
              );
            })}
          </Grid>
        </RadioGroup>

        {errors.payment && (
          <FormHelperText error>
            <Box component="span" px={2}>
              {touched.payment && t("payment-required")}
            </Box>
          </FormHelperText>
        )}
      </CardContent>
    </RootStyled>
  );
}
