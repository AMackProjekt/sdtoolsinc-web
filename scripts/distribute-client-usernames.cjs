const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CLIENT_TEMP_PASSWORD_SECRET = process.env.CLIENT_TEMP_PASSWORD_SECRET || 'replace-this-with-a-secure-random-secret';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@sdtoolsinc.org';
const PORTAL_URL = process.env.PORTAL_URL || 'https://portal.sdtoolsinc.com';

const CLIENT_USERS_FILEPATH = path.join(__dirname, '..', 'data', 'client-users.json');
const LETTERS = 'ABCDEFGHIJ'.split('');
const ACCOUNTS_PER_LETTER = 18;

function generateTemporaryPassword(username) {
  const digest = crypto
    .createHmac('sha256', CLIENT_TEMP_PASSWORD_SECRET)
    .update(username.toLowerCase())
    .digest('base64url');
  return `Temp!${digest.slice(0, 16)}`;
}

function loadClientUsers() {
  try {
    const payload = fs.readFileSync(CLIENT_USERS_FILEPATH, { encoding: 'utf-8' });
    const rawUsers = JSON.parse(payload);
    if (!Array.isArray(rawUsers) || rawUsers.length === 0) {
      return null;
    }
    return rawUsers.map((user) => ({
      username: user.username,
      name: user.name || user.username,
      email: user.email || clientEmailFromUsername(user.username),
      tempPassword: generateTemporaryPassword(user.username),
    }));
  } catch (error) {
    return null;
  }
}

function clientEmailFromUsername(username) {
  return `${username}@clients.sdtoolsinc.org`;
}

function createMailOptions(user) {
  return {
    to: user.email,
    subject: 'Your SD Tools Inc. Portal Identity',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
        <h2 style="color: #0d9488;">Welcome to the Secure Portal</h2>
        <p>Your username is: <strong>${user.username}</strong></p>
        <p>Your temporary password has been sent via your registered mobile device.</p>
        <p>Use the portal link below to sign in and complete your first login.</p>
        <p style="margin: 18px 0;">
          <a href="${PORTAL_URL}" style="display: inline-block; padding: 12px 18px; border-radius: 10px; background: #0f172a; color: #ffffff; text-decoration: none;">Access Portal Here</a>
        </p>
        <p style="font-size: 13px; color: #64748b;">
          Security Note: You will be required to change your password immediately upon entry.
        </p>
      </div>
    `,
  };
}

function createClientUsers() {
  return LETTERS.flatMap((letter) =>
    Array.from({ length: ACCOUNTS_PER_LETTER }, (_, index) => {
      const sequence = index + 1;
      const username = `dfclient${letter}${sequence}`;
      return {
        username,
        name: `DF Client ${letter}${sequence}`,
        email: clientEmailFromUsername(username),
        tempPassword: generateTemporaryPassword(username),
      };
    })
  );
}

async function sendMail(mailOptions) {
  if (!RESEND_API_KEY) {
    console.log('[distribute-client-usernames] RESEND_API_KEY not configured, skipping actual send.');
    return null;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error ${response.status}: ${text}`);
  }

  return response.json();
}

async function main() {
  const existingUsers = loadClientUsers();
  const users = existingUsers ?? createClientUsers();
  const source = existingUsers ? 'data/client-users.json' : 'generated list';

  console.log(`Preparing ${users.length} username notifications from ${source}.`);

  for (const user of users) {
    const mailOptions = createMailOptions(user);

    console.log('---');
    console.log(`To: ${user.email}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(mailOptions.html.replace(/\s+/g, ' ').trim());

    if (RESEND_API_KEY) {
      try {
        await sendMail(mailOptions);
        console.log(`Sent email to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error.message || error);
      }
    } else {
      console.log('Email not sent: RESEND_API_KEY not configured.');
    }
  }

  console.log('\nFinished distributing usernames. Temporary passwords should be delivered via SMS separately.');
}

main().catch((error) => {
  console.error('[distribute-client-usernames] Unexpected error:', error);
  process.exit(1);
});
