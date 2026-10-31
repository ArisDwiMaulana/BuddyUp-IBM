/// <reference path="../pb_data/types.d.ts" />

// Migration 6: Add created and updated autodate fields to checklists and chats
migrate(
  (app) => {
    const targetCollections = ["checklists", "chats"];

    for (const name of targetCollections) {
      try {
        const collection = app.findCollectionByNameOrId(name);
        if (!collection) continue;

        let changed = false;

        if (!collection.fields.getByName("created")) {
          collection.fields.add(new AutodateField({
            name: "created",
            onCreate: true,
          }));
          changed = true;
        }

        if (!collection.fields.getByName("updated")) {
          collection.fields.add(new AutodateField({
            name: "updated",
            onCreate: true,
            onUpdate: true,
          }));
          changed = true;
        }

        if (changed) {
          app.save(collection);
        }
      } catch (err) {
        console.error(`Migration 6 error for collection ${name}:`, err);
      }
    }
  },
  (app) => {
    const targetCollections = ["checklists", "chats"];

    for (const name of targetCollections) {
      try {
        const collection = app.findCollectionByNameOrId(name);
        if (!collection) continue;

        let changed = false;
        const created = collection.fields.getByName("created");
        if (created) {
          collection.fields.remove(created);
          changed = true;
        }

        const updated = collection.fields.getByName("updated");
        if (updated) {
          collection.fields.remove(updated);
          changed = true;
        }

        if (changed) {
          app.save(collection);
        }
      } catch (_) {}
    }
  }
);
