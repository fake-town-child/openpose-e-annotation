import {
  BrowserWindow,
  OpenDialogOptions,
  SaveDialogOptions,
  dialog,
  ipcMain,
} from "electron";
import fs from "fs";
import path from "path";

// 参考
// https://qiita.com/ForestMountain1234/items/2c85b7df6812be1e1f97

/**
 * ハンドリングするAPIを定義するオブジェクト。
 *
 * このオブジェクトをregisterAPIHandlersやcreateAPIInvokerの引数に指定する事で、
 * 自動でipcMain.handle(),ipcRenderer.invoke()の処理を実行させることが出来る。
 *
 * 「export API = typeof apiHandlers」とすることで、contextBridgeで公開されているAPIとその型を参照できる。
 */
export const apiHandlers = (window: BrowserWindow) => ({
  getFileNameWithSaveDialog: async ({
    payload,
  }: {
    payload?: SaveDialogOptions;
  }) => {
    return await dialog.showSaveDialog(window, {
      ...payload,
    });
  },
  getFileNamesWithOpenDialog: async ({
    payload,
  }: {
    payload?: OpenDialogOptions;
  }) => {
    return await dialog.showOpenDialog(window, {
      ...payload,
    });
  },

  getFile: async ({ filePath }: { filePath: string }) => {
    return fs.promises.readFile(filePath);
  },
  saveFile: async ({
    filePath,
    data,
  }: {
    filePath: string;
    data: Buffer | string;
  }) => {
    return fs.promises.writeFile(filePath, data);
  },
  checkFileExists: ({ filePath }: { filePath: string }) => {
    return fs.existsSync(filePath);
  },
  getDirectoryFiles: async ({ directoryPath }: { directoryPath: string }) => {
    return fs.promises
      .readdir(directoryPath, { withFileTypes: true })
      .then((dirents) => {
        const result = dirents
          .filter((dirent) => dirent.isFile())
          .map((dirent) => {
            return path.join(directoryPath, dirent.name);
          });
        return result;
      });
  },
  getBaseName: ({ filePath }: { filePath: string }) => {
    return path.basename(filePath);
  },
});

/** mainプロセスにAPIをハンドリングする。mainプロセス上で呼び出す。*/
export const registerAPIHandlers = (
  apiHandlersObj: Record<string, (...args: any[]) => any>
) => {
  //invoke-apiというイベントを用意する。APIを使う際はまずこのイベントを通り、各種APIにはapiName引数を指定する事でアクセスする。
  ipcMain.handle(
    "invoke-api",
    async (event, apiName: string, ...args: any[]) => {
      // handlers引数にはAPI定義オブジェクト(apiHandlers等)を渡す。「handlers[apiName]」でAPI定義オブジェクトに登録したプロパティ(API)を呼び出す。
      if (apiHandlersObj[apiName]) {
        try {
          return await apiHandlersObj[apiName](...args);
        } catch (error) {
          console.error(`Error in '${apiName}':`, error);
          throw error;
        }
      } else {
        console.error(`API '${apiName}' is not defined.`);
        throw new Error(`API '${apiName}' is not defined.`);
      }
    }
  );
};

/** APIの型定義。renderer.d.tsファイルで参照する。*/
export type API = ReturnType<typeof apiHandlers>;
