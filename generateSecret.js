const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(64).toString('hex');
}

const secret = generateSecret();
console.log('Your JWT Secret:', secret);
