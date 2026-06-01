const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CLIENT_TEMP_PASSWORD_SECRET = process.env.CLIENT_TEMP_PASSWORD_SECRET || 'replace-this-with-a-secure-random-secret';
const LETTERS = 'ABCDEFGHIJ'.split('');
const ACCOUNTS_PER_LETTER = 18;

function hashPassword(password, salt) {
  const derived = crypto.scryptSync(password, salt, 64);
  return derived.toString('hex');
}

function generateTemporaryPassword(username) {
  const digest = crypto
    .createHmac('sha256', CLIENT_TEMP_PASSWORD_SECRET)
    .update(username.toLowerCase())
    .digest('base64url');
  return `Temp!${digest.slice(0, 16)}`;
}

function createClientUser(username, name) {
  const password = generateTemporaryPassword(username);
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  return {
    id: username,
    username,
    name,
    passwordHash,
    salt,
    firstLogin: true,
    mustChangePassword: true,
    pwd_reset_required: true,
    sessionVersion: 1,
    lastPasswordChange: null,
    role: 'client',
    createdAt: new Date().toISOString(),
    tempPassword: password,
  };
}

const seededUsers = LETTERS.flatMap((letter) =>
  Array.from({ length: ACCOUNTS_PER_LETTER }, (_, index) => {
    const number = index + 1;
    const username = `dfclient${letter}${number}`;
    const name = `DF Client ${letter}${number}`;
    return createClientUser(username, name);
  })
);

const outputDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, 'client-users.json');
const outputUsers = seededUsers.map(({ tempPassword, ...rest }) => rest);
fs.writeFileSync(outputPath, JSON.stringify(outputUsers, null, 2), 'utf-8');

console.log(`Wrote ${outputUsers.length} client users to ${outputPath}`);
console.log('First 5 temporary credentials:');
seededUsers.slice(0, 5).forEach((user) => {
  console.log(`${user.username} -> ${user.tempPassword}`);
});
