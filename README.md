# Clover Support Landing (Preview)

> 日本語のみ記載しています。最小限のプレビュー環境用メモです。

## 概要

Minecraftサーバーのサポーター向けランディングページ（React製）のプレビュー環境をViteで構築しました。  
`src/App.jsx` がメイン実装ファイルです（旧 `temp.js` から移設済み）。

## 動かし方（ローカルプレビュー）

前提: Node.js 18以上（開発マシンでは v25.2.1 で確認）。

```bash
npm install
npm run dev   # http://localhost:5173 でプレビュー
npm run build # プロダクションビルド
```

TailwindはCDNロードで動作するため、追加のセットアップは不要です。

## 技術スタック
- Vite + React 18
- framer-motion / lucide-react
- Tailwind CDN（ビルドレスのユーティリティ適用）

## ライセンス

このリポジトリは [MITライセンス](LICENSE.txt) の下でライセンスされています。
