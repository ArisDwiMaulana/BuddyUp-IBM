/// <reference path="../pb_data/types.d.ts" />

// Migration 4: Seed demo user + default onboarding checklist tasks
migrate(
  (app) => {
    // ------------------------------------------------------------------ //
    // 1. Create demo user
    // ------------------------------------------------------------------ //
    const usersCollection = app.findCollectionByNameOrId("users");

    const demoUser = new Record(usersCollection);
    demoUser.set("email", "alexjohnson@buddyup.com");
    demoUser.set("password", "password123");
    demoUser.set("passwordConfirm", "password123");
    demoUser.set("verified", true);
    demoUser.set("name", "Alex Johnson");
    demoUser.set("username", "alexjohnson");
    demoUser.set("division", "Human Resources");
    demoUser.set("avatar", "");
    demoUser.set("joined_date", "2024-01-15");

    app.save(demoUser);

    // ------------------------------------------------------------------ //
    // 2. Seed default onboarding tasks for the demo user
    // ------------------------------------------------------------------ //
    const checklistsCollection = app.findCollectionByNameOrId("checklists");

    const defaultTasks = [
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

    for (const taskName of defaultTasks) {
      const task = new Record(checklistsCollection);
      task.set("user_id", demoUser.id);
      task.set("task_name", taskName);
      task.set("is_completed", false);
      app.save(task);
    }
  },
  (app) => {
    // Revert: remove seeded records
    try {
      const user = app.findFirstRecordByData("users", "email", "alexjohnson@buddyup.com");

      // Delete associated checklists
      const tasks = app.findRecordsByFilter(
        "checklists",
        `user_id = "${user.id}"`,
        "",
        0,
        0
      );
      for (const t of tasks) {
        app.delete(t);
      }

      // Delete associated chats
      const chats = app.findRecordsByFilter(
        "chats",
        `user_id = "${user.id}"`,
        "",
        0,
        0
      );
      for (const c of chats) {
        app.delete(c);
      }

      app.delete(user);
    } catch (_) {
      // already removed — ignore
    }
  }
);
