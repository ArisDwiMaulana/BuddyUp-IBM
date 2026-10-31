/**
 * pb.js — PocketBase SDK singleton initialisation
 *
 * Loads the official PocketBase JS SDK from CDN and exposes a single
 * `window.pb` instance configured to use cookies for auth persistence.
 *
 * NOTE: This file must be loaded BEFORE any other app JS that uses `pb`.
 */

// The SDK is loaded via <script> tag in every HTML page before this module.
// We configure it here so every page shares the same instance.

(function () {
  "use strict";

  const PB_URL = window.location.origin; // served by PocketBase itself

  // ------------------------------------------------------------------ //
  // Cookie helpers
  // ------------------------------------------------------------------ //
  const COOKIE_NAME = "buddyup_auth_v2";
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

  function setCookie(value) {
    document.cookie = [
      `${COOKIE_NAME}=${encodeURIComponent(value)}`,
      `max-age=${COOKIE_MAX_AGE}`,
      "path=/",
      "SameSite=Lax",
    ].join("; ");
  }

  function getCookie() {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_NAME}=`));
    return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
  }

  function deleteCookie() {
    document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; SameSite=Lax`;
  }

  // ------------------------------------------------------------------ //
  // PocketBase instance
  // ------------------------------------------------------------------ //
  const pb = new PocketBase(PB_URL);

  // Disable auto-cancellation — prevents concurrent requests from cancelling each other
  pb.autoCancellation(false);

  // Restore auth state from cookie on page load
  const stored = getCookie();
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      pb.authStore.save(parsed.token, parsed.record || parsed.model);
    } catch (_) {
      deleteCookie();
    }
  }

  // Mirror authStore changes into the cookie
  pb.authStore.onChange((token, record) => {
    if (token && record) {
      setCookie(JSON.stringify({ token, record }));
    } else {
      deleteCookie();
    }
  });

  // Expose globally
  window.pb = pb;
  window._deleteCookie = deleteCookie;
})();
