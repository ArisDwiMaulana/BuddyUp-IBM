/**
 * hooks/main.pb.js
 *
 * PocketBase server-side JS hooks entry point.
 */

const DEFAULT_ONBOARDING_TASKS = [
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

/**
 * Whenever a new employee record is created in the "users" collection,
 * automatically generate the standard onboarding checklist for them.
 */
onRecordCreate((e) => {
  e.next();

  try {
    const checklistsCollection = $app.findCollectionByNameOrId("checklists");
    if (!checklistsCollection) return;

    for (const taskName of DEFAULT_ONBOARDING_TASKS) {
      const task = new Record(checklistsCollection);
      task.set("user_id", e.record.id);
      task.set("task_name", taskName);
      task.set("is_completed", false);
      $app.save(task);
    }
  } catch (err) {
    console.error("[BuddyUp Hooks] Failed to auto-provision tasks for new user:", err);
  }
}, "users");
