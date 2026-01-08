---
title: JoinLanding Scroll/Load Animations
status: proposed
draft_status: n/a
created_at: 2026-01-08
updated_at: 2026-01-08
references:
  - ../../../standards/documentation_guidelines.md
  - ../../../standards/documentation_operations.md
related_issues: []
related_prs: []
---

## Overview
JoinLandingに、Membershipで使われている読み込み・スクロール連動のアニメーションを適用し、LPの体験を統一する。主にセクション単位でのフェード/スライド・スタッガーを導入し、ヒーロー/CTAなど主要パーツの印象を強化する。

## Scope
- `src/pages/JoinLanding.jsx` に Framer Motion を導入
- 読み込み時のヒーロー要素（テキスト、ボタン、写真フレーム）のアニメーション適用
- スクロールで可視化されるセクション（Memories/Stories/Features/CTA）のフェード/スライド適用
- パフォーマンス配慮として `viewport` / `once` / `amount` を設定

## Non-Goals
- レイアウトやコピーの変更
- 画像アセットの差し替え
- 既存CSSアニメーションの削除・置換（必要最小限の共存に留める）

## Requirements
- **Functional**:
  - JoinLanding内の主要セクションが、スクロール/読み込みに応じてアニメーションする
  - Membershipと同等の体感（フェード/スライド/スタッガー中心）になる
- **Non-Functional**:
  - 既存のCSSアニメーション（float/blob等）と干渉しない
  - レンダリング/スクロールの体感性能が悪化しない

## Tasks
- `JoinLanding.jsx` に `motion` / `AnimatePresence` / `useReducedMotion` の導入要否を確認
- ヒーローの見出し・説明・CTA・フォトフレームに読み込みアニメーションを付与
- 各セクションのコンテナに `whileInView` + `viewport` 設定を付与
- 繰り返しアニメーションの定義を共通化し、同ファイル内に配置
- 運用面のドキュメント更新要否を確認

## Test Plan
- JoinLandingの各セクションで、スクロール時にアニメーションが1回だけ発火することを確認
- モバイル/デスクトップでレイアウト崩れやカクつきがないことを確認
- `prefers-reduced-motion` が有効な環境で過剰な動きが抑制されることを確認

## Deployment / Rollout
- 既存UIとの差分が視覚的に大きくならないよう、段階的に確認しながら反映
