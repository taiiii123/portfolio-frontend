<template>
  <div class="blog-detail-page">
    <!-- ローディング状態 -->
    <Loading v-if="isLoading" size="lg" text="記事を読み込み中" :height="'500px'" />

    <!-- エラー状態 -->
    <div v-else-if="!post || !post.id" class="error-container container">
      <div class="error-message">
        <h2>記事が見つかりませんでした</h2>
        <p>お探しの記事は存在しないか、削除された可能性があります。</p>
        <router-link to="/blog" class="btn btn-primary"> ブログトップへ戻る </router-link>
      </div>
    </div>

    <!-- 記事表示 -->
    <div v-else>
      <div class="blog-hero" :style="heroBackgroundStyle">
        <hero-stars :particles="false" />
        <div class="container">
          <div class="post-metadata">
            <div class="post-category" v-if="post.category">
              {{ getCategoryName(getCategoryId(post.category)) }}
            </div>
            <div class="post-date" v-if="post.publishedAt">
              <template v-if="!shouldShowUpdatedDate">
                {{ formatDate(post.publishedAt) }}&nbsp;&nbsp;公開
              </template>
              <template v-else>
                {{ formatDate(post.revisedAt) }}&nbsp;&nbsp;更新
              </template>
            </div>
          </div>
          <h1 class="post-title animated-gradient" v-if="post.title">
            {{ post.title }}
          </h1>
          <div class="post-tags" v-if="post.tags && post.tags.length > 0">
            <span v-for="(tag, index) in formatTags(post.tags)" :key="index" class="post-tag">
              #{{ tag }}
            </span>
          </div>
        </div>
        <div class="scroll-indicator">
          <span>スクロール</span>
          <div class="scroll-arrow"></div>
        </div>
      </div>

      <div class="post-content-wrapper">
        <div class="container">
          <div class="post-layout">
            <main class="post-main">
              <article class="post-content">
                <div class="breadcrumb-nav">
                  <ol class="breadcrumb-list">
                    <li class="breadcrumb-item">
                      <router-link to="/blog" class="breadcrumb-link">
                        <img src="@/assets/images/blog-icon.png" class="breadcrumb-blog-icon" alt="ブログアイコン"
                          width="30" />
                        <span class="breadcrumb-blog-text">ブログ</span>
                      </router-link>
                    </li>
                    <li class="breadcrumb-item" v-if="post.category">
                      <router-link :to="`/blog?category=${getCategoryId(post.category)}`" class="breadcrumb-link">
                        <span>{{ getCategoryName(getCategoryId(post.category)) }}</span>
                      </router-link>
                    </li>
                    <li class="breadcrumb-item breadcrumb-item-current">
                      <span class="breadcrumb-current-text">{{ post.title || '' }}</span>
                    </li>
                  </ol>
                </div>

                <!-- サムネイル画像 -->
                <div v-if="post.thumbnail && post.thumbnail.url" class="post-thumbnail">
                  <img :src="post.thumbnail.url" :alt="post.title || '記事画像'" ref="postThumbnail" @click="showImage"
                    class="clickable-image" />
                </div>

                <div class="post-thumbnail-title" v-if="post.title">
                  <h2 class="thumbnail-title">{{ post.title }}</h2>
                  <div class="post-date-container" v-if="post.publishedAt">
                    <div class="post-date-wrapper">
                      <div class="clock-icon-wrapper">
                        <img src="@/assets/images/clock.png" class="clock-icon" alt="時計アイコン" />
                        {{ formatDate(post.publishedAt) }}&nbsp;&nbsp;公開
                      </div>
                      <template v-if="shouldShowUpdatedDate">
                        <div class="update-icon-wrapper">
                          <img src="@/assets/images/update-done.png" class="update-icon" alt="更新アイコン" width="30" />
                          {{ formatDate(post.revisedAt) }}&nbsp;&nbsp;更新
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- グラデーションの線 -->
                <hr class="content-divider" />

                <!-- モバイル用目次（目次がある場合のみ表示） -->
                <div class="mobile-table-of-contents" v-if="numberedTableOfContents.length > 0">
                  <!-- 折りたたみ可能なヘッダー -->
                  <div class="mobile-toc-header" @click="toggleMobileToc">
                    <div class="mobile-toc-header-left">
                      <button class="mobile-toc-toggle" :class="{ 'expanded': isMobileTocExpanded }">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      <h3 class="mobile-toc-title">
                        目次&nbsp;&nbsp;
                        [
                        <span class="mobile-toc-status" :class="{ 'expanded': isMobileTocExpanded }">
                          {{ isMobileTocExpanded ? '閉じる' : '開く' }}
                        </span>
                        ]
                      </h3>
                    </div>
                  </div>

                  <!-- 折りたたみ可能なコンテンツ -->
                  <transition name="mobile-toc-slide">
                    <ul class="mobile-toc-list" v-show="isMobileTocExpanded">
                      <li v-for="(h2Item, h2Index) in numberedTableOfContents" :key="`mobile-h2-${h2Index}`"
                        class="mobile-toc-item">
                        <!-- h2見出し（番号付き） -->
                        <a :href="`#${h2Item.id}`" class="mobile-toc-link" @click.prevent="scrollToSection(h2Index)">
                          <span class="toc-number">{{ h2Item.number }}.</span>
                          <span class="toc-text">{{ h2Item.text }}</span>
                        </a>

                        <!-- h3見出し（X-X形式の番号付き） -->
                        <ul v-if="h2Item.children && h2Item.children.length > 0" class="mobile-toc-sublist">
                          <li v-for="(h3Item, h3Index) in h2Item.children" :key="`mobile-h3-${h2Index}-${h3Index}`"
                            class="mobile-toc-subitem">
                            <a :href="`#${h3Item.id}`" class="mobile-toc-sublink"
                              @click.prevent="scrollToSection(h2Index, h3Index)">
                              <span class="toc-subnumber">{{ h3Item.number }}.</span>
                              <span class="toc-subtext">{{ h3Item.text }}</span>
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </transition>
                </div>

                <!-- 記事本文 -->
                <div class="post-body" v-html="formattedContent"></div>
              </article>

              <!-- 前後の記事ナビゲーション -->
              <div class="post-navigation">
                <div class="next-post" v-if="nextPost">
                  <router-link :to="`/blog/${nextPost.id}`" class="nav-link next">
                    <span class="nav-label">← 次の記事</span>
                    <span class="nav-title">{{ nextPost.title }}</span>
                  </router-link>
                </div>
                <div class="prev-post" v-if="prevPost">
                  <router-link :to="`/blog/${prevPost.id}`" class="nav-link prev">
                    <span class="nav-label">前の記事 →</span>
                    <span class="nav-title">{{ prevPost.title }}</span>
                  </router-link>
                </div>
              </div>
            </main>

            <aside class="post-sidebar">
              <!-- サイドバーコンテンツ -->
              <div class="sidebar-section author-info">
                <h3 class="sidebar-title sidebar-title-author">著者情報</h3>
                <div class="author-card">
                  <router-link to="/about">
                    <div class="profile-circle">
                      <img src="@/assets/images/profile.png" alt="著者のアバター" class="profile-image" />
                    </div>
                  </router-link>
                  <div class="author-details">
                    <h4 class="author-name">Yamada Taiki</h4>
                    <p class="author-bio">
                      20代のWebエンジニア。このブログでは、主に日々の学びやプログラミング、技術関連、エンジニア向けに役に立つ情報等をメモとして書いています。
                    </p>
                  </div>
                </div>
              </div>

              <!-- サイドバーの目次セクション（デスクトップ用） -->
              <div class="sidebar-section table-of-contents" v-if="numberedTableOfContents.length > 0">
                <h3 class="sidebar-title">目次</h3>
                <ul class="toc-list">
                  <li v-for="(h2Item, h2Index) in numberedTableOfContents" :key="`h2-${h2Index}`" class="toc-item">
                    <!-- h2見出し（番号付き） -->
                    <a :href="`#${h2Item.id}`" class="toc-link" @click.prevent="scrollToSection(h2Index)">
                      <span class="toc-number">{{ h2Item.number }}.</span>
                      <span class="toc-text">{{ h2Item.text }}</span>
                    </a>

                    <!-- h3見出し（X-X形式の番号付き） -->
                    <ul v-if="h2Item.children && h2Item.children.length > 0" class="toc-sublist">
                      <li v-for="(h3Item, h3Index) in h2Item.children" :key="`h3-${h2Index}-${h3Index}`"
                        class="toc-subitem">
                        <a :href="`#${h3Item.id}`" class="toc-sublink"
                          @click.prevent="scrollToSection(h2Index, h3Index)">
                          <span class="toc-subnumber">{{ h3Item.number }}.</span>
                          <span class="toc-subtext">{{ h3Item.text }}</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div class="sidebar-section related-posts" v-if="relatedPosts.length > 0">
                <h3 class="sidebar-title">関連記事</h3>
                <ul class="related-posts-list">
                  <li v-for="relatedPost in relatedPosts" :key="relatedPost.id" class="related-post-item">
                    <router-link :to="`/blog/${relatedPost.id}`" class="related-post-link">
                      <div class="related-post-image" v-if="relatedPost.thumbnail && relatedPost.thumbnail.url">
                        <img :src="relatedPost.thumbnail.url" :alt="relatedPost.title" />
                      </div>
                      <div class="related-post-info">
                        <h4 class="related-post-title">
                          {{ maskText(relatedPost.title) }}
                        </h4>
                        <span class="related-post-date">{{
                          formatDate(relatedPost.publishedAt)
                        }}</span>
                      </div>
                    </router-link>
                  </li>
                </ul>
              </div>

              <div class="sidebar-section categories" v-if="categories.length > 0">
                <h3 class="sidebar-title sidebar-title-categories">カテゴリー</h3>
                <ul class="categories-list">
                  <li v-for="category in categories" :key="category.id" class="category-item">
                    <router-link :to="`/blog?category=${category.id}`" class="category-link">
                      {{ category.name }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </aside>

            <!-- 戻るボタン -->
            <div class="back-to-blog-wrapper">
              <div class="btn-center">
                <router-link to="/blog" class="back-to-blog-btn">
                  <span>←</span> すべての記事へ戻る
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <table-of-contents-button :table-of-contents="numberedTableOfContents" />
</template>

<script>
import HeroStars from "@/components/common/HeroStars.vue";
import Loading from "@/components/common/Loading.vue";
import TableOfContentsButton from "@/components/blog/TableOfContentsButton.vue";
import "viewerjs/dist/viewer.css";

// highlight.jsのインポートとスタイル
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { transformCodeBlocks, processIframelyEmbeds } from "@/utils/markdownUtils";

// 開発環境のみモックAPIを使用
if (process.env.VUE_APP_NODE_ENV === "development") {
  console.log("開発モードでブログのモックAPIが有効になっています");
  import("@/api/blog/mock").catch((err) => {
    console.warn("ブログモックのインポートに失敗しました:", err);
  });
}

export default {
  name: "BlogDetailView",
  components: {
    HeroStars,
    Loading,
    TableOfContentsButton,
  },
  props: {
    id: {
      type: String,
      default: null
    },
    draftKey: {
      type: String,
      default: null
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      post: null,
      isLoading: true,
      prevPost: null,
      nextPost: null,
      relatedPosts: [],
      tableOfContents: [], // 目次用の配列
      isMobileTocExpanded: true,
      categories: [
        { id: "all", name: "すべて" },
        { id: "tech", name: "テクノロジー" },
        { id: "dev", name: "開発日記" },
        { id: "life", name: "日常" },
        { id: "hobby", name: "趣味" },
        { id: "other", name: "その他" },
      ],
      viewer: null,
      iframelyScriptLoaded: false,
    };
  },
  computed: {
    postId() {
      return this.id || this.$route.params.id;
    },

    // 更新日を表示するかどうかを判定
    shouldShowUpdatedDate() {
      // postが存在しない場合は早期リターン
      if (!this.post || !this.post.publishedAt || !this.post.revisedAt) {
        return false;
      }

      // 日付部分のみを比較
      const publishedDate = new Date(this.post.publishedAt).toDateString();
      const revisedDate = new Date(this.post.revisedAt).toDateString();

      return publishedDate !== revisedDate;
    },

    // 番号付き目次データを生成
    numberedTableOfContents() {
      if (this.tableOfContents.length === 0) {
        return [];
      }

      return this.tableOfContents.map((h2Item, h2Index) => {
        const h2Number = h2Index + 1;

        // h3の子要素に番号を付与
        const numberedChildren = h2Item.children
          ? h2Item.children.map((h3Item, h3Index) => ({
            ...h3Item,
            number: `${h2Number} - ${h3Index + 1}`,
            displayText: `${h2Number} - ${h3Index + 1}. ${h3Item.text}`
          }))
          : [];

        return {
          ...h2Item,
          number: h2Number,
          displayText: `${h2Number}. ${h2Item.text}`,
          children: numberedChildren
        };
      });
    },

    formattedContent() {
      // postまたはpost.contentが存在しない場合は早期リターン
      if (!this.post || !this.post.content) {
        return "";
      }

      let content = this.post.content;

      // まずh2タグにIDを追加
      const h2Regex = /<h2(?:\s+[^>]*)?>.*?<\/h2>/g;
      let h2Match;
      let h2Index = 0;

      while ((h2Match = h2Regex.exec(content)) !== null) {
        const originalH2 = h2Match[0];
        // 既存のid属性があるかチェック
        const existingIdMatch = originalH2.match(/id="([^"]*?)"/);

        if (!existingIdMatch) {
          // IDがない場合は新しいIDを追加（固定形式のIDを使用）
          const newH2 = originalH2.replace(
            /<h2/,
            `<h2 id="section-${h2Index}"`
          );
          content = content.replace(originalH2, newH2);
        }
        h2Index++;
      }

      // 次にh3タグにIDを追加（h2と同じパターンで明確なIDを付与）
      const h3Regex = /<h3(?:\s+[^>]*)?>.*?<\/h3>/g;
      let h3Match;
      let h3Index = 0;

      while ((h3Match = h3Regex.exec(content)) !== null) {
        const originalH3 = h3Match[0];
        // 既存のid属性があるかチェック
        const existingIdMatch = originalH3.match(/id="([^"]*?)"/);

        if (!existingIdMatch) {
          // IDがない場合は新しいID形式を追加（h3専用のIDプレフィックス）
          const newH3 = originalH3.replace(
            /<h3/,
            `<h3 id="subsection-${h3Index}"`
          );
          content = content.replace(originalH3, newH3);
        }
        h3Index++;
      }
      content = processIframelyEmbeds(content);

      // コードブロックの変換
      return transformCodeBlocks(content);
    },

    heroBackgroundStyle() {
      // postが存在しない場合は空のスタイルオブジェクトを返す
      if (!this.post) {
        return {};
      }

      // ヒーローセクションの背景スタイル
      if (this.post.thumbnail && this.post.thumbnail.url) {
        return {
          backgroundImage: `linear-gradient(to bottom, rgba(19, 14, 14, 0.7), rgba(0, 0, 0, 0.9)), url(${this.post.thumbnail.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      } else if (this.post.color) {
        return {
          background: this.post.color,
        };
      }
      return {};
    },
  },
  watch: {
    // ルートパラメータまたはpropsの変更を監視
    postId: {
      immediate: true,
      handler(newId, oldId) {
        if (newId && newId !== oldId) {
          this.scrollToTop();
          this.fetchPostData(newId);
        }
      },
    },
    "post.content": {
      handler() {
        // postが存在しない場合は何もしない
        if (!this.post) {
          return;
        }
        // 記事のコンテンツが更新されたら目次を生成
        this.generateTableOfContents();
      },
    },
    post: {
      handler(newPost) {
        if (this.viewer) {
          this.viewer.destroy();
          this.viewer = null;
        }

        // DOMが更新された後にビューワーの初期化を試みる
        this.$nextTick(() => {
          if (
            newPost &&
            newPost.thumbnail &&
            newPost.thumbnail.url &&
            this.$refs.postThumbnail
          ) {
            this.initViewer();
          }
        });

        this.reinitializeIframely();
      },
    },
  },
  mounted() {
    this.scrollToTop();

    this.loadIframelyScript();

    // コードブロックのコピー機能
    window.copyCodeBlock = function (button) {
      // コピー対象の要素を特定
      const codeBlockWrapper = button.closest(".code-block-wrapper");
      const codeElement = codeBlockWrapper.querySelector("code");

      if (!codeElement) return;

      // タップフィードバックを追加（モバイル用）
      button.style.transition =
        "transform 0.1s ease, background-color 0.2s ease";
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 100);

      // コードのテキストを取得
      const textToCopy = codeElement.textContent;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          const originalText = button.textContent;
          button.textContent = "コピー完了";
          button.classList.add("copied");

          setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove("copied");
          }, 2000);
        })
        .catch((err) => {
          console.error("コードのコピーに失敗しました:", err);

          // モバイルでコピーできない場合の代替手段
          if (isMobileDevice()) {
            fallbackCopy(textToCopy, button);
          } else {
            button.textContent = "コピー失敗";
            setTimeout(() => {
              button.textContent = "コピー";
            }, 2000);
          }
        });
    };

    // 行番号表示切り替え機能
    window.toggleLineNumbers = function (checkbox) {
      // 対象のコードブロックを特定
      const codeBlockWrapper = checkbox.closest(".code-block-wrapper");
      const codeContainer = codeBlockWrapper.querySelector(".code-container");

      // チェックボックスの状態に応じて表示を切り替え
      if (checkbox.checked) {
        // 行番号付きの表示に切り替え
        codeContainer.querySelector(".with-line-numbers-new").style.display =
          "block";
        codeContainer.querySelector(".code-only").style.display = "none";

        // スクロール位置をリセット
        codeContainer.scrollLeft = 0;

        // モバイルデバイスでの水平スクロールを可能にするためのヒント表示
        if (window.innerWidth <= 768) {
          // モバイルかつチェックボックスがオンの場合にスクロールヒントを追加
          let scrollHint = codeBlockWrapper.querySelector(".scroll-hint");
          if (!scrollHint) {
            scrollHint = document.createElement("div");
            scrollHint.className = "scroll-hint";
            scrollHint.textContent = "← スクロール可能 →";
            scrollHint.style.textAlign = "center";
            scrollHint.style.fontSize = "10px";
            scrollHint.style.color = "#636f87";
            scrollHint.style.padding = "4px";
            scrollHint.style.backgroundColor = "#141820";
            scrollHint.style.borderTop = "1px solid #0c0e12";
            codeContainer.after(scrollHint);

            // 5秒後にヒントを消す
            setTimeout(() => {
              if (scrollHint && scrollHint.parentNode) {
                scrollHint.style.opacity = "0";
                scrollHint.style.transition = "opacity 0.5s ease";
                setTimeout(() => {
                  if (scrollHint && scrollHint.parentNode) {
                    scrollHint.parentNode.removeChild(scrollHint);
                  }
                }, 500);
              }
            }, 5000);
          }
        }
      } else {
        // 通常表示に戻す
        codeContainer.querySelector(".with-line-numbers-new").style.display =
          "none";
        codeContainer.querySelector(".code-only").style.display = "block";

        // スクロールヒントが残っていたら削除
        const scrollHint = codeBlockWrapper.querySelector(".scroll-hint");
        if (scrollHint) {
          scrollHint.parentNode.removeChild(scrollHint);
        }
      }
    };

    // モバイルデバイス判定
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    }

    // モバイル用コピー代替手段
    function fallbackCopy(text, button) {
      // テキストエリアを作成して選択
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      // 選択範囲をコピー
      let success = false;
      try {
        success = document.execCommand("copy");
      } catch (err) {
        console.error("コピーが失敗しました", err);
      }

      // テキストエリアを削除
      document.body.removeChild(textarea);

      // 結果表示
      if (success) {
        button.textContent = "コピー完了";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = "コピー";
          button.classList.remove("copied");
        }, 2000);
      } else {
        button.textContent = "コピー失敗";
        setTimeout(() => {
          button.textContent = "コピー";
        }, 2000);
      }
    }

    // highlight.jsの初期化（コンテンツ更新後に実行）
    this.$nextTick(() => {
      this.applyHighlighting();

      // サムネイル画像があればビューワーを初期化
      if (
        this.post &&
        this.post.thumbnail &&
        this.post.thumbnail.url &&
        this.$refs.postThumbnail
      ) {
        this.initViewer();
      }
    });
  },
  updated() {
    // DOMが更新されたらハイライト処理を実行
    this.$nextTick(() => {
      this.applyHighlighting();

      // サムネイル画像があり、かつビューワーがまだ初期化されていない場合は初期化
      if (
        this.post &&
        this.post.thumbnail &&
        this.post.thumbnail.url &&
        this.$refs.postThumbnail &&
        !this.viewer
      ) {
        this.initViewer();
      }

      this.reinitializeIframely();
    });
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);

      this.$nextTick(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        });

        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 10);
      });
    },

    // ViewerJSの初期化
    initViewer() {
      if (this.$refs.postThumbnail) {
        // ViewerJSをrequireで取得
        const Viewer = require("viewerjs");

        this.viewer = new Viewer(this.$refs.postThumbnail, {
          inline: false,
          button: true,
          navbar: false,
          title: false,
          toolbar: {
            zoomIn: true,
            zoomOut: true,
            oneToOne: true,
            reset: true,
            prev: false,
            next: false,
            rotateLeft: true,
            rotateRight: true,
            flipHorizontal: true,
            flipVertical: true,
          },
          transition: true,
          backdrop: true,
          keyboard: true,
        });
      }
    },

    // 画像を表示
    showImage() {
      if (this.viewer) {
        this.viewer.show();
      } else {
        // ビューワーがない場合は初期化して表示
        this.initViewer();
        if (this.viewer) {
          this.viewer.show();
        }
      }
    },

    // ハイライト処理を適用するメソッド
    applyHighlighting() {
      // 通常表示のコード要素にハイライトを適用
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });

    },

    // タグのフォーマット処理
    formatTags(tags) {
      // 1. tagsが文字列の場合（カンマ区切りの文字列など）
      if (typeof tags === "string") {
        return tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");
      }

      // 2. tagsが配列の場合
      if (Array.isArray(tags)) {
        return tags
          .map((tag) => {
            // タグがオブジェクトの場合（例：{id: 'tag1', name: 'タグ1'}）
            if (typeof tag === "object" && tag !== null) {
              return (
                tag.name ||
                tag.text ||
                tag.value ||
                tag.id ||
                JSON.stringify(tag)
              );
            }
            // タグが文字列または他の型の場合
            return String(tag).trim();
          })
          .filter((tag) => tag !== "");
      }

      // 3. tagsがobjectの場合（例：{tag1: true, tag2: false}）
      if (typeof tags === "object" && tags !== null && !Array.isArray(tags)) {
        return Object.keys(tags)
          .filter((key) => tags[key])
          .map((key) => key.trim());
      }

      // 4. 未定義または他の型の場合は空配列を返す
      return [];
    },

    // モバイル目次の折りたたみ/展開を切り替え
    toggleMobileToc() {
      this.isMobileTocExpanded = !this.isMobileTocExpanded;

      // 色を即座に適用するため、DOM操作で直接変更
      this.$nextTick(() => {
        const toggleButton = document.querySelector('.mobile-toc-toggle');
        if (toggleButton) {
          if (this.isMobileTocExpanded) {
            // 開いているとき
            toggleButton.style.color = '#6A11CB';
          } else {
            // 閉じているとき
            toggleButton.style.color = '#2575FC';
          }
        }
      });
    },

    // 目次を押下した時に、指定のセクションへスクロールするメソッド
    scrollToSection(h2Index, h3Index = null) {
      try {
        let targetId;

        if (
          h3Index !== null &&
          this.tableOfContents[h2Index] &&
          this.tableOfContents[h2Index].children[h3Index]
        ) {
          // h3が指定されている場合
          targetId = this.tableOfContents[h2Index].children[h3Index].id;
        } else if (this.tableOfContents[h2Index]) {
          // h2のみの場合
          targetId = this.tableOfContents[h2Index].id;
        } else {
          console.error("無効なインデックスが指定されました", h2Index, h3Index);
          return;
        }

        // 要素を探す
        const section = document.getElementById(targetId);

        if (section) {
          // スクロールオフセット
          const offset = 112;

          // スムーズスクロール
          section.scrollIntoView({ behavior: "smooth", block: "start" });

          // オフセット調整
          setTimeout(() => {
            window.scrollBy(0, -offset);
          }, 10);
        } else {
          console.error(`セクション ID: ${targetId} が見つかりません`);
        }
      } catch (error) {
        console.error("スクロール処理中にエラーが発生しました:", error);
      }
    },

    // 目次を生成するメソッド
    generateTableOfContents() {
      this.tableOfContents = [];

      // postまたはpost.contentが存在しない場合は何もしない
      if (!this.post || !this.post.content) {
        return;
      }

      // コンテンツ内のすべてのh2タグを検索
      const h2Regex = /<h2(?:\s+[^>]*)?>(.*?)<\/h2>/g;
      const content = this.post.content;

      let h2Match;

      while ((h2Match = h2Regex.exec(content)) !== null) {
        // h2タグのテキスト内容を抽出
        const h2Full = h2Match[0];
        let h2Text = h2Match[1];

        // タグを除去
        const h2Div = document.createElement("div");
        h2Div.innerHTML = h2Text;
        h2Text = h2Div.textContent || h2Div.innerText || "";

        // h2のIDを取得
        const h2IdMatch = h2Full.match(/id="([^"]*?)"/);
        const h2Id = h2IdMatch ? h2IdMatch[1] : "";

        // 有効なh2項目を作成
        if (h2Text.trim() && h2Id) {
          const h2Item = {
            text: h2Text.trim(),
            id: h2Id,
            level: 2,
            children: [],
          };

          // この h2 の後から次の h2 までのコンテンツセクションを抽出
          const h2EndPos = h2Match.index + h2Match[0].length;

          // 一時的に次のh2を探す（現在位置を保存）
          const currentPos = h2Regex.lastIndex;
          const nextH2Match = h2Regex.exec(content);
          const nextH2Pos = nextH2Match ? nextH2Match.index : content.length;
          // 検索位置を戻す
          h2Regex.lastIndex = currentPos;

          // このh2とその次のh2の間のコンテンツを抽出
          const sectionContent = content.substring(h2EndPos, nextH2Pos);

          // このセクション内のh3を探す
          const h3Regex = /<h3(?:\s+[^>]*)?>(.*?)<\/h3>/g;
          let h3Match;

          while ((h3Match = h3Regex.exec(sectionContent)) !== null) {
            // h3タグのテキスト内容を抽出
            const h3Full = h3Match[0];
            let h3Text = h3Match[1];

            // タグを除去
            const h3Div = document.createElement("div");
            h3Div.innerHTML = h3Text;
            h3Text = h3Div.textContent || h3Div.innerText || "";

            // h3のIDを取得
            const h3IdMatch = h3Full.match(/id="([^"]*?)"/);
            const h3Id = h3IdMatch ? h3IdMatch[1] : "";

            // 有効なh3項目を追加
            if (h3Text.trim() && h3Id) {
              h2Item.children.push({
                text: h3Text.trim(),
                id: h3Id,
                level: 3,
              });
            }
          }

          // 目次にh2項目を追加
          this.tableOfContents.push(h2Item);
        }
      }
    },

    // 記事データを取得する
    async fetchPostData(postId) {
      this.isLoading = true;
      // postを明示的にnullにリセット
      this.post = null;

      // ページ遷移時にスクロール位置をリセット
      this.scrollToTop();

      const apiUrl = `${process.env.VUE_APP_MICROCMS_URL}/${postId}`;
      const apikey = process.env.VUE_APP_MICROCMS_API_KEY;
      let apiParams = {};

      // プレビューモードの場合はdraftKeyを追加
      if (this.isPreview && this.draftKey) {
        apiParams.draftKey = this.draftKey;
      }

      try {
        // 記事詳細の取得
        const response = await this.$axios.get(apiUrl, {
          params: apiParams,
          headers: {
            "x-api-key": apikey,
          },
        });

        if (response.status !== 200) {
          throw new Error(`APIエラー: ${response.status}`);
        }

        this.post = response.data || null;

        if (this.post && this.post.id) {
          this.generateTableOfContents();
          // 前後の記事と関連記事を並行して取得
          await Promise.all([
            this.fetchPrevNextPosts(),
            this.fetchRelatedPosts()
          ]);

          // データ取得完了後にもう一度スクロール
          this.$nextTick(() => {
            this.scrollToTop();
          });
        } else {
          this.isLoading = false;
        }
      } catch (error) {
        console.error("記事の取得に失敗しました", error);
        this.post = null;
        this.isLoading = false;

      }
    },

    // 前後の記事を取得
    async fetchPrevNextPosts() {
      // postが存在しない場合は何もしない
      if (!this.post || !this.post.publishedAt) {
        return;
      }

      const apiUrl = process.env.VUE_APP_MICROCMS_URL;
      const apikey = process.env.VUE_APP_MICROCMS_API_KEY;

      try {
        // 前の記事と次の記事を並行して取得
        const [prevResponse, nextResponse] = await Promise.allSettled([
          this.$axios.get(apiUrl, {
            params: {
              filters: `publishedAt[less_than]${this.post.publishedAt}`,
              orders: "-publishedAt",
              limit: 1
            },
            headers: {
              "x-api-key": apikey,
            },
          }),
          this.$axios.get(apiUrl, {
            params: {
              filters: `publishedAt[greater_than]${this.post.publishedAt}`,
              orders: "publishedAt",
              limit: 1
            },
            headers: {
              "x-api-key": apikey,
            },
          })
        ]);

        const extractPost = (response) => {

          if (response.status !== 'fulfilled') {
            return null;
          }

          const { status, data } = response.value;

          if (status !== 200 || !data?.contents?.length) {
            return null
          }

          return data.contents[0];
        };

        // 前の記事の処理
        this.prevPost = extractPost(prevResponse);

        // 次の記事の処理
        this.nextPost = extractPost(nextResponse);

      } catch (error) {
        console.error("前後の記事の取得中に予期しないエラーが発生しました", error);
        this.prevPost = null;
        this.nextPost = null;
      }
    },

    // 関連記事を取得
    async fetchRelatedPosts() {
      // postが存在しない場合は何もしない
      if (!this.post || !this.post.category) {
        this.isLoading = false;
        return;
      }

      const apiUrl = process.env.VUE_APP_MICROCMS_URL;
      const apikey = process.env.VUE_APP_MICROCMS_API_KEY;

      try {
        const response = await this.$axios.get(apiUrl, {
          params: {
            filters: `category[contains]${this.post.category}[and]id[not_equals]${this.post.id}`,
            orders: "-publishedAt",
            limit: 10,
          },
          headers: {
            "x-api-key": apikey,
          },
        });

        const validatePost = (response) => {
          const { status, data } = response;

          if (status !== 200 || !data?.contents?.length) {
            return null
          }

          return data.contents;
        };

        this.relatedPosts = this.getRandomItems(validatePost(response), 3) || [];
        this.isLoading = false;
      } catch (error) {
        console.error("関連記事の取得に失敗しました", error);
        this.relatedPosts = [];
        this.isLoading = false;
      }
    },

    // 配列からランダムなアイテムを取得
    getRandomItems(array, count) {
      if (!Array.isArray(array) || array.length === 0) {
        return [];
      }

      if (array.length <= count) {
        return [...array]; // 配列をコピーして返す
      }

      const shuffled = [...array]; // 元の配列を変更しないようにコピー
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return shuffled.slice(0, count);
    },

    // 日付のフォーマット
    formatDate(dateString) {
      const date = new Date(dateString);
      const days = ["日", "月", "火", "水", "木", "金", "土"];
      const dayOfWeek = days[date.getDay()];

      return (
        date.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) + `\u00A0(${dayOfWeek})`
      );
    },

    // カテゴリIDを取得するメソッド
    getCategoryId(category) {
      if (Array.isArray(category) && category.length > 0) {
        const categoryId = category[0];
        // カテゴリIDが定義済みカテゴリに存在するかチェック
        const existingCategory = this.categories.find((cat) => cat.id === categoryId);
        return existingCategory ? categoryId : 'other';
      }
      if (typeof category === 'string') {
        // カテゴリIDが定義済みカテゴリに存在するかチェック
        const existingCategory = this.categories.find((cat) => cat.id === category);
        return existingCategory ? category : 'other';
      }
      return 'other';
    },

    // カテゴリー名を取得
    getCategoryName(categoryId) {
      const category = this.categories.find((cat) => cat.id === categoryId);
      return category ? category.name : "その他";
    },

    // 指定された文字数を超えるテキストをマスクする
    maskText(text, limit = 40) {
      return text.length > limit ? text.slice(0, limit) + "..." : text;
    },

    // iframelyスクリプトを動的に読み込む
    loadIframelyScript() {
      // すでに読み込まれている場合はスキップ
      if (this.iframelyScriptLoaded || window.iframely) {
        this.iframelyScriptLoaded = true;
        return;
      }

      // 既存のスクリプトタグをチェック
      const existingScript = document.querySelector('script[src*="cdn.iframe.ly/embed.js"]');
      if (existingScript) {
        this.iframelyScriptLoaded = true;
        return;
      }

      // スクリプトタグを動的に作成
      const script = document.createElement('script');
      script.src = '//cdn.iframe.ly/embed.js';
      script.async = true;
      script.charset = 'utf-8';

      script.onload = () => {
        this.iframelyScriptLoaded = true;
        this.reinitializeIframely();
      };

      script.onerror = () => {
        console.error('Iframelyのスクリプトの読み込みに失敗しました');
      };

      document.head.appendChild(script);
    },

    // iframelyの埋め込みを再初期化する
    reinitializeIframely() {
      if (this.iframelyScriptLoaded && window.iframely) {
        // iframelyが利用可能な場合は再初期化
        setTimeout(() => {
          try {
            window.iframely.load();
          } catch (error) {
            console.error('Iframelyの再初期化中にエラーが発生しました:', error);
          }
        }, 100);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/variables";

.blog-detail-page {
  overflow-x: hidden;
}

.blog-hero {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  text-align: center;
  padding: $spacing-2xl 0;
  background-color: $color-secondary;
}

.btn {
  box-shadow: 0 5px 15px rgba($color-accent-1, 0.5);
  background-size: 500% 500%;
  background-image: linear-gradient(90deg,
      $color-accent-2 0%,
      $color-accent-1 25%,
      $color-accent-2 50%,
      $color-accent-1 75 $color-accent-2 100%);
  animation: gradientFlow 12s ease-in-out infinite;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  filter: brightness(98%);

  &:hover {
    color: $color-text-secondary;
    transform: translateY(-5px);
  }
}

.post-metadata {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.post-category {
  background: rgba($color-accent-1, 0.3);
  padding: $spacing-xs $spacing-md;
  border-radius: 20px;
  color: rgb(147, 66, 227);
  font-weight: 700;
  font-size: $font-size-sm;
}

.category-link {
  color: $color-accent-1;
  font-weight: 500;
  font-size: $font-size-sm;
  transition: all $transition-normal ease;

  &:hover {
    color: $color-accent-2;
  }
}

.post-date {
  color: $color-text-secondary;
  font-size: $font-size-sm;
}

.post-title {
  font-size: $font-size-3xl;
  margin-bottom: $spacing-lg;
  color: $color-text-primary;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.animated-gradient {
  background-size: 400% 400%;
  background-image: linear-gradient(-45deg,
      $color-accent-2 0%,
      $color-accent-1 25%,
      $color-accent-2 50%,
      $color-accent-1 75%,
      $color-accent-2 100%);

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 12s ease-in-out infinite;
}

.post-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.post-tag {
  background: rgba($color-accent-2, 0.2);
  padding: $spacing-xs $spacing-md;
  border-radius: 20px;
  color: rgba(118, 127, 229, 0.8);
  font-weight: 700;
  font-size: $font-size-xs;
}

.scroll-indicator {
  position: absolute;
  bottom: $spacing-xl;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $color-text-secondary;
  font-size: $font-size-sm;

  .scroll-arrow {
    width: 20px;
    height: 20px;
    border-left: 2px solid $color-text-secondary;
    border-bottom: 2px solid $color-text-secondary;
    transform: rotate(-45deg);
    margin-top: $spacing-sm;
    animation: scroll-arrow 2s infinite;
  }
}

.post-content-wrapper {
  padding: $spacing-xl 0;
}

.post-layout {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto auto;
  gap: $spacing-xl;
}

.post-main {
  background: rgba($color-secondary, 0.7);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  grid-column: 1;
  grid-row: 1;
}

.post-thumbnail {
  width: 100%;
  height: auto;
  max-height: 500px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "クリックで拡大";
    position: absolute;
    bottom: 15px;
    right: 15px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}

.post-content {
  padding: $spacing-xl;
  color: $color-text-primary;
}

.content-divider {
  height: 3px;
  border: none;
  margin: $spacing-lg 0;
  background: linear-gradient(90deg,
      $color-accent-2,
      $color-accent-1,
      $color-accent-2 );
  background-size: 200% 200%;
  animation: gradientFlow 12s ease-in-out infinite;
  border-radius: 1.5px;
  box-shadow: 0 1px 4px rgba($color-accent-1, 0.3);
}

.breadcrumb-nav {
  margin-bottom: $spacing-md;
  background: rgba($color-secondary, 0.5);
  border-radius: 8px;
  padding: $spacing-sm $spacing-md;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-xs;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: $font-size-sm;

  &:not(:last-child)::after {
    content: "";
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 $spacing-xs;
    background-image: url("@/assets/images/forward.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  color: $color-text-secondary;
  transition: all $transition-normal ease;

  &:hover {
    color: $color-accent-2;
    transform: translateY(-1px);
  }
}

.breadcrumb-blog-icon,
.clock-icon {
  margin-right: 5px;
  font-size: 1.1em;
}

.clock-icon {
  width: 16px;
  height: 16px;
  transform: translateY(3px);
  display: inline-block;
}

.update-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: 10px;
  margin-right: 3px;
  transform: translateY(3px);
}

.breadcrumb-current-text {
  color: $color-accent-2;
  max-width: 800px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.breadcrumb-item-current {
  font-weight: 500;
}

.post-thumbnail-title {
  padding: $spacing-lg $spacing-xl;
  background: rgba(darken($color-secondary, 2%), 0.8);
  border-radius: 0 0 10px 10px;
  margin-top: -5px;
  position: relative;
}

.thumbnail-title {
  font-size: $font-size-2xl;
  margin: 0;
  padding: $spacing-sm 0;
  color: $color-text-light;
  font-weight: 700;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.post-date-container {
  display: flex;
  justify-content: flex-end;
  margin-top: $spacing-xs;
}

.post-date-wrapper {
  display: flex;
  color: $color-text-secondary;
  font-size: $font-size-xs;
  font-weight: 400;
  opacity: 0.8;
}

.mobile-table-of-contents {
  display: none;
  background: rgba($color-secondary, 0.8);
  border-radius: 8px;
  padding: 0;
  margin-bottom: $spacing-lg;
  border: 1px solid rgba($color-accent-1, 0.2);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.mobile-toc-header {
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  padding-left: 10px;
  cursor: pointer;
  user-select: none;
}

.mobile-toc-header-left {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.mobile-toc-status {

  &:not(.expanded) {
    color: #2575FC;
  }

  &.expanded {
    color: #6A11CB;
  }
}

.mobile-toc-title {
  font-size: $font-size-lg;
  margin: 0;
  color: $color-text-primary;
  position: relative;
  padding-bottom: $spacing-sm;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 150px;
    height: 2.5px;
    background: linear-gradient(90deg,
        $color-accent-1,
        $color-accent-2,
        transparent);
  }
}

.mobile-toc-toggle {
  border: none;
  color: $color-accent-2;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    transition: transform 0.3s ease;
  }

  &.expanded {
    color: $color-accent-1;

    svg {
      transform: rotate(180deg);
    }
  }

  &:hover {
    opacity: 0.8;
  }
}

.mobile-toc-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  list-style: none;
  padding: 0 $spacing-lg $spacing-lg $spacing-lg;
  margin: 0;
}

.mobile-toc-item {
  padding: $spacing-xs 0;
  border-bottom: 1px solid rgba($color-accent-1, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.mobile-toc-link {
  color: $color-text-secondary;
  font-size: $font-size-sm;
  transition: all $transition-normal ease;
  display: block;
  padding-left: 0;
  position: relative;
  cursor: pointer;
  font-weight: 500;

  &::before {
    display: none;
  }

  &:hover {
    color: $color-accent-1;
    transform: translateX(4px);
  }

  .toc-number {
    font-weight: 700;
    color: $color-accent-1;
    margin-right: 4px;
  }

  .toc-text {
    font-weight: 500;
  }
}

.mobile-toc-sublist {
  margin-left: $spacing-md;
  margin-top: $spacing-xs;
  margin-bottom: $spacing-xs;
  list-style: none;
  padding: 0;
}

.mobile-toc-subitem {
  padding: $spacing-xs 0;
  border-bottom: 1px dotted rgba($color-accent-1, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.mobile-toc-sublink {
  color: rgba($color-text-secondary, 0.8);
  font-size: $font-size-xs;
  transition: all $transition-normal ease;
  display: block;
  padding-left: 0;
  position: relative;
  cursor: pointer;

  &::before {
    display: none;
  }

  &:hover {
    color: $color-accent-1;
    transform: translateX(4px);
  }

  .toc-subnumber {
    font-weight: 700;
    color: rgba($color-accent-1, 0.8);
    margin-right: 4px;
  }

  .toc-subtext {
    font-weight: 400;
  }
}

.post-body {
  font-size: $font-size-md;
  line-height: 1.8;

  :deep(h2) {
    font-size: $font-size-xl;
    margin: $spacing-xl 0 $spacing-md;
    color: #ffffff;
    position: relative;
    padding: $spacing-md $spacing-lg $spacing-md calc($spacing-lg + 10px);
    border-radius: 8px;
    scroll-margin-top: 90px;
    background: linear-gradient(135deg,
        rgba(10, 20, 45, 0.9),
        rgba(30, 40, 80, 0.8));

    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    z-index: 1;

    box-shadow: inset 0 1px rgba(255, 255, 255, 0.1),
      inset 0 -1px rgba(0, 0, 0, 0.2), 0 3px 5px rgba(0, 0, 0, 0.1);

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 5px;
      height: 100%;
      background: linear-gradient(to bottom, $color-accent-1, $color-accent-2);
      border-radius: 8px 0 0 8px;
      box-shadow: 0 0 8px rgba($color-accent-1, 0.5);
      opacity: 0.8;
      z-index: 2;
      pointer-events: none;
    }

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
      background: radial-gradient(circle at 20% 30%,
          rgba($color-accent-1, 0.3),
          transparent 50%),
        radial-gradient(circle at 80% 70%,
          rgba($color-accent-2, 0.2),
          transparent 40%);
      background-image: radial-gradient(1px 1px at 10% 20%,
          rgba(255, 255, 255, 0.9),
          transparent),
        radial-gradient(1px 1px at 20% 50%,
          rgba(255, 255, 255, 0.8),
          transparent),
        radial-gradient(1px 1px at 80% 30%,
          rgba(255, 255, 255, 0.9),
          transparent),
        radial-gradient(1px 1px at 50% 70%,
          rgba(255, 255, 255, 0.7),
          transparent),
        radial-gradient(1px 1px at 30% 90%,
          rgba(255, 255, 255, 0.8),
          transparent),
        radial-gradient(1px 1px at 70% 15%,
          rgba(255, 255, 255, 0.9),
          transparent),
        radial-gradient(1px 1px at 90% 80%,
          rgba(255, 255, 255, 0.8),
          transparent);
      z-index: -1;
      pointer-events: none;
    }

    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: inset 0 1px rgba(255, 255, 255, 0.1),
        inset 0 -1px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15),
        0 0 8px rgba($color-accent-1, 0.2);

      &::before {
        opacity: 1;
        width: 6px;
        box-shadow: 0 0 12px rgba($color-accent-1, 0.7);
        transition: all 0.3s ease;
      }
    }
  }

  :deep(h3) {
    font-size: $font-size-lg;
    margin: $spacing-lg 0 $spacing-md;
    color: $color-text-primary;
    position: relative;
    padding: $spacing-sm $spacing-md $spacing-sm $spacing-lg;
    scroll-margin-top: 90px;

    font-weight: 500;
    letter-spacing: 0.3px;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 3px;
      height: 100%;
      background: linear-gradient(to bottom,
          rgba($color-accent-2, 0.8),
          rgba($color-accent-1, 0.8));
      border-radius: 1.5px;
      box-shadow: 0 0 6px rgba($color-accent-2, 0.4);
      z-index: 1;
      pointer-events: none;
    }

    transition: all 0.2s ease;

    &:hover {
      color: lighten($color-text-primary, 10%);
      padding-left: calc($spacing-lg + 2px);

      &::before {
        width: 4px;
        box-shadow: 0 0 8px rgba($color-accent-2, 0.6);
      }
    }
  }

  :deep(h4) {
    font-size: $font-size-md;
    margin: $spacing-md 0 $spacing-sm;
    color: rgba(190, 210, 240, 0.95);
    font-weight: 600;
    position: relative;
    padding-left: $spacing-lg;

    &::before {
      content: "> ";
      position: absolute;
      left: 0;
      color: $color-accent-2;
      font-family: monospace;
    }
  }

  :deep(h5) {
    font-size: $font-size-sm;
    margin: $spacing-sm 0;
    color: $color-text-primary;
    font-weight: 500;
    padding-left: $spacing-sm;
    border-left: 2px solid rgba($color-accent-2, 0.5);
  }

  :deep(p) {
    margin-bottom: $spacing-md;
    color: $color-text-secondary;
  }

  // 引用スタイル
  :deep(blockquote) {
    margin: $spacing-lg 0;
    padding: $spacing-lg;
    background-color: rgba(darken($color-secondary, 5%), 0.8);
    border-radius: 8px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.1);
    border-left: 3px solid $color-accent-2;

    p {
      color: lighten($color-text-secondary, 5%) !important;
      line-height: 1.7;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    cite {
      display: block;
      margin-top: $spacing-md;
      font-style: normal;
      font-size: 0.9em;
      font-weight: 500;
      text-align: right;
      color: rgba($color-accent-1, 0.8);
    }
  }

  // テーブルのスタイル
  :deep(table) {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: $spacing-xl 0;
    font-size: $font-size-sm;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(10, 27, 56, 0.5);
    border: 1px solid rgba(65, 120, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    @media (max-width: $breakpoint-md) {
      display: block;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;

      /* スクロールバーのスタイリング */
      &::-webkit-scrollbar {
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(10, 27, 56, 0.5);
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(65, 120, 255, 0.6);
        border-radius: 4px;

        &:hover {
          background: rgba(65, 120, 255, 0.8);
        }
      }

      thead, tbody {
        display: table;
        width: 100%;
      }
    }
  }

  :deep(th) {
    background: rgba(20, 50, 100, 0.6);
    color: #a2d6ff;
    font-weight: 600;
    padding: $spacing-sm $spacing-md;
    text-align: left;
    border-bottom: 2px solid rgba(65, 120, 255, 0.4);
    border-right: 1px solid rgba(65, 120, 255, 0.15);
    white-space: nowrap;

    @media (max-width: $breakpoint-md) {
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-xs;
    }
  }

  :deep(th p),
  :deep(td p) {
    margin-bottom: 0;
  }

  :deep(th:last-child) {
    border-right: none;
  }

  :deep(td) {
    padding: $spacing-sm $spacing-md;
    min-width: 100px;
    color: #b8d8ff;
    background-color: rgba(10, 27, 56, 0.3);
    border-bottom: 1px solid rgba(65, 120, 255, 0.1);
    border-right: 1px solid rgba(65, 120, 255, 0.1);
    white-space: nowrap;
    transition: background-color 0.2s ease;

    @media (max-width: $breakpoint-md) {
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-xs;
      min-width: 80px;
    }
  }

  :deep(td:last-child) {
    border-right: none;
  }

  :deep(tr:last-child td) {
    border-bottom: none;
  }

  :deep(tbody tr:hover td) {
    background-color: rgba(28, 65, 126, 0.4);
  }

  :deep(tbody tr:nth-child(even) td) {
    background-color: rgba(15, 35, 70, 0.3);
  }

  // リストのスタイル
  :deep(ul),
  :deep(ol) {
    margin: $spacing-lg 0;
    padding-left: $spacing-lg;
  }

  :deep(ul li),
  :deep(ol li) {
    margin-bottom: $spacing-md;
    color: $color-text-secondary;
    position: relative;
    line-height: 1.7;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateX(3px);
      color: $color-text-primary;
    }
  }

  /* 番号なしリスト */
  :deep(ul li) {
    padding-left: $spacing-md;

    &::before {
      content: "";
      position: absolute;
      left: -$spacing-sm;
      top: 0.7em;
      width: 6px;
      height: 6px;
      border-radius: 2px;
      background: $color-accent-2;
      transform: rotate(45deg);
    }
  }

  /* 順序付きリスト */
  :deep(ol) {
    counter-reset: custom-counter;

    li {
      counter-increment: custom-counter;
      padding-left: $spacing-sm;

      &::before {
        content: counter(custom-counter);
        position: absolute;
        left: -$spacing-lg;
        top: 0;
        font-weight: 600;
        color: $color-accent-2;
        font-size: 0.9em;
      }
    }
  }

  /* ネストされたリスト */
  :deep(ul li ul),
  :deep(ol li ol),
  :deep(ul li ol),
  :deep(ol li ul) {
    margin: $spacing-sm 0 0 0;

    li {
      margin-bottom: $spacing-xs;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  // コードブロックスタイル
  :deep(.code-block-wrapper) {
    margin: $spacing-md 0;
    border-radius: 8px;
    overflow: hidden;
    background-color: #1a1d23;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  :deep(.code-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background-color: #141820;
    border-bottom: 1px solid #0c0e12;
  }

  :deep(.language-tag) {
    font-size: $font-size-xs;
    color: #61afef;
    text-transform: uppercase;
    padding: 2px 8px;
    background-color: rgba(97, 175, 239, 0.1);
    border-radius: 4px;
  }

  :deep(.filename) {
    font-size: $font-size-xs;
    color: #abb2bf;
    margin-left: $spacing-sm;
    flex-grow: 1;
  }

  :deep(.code-actions) {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  :deep(.line-numbers-toggle) {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: $font-size-xs;
    color: #abb2bf;
    cursor: pointer;
    user-select: none;
    margin-right: $spacing-sm;
  }

  :deep(.line-numbers-checkbox) {
    appearance: none;
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border: 1px solid rgba(86, 182, 194, 0.4);
    border-radius: 3px;
    background-color: transparent;
    position: relative;
    cursor: pointer;

    &:checked {
      background-color: rgba(86, 182, 194, 0.2);
      border-color: #56b6c2;

      &::after {
        content: "✓";
        font-size: 10px;
        position: absolute;
        top: 0;
        left: 2px;
        color: #56b6c2;
      }
    }

    &:hover {
      border-color: #56b6c2;
    }
  }

  :deep(.line-numbers-label) {
    font-size: $font-size-xs;
    color: #abb2bf;
  }

  :deep(.copy-button) {
    font-size: $font-size-xs;
    background-color: transparent;
    color: #abb2bf;
    border: 1px solid rgba(86, 182, 194, 0.3);
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(86, 182, 194, 0.15);
      color: #56b6c2;
      border-color: rgba(86, 182, 194, 0.5);
    }

    &.copied {
      background-color: #56b6c2;
      color: #1a1d23;
      border-color: #56b6c2;
    }
  }

  :deep(.code-container) {
    position: relative;
    background-color: #1a1d23;
    overflow: hidden;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  :deep(.with-line-numbers-new) {
    margin: 0;
    padding: 16px 0;
    width: 100%;
    overflow-x: auto;
    font-size: $font-size-sm;
    line-height: 1.6;
    background-color: #1a1d23;
    display: none;
  }

  :deep(.code-line-wrapper) {
    display: flex;
    width: 100%;
    min-width: fit-content;
  }

  :deep(.line-number) {
    display: inline-block;
    padding: 0 8px;
    min-width: 40px;
    text-align: right;
    color: #636f87;
    opacity: 0.6;
    background-color: #141820;
    border-right: 1px solid #0c0e12;
    user-select: none;
  }

  :deep(.code-line) {
    padding: 0 16px;
    width: 100%;
    white-space: pre;

    :deep(span) {
      display: inline;
    }
  }

  :deep(.code-only) {
    margin: 0;
    padding: 16px;
    width: 100%;
    overflow-x: auto;
    font-size: $font-size-sm;
    line-height: 1.6;
    background-color: #1a1d23;
    display: block;
  }

  :deep(.scroll-hint) {
    font-size: 10px;
    color: #636f87;
    text-align: center;
    padding: 4px;
    background-color: #141820;
    border-top: 1px solid #0c0e12;
  }

  :deep(.hljs) {
    background-color: #1a1d23 !important;
    color: #abb2bf;
  }

  :deep(.hljs-keyword),
  :deep(.hljs-selector-tag),
  :deep(.hljs-title),
  :deep(.hljs-section),
  :deep(.hljs-doctag),
  :deep(.hljs-name),
  :deep(.hljs-title.function_) {
    color: #c678dd;
    /* 紫 - キーワード */
  }

  :deep(.hljs-string),
  :deep(.hljs-title.class_),
  :deep(.hljs-attr),
  :deep(.hljs-selector-pseudo),
  :deep(.hljs-addition),
  :deep(.hljs-regexp) {
    color: #98c379;
    /* 緑 - 文字列 */
  }

  :deep(.hljs-attribute),
  :deep(.hljs-code),
  :deep(.hljs-selector-class),
  :deep(.hljs-selector-id) {
    color: #d19a66;
    /* オレンジ - 属性 */
  }

  :deep(.hljs-number),
  :deep(.hljs-meta),
  :deep(.hljs-built_in),
  :deep(.hljs-builtin-name),
  :deep(.hljs-literal),
  :deep(.hljs-type),
  :deep(.hljs-params) {
    color: #d19a66;
    /* オレンジ - 数値 */
  }

  :deep(.hljs-symbol),
  :deep(.hljs-bullet),
  :deep(.hljs-link),
  :deep(.hljs-meta .hljs-string),
  :deep(.hljs-selector-attr),
  :deep(.hljs-subst) {
    color: #61afef;
    /* 青 - シンボル */
  }

  :deep(.hljs-comment),
  :deep(.hljs-quote),
  :deep(.hljs-deletion) {
    color: #5c6370;
    /* グレー - コメント */
    font-style: italic;
  }

  :deep(.hljs-variable),
  :deep(.hljs-template-variable),
  :deep(.hljs-property) {
    color: #e06c75;
    /* 赤 - 変数 */
  }

  :deep(.hljs-function) {
    color: #61afef;
    /* 青 - 関数 */
  }

  :deep(.hljs-operator) {
    color: #56b6c2;
    /* シアン - 演算子 */
  }

  :deep(.hljs-tag) {
    color: #e06c75;
    /* 赤 - タグ */
  }

  :deep(.hljs-title.class_.inherited__),
  :deep(.hljs-class .hljs-title),
  :deep(.hljs-title.class_) {
    color: #e5c07b;
    /* 黄色 - クラス */
  }

  :deep(p code) {
    background-color: rgba(97, 175, 239, 0.08);
    color: rgba(22, 223, 156, 0.637);
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 0.9em;
    display: inline;
  }
}

.post-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: $spacing-xl;
  padding: $spacing-md $spacing-xl;
  border-top: 1px solid rgba($color-accent-1, 0.1);

  .prev-post,
  .next-post {
    max-width: 45%;
  }

  .prev-post:only-child {
    margin-left: auto;
  }

  .next-post:only-child {
    margin-right: auto;
  }

  .nav-link {
    display: flex;
    flex-direction: column;
    color: $color-text-secondary;
    transition: all $transition-normal ease;

    &.prev {
      align-items: flex-start;
    }

    &.next {
      align-items: flex-end;
      text-align: right;
    }

    .nav-label {
      font-size: $font-size-sm;
      margin-bottom: $spacing-xs;
      color: $color-accent-2;
    }

    .nav-title {
      font-size: $font-size-md;
      font-weight: 500;
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
      display: block;
    }

    &:hover {
      color: $color-text-primary;
      transform: translateY(-3px);
    }
  }
}

.post-sidebar {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
  grid-column: 2;
  grid-row: 1;
}

.back-to-blog-wrapper {
  grid-column: 1 / -1;
  grid-row: 2;
  margin: $spacing-xl 0;
  text-align: center;
}

.btn-center {
  margin-left: 70px;
  display: flex;
  justify-content: left;
}

.back-to-blog-btn {
  display: inline-flex;
  align-items: left;
  justify-content: left;
  gap: $spacing-sm;
  color: $color-text-secondary;
  font-weight: 500;
  background: rgba($color-secondary, 0.9);
  padding: $spacing-sm $spacing-lg;
  border-radius: 6px;
  border: 1px solid rgba($color-accent-1, 0.3);
  transition: all $transition-normal ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    color: $color-accent-1;
    border-color: $color-accent-1;
  }

  span {
    font-size: $font-size-lg;
  }
}

.sidebar-section {
  background: rgba($color-secondary, 0.7);
  border-radius: 10px;
  padding: $spacing-lg;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.sidebar-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-md;
  position: relative;
  padding-bottom: $spacing-sm;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 2.5px;
    background: linear-gradient(90deg,
        $color-accent-1,
        $color-accent-2,
        transparent);
  }
}

.sidebar-title-author::after {
  width: 100px;
}

.sidebar-title-categories::after {
  width: 120px;
}

.author-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-circle {
  width: 120px;
  height: 120px;
  margin-bottom: $spacing-md;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-accent-5, $color-accent-6);
  box-shadow: 0 10px 20px rgba($color-accent-1, 0.4);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateZ(0);
  backface-visibility: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    background: $color-secondary;
    z-index: 1;
  }
}

.profile-image {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  z-index: 3;
}

.author-details {
  margin-top: $spacing-md;
}

.author-name {
  font-family: 'Courier New', Courier, monospace;
  font-size: $font-size-lg;
  margin-bottom: $spacing-xs;
  color: $color-text-primary;
  font-weight: 700;
}

.author-bio {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: 1.6;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.toc-item {
  padding: $spacing-xs 0;
  border-bottom: 1px solid rgba($color-accent-1, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.toc-link {
  color: $color-text-secondary;
  font-size: $font-size-sm;
  transition: all $transition-normal ease;
  display: block;
  padding-left: 0;
  position: relative;
  cursor: pointer;
  font-weight: 500;

  &::before {
    display: none;
  }

  &:hover {
    color: $color-accent-1;
    transform: translateX(4px);
  }
}

.toc-number {
  font-weight: 700;
  color: $color-accent-1;
  margin-right: 4px;
}

.toc-text {
  font-weight: 500;
}

.toc-sublink {
  color: rgba($color-text-secondary, 0.8);
  font-size: $font-size-xs;
  transition: all $transition-normal ease;
  display: block;
  padding-left: 0;
  position: relative;
  cursor: pointer;

  &::before {
    display: none;
  }

  &:hover {
    color: $color-accent-1;
    transform: translateX(4px);
  }
}

.toc-subnumber {
  font-weight: 700;
  color: rgba($color-accent-1, 0.8);
  margin-right: 4px;
}

.toc-subtext {
  font-weight: 400;
}

.toc-subitem {
  padding: $spacing-xs 0;
  border-bottom: 1px dotted rgba($color-accent-1, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.toc-sublink {
  color: rgba($color-text-secondary, 0.8);
  font-size: $font-size-xs;
  transition: all $transition-normal ease;
  display: block;
  padding-left: $spacing-md;
  position: relative;
  cursor: pointer;

  &::before {
    content: "◦";
    position: absolute;
    left: 0;
    color: rgba($color-accent-2, 0.7);
  }

  &:hover {
    color: $color-accent-1;
    transform: translateX(4px);
  }
}

.related-posts-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.related-post-item {
  margin-bottom: $spacing-md;
}

.related-post-link {
  display: flex;
  gap: $spacing-sm;
  color: $color-text-secondary;
  transition: all $transition-normal ease;

  &:hover {
    color: $color-text-primary;
    transform: translateX(3px);
  }
}

.related-post-image {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.related-post-info {
  display: flex;
  flex-direction: column;
}

.related-post-title {
  font-size: $font-size-sm;
  margin-bottom: $spacing-xs;
  font-weight: 500;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.related-post-date {
  font-size: $font-size-xs;
  color: $color-text-secondary;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.category-item {
  padding: $spacing-xs 0;
  border-bottom: 1px solid rgba($color-accent-1, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.container {
  max-width: 1400px;
}

.error-container {
  padding: $spacing-2xl 0;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message {
  text-align: center;
  background: rgba($color-secondary, 0.7);
  padding: $spacing-xl;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  max-width: 600px;

  h2 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
  }

  h2::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 265px;
    height: 3px;
    background: linear-gradient(90deg, $color-accent-2, $color-accent-1);
    border-radius: 1.5px;
  }

  p {
    color: $color-text-secondary;
    margin-bottom: $spacing-lg;
  }
}

.clickable-image {
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;

  &:hover {
    transform: scale(1.02);
    filter: brightness(1.1);
  }
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes space-twinkle {
  0% {
    transform: translateY(0);
    opacity: 0.4;
  }

  50% {
    transform: translateY(-20px);
    opacity: 0.6;
  }

  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
}

@media (max-width: $breakpoint-lg) {
  .post-layout {
    grid-template-columns: 2fr 1fr;
  }
}

@media (max-width: $breakpoint-md) {
  .post-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .post-main {
    grid-column: 1;
    grid-row: 1;
  }

  .post-sidebar {
    grid-column: 1;
    grid-row: 2;
  }

  .mobile-table-of-contents {
    display: block;
  }

  .table-of-contents {
    display: none;
  }

  .post-thumbnail {
    &::after {
      bottom: 10px;
      right: 10px;
      font-size: 10px;
      padding: 3px 8px;
    }
  }

  .clock-icon {
    width: 14px;
    height: 14px;
    transform: translateY(3px);
  }

  .update-icon {
    width: 14px;
    width: 14px;
    transform: translateY(3px);
  }

  .post-thumbnail-title {
    padding: $spacing-md;
  }

  .thumbnail-title {
    font-size: $font-size-xl;
  }

  .back-to-blog-wrapper {
    grid-column: 1;
    grid-row: 3;
    text-align: center;
  }

  .btn-center {
    justify-content: center;
    margin-left: 0;
  }

  .back-to-blog-btn {
    align-items: center;
    justify-content: center;
  }

  .post-title {
    font-size: $font-size-2xl;
  }

  .post-content {
    padding: $spacing-lg;
  }

  .post-navigation {
    padding: $spacing-md;
    flex-wrap: wrap;
    gap: $spacing-md;

    .prev-post,
    .next-post {
      max-width: 100%;
    }
  }

  .profile-circle {
    width: 150px;
    height: 150px;
  }

  .breadcrumb-nav {
    padding: $spacing-xs;
    margin-bottom: $spacing-sm;
  }

  .breadcrumb-list {
    font-size: $font-size-xs;
  }

  .breadcrumb-current-text {
    max-width: 150px;
  }

  .post-body {
    :deep(.code-header) {
      flex-wrap: wrap;
    }

    :deep(.filename) {
      width: 100%;
      margin: 4px 0;
      order: -1;
    }

    :deep(.language-tag) {
      margin-bottom: 4px;
    }

    :deep(.code-actions) {
      width: 100%;
      justify-content: space-between;
      margin-top: 4px;
    }

    :deep(.code-container) {
      max-width: 100%;
    }

    :deep(.with-line-numbers-new) {
      font-size: $font-size-xs;
    }

    :deep(.code-line-wrapper) {
      width: max-content;
      min-width: 100%;
    }

    :deep(.line-number) {
      min-width: 30px;
      padding: 0 4px;
    }

    :deep(.code-line) {
      padding: 0 8px;
    }

    :deep(.code-only) {
      font-size: $font-size-xs;
      padding: 12px;
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .post-title {
    font-size: $font-size-xl;
  }

  .post-metadata {
    flex-direction: column;
    gap: $spacing-sm;
  }

  .post-content {
    padding: $spacing-md;
  }

  .breadcrumb-blog-text {
    display: none;
  }

  .breadcrumb-item-current span {
    display: inline-block;
    max-width: 150px;
  }

  .breadcrumb-blog-icon {
    margin-right: 0;
  }

  .post-thumbnail-title {
    padding: $spacing-sm;
  }

  .thumbnail-title {
    font-size: $font-size-lg;
  }

  .post-date-wrapper {
    display: block;
    font-size: 10px;
    transform: translateX(5px);
  }

  .update-icon-wrapper {
    transform: translateX(-8px);
  }

  .post-body {
    font-size: $font-size-sm;

    :deep(.code-block-wrapper) {
      margin: $spacing-sm 0;
    }

    :deep(.code-header) {
      padding: 8px 10px;
    }

    :deep(table) {
      display: block;
      overflow-x: auto;
    }

    :deep(.language-tag) {
      font-size: 10px;
      padding: 2px 4px;
    }

    :deep(.line-numbers-toggle) {
      font-size: 10px;
    }

    :deep(.line-numbers-checkbox) {
      width: 12px;
      height: 12px;
    }

    :deep(.copy-button) {
      font-size: 10px;
      padding: 2px 8px;
    }

    :deep(.with-line-numbers-new),
    :deep(.code-only) {
      font-size: 11px;
    }

    :deep(.line-number) {
      min-width: 24px;
    }
  }

  .profile-circle {
    width: 120px;
    height: 120px;
  }

}

@media (hover: none) and (pointer: coarse) {
  .post-body {
    :deep(.line-numbers-toggle) {
      padding: 4px 0;
    }

    :deep(.line-numbers-checkbox) {
      width: 16px;
      height: 16px;
    }

    :deep(.line-numbers-label) {
      padding: 4px 0;
    }

    :deep(.copy-button) {
      padding: 6px 12px;
    }
  }
}
</style>
