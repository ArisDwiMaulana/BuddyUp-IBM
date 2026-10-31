/// <reference path="../pb_data/types.d.ts" />

// Migration 1: Create checklists collection
migrate(
  (app) => {
    const collection = new Collection();
    collection.name = "checklists";
    collection.type = "base";
    collection.fields.add(new RelationField({
      name: "user_id",
      required: true,
      collectionId: "_pb_users_auth_",
      cascadeDelete: true,
      maxSelect: 1,
    }));
    collection.fields.add(new TextField({
      name: "task_name",
      required: true,
      min: 1,
      max: 255,
    }));
    collection.fields.add(new BoolField({
      name: "is_completed",
      required: false,
    }));
    collection.fields.add(new AutodateField({
      name: "created",
      onCreate: true,
    }));
    collection.fields.add(new AutodateField({
      name: "updated",
      onCreate: true,
      onUpdate: true,
    }));

    collection.listRule  = '@request.auth.id != ""';
    collection.viewRule  = '@request.auth.id != ""';
    collection.createRule = '@request.auth.id != ""';
    collection.updateRule = '@request.auth.id = user_id';
    collection.deleteRule = '@request.auth.id = user_id';

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("checklists");
    return app.delete(collection);
  }
);
