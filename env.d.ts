export interface Env {
  PORT: string
}

export declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
