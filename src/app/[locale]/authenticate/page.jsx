"use client";

import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { authenticateWithGoogle } from "@/api/auth/oauthRequest";
import { handleLoginNavigation } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function Authenticate() {

  const router = useRouter();

  useEffect(() => {

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];

      authenticateWithGoogle(authCode)
        .then((response) => {
          handleLoginNavigation(response.result.token, router);
        })
        .catch((error) => {
          console.error("Authentication failed:", error);
        });
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress></CircularProgress>
        <Typography>Authenticating...</Typography>
      </Box>
    </>
  );
}
