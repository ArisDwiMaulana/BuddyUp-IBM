/// <reference path="../pb_data/types.d.ts" />

// Migration 7: Ensure all existing and future users have the standard onboarding checklist tasks
migrate(
  (app) => {
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

    try {
      const users = app.findRecordsByFilter("users", "1=1", "", 0, 0);
      const checklistsCollection = app.findCollectionByNameOrId("checklists");
      if (!checklistsCollection) return;

      for (const user of users) {
        const existingTasks = app.findRecordsByFilter(
          "checklists",
          `user_id = "${user.id}"`,
          "",
          0,
          0
        );

        if (!existingTasks || existingTasks.length === 0) {
          for (const taskName of defaultTasks) {
            const task = new Record(checklistsCollection);
            task.set("user_id", user.id);
            task.set("task_name", taskName);
            task.set("is_completed", false);
            app.save(task);
          }
        }
      }
    } catch (err) {
      console.error("Migration 7 error:", err);
    }
  },
  (app) => {
    // Revert not required
  }
);
