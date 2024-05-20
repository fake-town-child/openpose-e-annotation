import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  OpenDialogOptions,
  SaveDialogOptions,
} from "electron";
import fs from "fs";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

const addIpcListner = (): void => {
  ipcMain.on(
    "save-file-dialog",
    async (
      event,
      data: string | Buffer,
      token: string,
      payload?: SaveDialogOptions
    ) => {
      if (!mainWindow) {
        event.reply("save-file-dialog", token, "No main window found");
        return;
      }

      console.log("save file dialog", payload);

      const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        ...payload,
      });

      if (!canceled && filePath) {
        fs.writeFile(filePath, data, (err) => {
          if (err) {
            event.reply("save-file-reply", token, err);
          } else {
            event.reply("save-file-reply", token, "File saved successfully");
          }
        });
      } else {
        event.reply("save-file-reply", "File not saved");
      }
    }
  );

  ipcMain.on(
    "open-file-dialog",
    async (event, token, payload?: OpenDialogOptions) => {
      if (!mainWindow) {
        event.reply("open-file-reply", token, {
          isSuccess: false,
          message: "No main window",
        });
        return;
      }

      console.log("open-file-dialog");

      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        ...payload,
      });

      if (!canceled && filePaths.length > 0) {
        const filePath = filePaths[0];
        fs.readFile(filePath, (err, data) => {
          if (err) {
            event.reply("open-file-reply", token, {
              isSuccess: false,
              message: err.message,
            });
          } else {
            event.reply("open-file-reply", token, {
              isSuccess: true,
              data,
            });
          }
        });
      } else {
        event.reply("open-file-reply", {
          isSuccess: false,
          message: "File not opened",
        });
      }
    }
  );
};

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  addIpcListner();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
