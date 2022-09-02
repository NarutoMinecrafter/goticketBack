export interface Env {
  PORT: string
  PG_URL: string
  REDIS_URL: string
  JWT_SECRET: string
  TWILLO_ACCOUNT_SID: string
  TWILLO_AUTH_TOKEN: string
  TWILLO_PHONE: string
  APIART_ZCREDIT_TERMINAL_NUMBER: string
  APIART_ZCREDIT_PASSWORD: string
}

export declare global {
  namespace NodeJS {
    type ProcessEnv = Env
  }
}
