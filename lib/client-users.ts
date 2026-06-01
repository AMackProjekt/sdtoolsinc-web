import fs from "fs";
import path from "path";
import crypto from "crypto";

export type ClientUser = {
  id: string;
  username: string;
  name: string;
  passwordHash: string;
  salt: string;
  firstLogin: boolean;
  mustChangePassword: boolean;
  pwd_reset_required: boolean;
  sessionVersion: number;
  lastPasswordChange?: string;
  role: "client";
  createdAt: string;
};

const CLIENT_USERS_FILEPATH = path.join(process.cwd(), "data", "client-users.json");
const CLIENT_TEMP_PASSWORD_SECRET = process.env.CLIENT_TEMP_PASSWORD_SECRET ?? "replace-this-with-a-secure-random-secret";
const LETTERS = "ABCDEFGHIJ".split("");
const ACCOUNTS_PER_LETTER = 18;

function createSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function hashPassword(password: string, salt?: string) {
  const workSalt = salt ?? createSalt();
  const derived = crypto.scryptSync(password, workSalt, 64);
  return {
    hash: derived.toString("hex"),
    salt: workSalt,
  };
}

export function verifyPassword(password: string, storedHash: string, salt: string) {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
}

export function generateTemporaryPassword(username: string) {
  const digest = crypto
    .createHmac("sha256", CLIENT_TEMP_PASSWORD_SECRET)
    .update(username.toLowerCase())
    .digest("base64url");

  // 16 bytes of base64url output provides at least 96 bits of entropy.
  return `Temp!${digest.slice(0, 16)}`;
}

function createClientUser(username: string, name: string): ClientUser {
  const password = generateTemporaryPassword(username);
  const { hash, salt } = hashPassword(password);
  return {
    id: username,
    username,
    name,
    passwordHash: hash,
    salt,
    firstLogin: true,
    mustChangePassword: true,
    pwd_reset_required: true,
    sessionVersion: 1,
    lastPasswordChange: undefined,
    role: "client",
    createdAt: new Date().toISOString(),
  };
}

function generateDefaultClientUsers(): ClientUser[] {
  return LETTERS.flatMap((letter) =>
    Array.from({ length: ACCOUNTS_PER_LETTER }, (_, index) => {
      const number = index + 1;
      const username = `dfclient${letter}${number}`;
      const name = `DF Client ${letter}${number}`;
      return createClientUser(username, name);
    })
  );
}

async function writeClientUsers(users: ClientUser[]) {
  const dir = path.dirname(CLIENT_USERS_FILEPATH);
  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(CLIENT_USERS_FILEPATH, JSON.stringify(users, null, 2), { encoding: "utf-8" });
}

export async function ensureClientUsersFile(): Promise<ClientUser[]> {
  try {
    await fs.promises.access(CLIENT_USERS_FILEPATH, fs.constants.F_OK);
  } catch {
    const users = generateDefaultClientUsers();
    await writeClientUsers(users);
    return users;
  }
  return loadClientUsers();
}

export async function loadClientUsers(): Promise<ClientUser[]> {
  try {
    const payload = await fs.promises.readFile(CLIENT_USERS_FILEPATH, { encoding: "utf-8" });
    return JSON.parse(payload) as ClientUser[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return ensureClientUsersFile();
    }
    throw error;
  }
}

export async function findClientUserByUsername(username: string): Promise<ClientUser | null> {
  const users = await ensureClientUsersFile();
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export async function updateClientUserPassword(username: string, newPassword: string) {
  const users = await ensureClientUsersFile();
  const index = users.findIndex((user) => user.username.toLowerCase() === username.toLowerCase());
  if (index === -1) {
    throw new Error(`Client user not found: ${username}`);
  }
  const { hash, salt } = hashPassword(newPassword);
  users[index].passwordHash = hash;
  users[index].salt = salt;
  users[index].firstLogin = false;
  users[index].mustChangePassword = false;
  users[index].pwd_reset_required = false;
  users[index].sessionVersion += 1;
  users[index].lastPasswordChange = new Date().toISOString();
  await writeClientUsers(users);
}

export async function getClientUserSessionVersion(username: string): Promise<number | null> {
  const user = await findClientUserByUsername(username);
  return user?.sessionVersion ?? null;
}
