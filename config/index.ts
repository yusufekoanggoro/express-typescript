import dotenv from 'dotenv';
import confidence from 'confidence';

dotenv.config();

const config: any = {
  httpPort: Number(process.env.HTTP_PORT),
  basePath: process.env.BASE_PATH,
  mongoDbConfig: {
    url: process.env.MONGO_DATABASE_URL,
    dbName: process.env.MONGO_DATABASE_NAME,
    maxPoolSize: Number(process.env.MONGO_DATABASE_MAX_POOL_SIZE),
    keepAlive: process.env.MONGO_DATABASE_KEEP_ALIVE,
    socketTimeoutMS: Number(process.env.MONGO_DATABASE_SOCKET_TIMEOUT_MS),
    connectTimeoutMS: Number(process.env.MONGO_DATABASE_CONNECT_TIMEOUT_MS)
  },
  accessTokenExpired: Number(process.env.ACCESS_TOKEN_EXPIRED),
  refreshTokenExpired: Number(process.env.REFRESH_TOKEN_EXPIRED),
  jwtIssuer: process.env.JWT_ISSUER,
  jwtAudience: process.env.JWT_AUDIENCE,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  jwtPublicKey: process.env.JWT_PUBLIC_KEY,
  passwordConfig: {
    alg: process.env.PASSWORD_HASH_ALG,
    keyLen: Number(process.env.PASSWORD_HASH_KEY_LEN),
    saltLen: Number(process.env.PASSWORD_HASH_SALT_LEN),
    iterations: Number(process.env.PASSWORD_HASH_ITERATIONS)
  }
};

let store!: confidence.Store;

store ??= new confidence.Store(config);

export function get(key: string): any {
  return store.get(key);
}
