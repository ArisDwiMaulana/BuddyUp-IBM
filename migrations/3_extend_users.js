/// <reference path="../pb_data/types.d.ts" />

// Migration 3: Extend users auth collection with extra profile fields
// Note: PocketBase v0.23+ auth collections already include a built-in
// "name" TextField. We only add fields that don't already exist.
migrate(
  (app) => {
    const usersCollection = app.findCollectionByNameOrId("users");

    // Add "division" if not already present
    if (!usersCollection.fields.getByName("division")) {
      usersCollection.fields.add(new TextField({
        name: "division",
        required: false,
        max: 100,
      }));
    }

    // Add "avatar" (URL string) if not already present
    if (!usersCollection.fields.getByName("avatar")) {
      usersCollection.fields.add(new TextField({
        name: "avatar",
        required: false,
        max: 500,
      }));
    }

    // Add "joined_date" if not already present
    if (!usersCollection.fields.getByName("joined_date")) {
      usersCollection.fields.add(new TextField({
        name: "joined_date",
        required: false,
        max: 50,
      }));
    }

    // Allow authenticated users to read/update their own profile
    usersCollection.listRule   = '@request.auth.id != ""';
    usersCollection.viewRule   = '@request.auth.id != ""';
    usersCollection.updateRule = '@request.auth.id = id';

    return app.save(usersCollection);
  },
  (app) => {
    const usersCollection = app.findCollectionByNameOrId("users");
    const toRemove = ["division", "avatar", "joined_date"];
    for (const name of toRemove) {
      const field = usersCollection.fields.getByName(name);
      if (field) {
        usersCollection.fields.remove(field);
      }
    }
    return app.save(usersCollection);
  }
);
