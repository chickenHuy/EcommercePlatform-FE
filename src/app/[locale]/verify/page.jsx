"use client";
import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { verifyEmail } from "@/api/verify/emailRequest";

export default function VerifyEmail() {
  useEffect(() => {
    console.log(window.location.href);

    const emailTokenRegex = /token=([^&]+)/;
    const isMatch = window.location.href.match(emailTokenRegex);

    if (isMatch) {
      const emailToken = isMatch[1];
      console.log("Emailtoken: ", emailToken);

      verifyEmail(emailToken)
        .then(() => {
          window.location.href =
            "http://localhost:3000/en/auth";
        })
        .catch((error) => {
          console.error("Verify email failed:", error);
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
        <Typography>Verifing...</Typography>
      </Box>
    </>
  );
}
