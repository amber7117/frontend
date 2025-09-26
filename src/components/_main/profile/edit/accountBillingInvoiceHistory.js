import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
// import { Link as RouterLink } from "next/router";
import RouterLink from "src/utils/link";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
// material
import {
  Link,
  Stack,
  Button,
  Typography,
  Card,
  Divider,
  Box,
  Skeleton,
} from "@mui/material";
// utils
import { fDate } from "src/utils/formatTime";
import useCurrency from "src/hooks/useCurrency";
import * as api from "src/services";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

// ----------------------------------------------------------------------

AccountBillingInvoiceHistory.propTypes = {
  invoices: PropTypes.array,
};

export default function AccountBillingInvoiceHistory() {
  const router = useRouter();
  const { data, isLoading } = useQuery("invoice", api.getInvoices);
  return (
    <Card
      sx={{
        p: 3,
        width: 1,
        position: "sticky",
        top: "80px",
        display: { md: "block", xs: "none" },
      }}
    >
      <Stack spacing={3} alignItems="flex-end">
        <Typography
          variant="overline"
          sx={{ color: "text.secondary", width: 1 }}
        >
          Invoice History
        </Typography>
        <Stack spacing={2} sx={{ width: 1 }}>
          {(isLoading ? Array.from(new Array(5)) : data?.data.slice(0, 5)).map(
            (invoice) => (
              <Box key={Math.random()}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ width: 1 }}
                >
                  <Typography variant="body2" sx={{ minWidth: 160 }}>
                    {isLoading ? (
                      <Skeleton variant="text" />
                    ) : (
                      fDate(invoice.createdAt)
                    )}
                  </Typography>
                  <Typography variant="body2">
                    {/* type error */}
                    {/* {isLoading ? (
                      <Skeleton variant="text" width={40} />
                    ) : (
                      useCurrency(invoice.total)
                    )} */}
                  </Typography>
                  {/* <Link component={RouterLink} href="#">
                    {isLoading ? (
                      <Skeleton variant="text" width={40} />
                    ) : (
                      <>PDF</>
                    )}
                  </Link> */}
                </Stack>
                <Divider sx={{ mt: 1.5 }} />
              </Box>
            )
          )}
        </Stack>
        {isLoading ? (
          <Skeleton variant="text" height={32} width={100} />
        ) : (
          <Button
            size="small"
            onClick={() => router.push("/profile")}
            endIcon={<Icon icon={arrowIosForwardFill} />}
          >
            All invoices
          </Button>
        )}
      </Stack>
    </Card>
  );
}
