export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      GITHUB_URI_CALLBACK: string;
      SESSION_SECRET: string;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}