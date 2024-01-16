import { useRouter } from "next/router";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
// material
import { Box, Link, Button, Typography, Stack, Container } from "@mui/material";
// redux
import { useDispatch } from "react-redux";
import { resetCart } from "src/redux/slices/product";
//
import { OrderCompleteIllustration } from "src/components/illustrations/noDataFound";

export default function CheckoutOrderComplete() {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleResetStep = () => {
    router.push("/");
    dispatch(resetCart());
  };
  return (
    <Container>
      <Box>
        <Box sx={{ maxWidth: 440, mx: "auto" }}>
          <OrderCompleteIllustration
            sx={{ svg: { width: "100%", height: "100%" } }}
          />
        </Box>
        <Typography variant="h3" sx={{ textAlign: "center" }} noWrap>
          Thanks for placing order!
        </Typography>
        <Typography align="center">
          <Link href="#">01dc1370-3df6-11eb-b378-0242ac130002</Link>
        </Typography>
        <Typography align="center" paragraph>
          We will send you a notification within 5 days when it ships. If you
          have any question or queries then fell to get in contact us.All the
          best,
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        justifyContent="center"
        spacing={2}
      >
        <Button
          color="inherit"
          onClick={handleResetStep}
          startIcon={<ArrowBackRoundedIcon />}
        >
          Continue Shopping
        </Button>
      </Stack>
    </Container>
  );
}
