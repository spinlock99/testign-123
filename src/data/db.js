import Dexie from "dexie";

const db = new Dexie("AtomicApps");
db.version(1).stores({
  apps: "id, name",
  githubTokens: "++id"
});

export default db;
