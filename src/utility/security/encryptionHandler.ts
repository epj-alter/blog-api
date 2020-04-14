import * as bcrypt from 'bcryptjs';
import 'dotenv/config';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

const ENCRYPT_ROUNDS: number = parseInt(process.env.ENCRYPT_ROUNDS as string);
const ENCRYPT_SALT: string = process.env.ENCRYPT_SALT as string;
const ENCRYPT_PEPPER: string = process.env.ENCRYPT_PEPPER as string;

/**
 * Encrpts a received value
 * @param keyValue value to encrypt
 * @returns a hashed value using
 */
export async function encrypt(keyValue: string) {
  try {
    const dish = await bcrypt.genSalt(ENCRYPT_ROUNDS);
    const hashDigest = sha256(ENCRYPT_SALT + keyValue);
    const hmacDigest = Base64.stringify(hmacSHA512(hashDigest, ENCRYPT_PEPPER));
    const hashedValue = await bcrypt.hash(hmacDigest, dish);

    return (keyValue = hashedValue);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Checks if the comparison of two values is true or false
 * @param valueBeingCompared valued to be compared
 * @param valueToCompareTo value to compare to
 * @returns true or false
 */
export async function compare(valueBeingCompared: string, valueToCompareTo: string) {
  try {
    const hashDigest = sha256(ENCRYPT_SALT + valueBeingCompared);
    const hmacDigest = Base64.stringify(hmacSHA512(hashDigest, ENCRYPT_PEPPER));
    return await bcrypt.compare(hmacDigest, valueToCompareTo);
  } catch (error) {
    return false;
  }
}
