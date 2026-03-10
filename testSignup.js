import http from 'node:http';

const data = JSON.stringify({
  fullName: 'Test User',
  email: 'error500@example.com',
  phone: '123',
  dob: '2000-01-01',
  accountType: 'assessment',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => (body += chunk));
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log('body', body);
  });
});

req.on('error', err => {
  console.error('request error', err);
});
req.write(data);
req.end();
