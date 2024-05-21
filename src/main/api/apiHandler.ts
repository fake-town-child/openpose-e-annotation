import {
  BrowserWindow,
  OpenDialogOptions,
  SaveDialogOptions,
  dialog,
  ipcMain,
  ipcRenderer,
} from "electron";
import fs from "fs";

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
    const { canceled, filePath } = await dialog.showSaveDialog(window, {
      ...payload,
    });
    if (canceled) {
      throw new Error("File save dialog was canceled.");
    }
    return filePath;
  },
  getFileNamesWithOpenDialog: async ({
    payload,
  }: {
    payload?: OpenDialogOptions;
  }) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(window, {
      ...payload,
    });
    if (canceled) {
      throw new Error("File open dialog was canceled.");
    }
    return filePaths;
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

/** rendererプロセスでAPIを呼び出すためのオブジェクトを生成する。preloadファイルで呼び出し、rendererプロセスに作成したオブジェクトを公開する。*/
export const createAPIInvoker = (
  apiHandlersObj: (...args: any[]) => Record<string, (...args: any[]) => any>
) => {
  const apiRenderer: Record<string, (...args: any[]) => Promise<any>> = {};

  //API定義オブジェクト(apiHandlerObj)のプロパティを、１つずつipcMainの「invoke-api」イベントと接続する。
  console.log(apiHandlersObj());
  for (const apiName in apiHandlersObj()) {
    apiRenderer[apiName] = async (...args: any[]) => {
      return await ipcRenderer.invoke("invoke-api", apiName, ...args); //プロパティ名をapiName引数として渡し、各種APIにアクセスできるようにする。
    };
  }

  return apiRenderer; //for文で生成された、APIアクセス用のオブジェクトを返す
};

/** APIの型定義。renderer.d.tsファイルで参照する。*/
export type API = ReturnType<typeof apiHandlers>;
