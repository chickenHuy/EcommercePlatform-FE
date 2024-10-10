"use client";
import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { authenticateWithGoogle } from "@/api/auth/oauthRequest";

export default function Authenticate() {
  useEffect(() => {
    console.log(window.location.href);

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];

      authenticateWithGoogle(authCode)
        .then((response) => {
          console.log("Authentication success:", response);
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
