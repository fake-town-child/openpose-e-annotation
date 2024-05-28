import { AppVersionHistory } from "./types";

export const versionHistory: AppVersionHistory = [
  {
    version: "1.0.0",
    description: "Initial release",
  },
  {
    version: "1.0.1",
    description: "Fix some bugs",
  },
  {
    version: "1.0.2",
    description: `
    Fix bugs
    - enable to load multi-bite path
    - and some
    Add features
    - use relative path on load in directory mode
    - add reset annotation(small) button
    - add version history
    `.trim(),
  },
];

export const currentVersion = versionHistory[versionHistory.length - 1].version;
