import { pbkdf2Sync, randomBytes } from 'crypto';
import { Buffer } from 'buffer';
import { get as getConf } from '../../config';

export interface IPbkdf2Config {
  digest: string;
  keyLen: number;
  saltLen: number;
  iterations: number;
}

class Pbkdf2 {
  private static instance: Pbkdf2;

  private static DEFAULT_ALG = 'sha256';
  private static DEFAULT_SALT_LEN = 64;
  private static DEFAULT_KEY_LEN = 64;
  private static DEFAULT_KEY_ITERATIONS = 15000;

  private config: IPbkdf2Config;

  private constructor(config: IPbkdf2Config) {
    this.config = config;

    if (this.config.digest === undefined || this.config.digest === '') {
      this.config.digest = Pbkdf2.DEFAULT_ALG;
    }

    if (this.config.saltLen === undefined || this.config.saltLen <= 0) {
      this.config.saltLen = Pbkdf2.DEFAULT_SALT_LEN;
    }

    if (this.config.iterations === undefined || this.config.iterations <= 0) {
      this.config.iterations = Pbkdf2.DEFAULT_KEY_ITERATIONS;
    }

    if (this.config.keyLen === undefined || this.config.keyLen <= 0) {
      this.config.keyLen = Pbkdf2.DEFAULT_KEY_LEN;
    }
  }

  // singleton static method
  public static getInstance(config: IPbkdf2Config): Pbkdf2 {
    return Pbkdf2.instance ?? new Pbkdf2(config);
  }

  public hash(plainPassword: string): string {
    const rb = randomBytes(this.config.saltLen);

    const saltBase64 = Buffer.from(rb).toString('base64');
    const bufferHashResult = pbkdf2Sync(
      Buffer.from(plainPassword, 'utf8'),
      Buffer.from(saltBase64, 'utf8'),
      this.config.iterations,
      this.config.keyLen,
      this.config.digest
    );

    return `${this.config.iterations}:${
      this.config.keyLen
    }:${bufferHashResult.toString('base64')}:${saltBase64}`;
  }

  public verify(plainPassword: string, hashedPassword: string): boolean {
    const hashedPasswordSplited = hashedPassword.split(':');
    if (hashedPasswordSplited.length != 4) return false;

    const iterations = Number(hashedPasswordSplited[0]);
    const keyLen = Number(hashedPasswordSplited[1]);
    const hBase64 = hashedPasswordSplited[2];
    const saltBase64 = hashedPasswordSplited[3];

    const hBuffer = Buffer.from(hBase64, 'base64');

    const bufferHashResult = pbkdf2Sync(
      Buffer.from(plainPassword, 'utf8'),
      Buffer.from(saltBase64, 'utf8'),
      iterations,
      keyLen,
      this.config.digest
    );

    return this.bitEqual(hBuffer, bufferHashResult);
  }

  private bitEqual(x: Buffer, y: Buffer): boolean {
    let diff = x.length ^ y.length;
    for (let i = 0; i < x.length && i < y.length; i++) {
      diff |= x[i] ^ y[i];
    }

    return diff === 0;
  }
}

const config: IPbkdf2Config = {
  digest: getConf('/passwordConfig').alg,
  keyLen: getConf('/passwordConfig').keyLen,
  saltLen: getConf('/passwordConfig').saltLen,
  iterations: getConf('/passwordConfig').iterations
};

export default Pbkdf2.getInstance(config);
