/**
 * api.js — Centralised PocketBase API call wrappers
 *
 * All functions return Promises and throw on error so callers can
 * handle failures with try/catch.
 */

(function () {
  "use strict";

  // ------------------------------------------------------------------ //
  // User
  // ------------------------------------------------------------------ //

  /** Fetch the full user record for the currently authenticated user. */
  window.api = window.api || {};

  api.getMe = async function () {
    return pb.collection("users").getOne(pb.authStore.record.id);
  };

  // ------------------------------------------------------------------ //
  // Checklists
  // ------------------------------------------------------------------ //

  const DEFAULT_TASKS = [
    "Attend New Employee Orientation",
    "Sign Employment Contract",
    "Submit National ID (KTP) Copy",
    "Submit Tax Identification Number (NPWP)",
    "Complete IT Equipment Request Form",
    "Set Up Company Email Account",
    "Read & Acknowledge Company Handbook",
    "Complete Data Privacy & Security Training",
    "Submit Emergency Contact Information",
    "Meet Your Team & Direct Manager",
  ];

  api.DEFAULT_TASKS = DEFAULT_TASKS;

  /**
   * Auto-provision standard onboarding checklist tasks for the current employee
   * if they don't have any tasks assigned yet.
   */
  api.initializeDefaultTasks = async function () {
    const createdTasks = [];
    for (const taskName of DEFAULT_TASKS) {
      try {
        const task = await pb.collection("checklists").create({
          user_id: pb.authStore.record.id,
          task_name: taskName,
          is_completed: false,
        });
        createdTasks.push(task);
      } catch (err) {
        console.error("Failed to seed default task:", taskName, err);
      }
    }
    return createdTasks;
  };

  /** Fetch all checklist tasks belonging to the current user. */
  api.getChecklists = async function () {
    try {
      return await pb.collection("checklists").getFullList({
        filter: `user_id = '${pb.authStore.record.id}'`,
        sort: "created",
      });
    } catch (_) {
      return await pb.collection("checklists").getFullList({
        filter: `user_id = '${pb.authStore.record.id}'`,
      });
    }
  };

  /**
   * Toggle the is_completed state of a checklist item.
   * Sets completed_at to the current timestamp when marking done, clears it when un-checking.
   * @param {string} recordId
   * @param {boolean} isCompleted
   */
  api.updateChecklist = async function (recordId, isCompleted) {
    return pb.collection("checklists").update(recordId, {
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString().replace("T", " ").slice(0, 19) : null,
    });
  };

  // ------------------------------------------------------------------ //
  // Chats
  // ------------------------------------------------------------------ //

  /**
   * Fetch all chat messages for the current user, sorted oldest-first.
   */
  api.getChats = async function () {
    try {
      return await pb.collection("chats").getFullList({
        filter: `user_id = '${pb.authStore.record.id}'`,
        sort: "created",
      });
    } catch (_) {
      return await pb.collection("chats").getFullList({
        filter: `user_id = '${pb.authStore.record.id}'`,
      });
    }
  };

  /**
   * Save a single chat message.
   * @param {"user"|"buddy"} sender
   * @param {string} message
   */
  api.saveChat = async function (sender, message) {
    return pb.collection("chats").create({
      user_id: pb.authStore.record.id,
      sender,
      message,
    });
  };
})();
