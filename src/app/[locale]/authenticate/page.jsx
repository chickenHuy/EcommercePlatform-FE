"use client";
import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { authenticateWithGoogle } from "@/api/auth/oauthRequest";
import Cookies from "js-cookie";

export default function Authenticate() {
  useEffect(() => {
    console.log(window.location.href);

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];

      authenticateWithGoogle(authCode)
        .then((response) => {
          const token = response.result.token;
          Cookies.set(process.env.NEXT_PUBLIC_JWT_NAME, token, {
            expires: 1,
            secure: true,
            path: "/",
          });

          window.location.href = "http://localhost:3000/admin"; 
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
