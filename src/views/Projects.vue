<template>
  <div class="projects-page">
    <div class="projects-hero">
      <hero-stars />
      <div class="container">
        <h1 class="projects-title animated-gradient">プロジェクト</h1>
        <p class="projects-subtitle typing-animation">{{ subtitleText }}</p>
      </div>
      <div class="scroll-indicator">
        <span>スクロール</span>
        <div class="scroll-arrow"></div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="projects-filter">
          <button
            v-for="category in categories"
            :key="category.id"
            class="filter-btn"
            :class="{ active: selectedCategory === category.id }"
            @click="filterByCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- ローディングコンポーネント -->
        <Loading
          v-if="isLoading"
          size="md"
          text="プロジェクトを読み込み中"
          min-height="500px"
        />

        <transition-group
          name="projects-fade"
          tag="div"
          class="projects-grid"
          v-else-if="projects.length > 0"
        >
          <div
            v-for="project in projects"
            :key="project.id"
            class="project-card"
            @mouseenter="hoverProject(project.id)"
            @mouseleave="unhoverProject()"
          >
            <div class="project-image">
              <div
                class="project-image-placeholder"
                :style="{ backgroundColor: project.color }"
              >
                <img
                  v-if="
                    project.thumbnailPath && project.thumbnailPath.length > 0
                  "
                  :src="project.thumbnailPath"
                  alt="Project thumbnail"
                  class="project-thumbnail"
                />
                <div class="project-overlay">
                  <div class="project-links">
                    <a
                      :href="project.liveLink"
                      target="_blank"
                      class="project-link-btn"
                      v-if="project.liveLink"
                    >
                      <span>Live Demo</span>
                    </a>
                    <a
                      :href="project.codeLink"
                      target="_blank"
                      class="project-link-btn"
                      v-if="project.codeLink"
                    >
                      <span>Source Code</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>

              <!-- カテゴリー表示部分 -->
              <div class="project-category">
                <span class="category-icon">
                  <img src="@/assets/images/folder.png" alt="フォルダアイコン" width="20">
                </span>
                <span class="category-text">{{
                  getCategoryName(project.category)
                }}</span>
              </div>

              <div class="project-tags">
                <template
                  v-for="(tag, index) in project.tags"
                  :key="index"
                >
                  <div class="project-tag">
                    <img src="@/assets/images/tag.png" class="tag-icon" alt="タグアイコン" width="18" />
                    <span>
                      {{ tag }}
                    </span>
                  </div>
                </template>
              </div>

              <router-link
                :to="`/projects/${project.id}`"
                class="project-details-link"
                @click.stop
              >
                詳細を見る
              </router-link>
            </div>
          </div>
        </transition-group>

        <!-- プロジェクトが0の場合のメッセージ -->
        <div v-else class="no-projects">
          <p>この条件に一致するプロジェクトはまだありません。</p>
        </div>

        <!-- モバイル表示用のページネーションボタン -->
        <div
          class="mobile-pagination-buttons"
          v-if="pagination.totalPages > 1 && !isLoading"
        >
          <button class="mobile-next-btn" @click="changePage(pagination.page + 1)">
            次のページ
          </button>
        </div>

        <!-- ページネーションコンポーネント -->
        <projects-pagination
          v-if="pagination.totalPages > 1 && !isLoading"
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          @page-change="changePage"
        />

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
import ProjectsPagination from "@/components/projects/ProjectsPagination.vue";
import Loading from "@/components/common/Loading.vue";

// 開発環境のみモックAPIを使用
if (process.env.VUE_APP_NODE_ENV === "development") {
  console.log("開発モードでモックAPIが有効になっています");
  import("@/api/projects/mock").catch((err) => {
    console.warn("モックのインポートに失敗しました:", err);
  });
}

