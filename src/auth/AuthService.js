/* eslint-disable */
import auth0 from "auth0-js";
import { AUTH_CONFIG } from "./auth0-variables";
import EventEmitter from "eventemitter3";
import router from "./../router";

export default class AuthService {
  authenticated = this.isAuthenticated();
  authNotifier = new EventEmitter();
  userProfile = null;

  constructor() {
    this.login = this.login.bind(this);
    this.setSession = this.setSession.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    // this.userProfile = this.userProfile.bind(this);
    // this.userProfile = null;
  }

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    responseType: "token id_token",
    scope: AUTH_CONFIG.scope || "openid"
  });

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        router.replace("home");
      } else if (err) {
        router.replace("home");
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getProfile = () => {
    return userProfile;
  };

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);

    localStorage.setItem(
      "user_profile",
      JSON.stringify(authResult.idTokenPayload)
    );
    this.authNotifier.emit("authChange", {
      authenticated: true,
      currentUser: authResult.idTokenPayload
    });
    console.log("from setSession: ", authResult.idTokenPayload);
    this.userProfile = authResult.idTokenPayload;
  }

  setUser(authResult) {
    this.userProfile = authResult.idTokenPayload;
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("user_profile");
    this.userProfile = null;
    this.authNotifier.emit("authChange", {
      authenticated: false,
      currentUser: null
    });
    // navigate to the home route
    router.replace("home");
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
}
