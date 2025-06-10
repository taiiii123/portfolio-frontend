# taiki-note


## 📁 プロジェクト構造

<details>
  <summary>クリックして展開</summary>
 <pre><code>
📦プロジェクトルート
├─ 📂public                     # 静的アセット
├─ 📂src                        # ソースコード
│  ├─ 📂api                     # モックAPI
│  ├─ 📂assets                  # フォント、アイコン、画像、効果音、SVG
│  ├─ 📂components              # Vue コンポーネント
│  │  ├─ 📂blog                 # ブログ関連
│  │  │  ├─ 📜BlogPagination.vue          # ブログ記事のページネーション
│  │  │  └─ 📜TableOfContentsButton.vue   # 目次表示ボタン（モーダル）
│  │  ├─ 📂common               # 共通コンポーネント
│  │  │  ├─ 📜HeroStars.vue               # 星空背景エフェクト（Canvas + particles.js）
│  │  │  ├─ 📜Loading.vue                 # 汎用ローディングコンポーネント
│  │  │  ├─ 📜LoadingScreen.vue           # フルスクリーンローディング画面
│  │  │  ├─ 📜OfflineScreen.vue           # オフライン状態表示画面（ネットワーク監視機能付き）
│  │  │  ├─ 📜ScrollIndicator.vue         # スクロール進捗表示（円形インジケーター）
│  │  │  ├─ 📜ScrollTopButton.vue         # ページトップへ戻るボタン（スムーズスクロール）
│  │  │  └─ 📜SpaceDialog.vue             # モーダルダイアログ（確認・通知用）
│  │  ├─ 📂drawing              # 描画機能
│  │  │  ├─ 📜CanvasNavigationButtons.vue # モバイル向けキャンバス・コントロールパネル間移動ボタン
│  │  │  └─ 📜SpaceCanvas.vue             # 描画キャンバス（Canvas + 効果音対応）
│  │  ├─ 📂effects              # エフェクト
│  │  │  └─ 📜MouseTrailEffect.vue        # マウストレイル
│  │  ├─ 📂home                 # ホーム関連
│  │  │  ├─ 📜PlanetAnimation.vue         # 3D惑星アニメーション
│  │  │  └─ 📜SkillsConstellation.vue     # スキル技術のインタラクティブノード表示
│  │  ├─ 📂layout               # レイアウトコンポーネント
│  │  │  ├─ 📜AppFooter.vue               # フッター
│  │  │  └─ 📜NavBar.vue                  # ナビゲーションバー
│  │  └─ 📂projects             # プロジェクト関連
│  │     └─ 📜ProjectsPagination.vue      # プロジェクトのページネーション
│  ├─ 📂router                  # ルーティング設定
│  │  └─ 📜index.js
│  ├─ 📂store                   # Vuex ストア
│  │  └─ 📜index.js
│  ├─ 📂styles                  # SCSS スタイル
│  │  ├─ 📜main.scss                      # メインスタイル（全体・ページ遷移アニメーション）
│  │  ├─ 📜_animations.scss               # アニメーション定義(共通定義)
│  │  ├─ 📜_fonts.scss                    # フォント定義(共通定義)
│  │  ├─ 📜_mixins.scss                   # Sassミックスイン(共通定義)
│  │  ├─ 📜_reset.scss                    # CSSリセット
│  │  └─ 📜_variables.scss                # SCSS変数(共通定義)
│  ├─ 📂utils                   # ユーティリティ
│  │  ├─ 📜dialogService.js               # ダイアログサービス（alert・confirm・カスタムダイアログ）
│  │  └─ 📜markdownUtils.js               # Markdown変換ユーティリティ（highlight.js + コードブロック処理）
│  ├─ 📂views                   # ページコンポーネント
│  │  ├─ 📂detail               # 詳細ページ
│  │  │  ├─ 📜BlogDetail.vue              # ブログ記事詳細ページ
│  │  │  └─ 📜ProjectDetail.vue           # プロジェクト詳細ページ
│  │  ├─ 📜About.vue                      # 自己紹介ページ
│  │  ├─ 📜Blog.vue                       # ブログ一覧ページ
│  │  ├─ 📜Contact.vue                    # お問い合わせページ
│  │  ├─ 📜Drawing.vue                    # スペースキャンバスページ
│  │  ├─ 📜Error.vue                      # エラーページ
│  │  ├─ 📜Home.vue                       # ホームページ
│  │  ├─ 📜Projects.vue                   # プロジェクト一覧ページ
│  │  ├─ 📜RouteSelection.vue             # ルート選択ページ
│  │  └─ 📜Skills.vue                     # スキルページ
│  ├─ 📜App.vue                           # ルートコンポーネント
│  └─ 📜main.js                           # アプリケーションエントリーポイント
├─ 📜babel.config.js                      # Babel設定
├─ 📜jsconfig.json                       # JavaScript設定
├─ 📜vue.config.js                       # Vue CLI設定
├─ 📜package-lock.json                   # npm依存関係ロック
├─ 📜package.json                        # プロジェクト設定
└─ 📜README.md                           # README
  </code></pre>
</details>

## 🛠️ 技術スタック

- Vue.js 3 - コンポーネントベースのフレームワーク
- Vue Router - SPA用ルーティング
- Vuex 4 - 状態管理
- SCSS - CSS処理
- GSAP - 高性能アニメーションライブラリ
- Vue3 Particles - パーティクルエフェクト
- TSParticles Slim - 軽量パーティクルシステム
- Vue3 Carousel - カルーセルコンポーネント
- V-Viewer - 画像ビューア
- ESLint - コード品質管理
- Axios - HTTP通信
- Axios Mock Adapter - 開発用モックAPI

## 🚀セットアップ
```
npm install
```

### 開発サーバーの起動
```
# ローカル開発サーバー
npm run dev-serve

# ステージング環境
npm run stg-serve
```

### ビルド
```
npm run build
```

```
npm run lint
```
