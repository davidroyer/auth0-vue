export const AUTH_CONFIG = {
  // clientId: 'jMSvvKeFirdoe72DO221g7eoYlWGJM0h',
  // domain: 'droyer.auth0.com',
  // callbackUrl: 'http://localhost:3000/callback',
  // apiUrl: 'YOUR_API_IDENTIFIER'

  domain: "droyer.auth0.com",
  clientId: "QBPom6WU5rs5hcrST6Og4mq2JI6ZM4YG",
  callbackUrl: "http://localhost:8080/callback", // Will be redirectUri
  audience: "https://droyer.auth0.com/userinfo",
  responseType: "token id_token",
  scope: "openid profile"
};
