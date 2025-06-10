<template>
  <div class="blog-page">
    <div class="blog-hero">
      <hero-stars />
      <div class="container">
        <h1 class="blog-title animated-gradient">ブログ</h1>
        <p class="blog-subtitle typing-animation">{{ subtitleText }}</p>
      </div>
      <div class="scroll-indicator">
        <span>スクロール</span>
        <div class="scroll-arrow"></div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- 検索バー -->
        <div class="search-container">
          <div class="search-box">
            <button class="search-button search-button-left" @click="searchPosts">
              <span class="search-icon">
                <img src="@/assets/images/search.png" alt="検索" width="20">
              </span>
            </button>
            <input type="text" v-model="searchQuery" placeholder="ブログを検索..." class="search-input" maxlength="150"
              @keyup.enter="searchPosts" />
            <button v-if="searchQuery.length > 0" class="clear-icon-right" @click="clearSearchInput">
              ✕
            </button>
          </div>
          <div v-if="isSearching" class="search-status">
            <span>「{{ lastSearchQuery }}」の検索結果:
              {{ pagination.totalItems }}件</span>
            <button v-if="lastSearchQuery" class="clear-search" @click="clearSearch">
              検索をクリア
            </button>
          </div>
        </div>

        <!-- カテゴリフィルター -->
        <div class="blog-filter">
          <button v-for="category in categories" :key="category.id" class="filter-btn"
            :class="{ active: selectedCategory === category.id }" @click="filterByCategory(category.id)">
            {{ category.name }}
          </button>
        </div>

        <!-- ローディングコンポーネント -->
        <Loading v-if="isLoading" size="md" text="ブログ記事を読み込み中" min-height="500px" />

        <transition-group name="blog-fade" tag="div" class="blog-grid" v-else-if="posts.length > 0">
          <div v-for="post in posts" :key="post.id" class="blog-card" @mouseenter="hoverPost(post.id)"
            @mouseleave="unhoverPost()">
            <div class="blog-image">
              <div class="blog-image-placeholder" :style="{ backgroundColor: post.color || '#6A11CB' }">
                <img v-if="post.thumbnail && post.thumbnail.url" :src="post.thumbnail.url" alt="Blog thumbnail"
                  class="blog-thumbnail" />
                <div class="blog-overlay"></div>
              </div>
            </div>

            <div class="blog-content">
              <div class="blog-meta-row">
                <div class="blog-category">
                  <span class="blog-category-label" :class="getCategoryId(post.category)">
                    <span class="category-icon">
                      <img src="@/assets/images/folder.png" alt="フォルダアイコン" width="18">
                    </span>
                    {{ getCategoryName(getCategoryId(post.category)) }}
                  </span>
                </div>

                <p class="blog-publish-date">
                  <span class="date-icon">
                    <img src="@/assets/images/date-icon.png" alt="日付アイコン" width="20">
                  </span>
                  {{ formatDateWithStatus(post.publishedAt, post.revisedAt) }}
                </p>
              </div>

              <!-- タイトル -->
              <h3 class="blog-post-title">{{ post.title }}</h3>

              <!-- タグ -->
              <div class="blog-tags" v-if="post.tags && post.tags.length > 0">
                <template
                  v-for="(tag, index) in formatTags(post.tags)"
                  :key="index"
                >
                  <div class="blog-tag">
                    <img src="@/assets/images/tag.png" class="tag-icon" alt="タグアイコン" width="18" />
                    <span>
                      {{ tag }}
                    </span>
                  </div>
                </template>
              </div>

              <router-link :to="`/blog/${post.id}`" class="blog-details-link" @click.stop>
                続きを読む
              </router-link>
            </div>
          </div>
        </transition-group>

        <!-- ブログが0の場合のメッセージ -->
        <div v-else class="no-posts">
          <p v-if="isSearching">
            「{{ searchQuery }}」に一致する記事は見つかりませんでした。
          </p>
          <p v-else-if="selectedCategory !== 'all'">
            このカテゴリの記事はまだありません。
          </p>
          <p v-else>ブログ記事はまだありません。</p>
        </div>

        <!-- モバイル表示用のページネーションボタン -->
        <div class="mobile-pagination-buttons" v-if="
          pagination.totalPages > 1 &&
            !isLoading &&
            pagination.page < pagination.totalPages
          ">
          <button class="mobile-next-btn" @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages">
            次のページ
          </button>
        </div>

        <!-- ページネーションコンポーネント -->
        <blog-pagination v-if="pagination.totalPages > 1 && !isLoading" :current-page="pagination.page"
          :total-pages="pagination.totalPages" @page-change="changePage" />

        <!-- 件数表示 -->
        <div class="items-count" v-if="!isLoading && pagination.totalItems > 0">
          <p>
            全{{ pagination.totalItems }}件中
            {{ getDisplayRange().start }}&nbsp;〜&nbsp;{{ getDisplayRange().end }}件を表示
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeroStars from "@/components/common/HeroStars.vue";
import BlogPagination from "@/components/blog/BlogPagination.vue";
import Loading from "@/components/common/Loading.vue";

