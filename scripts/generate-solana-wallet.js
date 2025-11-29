// Script to generate a Solana wallet for NFT minting
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

const keypair = Keypair.generate();

// bs58 v5+ uses default export differently
const encode = bs58.default?.encode || bs58.encode;
const privateKeyBase58 = Buffer.from(keypair.secretKey).toString('base64');

// Convert to base58 manually if needed
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function toBase58(buffer) {
  const bytes = [...buffer];
  const digits = [0];
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let str = '';
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) str += '1';
  for (let i = digits.length - 1; i >= 0; i--) str += ALPHABET[digits[i]];
  return str;
}

const base58Key = toBase58(keypair.secretKey);

console.log('\n🔐 NEW SOLANA WALLET GENERATED\n');
console.log('================================');
console.log('Public Key (Wallet Address):');
console.log(keypair.publicKey.toBase58());
console.log('\nPrivate Key (Base58) - ADD THIS TO .env:');
console.log(base58Key);
console.log('================================\n');

console.log('📝 Next Steps:');
console.log('1. Copy the Private Key above');
console.log('2. Paste it in .env as SOLANA_AUTHORITY_PRIVATE_KEY="..."');
console.log('3. Fund the wallet with devnet SOL:');
console.log(`   https://faucet.solana.com/?address=${keypair.publicKey.toBase58()}`);
console.log('\n⚠️  IMPORTANT: Never share your private key!\n');
