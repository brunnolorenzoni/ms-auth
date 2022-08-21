export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      GITHUB_CLIENT_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_URI_CALLBACK: string;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}