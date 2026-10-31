/// <reference path="../pb_data/types.d.ts" />

// Migration 2: Create chats collection
migrate(
  (app) => {
    const collection = new Collection();
    collection.name = "chats";
    collection.type = "base";
    collection.fields.add(new RelationField({
      name: "user_id",
      required: true,
      collectionId: "_pb_users_auth_",
      cascadeDelete: true,
      maxSelect: 1,
    }));
    collection.fields.add(new SelectField({
      name: "sender",
      required: true,
      maxSelect: 1,
      values: ["user", "buddy"],
    }));
    collection.fields.add(new TextField({
      name: "message",
      required: true,
      min: 1,
      max: 5000,
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
    const collection = app.findCollectionByNameOrId("chats");
    return app.delete(collection);
  }
);
