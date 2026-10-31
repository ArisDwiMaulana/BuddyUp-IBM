/**
 * auth.js — Authentication helpers & session guards
 *
 * Exports:
 *   requireAuth()  — Call on protected pages. Redirects to login if not authenticated.
 *   requireGuest() — Call on login page. Redirects to dashboard if already authenticated.
 *   logout()       — Signs out and clears cookies.
 */

(function () {
  "use strict";

  /**
   * requireAuth — must be called at the top of every private page.
   * Redirects to login if there is no token in the authStore.
   */
  window.requireAuth = async function () {
    if (!pb.authStore.token) {
      window.location.replace("login.html");
      return false;
    }
    return true;
  };

  /**
   * requireGuest — call on login.html.
   * If the user already has a token, send them to the dashboard.
   */
  window.requireGuest = async function () {
    if (pb.authStore.token) {
      window.location.replace("dashboard.html");
      return false;
    }
    return true;
  };

  /**
   * logout — clears auth state, removes cookie, redirects to login.
   */
  window.logout = function () {
    pb.authStore.clear();
    if (typeof window._deleteCookie === "function") {
      window._deleteCookie();
    }
    window.location.replace("login.html");
  };
})();
