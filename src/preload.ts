import { SaveDialogOptions, contextBridge, ipcRenderer } from "electron";
import { OpenFile } from "./types";
import { API, apiHandlers, createAPIInvoker } from "./main/api/apiHandler";

const APIRenderer = createAPIInvoker(apiHandlers);
contextBridge.exposeInMainWorld("electronAPI", APIRenderer);

// contextBridge.exposeInMainWorld("electronAPI", {
//   saveFile: (
//     data: string | Buffer,
//     payload?: SaveDialogOptions
//   ) => ipcRenderer.invoke("save-file-dialog", data,  payload),
//   onSaveFileReply: (
//     callback: (event: Electron.IpcRendererEvent, message: string) => void
//   ) => ipcRenderer.on("save-file-reply", callback),
//   openFile: ( payload?: SaveDialogOptions) =>
//     ipcRenderer.invoke("open-file-dialog",  payload),
//   onOpenFileReply: (
//     callback: (event: Electron.IpcRendererEvent, result: OpenFile) => void
//   ) => ipcRenderer.on("open-file-reply", callback),
// });

declare global {
  interface Window {
    electronAPI: API;
  }
}

// export interface IMainProcess {
//   saveFile: (
//     data: string | Buffer,
//     payload?: SaveDialogOptions
//   ) => void;
//   onSaveFileReply: (
//     callback: (
//       event: Electron.IpcRendererEvent,
//       token: string,
//       message: string
//     ) => void
//   ) => void;
//   openFile: (token: string, payload?: SaveDialogOptions) => void;
//   onOpenFileReply: (
//     callback: (
//       event: Electron.IpcRendererEvent,
//       token: string,
//       result: OpenFile
//     ) => void
//   ) => void;
// }
