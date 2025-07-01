# 開発計画

## 1. プロジェクト初期設定

- Viteを用いて、React+TypeScriptのプロジェクトを作成する (`npm create vite@latest the-night-is-still-young -- --template react-ts`)
- 必要なライブラリをインストールする
  - `npm install @mui/material @emotion/react @emotion/styled`
  - `npm install dayjs`
  - `npm install react-router-dom`
- ESLint, Prettierをセットアップし、`package.json`に`lint`, `format`スクリプトを定義する
- Vitestをセットアップし、`package.json`に`test`スクリプトを定義する

## 2. UIコンポーネント実装

`spec.md`の画面レイアウトに基づき、MUIを利用して以下のコンポーネントを実装する。

- **Header**: アプリケーションのタイトルを表示する
- **ConfigSection**: 時刻の入力モード（現在時刻/手動入力）と日付フォーマットを設定する
- **TimezoneList**: タイムゾーンごとの時刻を表示するリスト
- **TimezoneListItem**: 国名選択、時刻表示、削除ボタンを持つリスト項目
- **AddButton**: 新しいタイムゾーンを追加するボタン

## 3. 状態管理とロジック実装

- Reactの`useState`, `useContext`を用いてアプリケーションの状態を管理する
- `dayjs`を用いて時刻計算とフォーマット処理を実装する
- `react-router-dom`を用いて、クエリパラメータとアプリケーションの状態を同期させる

## 4. テスト

- VitestとReact Testing Libraryを用いて、各コンポーネントのユニットテストと結合テストを作成する
- 特に、時刻計算ロジックや状態変更が正しく行われることを確認する

## 5. ローカルでの実行

- `npm run dev`コマンドで開発サーバーを起動し、ブラウザでアプリケーションを確認する
