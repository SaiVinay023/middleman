import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.middleman.app',
  appName: 'Middleman',
  webDir: 'out', // Must match the Next.js output directory
  server: {
    androidScheme: 'https'
  }
};

export default config;
