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
  {
    version: "1.0.3",
    description: `
    Fix bugs
    - fix when load savefile secondtime, the annotation layer cannot be saved.
    `.trim(),
  },
  {
    version: "1.0.4",
    description: `
    Fix bugs
    - unvisible target is saved in annotation layer image
    `.trim(),
  },
  {
    version: "1.0.5",
    description: `
    UI changes
    - set canvas to center
    - keep directory state on change mode
    `.trim(),
  },
];

export const currentVersion = versionHistory[versionHistory.length - 1].version;
