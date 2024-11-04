declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ARGON_PASS: string;
      JWT_PASS: string;
      POSTGRES_DB: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_USER: string;
      POSTGRES_PORT: number;
    }
  }
}

export {};
