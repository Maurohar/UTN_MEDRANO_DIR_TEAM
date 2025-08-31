/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CONTRACT_ADDRESS: string;
  // otras variables públicas que tengas
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