// 開発環境のみモックAPIを使用
if (process.env.VUE_APP_NODE_ENV === "development") {
  console.log("開発モードでブログのモックAPIが有効になっています");
  import("@/api/blog/mock").catch((err) => {
    console.warn("ブログモックのインポートに失敗しました:", err);
  });
}

export default {
  name: "BlogView",
  components: {
    HeroStars,
    BlogPagination,
    Loading,
  },
  data() {
    return {
      subtitleText: "",
      selectedCategory: "all",
      hoveredPost: null,
      isLoading: true,
      searchQuery: "",
      lastSearchQuery: "",
      isSearching: false,
      categories: [
        { id: "all", name: "すべて" },
        { id: "tech", name: "テクノロジー" },
        { id: "dev", name: "開発日記" },
        { id: "life", name: "日常" },
        { id: "hobby", name: "趣味" },
        { id: "other", name: "その他" },
      ],
      posts: [],
      pagination: {
        page: 1,
        perPage: 9,
        totalPages: 0,
        totalItems: 0,
      },
      typingInterval: null,
    };
  },
  mounted() {
    // タイピングアニメーション
    this.typing("subtitleText", "日々の学びや発見を記録していきます");

    const category = this.$route.query.category;
    if (category) {
      this.filterByCategory(category);
    } else {
      // ブログ記事データの取得
      this.fetchPosts();
    }
  },
  beforeUnmount() {
    // コンポーネント破棄時にタイムアウトをクリア
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  },
  methods: {
    // 表示範囲を計算するメソッド
    getDisplayRange() {
      const start = (this.pagination.page - 1) * this.pagination.perPage + 1;
      const end = Math.min(
        this.pagination.page * this.pagination.perPage,
        this.pagination.totalItems
      );
      return { start, end };
    },

    // 検索入力をクリアする新しいメソッド
    clearSearchInput() {
      this.searchQuery = "";
    },

    // ブログ記事データをAPIから取得
    fetchPosts() {
      this.isLoading = true;

      // APIリクエストのクエリパラメータを構築
      const params = {
        offset: (this.pagination.page - 1) * this.pagination.perPage,
        limit: this.pagination.perPage,
        orders : "-publishedAt" // コンテンツ作成日時の降順で取得
      };

      // フィルター条件を配列で管理
      const filterConditions = [];

      // カテゴリフィルタリング
      if (this.selectedCategory !== "all") {
        filterConditions.push(`category[contains]${this.selectedCategory}`);
      }

      // 記事タイトル検索
      if (this.isSearching && this.searchQuery?.trim()) {
        filterConditions.push(`title[contains]${this.searchQuery.trim()}`);
      }

      // フィルター条件がある場合のみparamsに追加
      if (filterConditions.length > 0) {
        params.filters = filterConditions.join('[and]');
      }

      this.$axios
        .get(process.env.VUE_APP_MICROCMS_URL, {
          params: params,
          headers: {
            "x-api-key": process.env.VUE_APP_MICROCMS_API_KEY,
          },
        })
        .then((response) => {

          if (response.status !== 200) {
            console.error("ブログ記事データの取得に失敗しました:", response.status);
            this.posts = [];
            this.pagination.totalPages = 0;
            this.pagination.totalItems = 0;
            this.isLoading = false;
            return;
          }

          if (response.data) {
            this.posts = response.data.contents || response.data || [];

            // ページネーション情報の更新
            if (response.data.totalCount !== undefined) {
              this.pagination.totalItems = response.data.totalCount;
              this.pagination.totalPages = Math.ceil(response.data.totalCount / this.pagination.perPage);
            } else {
              this.pagination.totalItems = 0;
              this.pagination.totalPages = 0;
            }
          } else {
            this.posts = [];
            this.pagination.totalItems = 0;
            this.pagination.totalPages = 0;
          }

          this.isLoading = false;
        })
        .catch((error) => {
          console.error("ブログ記事データの取得に失敗しました:", error);
          this.posts = [];
          this.pagination.totalPages = 0;
          this.pagination.totalItems = 0;
          this.isLoading = false;

          // エラーページにリダイレクト
          sessionStorage.setItem('errorCode', '500');
          this.$router.push('/error');
        });
    },

    // カテゴリIDを取得
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

    // タイピングアニメーション
    typing(textProperty, sentence) {
      let currentIndex = 0;

      // 既存のタイピングインターバルをクリア
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }

      this[textProperty] = "";

      // 新しいインターバルを設定
      this.typingInterval = setInterval(() => {
        if (currentIndex < sentence.length) {
          this[textProperty] += sentence[currentIndex];
          currentIndex++;
        } else {
          clearInterval(this.typingInterval);
        }
      }, 180);
    },

    // 検索を実行
    async searchPosts() {
      if (this.searchQuery.trim()) {
        this.isSearching = true;
        this.lastSearchQuery = this.searchQuery;
        this.pagination.page = 1;
        await this.fetchPosts();

        // カテゴリー位置まで移動
        const viewportHeight = window.innerHeight;
        const scrollOffset = viewportHeight * 0.4;
        document.documentElement.scrollTop = scrollOffset;
        document.body.scrollTop = scrollOffset;
      }
    },

    // 検索をクリア
    clearSearch() {
      this.searchQuery = "";
      this.lastSearchQuery = "";
      this.isSearching = false;
      this.pagination.page = 1;
      this.fetchPosts();
    },

    // カテゴリーでフィルタリング
    async filterByCategory(categoryId) {
      // 同じカテゴリーの場合は何もしない
      if (this.selectedCategory === categoryId) {
        return;
      }

      this.selectedCategory = categoryId;
      this.pagination.page = 1;
      await this.fetchPosts();

      // カテゴリー位置まで移動
      const viewportHeight = window.innerHeight;
      const scrollOffset = viewportHeight * 0.4;
      document.documentElement.scrollTop = scrollOffset;
      document.body.scrollTop = scrollOffset;
    },

    // ページを変更
    async changePage(page) {
      if (page < 1 || page > this.pagination.totalPages) return;

      this.pagination.page = page;
      await this.fetchPosts();

      // カテゴリー位置まで移動
      const viewportHeight = window.innerHeight;
      const scrollOffset = viewportHeight * 0.4;
      document.documentElement.scrollTop = scrollOffset;
      document.body.scrollTop = scrollOffset;
    },

    hoverPost(id) {
      this.hoveredPost = id;
    },
    unhoverPost() {
      this.hoveredPost = null;
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

    // 日付と更新・公開ステータスのフォーマット
    formatDateWithStatus(publishedAt, revisedAt) {
      const publishedDate = new Date(publishedAt);
      const revisedDate = new Date(revisedAt);

      // 日付部分のみ比較（時間は無視）
      const publishedDateOnly = new Date(publishedDate.getFullYear(), publishedDate.getMonth(), publishedDate.getDate());
      const revisedDateOnly = new Date(revisedDate.getFullYear(), revisedDate.getMonth(), revisedDate.getDate());

      // 日付が同じかどうかを判定
      const isSameDate = publishedDateOnly.getTime() === revisedDateOnly.getTime();

      if (isSameDate) {
        return this.formatDate(publishedAt) + "\u00A0\u00A0公開";
      } else {
        return this.formatDate(revisedAt) + "\u00A0\u00A0更新";
      }
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

      return [];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.blog-page {
  overflow-x: hidden;
}

.blog-hero {
  height: 40vh;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  text-align: center;
  margin-bottom: $spacing-xl;
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

.blog-title {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-md;
  text-shadow: $title-shadow;
}

.blog-subtitle {
  font-size: $font-size-xl;
  color: $color-text-secondary;
  font-family: "ZenMaruGothic", serif;
}

.typing-animation::after {
  content: "";
  border-right: 1px solid #333;
  margin-left: 2px;
  animation: flashing 1s linear infinite;
  opacity: 0;
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

.search-container {
  margin-bottom: $spacing-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-bottom: $spacing-md;
}

.search-input {
  width: 100%;
  padding: $spacing-md $spacing-xl $spacing-md calc(48px + $spacing-lg);
  border-radius: 8px;
  border: 1px solid rgba(120, 180, 255, 0.3);
  background: rgba(20, 20, 35, 0.6);
  color: rgb(220, 230, 255);
  font-size: $font-size-md;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 0 10px rgba(100, 150, 255, 0.15);

  &:focus {
    border-color: rgba(140, 200, 255, 0.5);
    box-shadow: 0 0 15px rgba(120, 180, 255, 0.3),
      inset 0 0 5px rgba(120, 180, 255, 0.1);
  }

  &::placeholder {
    color: rgba(150, 170, 255, 0.5);
  }
}

.clear-icon-right {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(100, 120, 200, 0.2);
  border: none;
  color: rgba(180, 200, 255, 0.8);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    background: rgba(120, 140, 220, 0.4);
    color: rgba(220, 230, 255, 1);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 0 8px rgba(140, 180, 255, 0.4);
  }
}

.search-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 38px;
  border-radius: 8px;
  background: rgba(20, 20, 35, 0.7);
  border: 1px solid rgba(120, 220, 255, 0.3);
  color: rgb(140, 230, 255);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(100, 200, 255, 0.2);
  z-index: 2;

  &.search-button-left {
    left: 8px;
  }

  &:hover {
    color: rgb(160, 250, 255);
    border-color: rgba(140, 240, 255, 0.6);
    box-shadow: 0 0 15px rgba(120, 220, 255, 0.4),
      inset 0 0 8px rgba(120, 220, 255, 0.2);
    text-shadow: 0 0 5px rgba(160, 250, 255, 0.8);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  .search-icon {
    font-size: 16px;
    filter: drop-shadow(0 0 2px rgba(160, 250, 255, 0.6));
  }
}

.search-status {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  color: $color-text-secondary;
  font-size: $font-size-sm;
}

.clear-search {
  background: rgba(20, 20, 35, 0.7);
  border: 1px solid rgba(120, 180, 255, 0.3);
  color: rgba(180, 200, 255, 0.8);
  padding: $spacing-xs $spacing-sm;
  border-radius: 6px;
  font-size: $font-size-xs;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 8px rgba(100, 150, 255, 0.15);

  &:hover {
    color: rgba(210, 220, 255, 1);
    border-color: rgba(140, 200, 255, 0.5);
    box-shadow: 0 0 12px rgba(120, 180, 255, 0.3);
    text-shadow: 0 0 5px rgba(180, 200, 255, 0.5);
    transform: translateY(-2px);
  }
}

.blog-filter {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.filter-btn {
  padding: $spacing-sm $spacing-lg;
  background: rgba(20, 20, 35, 0.7);
  color: rgba(180, 180, 255, 0.8);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(120, 120, 255, 0.3);
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  box-shadow: 0 0 8px rgba(100, 100, 255, 0.15);
  overflow: hidden;

  &:hover {
    color: $color-text-light;
    border: 1px solid rgba(140, 140, 255, 0.5);
    text-shadow: 0 0 5px rgba(180, 180, 255, 0.5);
    transform: translateY(-2px);
    background-size: 400% 400%;
    background-image: linear-gradient(90deg,
        $color-accent-1 0%,
        $color-accent-2 30%,
        $color-accent-1 70%,
        $color-accent-2 100%);
    animation: gradientFlow 20s ease-in-out infinite;
    box-shadow: 0 0 15px rgba(100, 100, 255, 0.5),
      0 0 30px rgba($color-accent-1, 0.3);
  }

  &.active {
    color: $color-text-light;
    border: 1px solid rgba(140, 200, 255, 0.6);
    text-shadow: 0 0 8px rgba(200, 220, 255, 0.8);
    background-size: 400% 400%;
    background-image: linear-gradient(90deg,
        $color-accent-1 0%,
        $color-accent-2 30%,
        $color-accent-1 70%,
        $color-accent-2 100%);
    animation: gradientFlow 20s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(100, 150, 255, 0.5),
      0 0 20px rgba($color-accent-2, 0.3),
      inset 0 0 10px rgba(100, 150, 255, 0.3);

    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg,
          transparent 0%,
          rgba(140, 180, 255, 1) 50%,
          transparent 100%);
      box-shadow: 0 0 10px rgba(140, 180, 255, 0.8),
        0 0 20px rgba($color-accent-1, 0.5);
    }
  }
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
  min-height: 300px;
}

.blog-card {
  background: rgba($color-secondary, 0.7);
  border-radius: 10px;
  overflow: hidden;
  transition: all $transition-normal ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 10px;
    padding: 2px;
    background: linear-gradient(135deg, $color-accent-1, $color-accent-2);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);

    &::after {
      opacity: 1;
    }

    .blog-overlay {
      opacity: 1;
    }
  }
}

.blog-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.blog-image-placeholder {
  width: 100%;
  height: 100%;
  transition: all $transition-normal ease;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  filter: brightness(85%);

  &:hover {
    transform: scale(1.05);
  }
}

.blog-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: translateY(0);
}

