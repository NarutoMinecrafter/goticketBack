export interface Env {
  PORT: string
  PG_URL: string
  REDIS_URL: string
  TOTP_SECRET: string
  JWT_SECRET: string
  TWILLO_ACCOUNT_SID: string
  TWILLO_AUTH_TOKEN: string
  TWILLO_PHONE: string
}

export declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
