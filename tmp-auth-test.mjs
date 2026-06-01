import fetch from 'node-fetch';
(async () => {
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf', { credentials: 'include' });
  const csrfData = await csrfRes.json();
  console.log('csrf:', csrfData);
  const body = new URLSearchParams({
    csrfToken: csrfData.csrfToken,
    username: 'dfclientA1',
    password: 'Temp!YYvlQN89796YVyF1',
    callbackUrl: '/portal/client/change-password'
  });
  const loginRes = await fetch('http://localhost:3000/api/auth/callback/client-credentials', {
    method: 'POST',
    body,
    redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  console.log('status', loginRes.status);
  console.log('location', loginRes.headers.get('location'));
  console.log('set-cookie', loginRes.headers.raw()['set-cookie']);
})();
