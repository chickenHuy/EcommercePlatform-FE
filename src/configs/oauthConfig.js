export const OAuthConfig = {
  clientId: "114329022200-hkajl8098uino3u4hjl1e30gmph9m80l.apps.googleusercontent.com",
  redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/authenticate`,
  authUri: "https://accounts.google.com/o/oauth2/auth",
};

export const FacebookOAuthConfig = {
  clientId: "1699360190637263",
  redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/facebook-authenticate`,
  authUri: "https://facebook.com/v21.0/dialog/oauth",
};