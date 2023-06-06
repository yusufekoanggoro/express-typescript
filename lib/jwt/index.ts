import jsonwebtoken, {
  SignOptions,
  VerifyOptions,
  Algorithm
} from 'jsonwebtoken';

import { get as getConf } from '../../config';

interface IBaseJwtOptions {
  issuer?: string;
  subject?: string;
  audience?: string;
}

export interface IJwtSignOptions extends IBaseJwtOptions {
  readonly expiresIn: number;
}

export interface IJwtVerifyOptions extends IBaseJwtOptions {
  clockTolerance?: number;
}

export interface CustomJwtPayload {
  email?: string;
}

export interface IJwtUtil {
  generate(subject: string, payload: CustomJwtPayload): string;
  verify(token: string, clockTolerance: number): any;
}

class JwtUtil implements IJwtUtil {
  private static instance: JwtUtil;

  private readonly signAlgRS256: Algorithm = 'RS256';
  private options: IJwtSignOptions;
  private readonly privateKey: string;
  private readonly publicKey: string;

  private constructor(
    privateKey: string,
    publicKey: string,
    options: IJwtSignOptions
  ) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;

    this.options = options;
  }

  // singleton static method
  public static getInstance(
    privateKey: string,
    publicKey: string,
    options: IJwtSignOptions
  ): JwtUtil {
    return JwtUtil.instance ?? new JwtUtil(privateKey, publicKey, options);
  }

  public generate(subject: string, payload: CustomJwtPayload): string {
    const signOptions: SignOptions = {
      algorithm: this.signAlgRS256,
      issuer: this.options.issuer,
      subject: subject,
      audience: this.options.audience,
      expiresIn: this.options.expiresIn
    };
    return jsonwebtoken.sign(payload, this.privateKey, signOptions);
  }

  public verify(token: string, clockTolerance = 0): any {
    if (clockTolerance === undefined || clockTolerance <= 0) {
      // set tolerance to 5 second
      clockTolerance = 5;
    }

    const options: VerifyOptions = {
      algorithms: [this.signAlgRS256],
      issuer: this.options.issuer,
      subject: this.options.subject,
      audience: this.options.audience,
      clockTolerance: clockTolerance,
      complete: true
    };

    return jsonwebtoken.verify(token, this.publicKey, options);
  }
}

const privateKeyStr = getConf('/jwtPrivateKey');
const publicKeyStr = getConf('/jwtPublicKey');

const jwtSignOptions: IJwtSignOptions = {
  expiresIn: getConf('/accessTokenExpired'),
  issuer: getConf('/jwtIssuer'),
  audience: getConf('/jwtAudience'),
  subject: undefined
};

export default JwtUtil.getInstance(privateKeyStr, publicKeyStr, jwtSignOptions);
