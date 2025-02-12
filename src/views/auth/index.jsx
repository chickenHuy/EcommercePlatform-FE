"use client";

import { Logo, LogoText } from "@/components/logo/index";
import IconGoogle from "@/assets/icons/icon_google.png";
import IconFacebook from "@/assets/icons/icon_facebook.png";
import BackgroundAuthPage from "@/assets/images/background_auth_page.png";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSelector } from "react-redux";
import { OAuthConfig, FacebookOAuthConfig } from "@/configs/oauthConfig";
import { post } from "@/lib/httpClient";
import { handleLoginNavigation } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import SignInComponent from "@/components/auth/sign_in";
import SignUpComponent from "@/components/auth/sign_up";

const AuthPage = () => {
  const t = useTranslations("AuthPage");
  const { toast } = useToast();
  const [isSignIn, setIsSignIn] = useState(true);
  const loginData = useSelector((state) => state.loginReducer);
  const router = useRouter();

  function login(data) {
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_NAME, {
      path: "/",
      secure: true,
    });

    post("/api/v1/auths/log-in", data)
      .then((response) => {
        handleLoginNavigation(response.result.token, router);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleGoogleClick = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    window.location.href = targetUrl;
  };

  const handleFacebookClick = () => {
    const callbackUrl = FacebookOAuthConfig.redirectUri;
    const authUrl = FacebookOAuthConfig.authUri;
    const facebookClientId = FacebookOAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${facebookClientId}&scope=email%20public_profile`;

    window.location.href = targetUrl;
  };

  return (
    <div className="w-full h-full min-h-screen flex justify-center items-center">
      <div className="w-fit h-fit flex flex-col justify-center items-center lg:flex-row rounded-md shadow-sm shadow-white-tertiary">
        <div className="w-full max-w-[570px] h-full p-10">
          <div>
            <div className="flex flex-row justify-center items-center mb-2">
              <Logo width={"70"} />
              <LogoText height={"30"} />
            </div>
            <p className="font-bold text-[35px] text-center">{t("welcome")}</p>
            <p className="font-regular text-[15px] text-center text-black-secondary">
              {t("enterDetails")}
            </p>
          </div>
          <div className="w-full h-fit flex flex-row justify-center items-center gap-7 pt-5">
            <Button className='w-1/2 h-10 shadow-sm shadow-black-tertiary' onClick={handleGoogleClick}>
              <Image src={IconGoogle} alt="Google" width={20} height={20} />
            </Button>
            <Button className='w-1/2 h-10 shadow-sm shadow-black-tertiary' onClick={handleFacebookClick}>
              <Image src={IconFacebook} alt="Google" width={20} height={20} />
            </Button>
          </div>
          <div className="flex flex-row justify-evenly items-center mb-3">
            <div className="w-[45%] h-[2px] bg-black-tertiary opacity-30"></div>
            <p className="translate-y-2 mb-3">{t("or")}</p>
            <div className="w-[45%] h-[2px] bg-black-tertiary opacity-30"></div>
          </div>
          {isSignIn ? (
            <>
              <SignInComponent />
              <div className="flex flex-row justify-center items-center">
                <span>{t("dontHaveAccount")}</span>
                <span
                  className="underline ml-2 font-bold cursor-pointer"
                  onClick={() => setIsSignIn(!isSignIn)}
                >
                  {t("signUpNow")}
                </span>
              </div>
            </>
          ) : (
            <>
              <SignUpComponent setIsSignIn={setIsSignIn} />
              <div className="flex flex-row justify-center items-center">
                <span>{t("alreadyHaveAccount")}</span>
                <span
                  className="underline ml-2 font-bold cursor-pointer"
                  onClick={() => setIsSignIn(!isSignIn)}
                >
                  {t("signInHere")}
                </span>
              </div>
            </>
          )}
        </div>
        <div>
          <Image src={BackgroundAuthPage} alt="Backgroupd Auth Page" />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
