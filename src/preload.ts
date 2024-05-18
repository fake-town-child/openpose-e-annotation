import { SaveDialogOptions, contextBridge, ipcRenderer } from "electron";
import { OpenFile } from "./types";

contextBridge.exposeInMainWorld("electronAPI", {
  saveFile: (data: string | Buffer, payload?: SaveDialogOptions) =>
    ipcRenderer.send("save-file-dialog", data, payload),
  onSaveFileReply: (
    callback: (event: Electron.IpcRendererEvent, message: string) => void
  ) => ipcRenderer.on("save-file-reply", callback),
  openFile: (payload?: SaveDialogOptions) =>
    ipcRenderer.send("open-file-dialog", payload),
  onOpenFileReply: (
    callback: (event: Electron.IpcRendererEvent, result: OpenFile) => void
  ) => ipcRenderer.on("open-file-reply", callback),
});

declare global {
  interface Window {
    electronAPI: IMainProcess;
  }
}

export interface IMainProcess {
  saveFile: (data: string | Buffer, payload?: SaveDialogOptions) => void;
  onSaveFileReply: (
    callback: (event: Electron.IpcRendererEvent, message: string) => void
  ) => void;
  openFile: (payload?: SaveDialogOptions) => void;
  onOpenFileReply: (
    callback: (event: Electron.IpcRendererEvent, result: OpenFile) => void
  ) => void;
}