export default {
  name: "ProjectsView",
  components: {
    HeroStars,
    ProjectsPagination,
    Loading,
  },
  data() {
    return {
      subtitleText: "",
      selectedCategory: "all",
      hoveredProject: null,
      isLoading: true,
      categories: [],
      projects: [],
      pagination: {
        page: 1,
        perPage: 6,
        totalPages: 0,
        totalItems: 0
      },
    };
  },
  async mounted() {
    // タイピングアニメーション
    this.typing("subtitleText", "私の作品集を紹介します");

    // カテゴリーデータの取得
    await this.fetchCategories();

    // プロジェクトデータの取得
    await this.fetchProjects();
  },
  beforeUnmount() {
    // コンポーネント破棄時にタイムアウトをクリア
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  },
  methods: {
    // カテゴリーデータをAPIから取得
    fetchCategories() {
      this.$axios.get('/api/projects/categories')
      .then(response => {
        if (response.status !== 200) {
          throw new Error(`APIエラー: ${response.status}`);
        }
        this.categories = response.data.categories;
      })
      .catch(error => {
        console.error("カテゴリーデータの取得に失敗しました:", error);
        // エラー時はデフォルトのカテゴリーを設定
        this.categories = [
          { id: "all", name: "すべて" },
          { id: "web", name: "Webアプリ" },
          { id: "ui", name: "UIデザイン" },
          { id: "animation", name: "アニメーション" }
        ];
      });
    },

    // プロジェクトデータをAPIから取得
    fetchProjects() {
      this.isLoading = true;

      // APIリクエストのクエリパラメータを構築
      const params = {
        offset: (this.pagination.page - 1) * this.pagination.perPage,
        limit: this.pagination.perPage,
        category: this.selectedCategory
      };

      this.$axios.get('/api/projects', {
        params: params
      })
      .then(response => {
        if (response.status !== 200) {
          throw new Error(`APIエラー: ${response.status}`);
        }
        this.projects = response.data.projects;
        this.pagination.totalItems = response.data.pagination.totalItems;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.isLoading = false;
      })
      .catch(error => {
        console.error("プロジェクトデータの取得に失敗しました:", error);
        this.projects = [];
        this.pagination.totalPages = 0;
        this.pagination.totalItems = 0;
        this.isLoading = false;

        // エラーページにリダイレクト
        sessionStorage.setItem('errorCode', '500');
        this.$router.push('/error');
      });
    },

    // 表示範囲を計算するメソッド
    getDisplayRange() {
      const start = (this.pagination.page - 1) * this.pagination.perPage + 1;
      const end = Math.min(
        this.pagination.page * this.pagination.perPage,
        this.pagination.totalItems
      );
      return { start, end };
    },

    // カテゴリーIDからカテゴリー名を取得
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : "カテゴリーなし";
    },

    // カテゴリーでフィルタリング
    async filterByCategory(categoryId) {
      // 同じカテゴリーの場合は何もしない
      if (this.selectedCategory === categoryId) {
        return;
      }

      this.selectedCategory = categoryId;
      this.pagination.page = 1;
      await this.fetchProjects();

      // カテゴリー位置まで移動
      const container_hight = document.querySelector(".container").offsetTop;
      const viewportHeight = window.innerHeight;
      const scrollOffset = viewportHeight * 0.4;
      document.documentElement.scrollTop = container_hight + scrollOffset;
      document.body.scrollTop = container_hight + scrollOffset;
    },

    async changePage(page) {
      if (page < 1 || page > this.pagination.totalPages) {
        return;
      }

      this.pagination.page = page;
      await this.fetchProjects();

      // カテゴリー位置まで移動
      const container_hight = document.querySelector(".container").offsetTop;
      const viewportHeight = window.innerHeight;
      const scrollOffset = viewportHeight * 0.4;
      document.documentElement.scrollTop = container_hight + scrollOffset;
      document.body.scrollTop = container_hight + scrollOffset;
    },

    // タイピングアニメーション
    typing(textProperty, sentence) {
      let currentIndex = 0;

      // 既存のタイピングインターバルをクリア
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }

      // テキストをリセット
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

    // プロジェクトホバー処理
    hoverProject(id) {
      this.hoveredProject = id;
    },

    // プロジェクトホバー解除処理
    unhoverProject() {
      this.hoveredProject = null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.projects-page {
  overflow-x: hidden;
}

.projects-hero {
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
  background-image: linear-gradient(
    -45deg,
    $color-accent-2 0%,
    $color-accent-1 25%,
    $color-accent-2 50%,
    $color-accent-1 75%,
    $color-accent-2 100%
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 12s ease-in-out infinite;
}

.projects-title {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-md;
  text-shadow: $title-shadow;
}

.projects-subtitle {
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

.projects-filter {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.filter-btn {
  padding: $spacing-sm $spacing-lg;
  background: rgba($color-secondary, 0.7);
  color: $color-text-secondary;
  border-radius: 30px;
  cursor: pointer;
  transition: all $transition-normal ease;
  border: 1px solid rgba($color-accent-2, 0.1);
  filter: brightness(95%);

  &:hover,
  &.active {
    background-size: 400% 400%;
    background-image: linear-gradient(
      -45deg,
      $color-accent-2 0%,
      $color-accent-1 25%,
      $color-accent-2 50%,
      $color-accent-1 75%,
      $color-accent-2 100%
    );
    animation: gradientFlow 12s ease-in-out infinite;
    color: $color-text-primary;
    box-shadow: 0 5px 15px rgba($color-accent-1, 0.3);
    transform: translateY(-2px);
  }

  &.active {
    font-weight: 600;
  }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
  min-height: 300px;
}

.project-card {
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

    .project-overlay {
      opacity: 1;
    }
  }
}

.project-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.project-image-placeholder {
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

.project-thumbnail {
  width: 85%;
  height: 85%;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: translateY(0);
}

.project-overlay {
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

.project-links {
  display: flex;
  gap: $spacing-md;
}

.project-link-btn {
  padding: $spacing-sm $spacing-md;
  background: linear-gradient(-45deg, $color-accent-1, $color-accent-2);
  color: $color-text-primary;
  border-radius: 5px;
  font-size: $font-size-sm;
  font-weight: 600;
  transition: all $transition-normal ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba($color-accent-1, 0.5);
    background-size: 400% 400%;
    background-image: linear-gradient(
      -45deg,
      $color-accent-2 0%,
      $color-accent-1 25%,
      $color-accent-2 50%,
      $color-accent-1 75%,
      $color-accent-2 100%
    );
    animation: gradientFlow 12s ease-in-out infinite;
  }
}

.project-content {
  padding: $spacing-lg;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-title {
  font-size: $font-size-xl;
  margin-bottom: $spacing-sm;
  color: $color-text-primary;
}

.project-description {
  color: $color-text-secondary;
  margin-bottom: $spacing-md;
  font-size: $font-size-md;
  flex: 1;
}

.project-category {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-md;
  color: $color-text-secondary;
  font-size: $font-size-sm;
}

.category-icon {
  margin-right: $spacing-xs;
  font-size: $font-size-md;
}

.category-text {
  font-weight: 500;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;

  img.tag-icon {
      margin-right: 5px;
  }

  .project-tag {
    display: flex;
    background: rgba($color-accent-1, 0.1);
    color: $color-accent-2;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: $font-size-xs;
  }
}

.project-details-link {
  color: $color-accent-2;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  position: relative;
  z-index: 2;

  &::after {
    content: "→";
    margin-left: $spacing-sm;
    transition: transform $transition-normal ease;
  }

  &:hover, &:hover::after {
    color: $color-accent-1;
  }

  &:hover::after {
    transform: translateX(5px);
  }
}
.no-projects {
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

.projects-fade-enter-active,
.projects-fade-leave-active {
  transition: all 0.5s ease;
}

.projects-fade-enter-from,
.projects-fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.btn-lg {
  padding: $spacing-md $spacing-2xl;
  font-size: $font-size-lg;
}

.mobile-pagination-buttons {
  display: none;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
  gap: $spacing-sm;
}

.mobile-prev-btn,
.mobile-next-btn {
  flex: 1;
  padding: $spacing-sm $spacing-md;
  background: rgba($color-secondary, 0.7);
  color: $color-text-secondary;
  border-radius: 5px;
  border: 1px solid rgba($color-accent-2, 0.2);
  cursor: pointer;
  transition: all $transition-normal ease;

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
    color: $color-text-primary;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

@media (max-width: $breakpoint-md) {
  .typing-animation::after {
    border-right: 2px solid #333;
  }

  .projects-filter {
    gap: $spacing-sm;
  }

  .filter-btn {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-sm;
  }

  .mobile-pagination-buttons {
    display: flex;
  }
}
</style>
