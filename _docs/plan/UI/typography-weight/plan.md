---
title: Typography Weight Balance Across Pages
status: proposed
draft_status: n/a
created_at: 2026-01-08
updated_at: 2026-01-08
references:
  - ../../guide/design/design_tokens.md
related_issues: []
related_prs: []
---

## Overview
全ページでRegular寄りの表示が多く、視認性と情報階層が弱い問題を解消する。Design TokensのTypography基準に沿って、本文はRegular、UIラベルや強調はSemi Bold、見出しはBold以上に整理する。

## Scope
- Tailwind/グローバルCSS/個別コンポーネントのfont-weightを棚卸し
- Semi Bold(600)を主要UI要素に適用し、本文Regular(400)との役割分担を明確化
- 既存のBold/Blackの乱用や不足を調整して階層を揃える
- 対象ページ: `src/pages`, `src/components/layout`, `src/components/ui`, `src/legal`

## Non-Goals
- フォントファミリの変更
- 新しいタイポグラフィスケールや色設計の導入
- レイアウト/コピーの改修

## Requirements
- **Functional**:
  - RegularとSemi Boldの使い分けがUI全体で一貫していること
  - 見出し/ボタン/ラベル/本文の階層が視覚的に判別できること
- **Non-Functional**:
  - 既存デザインのトーンを崩さないこと
  - 全ページでの視認性が低下しないこと

## Tasks
- フォントウェイトの現状棚卸し（`font-bold`/`font-semibold`/未指定）
- Google Fonts読み込みにSemi Bold(600)を追加
- ベースタイポグラフィの方針を明文化（h1-h3=bold、UIラベル/ボタン=semibold、本文=regular）
- ページ/コンポーネントのウェイト調整
- 目視で主要ページ（Join/Membership/Thanks/Supporters/Legal）を確認

## Test Plan
- 主要ページを開き、見出し/ラベル/本文でウェイト差が明確に出ることを目視確認
- 文字のにじみや不自然な合成太字がないことを確認

## Deployment / Rollout
- 既存UIのデザインレビュー後に段階的に反映（差分が大きい場合は段階適用）
