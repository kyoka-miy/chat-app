# チャットアプリ（Next.js + TypeScript + Tailwind CSS）

このプロジェクトは、Next.js（App Router）、TypeScript、Tailwind CSS を用いた簡易的なリアルタイムチャットアプリのフロントエンドです。

## 主な機能

- サイドバーでチャットルーム選択
- メッセージ送信・表示
- ユーザー名入力・表示

## 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いて動作を確認できます。

## ディレクトリ構成

- `src/components/` ... UI コンポーネント
- `src/app/` ... ルーティング・ページ

## 注意

- このアプリはフロントエンドのみです。リアルタイム通信は未実装です。
