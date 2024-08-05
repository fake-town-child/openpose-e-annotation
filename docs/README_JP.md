# openpose-e-annotation

![Screenshot](/docs/figs/screenshot.png)

[Wing-openpose](https://huggingface.co/claraDolls/Wing_Openpose)用のアノテーションアプリケーション  
English README is [here](/README.md).

## ダウンロード

[リリースページ](https://github.com/fake-town-child/openpose-e-annotation/releases/tag/1.0.4) から "openpose-e-annotation-win32-x64.zip"をダウンロードしてください。

## "Wing-openpose"とは ?

Wing-openpos は Stable Diffusion XL 用の control net です。羽の生えたキャラクターイラストを生成する際に役立ちます。詳細な説明やモデルの入手は [hugging face](https://huggingface.co/claraDolls/Wing_Openpose)をご覧ください。

## 使い方

`openpose-e-annotation.exe`を起動。

### アノテーション画像の作成（生成用）

1. マーカーをドラッグしてポーズを作ってください。
2. 右クリックすることでマーカを非表示に出来ます。
3. `Save Annotation Image` をクリックするとアノテーション画像を保存できます。

### リファレンス画像を使ったアノテーション画像の作成（学習用）

1. リファレンス画像のパスを`Load Image File`に入力してください（あるいは、 `Open File` をクリックすることでダイアログからファイルを選択できます）。
2. アノテーションが編集できます。

### Save / Load annotation for re-edit

1. `Save savefile` から現在のアノテーションファイルのセーブデータを保存できます （アノテーションデータや画像の情報などが含まれています）。
2. `Load Save File` から既存のセーブデータを読み込むことで、過去に作成したアノテーションファイルを再編集できます。

Note: 一度 `Save savefile` でセーブデータを保存した後は、Quick save を押すことでセーブデータの上書き保存が可能です。

### モード

本アプリには「Single Image Mode」と「Directory Mode」の２つのモードがあります。ただし、Directory mode にはバグがたくさんありますので、現時点での利用は **非推奨** です。

## アノテーション定義

![definition of annotation](/docs/figs/annotation-jp.jpg)

## LICENSE

MIT License.  
どんどんフォークして改造してください。