.blog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba($color-primary, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity $transition-normal ease;
}

.blog-content {
  padding: $spacing-lg;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blog-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  gap: $spacing-sm;
}

.blog-post-title {
  font-size: $font-size-xl;
  margin-bottom: $spacing-md;
  color: $color-text-primary;
  order: 2;
}

.blog-publish-date {
  color: $color-text-secondary;
  font-size: $font-size-xs;
  display: flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;

  .date-icon {
    margin-right: $spacing-xs;
    font-style: normal;
  }
}

.blog-category {
  flex-shrink: 0;
}

.blog-category-label {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: $font-size-xs;
  font-weight: 600;
  color: white;

  .category-icon {
    margin-right: $spacing-xs;
    font-style: normal;
  }

  &.tech {
    background-size: 400% 400%;
    background-image: linear-gradient(-45deg,
        $gradient-tech-start 0%,
        $gradient-tech-end 25%,
        $gradient-tech-start 50%,
        $gradient-tech-end 75%,
        $gradient-tech-start 100%);
    animation: gradientFlow 12s ease-in-out infinite;
  }

  &.dev {
    background-size: 400% 400%;
    background-image: linear-gradient(-45deg,
        $gradient-dev-start 0%,
        $gradient-dev-end 25%,
        $gradient-dev-start 50%,
        $gradient-dev-end 75%,
        $gradient-dev-start 100%);
    animation: gradientFlow 12s ease-in-out infinite;
  }

  &.life {
    background-size: 400% 400%;
    background-image: linear-gradient(-45deg,
        $gradient-life-start 0%,
        $gradient-life-end 25%,
        $gradient-life-start 50%,
        $gradient-life-end 75%,
        $gradient-life-start 100%);
    animation: gradientFlow 12s ease-in-out infinite;
  }

  &.hobby {
    background-size: 400% 400%;
    background-image: linear-gradient(-45deg,
        $gradient-hobby-start 0%,
        $gradient-hobby-end 25%,
        $gradient-hobby-start 50%,
        $gradient-hobby-end 75%,
        $gradient-hobby-start 100%);
    animation: gradientFlow 12s ease-in-out infinite;
  }

  &.other {
    background-size: 400% 400%;
    background-image: linear-gradient(-45deg,
        $gradient-other-start 0%,
        $gradient-other-end 25%,
        $gradient-other-start 50%,
        $gradient-other-end 75%,
        $gradient-other-start 100%);
    animation: gradientFlow 12s ease-in-out infinite;
  }
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  order: 3;

  img.tag-icon {
      margin-right: 5px;
  }

  .blog-tag {
    display: flex;
    background: rgba($color-accent-1, 0.1);
    color: $color-accent-2;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: $font-size-xs;
  }
}

