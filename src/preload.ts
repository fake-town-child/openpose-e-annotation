import { contextBridge, ipcRenderer } from "electron";
import { API } from "./main/api/apiHandler";

// APIの名前を列挙
const apiHandlersName = [
  "getFileNameWithSaveDialog",
  "getFileNamesWithOpenDialog",
  "getFile",
  "saveFile",
] as const;

/** rendererプロセスでAPIを呼び出すためのオブジェクトを生成する。preloadファイルで呼び出し、rendererプロセスに作成したオブジェクトを公開する。*/
const createAPIInvoker = (
  // apiHandlersObj: Record<string, (...args: any[]) => any>
  apiHandlerName: readonly string[]
) => {
  const apiRenderer: Record<string, (...args: any[]) => Promise<any>> = {};

  //API定義オブジェクト(apiHandlerObj)のプロパティを、１つずつipcMainの「invoke-api」イベントと接続する。
  apiHandlerName.forEach((apiName) => {
    apiRenderer[apiName] = async (...args: any[]) => {
      return await ipcRenderer.invoke("invoke-api", apiName, ...args); //プロパティ名をapiName引数として渡し、各種APIにアクセスできるようにする。
    };
  });

  return apiRenderer; //for文で生成された、APIアクセス用のオブジェクトを返す
};

const APIRenderer = createAPIInvoker(apiHandlersName);
contextBridge.exposeInMainWorld("electronAPI", APIRenderer);

declare global {
  interface Window {
    electronAPI: API;
  }
}
