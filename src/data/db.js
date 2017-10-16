import Dexie from "dexie";

const db = new Dexie("AtomicApps");
db.version(1).stores({
  apps: "id, name",
  users: "++id"
});

export default db;
