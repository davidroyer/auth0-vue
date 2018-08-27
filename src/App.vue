<template>
  <div>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Auth0 - Vue</a>

          <router-link :to="'/'"
            class="btn btn-primary btn-margin">
              Home
          </router-link>
          <router-link to="/about">About</router-link> |
          <button
            id="qsLoginBtn"
            class="btn btn-primary btn-margin"
            v-if="!authenticated"
            @click="login()">
              Log In
          </button>

          <button
            id="qsLogoutBtn"
            class="btn btn-primary btn-margin"
            v-if="authenticated"
            @click="logout()">
              Log Out
          </button>
          <div v-if="authenticated && user">
            <h2>Hello {{user.name}}</h2>
            <img class="avatar" :src="user.picture" alt="">
            <pre>{{user}}</pre>
          </div>
        </div>
      </div>
    </nav>

    <div class="container">
      <router-view
        :auth="auth"
        :authenticated="authenticated">
      </router-view>
    </div>
  </div>
</template>

<script>
import AuthService from "./auth/AuthService";

const auth = new AuthService();

const { login, logout, authenticated, authNotifier, userProfile } = auth;

export default {
  name: "app",
  data() {
    authNotifier.on("authChange", authState => {
      this.authenticated = authState.authenticated;
      console.log("authState: ", authState);
    });
    return {
      auth,
      authenticated
    };
  },

  computed: {
    user() {
      return this.auth.userProfile
        ? this.auth.userProfile
        : JSON.parse(localStorage.getItem("user_profile"));
    }
  },

  methods: {
    login,
    logout
  }
};
</script>

<style>
@import "../node_modules/bootstrap/dist/css/bootstrap.css";

.btn-margin {
  margin-top: 7px;
}
.avatar {
  border-radius: 50%;
  max-width: 100px;
  max-height: 100px;
}
</style>
