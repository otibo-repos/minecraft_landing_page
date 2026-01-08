---
title: Design Tokens
status: active
draft_status: n/a
created_at: 2025-12-07
updated_at: 2026-01-08
references:
  - ../../plan/Membership/roadmap/plan.md
  - ../../draft/design_request.md
---

## 1. Design Philosophy

**Concept: Friendly Functionalism（親しみやすい機能主義）**

- **Tactile & Soft**: 物理的なフィードバック（Pushボタン）と柔らかな奥行き（Soft Shadow）で、デジタルながら手触りのある操作感を提供。
- **Clear & Durable**: モバイル/Windowsで崩れにくい Inter + Noto Sans JP を軸に、sans-serifへフォールバック。
- **Vivid & Clean**: 鮮やかなブランドカラー（Clover Green / Discord Blue）を、清潔感のあるホワイトスペースと淡いスレートグレーで支える。

## 2. Color System

### 2.1 Primitive Palette (Scale)

全ての色の基礎となるパレット。直接使用せず、セマンティックトークン経由での使用を推奨。

| Scale | Brand (Clover) | Neutral (Slate) | Success (Emerald) | Warning (Amber) | Error (Orange) |
|---:|---|---|---|---|---|
| 50  | #ecfdf5 | #f8fafc | #ecfdf5 | #fffbeb | #fff7ed |
| 100 | #d1fae5 | #f0f9ff (Bg) | #d1fae5 | #fef3c7 | #ffedd5 |
| 200 | #a7f3d0 | #e2e8f0 (Border) | #a7f3d0 | #fde68a | #fed7aa |
| 300 | #6ee7b7 | #cbd5e1 | #6ee7b7 | #fcd34d | #fdba74 |
| 400 | #5fbb4e (Base) | #94a3b8 | #34d399 | #fbbf24 | #fb923c |
| 500 | #4ea540 (Primary) | #64748b (Text-Sec) | #10b981 | #f59e0b | #f97316 |
| 600 | #469e38 (Shadow) | #475569 | #059669 | #d97706 | #ea580c |
| 700 | #15803d | #334155 | #047857 | #b45309 | #c2410c |
| 800 | #166534 | #1e293b (Text-Pri) | #065f46 | #92400e | #9a3412 |
| 900 | #14532d | #0f172a (Display) | #064e3b | #78350f | #7c2d12 |

**Social / Integration**

- **Discord Base**: #5865F2 (Blurple)
- **Discord Dark**: #4752C4 (Shadow/Hover)
- **Discord Surface**: #313338 (Mock UI Bg)

### 2.2 Semantic Tokens (Role-based)

UIコンポーネントに適用するエイリアス。

#### Surface

| Token Name | Reference Value | Usage Description |
|---|---|---|
| --color-bg-main | neutral-100 | ページ全体の背景 |
| --color-bg-surface | #ffffff | カード、モーダル、入力フォーム |
| --color-bg-alt | neutral-50 | セカンダリーセクション背景 |

#### Text

| Token Name | Reference Value | Usage Description |
|---|---|---|
| --color-text-display | neutral-900 | ヒーロータイトル、強調見出し |
| --color-text-primary | neutral-800 | 一般的な見出し、本文 |
| --color-text-secondary | neutral-500 | 説明文、メタ情報 |
| --color-text-disabled | neutral-400 | 無効状態、プレースホルダー |
| --color-text-link | brand-600 | テキストリンク |
| --color-text-on-brand | #ffffff | Primaryボタン上のテキスト |

#### Border

| Token Name | Reference Value | Usage Description |
|---|---|---|
| --color-border | neutral-200 | デフォルトの境界線 |
| --color-border-focus | brand-400 | フォーカスリング |

#### Action

| Token Name | Reference Value | Usage Description |
|---|---|---|
| --color-action-primary | brand-500 | プライマリーボタン背景 |
| --color-action-hover | brand-400 | ホバー時（明度アップ） |
| --color-action-shadow | brand-600 | プッシュボタンの影色 |

#### Feedback

| Token Name | Reference Value | Usage Description |
|---|---|---|
| --color-success-bg | success-50 | 成功メッセージ背景 |
| --color-success-text | success-800 | 成功メッセージテキスト |
| --color-error-bg | error-50 | エラーメッセージ背景 |
| --color-error-text | error-800 | エラーメッセージテキスト |

### 2.3 Gradients & Overlays

- **Hero Overlay**: rgba(0,0,0,0.40)（画像上のテキスト可読性確保）
- **Glass Effect**: rgba(255, 255, 255, 0.7) + backdrop-filter: blur(12px)（Navbar）
- **Hero Fade**: linear-gradient(to top, var(--color-bg-main) 0%, transparent 100%)

## 3. Typography System

### Font Family

- **Display/Headings / Body/UI**: `Inter` → `Noto Sans JP` → `sans-serif`
- **Pricing Highlight (Plan name / Price)**: `Outfit` → `Noto Sans JP` → `sans-serif`（`font-outfit`）

### Scale & Properties

