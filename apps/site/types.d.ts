declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      GITHUB_AUTH_CLIENT_ID: string;
      GITHUB_AUTH_SECRET: string;
    }
  }
}

export {};
