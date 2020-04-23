/**
 * Import environment variables
 */
import 'dotenv/config';
const ROUNDS: number = parseInt(process.env.ENCRYPT_ROUNDS as string);
const SECRET: string = process.env.ENCRYPT_SECRET as string;
const CODE: string = process.env.ENCRYPT_CODE as string;
const KEY: string = process.env.ENCRYPT_KEY as string;

/**
 * Import bcrypt methods
 */
import { hash as hashString } from 'bcryptjs';
import { compare as compareStrings } from 'bcryptjs';
import { genSalt } from 'bcryptjs';

/**
 * Import crypto-js methods
 */
import use_sha256 from 'crypto-js/sha256';
import use_hmacSHA512 from 'crypto-js/hmac-sha512';
import use_AES from 'crypto-js/aes';
import enc_Base64 from 'crypto-js/enc-base64';
import enc_Utf8 from 'crypto-js/enc-utf8';
import enc_Hex from 'crypto-js/enc-hex';

/**
 * Encrpts a received value
 * @param message value to encrypt
 * @param inmutable true in the need of a uniqued identfier
 * @returns a hashed value
 */
export async function encrypt(message: string, inmutable: boolean = false) {
  try {
    // GENERATE SALT
    const generated_salt = await genSalt(ROUNDS);
    // GENERATE SHA256 WORD ARRAY
    const message_sha256 = await use_sha256(SECRET + message);
    // ENCODE SHA256 TO BASE64 STRING
    const message_base64 = await enc_Base64.stringify(use_hmacSHA512(message_sha256, CODE));
    // HASH THE STRING
    const message_hashed = await hashString(message_base64, generated_salt);
    // ENCRYPT THE STRING
    const message_AES = await use_AES.encrypt(message_hashed, KEY);

    // Useful for IDs or things we need a unique identifier for.
    if (inmutable) {
      return (message = message_AES.ciphertext.toString(enc_Hex).replace(/\w\d/g, ''));
    }
    return (message = message_AES.toString());
  } catch (error) {
    console.log(error);
  }
}

/**
 * Checks if the comparison of two values is true or false
 * @param message valued to be compared
 * @param stored_message value to compare to
 * @returns true or false
 */
export async function compare(message: string, stored_message: string) {
  try {
    // GENERATE SHA256 WORD ARRAY
    // ENCODE SHA256 TO BASE64 STRING
    // THIS IS THE MESSAGE
    const messsage_sha256 = await use_sha256(SECRET + message);
    const message_string = await enc_Base64.stringify(use_hmacSHA512(messsage_sha256, CODE));

    // DECRYPT STORED_MESSAGE
    // ENCODE DECRYPTED STORED_MESSAGE TO UTF8
    const stored_message_decrypted = await use_AES.decrypt(stored_message, KEY);
    const stored_message_string = await stored_message_decrypted.toString(enc_Utf8);

    // COMPARE NEW ORDER WITH LAST ORDER
    return await compareStrings(message_string, stored_message_string);
  } catch (error) {
    return false;
  }
}
