/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_JWT_LOCAL_STORAGE_KEY?: string;
  }
}
