import { SaveDialogOptions, contextBridge, ipcRenderer } from "electron";
import { OpenFile } from "./types";

contextBridge.exposeInMainWorld("electronAPI", {
  saveFile: (
    data: string | Buffer,
    token: string,
    payload?: SaveDialogOptions
  ) => ipcRenderer.send("save-file-dialog", data, token, payload),
  onSaveFileReply: (
    callback: (event: Electron.IpcRendererEvent, message: string) => void
  ) => ipcRenderer.on("save-file-reply", callback),
  openFile: (token: string, payload?: SaveDialogOptions) =>
    ipcRenderer.send("open-file-dialog", token, payload),
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
  saveFile: (
    data: string | Buffer,
    token: string,
    payload?: SaveDialogOptions
  ) => void;
  onSaveFileReply: (
    callback: (
      event: Electron.IpcRendererEvent,
      token: string,
      message: string
    ) => void
  ) => void;
  openFile: (token: string, payload?: SaveDialogOptions) => void;
  onOpenFileReply: (
    callback: (
      event: Electron.IpcRendererEvent,
      token: string,
      result: OpenFile
    ) => void
  ) => void;
}
