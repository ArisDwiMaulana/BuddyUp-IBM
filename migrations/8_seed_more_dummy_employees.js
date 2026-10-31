/// <reference path="../pb_data/types.d.ts" />

// Migration 8: Seed additional dummy employees with varied onboarding progress
migrate(
  (app) => {
    const usersCollection = app.findCollectionByNameOrId("users");
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

    const dummyEmployees = [
      {
        name: "Sarah Connor",
        email: "sarahconnor@buddyup.com",
        username: "sarahconnor",
        division: "Software Engineering",
        joined_date: "2024-02-01",
        completedTaskCount: 5, // 50%
      },
      {
        name: "David Miller",
        email: "davidmiller@buddyup.com",
        username: "davidmiller",
        division: "Product Management",
        joined_date: "2024-01-08",
        completedTaskCount: 8, // 80%
      },
      {
        name: "Emily Watson",
        email: "emilywatson@buddyup.com",
        username: "emilywatson",
        division: "Brand Marketing",
        joined_date: "2024-03-01",
        completedTaskCount: 0, // 0% (New hire)
      },
      {
        name: "Budi Santoso",
        email: "budisantoso@buddyup.com",
        username: "budisantoso",
        division: "Finance & Accounting",
        joined_date: "2024-02-20",
        completedTaskCount: 3, // 30%
      },
    ];

    for (const emp of dummyEmployees) {
      let existingUser = null;
      try {
        existingUser = app.findFirstRecordByData("users", "email", emp.email);
      } catch (_) {}

      if (existingUser) continue;

      // 1. Create employee account
      const user = new Record(usersCollection);
      user.set("email", emp.email);
      user.set("password", "password123");
      user.set("passwordConfirm", "password123");
      user.set("verified", true);
      user.set("name", emp.name);
      user.set("username", emp.username);
      user.set("division", emp.division);
      user.set("avatar", "");
      user.set("joined_date", emp.joined_date);
      app.save(user);

      // 2. Create the standard 10 checklist items for this employee
      for (let i = 0; i < defaultTasks.length; i++) {
        const taskName = defaultTasks[i];
        const isDone = i < emp.completedTaskCount;

        const task = new Record(checklistsCollection);
        task.set("user_id", user.id);
        task.set("task_name", taskName);
        task.set("is_completed", isDone);
        if (isDone) {
          task.set("completed_at", "2024-02-15 10:00:00.000Z");
        }
        app.save(task);
      }
    }
  },
  (app) => {
    const emails = [
      "sarahconnor@buddyup.com",
      "davidmiller@buddyup.com",
      "emilywatson@buddyup.com",
      "budisantoso@buddyup.com",
    ];

    for (const email of emails) {
      try {
        const user = app.findFirstRecordByData("users", "email", email);
        if (!user) continue;

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

        app.delete(user);
      } catch (_) {}
    }
  }
);