| Token | Size (Mobile/Desktop) | Line Height | Tracking | Weight | Usage |
|---|---|---:|---:|---:|---|
| display | 2.5rem / 3.75rem | 1.1 | -0.02em | 900 | Hero H1 |
| h1 | 2.0rem / 3.0rem | 1.2 | -0.01em | 900 | Section Title |
| h2 | 1.5rem / 2.25rem | 1.3 | -0.01em | 900 | Card Title |
| h3 | 1.25rem / 1.5rem | 1.4 | 0 | 900 | Subsections |
| body-lg | 1.125rem | 1.6 | 0 | 600/700/900 | Lead Text |
| body | 1.0rem | 1.6 | 0 | 600 | Default Text |
| sm | 0.875rem | 1.5 | 0 | 600 | Meta / Footer |
| xs | 0.75rem | 1.4 | 0.02em | 700 | Tooltip / Label |
| tag | 0.75rem | 1.0 | 0.08em | 700 | Uppercase Chips |

## 4. Spacing & Layout

**Base Unit**: 4px

| Token | Value | Semantic Usage |
|---|---:|---|
| space-0.5 | 2px | Micro adjustment |
| space-1 | 4px | Icon gap, Tight grouping |
| space-2 | 8px | Chip padding, Grid gap (sm) |
| space-3 | 12px | Button padding (vertical) |
| space-4 | 16px | Card padding (sm), Form gap |
| space-5 | 20px | Button padding (horizontal) |
| space-6 | 24px | Card padding (lg), Mobile section gap |
| space-8 | 32px | Container gutter |
| space-12 | 48px | Desktop section gap (sm) |
| space-16 | 64px | Desktop section padding |
| space-32 | 128px | Hero bottom spacing |

### Layout Containers

- max-w-screen-xl: 1280px (Standard)
- max-w-screen-2xl: 1440px (Dashboard/Wide)
- **Breakpoints**: sm: 640px, md: 768px, lg: 1024px, xl: 1280px

## 5. Shape & Elevation (Depth)

### Radius

- radius-sm: **8px**（Chips, Small Inputs）
- radius-md: **12px**（Cards, Modals, Default Buttons）
- radius-lg: **20px**（Primary CTA, Large Panels）
- radius-xl: **24px**（Hero Container, Specialized UI）

### Shadows (The "Soft & Tactile" Look)

- **Shadow Soft**（Cards, Surfaces）:
  - 0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(50,60,90,0.05)
  - inset 0 1px 0 rgba(255,255,255,1)（Top Highlight for depth）
- **Shadow Push**（Primary Buttons）:
  - 0 4px 0 var(--color-action-shadow)（Solid color shadow）
- **Shadow Inner**（Input Fields）:
  - inset 0 2px 4px rgba(0,0,0,0.03)

## 6. Interaction & Motion

### States (Primary Button)

- **Default**: transform: none, shadow: push
- **Hover**: bg: brand-400, shadow: push (Color shift only)
- **Active**: transform: translateY(4px), shadow: none（Physical click feel）
- **Focus Visible**: Ring 4px solid rgba(95,187,78,0.4)（Offset 2px）

### Motion Primitives

- ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1)（Bouncy enter）
- ease-standard: cubic-bezier(0.4, 0, 0.2, 1)（Smooth transition）
- duration-fast: **200ms**（Micro-interactions）
- duration-base: **300ms**（Page transitions）
- duration-slow: **600ms**（Hero reveal）

## 7. Component Specific Tokens (Extracts)

### 7.1 Buttons & CTA

- **Primary (Brand)**: Bg brand-500, Text white, Shadow brand-600
- **Secondary (Discord)**: Bg discord-base, Text white, Shadow discord-dark
- **Ghost/Tertiary**: Text neutral-500, Hover Text neutral-800, Bg transparent

### 7.2 Chips / Badges

- **Brand Pill**: Bg rgba(95,187,78,0.1), Text brand-700
- **Discord Pill**: Bg rgba(88,101,242,0.1), Text discord-base
- **Plan Badge**:
  - Ticket: Text #bef264 (Lime) based logic
  - Monthly: Text #86efac (Green) based logic
  - Yearly: Text #5eead4 (Teal) based logic

### 7.3 Cards (Pricing / Feature)

- **Base**: Bg white, Border neutral-200, Shadow soft
- **Pricing Header**: Border color adapts to Plan Badge color (Ticket/Monthly/Yearly)
- **Interactive**: Hover adds transform: translateY(-2px) + increased soft shadow.

## 8. Implementation Guide (Tailwind Config)

```js
// tailwind.config.js snippet
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          // ... (scale)
          500: '#5fbb4e',
          600: '#4ea540',
          700: '#469e38', // Shadow
        },
        neutral: {
          // ... (slate scale)
        },
        discord: {
          base: '#5865F2',
          dark: '#4752C4',
          surface: '#313338'
        }
      },
      fontFamily: {
        display: [
          'Inter',
          '"Noto Sans JP"',
          "sans-serif",
        ],
        body: [
          'Inter',
          '"Noto Sans JP"',
          "sans-serif",
        ],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(50,60,90,0.05), inset 0 1px 0 rgba(255,255,255,1)',
        'push': '0 4px 0 var(--tw-shadow-color)',
        'inner-soft': 'inset 0 2px 4px rgba(0,0,0,0.03)',
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '24px',
      },
      animation: {
        'enter-bouncy': 'enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }
    }
  }
}
```
