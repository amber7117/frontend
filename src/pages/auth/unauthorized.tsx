import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const { push } = useRouter();
  return (
    <div>
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          textAlign: "center",
          bgcolor: "lightgrey",
          p: 3,
          borderRadius: 2,
          my: 5,
        }}
      >
        <Typography variant="h3" color="text.primary" textAlign="center">
          You are not authorized to log in. Please create an account or use
          another account
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => push("/auth/login")}
        >
          Go back
        </Button>
      </Box>
    </div>
  );
}
