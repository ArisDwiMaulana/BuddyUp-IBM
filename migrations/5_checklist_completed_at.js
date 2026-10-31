/// <reference path="../pb_data/types.d.ts" />

// Migration 5: Add completed_at field to checklists collection
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("checklists");

    // Only add if not already present (idempotent)
    if (!collection.fields.getByName("completed_at")) {
      collection.fields.add(new DateField({
        name: "completed_at",
        required: false,
      }));
    }

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("checklists");
    const field = collection.fields.getByName("completed_at");
    if (field) {
      collection.fields.remove(field);
      return app.save(collection);
    }
  }
);