.blog-details-link {
  color: $color-accent-2;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  position: relative;
  z-index: 2;
  margin-top: auto;
  order: 4;

  &::after {
    content: "→";
    margin-left: $spacing-sm;
    transition: transform $transition-normal ease;
  }

  &:hover,
  &:hover::after {
    color: $color-accent-1;
  }

  &:hover::after {
    transform: translateX(5px);
  }
}

.no-posts {
  text-align: center;
  padding: $spacing-xl;
  background: rgba($color-secondary, 0.5);
  border-radius: 10px;
  margin-bottom: $spacing-xl;

  p {
    color: $color-text-secondary;
    font-size: $font-size-lg;
  }
}

.mobile-pagination-buttons {
  display: none;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.mobile-next-btn {
  width: 100%;
  padding: $spacing-sm $spacing-md;
  background: rgba(20, 20, 35, 0.7);
  color: rgba(180, 200, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(120, 180, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(100, 150, 255, 0.15);
  overflow: hidden;

  &::after {
    content: "→";
    margin-left: 8px;
    transition: all 0.3s ease;
  }

  &:hover:not(:disabled) {
    color: $color-text-light;
    border: 1px solid rgba(140, 200, 255, 0.5);
    text-shadow: 0 0 5px rgba(180, 200, 255, 0.5);
    transform: translateY(-2px);
    background-size: 400% 400%;
    background-image: linear-gradient(90deg,
        $color-accent-1 0%,
        $color-accent-2 30%,
        $color-accent-1 70%,
        $color-accent-2 100%);
    animation: gradientFlow 20s ease-in-out infinite;
    box-shadow: 0 0 15px rgba(100, 150, 255, 0.3);

    &::after {
      transform: translateX(5px);
      text-shadow: 0 0 8px rgba(180, 200, 255, 0.8);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.blog-fade-enter-active,
.blog-fade-leave-active {
  transition: all 0.5s ease;
}

.blog-fade-enter-from,
.blog-fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.items-count {
  text-align: center;
  margin-top: $spacing-md;
  padding: $spacing-sm;

  p {
    color: $color-text-secondary;
    font-size: $font-size-sm;
    margin: 0;
  }
}

@keyframes flashing {

  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
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

@media (max-width: $breakpoint-lg) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr); // タブレットでは2列表示
  }
}

@media (max-width: $breakpoint-md) {
  .typing-animation::after {
    border-right: 2px solid #333;
  }

  .blog-filter {
    gap: $spacing-sm;
  }

  .filter-btn {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-sm;
  }

  .search-box {
    max-width: 100%;
  }

  .mobile-pagination-buttons {
    display: flex;
  }

  .blog-meta-row {
    gap: $spacing-xs;
  }

  .blog-publish-date {
    font-size: 10px;
  }

  .blog-category-label {
    font-size: 10px;
    padding: 4px 8px;
  }
}

@media (max-width: $breakpoint-sm) {
  .blog-grid {
    grid-template-columns: 1fr; // スマホでは1列表示
  }

  .blog-title {
    font-size: $font-size-3xl;
  }

  .blog-subtitle {
    font-size: $font-size-lg;
  }

  .search-status {
    flex-direction: column;
    gap: $spacing-sm;
  }
}
</style>
