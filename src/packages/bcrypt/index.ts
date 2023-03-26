import bcrypt from "bcrypt";

const SALT = 10;
const GEN_SALT = bcrypt.genSaltSync(SALT);

function encrypt(password: string) {
  return bcrypt.hash(password, GEN_SALT);
}

function compare(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export { encrypt, compare };
