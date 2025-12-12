<template>
  <div class="project-detail-page">
    <div
      class="project-hero"
      :style="{ backgroundColor: project?.color || '#000' }"
    >
      <div class="container">
        <div class="back-btn-wrapper">
          <router-link to="/projects" class="back-btn">
            <span>←</span> プロジェクト一覧に戻る
          </router-link>
        </div>
        <h1 class="project-title" v-if="project">{{ project.title }}</h1>
        <div class="project-tags" v-if="project">
          <span
            v-for="(tag, index) in project.tags"
            :key="index"
            class="project-tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <Loading
      v-if="loading"
      text="プロジェクトを読み込み中"
      fullPage="true"
      size="lg"
    />

    <div class="not-found" v-else-if="!project">
      <div class="container text-center">
        <h2 class="not-found-title">プロジェクトが見つかりません</h2>
        <p class="not-found-text">
          お探しのプロジェクトは存在しないか、削除された可能性があります。
        </p>
        <router-link to="/projects" class="btn btn-primary"> プロジェクト一覧へ </router-link>
      </div>
    </div>

    <div class="project-content" v-else>
      <section class="section">
        <div class="container">
          <div class="project-overview">
            <div class="project-image">
              <div
                class="project-image-container"
                :style="{ backgroundColor: project.color }"
              >
                <!-- サムネイル画像がある場合は表示、ない場合は背景色のみ -->
                <img
                  v-if="
                    project.thumbnailPath && project.thumbnailPath.length > 0
                  "
                  :src="project.thumbnailPath"
                  alt="プロジェクトイメージ"
                  class="project-thumbnail clickable-image"
                  ref="projectThumbnail"
                  @click="showImage"
                />
              </div>
            </div>
            <div class="project-details">
              <h2 class="section-title">プロジェクト概要</h2>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-meta">
                <div class="meta-item">
                  <h3 class="meta-title">カテゴリー</h3>
                  <p class="meta-text">
                    {{ getCategoryName(project.category) }}
                  </p>
                </div>
                <div class="meta-item" v-if="project.tags && project.tags.length > 0">
                  <h3 class="meta-title">主要な技術スタック</h3>
                  <div class="meta-tags">
                    <span
                      v-for="(tag, index) in project.tags"
                      :key="index"
                      class="meta-tag">
                        {{ tag }}
                      </span>
                  </div>
                </div>
                <div class="meta-item" v-if="project.liveLink || project.codeLink">
                  <h3 class="meta-title">外部リンク</h3>
                  <div class="meta-links">
                    <a
                      v-if="project.liveLink"
                      :href="project.liveLink"
                      target="_blank"
                      class="meta-link"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link meta-link-icon link-icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      <span>Live Demo</span>
                    </a>
                    <a
                      v-if="project.codeLink"
                      :href="project.codeLink"
                      target="_blank"
                      class="meta-link"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="meta-link-icon link-icon"><path fill="currentColor" d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436c.55.096.756-.233.756-.522c0-.262-.013-1.128-.013-2.049c-2.764.509-3.479-.674-3.699-1.292c-.124-.317-.66-1.293-1.127-1.554c-.385-.207-.936-.715-.014-.729c.866-.014 1.485.797 1.691 1.128c.99 1.663 2.571 1.196 3.204.907c.096-.715.385-1.196.701-1.471c-2.448-.275-5.005-1.224-5.005-5.432c0-1.196.426-2.186 1.128-2.956c-.111-.275-.496-1.402.11-2.915c0 0 .921-.288 3.024 1.128a10.2 10.2 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371c2.104-1.43 3.025-1.128 3.025-1.128c.605 1.513.221 2.64.111 2.915c.701.77 1.127 1.747 1.127 2.956c0 4.222-2.571 5.157-5.019 5.432c.399.344.743 1.004.743 2.035c0 1.471-.014 2.654-.014 3.025c0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11"/></svg>
                      <span>Source Code</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">プロジェクトの詳細</h2>
          <div class="project-full-description">
            <p
              v-for="(paragraph, index) in formattedFullDescription"
              :key="index"
            >
              {{ paragraph }}
            </p>
          </div>

          <!-- 主な機能リストを動的に表示 -->
          <div class="project-features" v-if="project.features.length > 0">
            <h3 class="features-title">主な機能</h3>
            <ul class="features-list">
              <li
                v-for="(feature, index) in project.features"
                :key="index"
                class="feature-item"
              >
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 関連プロジェクト -->
      <section
        class="section related-projects-section"
        v-if="relatedProjects.length > 0"
      >
        <div class="container">
          <h2 class="section-title">関連プロジェクト</h2>

          <!-- カルーセルを使用した関連プロジェクト表示 -->
          <div class="related-projects-carousel">
            <carousel
              :items-to-show="carouselItemsToShow"
              :wrap-around="true"
              :autoplay="3000"
              :transition="500"
              :breakpoints="carouselBreakpoints"
            >
              <slide
                v-for="relatedProject in relatedProjects"
                :key="relatedProject.id"
              >
                <div class="related-project-card">
                  <div
                    class="related-project-image"
                    :style="{ backgroundColor: relatedProject.color }"
                  >
                    <!-- 関連プロジェクトのサムネイル画像表示 -->
                    <img
                      v-if="
                        relatedProject.thumbnailPath &&
                        relatedProject.thumbnailPath.length > 0
                      "
                      :src="relatedProject.thumbnailPath"
                      alt="関連プロジェクトイメージ"
                      class="related-project-thumbnail"
                    />
                  </div>
                  <div class="related-project-content">
                    <h3 class="related-project-title">
                      {{ relatedProject.title }}
                    </h3>
                    <router-link
                      :to="`/projects/${relatedProject.id}`"
                      class="related-project-link"
                    >
                      詳細を見る
                    </router-link>
                  </div>
                </div>
              </slide>

              <template #addons>
                <navigation>
                  <template #prev>
                    <button class="carousel-nav carousel-prev">
                      <span>←</span>
                    </button>
                  </template>
                  <template #next>
                    <button class="carousel-nav carousel-next">
                      <span>→</span>
                    </button>
                  </template>
                </navigation>
                <pagination />
              </template>
            </carousel>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script>
import Loading from "@/components/common/Loading.vue";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import "viewerjs/dist/viewer.css";

// 開発環境のみモックAPIを使用
if (process.env.VUE_APP_NODE_ENV === "development") {
  console.log("開発モードでモックAPIが有効になっています");
  import("@/api/projects/mock").catch((err) => {
    console.warn("モックのインポートに失敗しました:", err);
  });
}

export default {
  name: "ProjectDetailView",
  components: {
    Loading,
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  data() {
    return {
      loading: true,
      project: null,
      categories: [],
      relatedProjects: [],
      maxItems: 5, // カルーセル用に表示させるアイテム数
      // カルーセル設定
      carouselItemsToShow: 3,
      carouselBreakpoints: {
        0: {
          itemsToShow: 1,
        },
        768: {
          itemsToShow: 2,
        },
        1200: {
          itemsToShow: 3,
        },
      },
      viewer: null,
    };
  },
  computed: {
    // プロジェクトIDをルートパラメータから取得
    projectId() {
      return this.$route.params.id;
    },
    // 改行を含む詳細説明を段落ごとに分割して配列に変換
    formattedFullDescription() {
      if (!this.project || !this.project.fullDescription) return [];

      // \\n\\n（文字列リテラル）を実際の改行文字に変換してから分割
      return this.project.fullDescription
        .replace(/\\n\\n/g, '\n\n')  // \\n\\n を \n\n に変換
        .split('\n\n')               // 実際の改行文字で分割
        .filter(paragraph => paragraph.trim().length > 0); // 空の段落を除去
    },
    // モーダルに表示する画像のURL
    projectImageUrl() {
      return this.project && this.project.thumbnailPath
        ? this.project.thumbnailPath
        : null;
    },
  },
  async mounted() {

    // カテゴリーデータの取得
    await this.fetchCategories();

    // ブログ詳細データの取得
    await this.fetchProjectDetail();
  },
  updated() {
    // DOMが更新された後にビューワーの初期化を試みる
    this.$nextTick(() => {
      if (this.$refs.projectThumbnail && !this.viewer) {
        this.initViewer();
      }
    });
  },
  watch: {
    // URLのプロジェクトIDが変わったら再取得
    projectId() {
      this.fetchProjectDetail();
    },
    // プロジェクトが変更されたら既存のビューワーを破棄して再初期化
    project() {
      if (this.viewer) {
        this.viewer.destroy();
        this.viewer = null;
      }
    },
  },
  methods: {
    // カテゴリーデータをAPIから取得
    fetchCategories() {
      this.$axios.get('/projects/categories')
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

    // プロジェクトデータとその関連プロジェクトをAPIから取得
    fetchProjectDetail() {
      this.loading = true;

      this.$axios
        .get(`/projects/${this.projectId}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`APIエラー: ${response.status}`);
          }
          // プロジェクト詳細と関連プロジェクトを取得
          this.project = response.data.project;

          this.relatedProjects = response.data.relatedProjects || [];

          this.loading = false;

          // データロード後にビューワーを初期化
          this.$nextTick(() => {
            if (this.$refs.projectThumbnail) {
              this.initViewer();
            }
          });
        })
        .catch((error) => {
          console.error("プロジェクト詳細の取得に失敗しました:", error);
          this.project = null;
          this.relatedProjects = [];
          this.loading = false;
        });
    },

    // カテゴリーIDからカテゴリー名を取得
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : "カテゴリーなし";
    },

    // ViewerJSの初期化
    initViewer() {
      if (this.$refs.projectThumbnail) {
        // ViewerJSをrequireで取得
        const Viewer = require("viewerjs");

        this.viewer = new Viewer(this.$refs.projectThumbnail, {
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
  },
  // コンポーネント破棄時にビューワーを破棄
  beforeUnmount() {
    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = null;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.project-detail-page {
  overflow-x: hidden;
}

.project-hero {
  min-height: 300px;
  padding: $spacing-2xl 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba($color-primary, 0.7),
      rgba($color-secondary, 0.9)
    );
    z-index: 0;
  }
}

.back-btn-wrapper {
  margin-bottom: $spacing-lg;
  position: relative;
  z-index: 1;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  color: $color-text-secondary;
  font-size: $font-size-md;
  transition: all $transition-normal ease;

  span {
    margin-right: $spacing-sm;
    transition: transform $transition-normal ease;
  }

  &:hover {
    color: $color-text-primary;

    span {
      transform: translateX(-5px);
    }
  }
}

.project-title {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-lg;
  padding-bottom: $spacing-lg;
  position: relative;
  z-index: 1;
  color: $color-text-primary;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  position: relative;
  z-index: 1;
}

.btn {
  box-shadow: 0 5px 15px rgba($color-accent-1, 0.5);
  background-size: 500% 500%;
  background-image: linear-gradient(
    90deg,
    $color-accent-2 0%,
    $color-accent-1 25%,
    $color-accent-2 50%,
    $color-accent-1 75,
    $color-accent-2 100%
  );
  animation: gradientFlow 12s ease-in-out infinite;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  filter: brightness(98%);

  &:hover {
    color: $color-text-secondary;
    transform: translateY(-5px);
  }
}

.project-tag {
  background: rgba($color-accent-1, 0.15);
  color: $color-text-primary;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: $font-size-sm;
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    background: rgba($color-accent-1, 0.25);
  }
}

.not-found {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  .not-found-title {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-md;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 340px;
      height: 3px;
      background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
      border-radius: 1.5px;
    }
  }

  .not-found-text {
    color: $color-text-secondary;
    margin-bottom: $spacing-lg;
  }
}

.section {
  padding: $spacing-xl 0;
}

.project-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.project-image {
  height: 400px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;

  &::after {
    content: "クリックで拡大";
    position: absolute;
    bottom: 40px;
    right: 40px;
    color: $color-text-light;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 10;
  }

  &:hover::after {
    opacity: 1;
  }
}

.project-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  filter: brightness(85%);
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.2) 1px,
      transparent 1px
    );
    background-size: 15px 15px;
    opacity: 0;
    transform: rotate(45deg);
    transition: opacity 0.6s ease;
    pointer-events: none;
    z-index: 0;
  }

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.2);

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 0.4;
      animation: twinkle 8s linear infinite;
    }

    .project-thumbnail {
      transform: scale(1.05);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
  }
}

.project-thumbnail {
  max-width: 85%;
  max-height: 85%;
  position: relative;
  z-index: 2;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: translateY(0);
}

.clickable-image {
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;

  &:hover {
    transform: scale(1.02);
    filter: brightness(1.1);
  }
}

.section-title {
  font-size: $font-size-2xl;
  margin-bottom: $spacing-lg;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 250px;
    height: 3px;
    background: linear-gradient(
      90deg,
      $color-accent-1,
      $color-accent-2,
      transparent
    );
  }
}

.project-description {
  font-size: $font-size-lg;
  line-height: 1.7;
  color: $color-text-secondary;
  margin-bottom: $spacing-lg;
}

.project-meta {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-lg;
  margin-top: $spacing-xl;
}

.meta-item {
  background: rgba($color-secondary, 0.5);
  border-radius: 10px;
  padding: $spacing-md;
  border: 1px solid rgba($color-accent-2, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba($color-accent-1, 0.05),
      rgba($color-accent-2, 0.05)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

    &::before {
      opacity: 1;
    }
  }
}

.meta-title {
  font-size: $font-size-md;
  margin-bottom: $spacing-sm;
  color: $color-text-primary;
  position: relative;
  z-index: 1;
}

.meta-text {
  color: $color-text-secondary;
  position: relative;
  z-index: 1;
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  position: relative;
  z-index: 1;

  .meta-tag {
    display: flex;
    background: rgba($color-accent-1, 0.1);
    color: $color-accent-2;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: $font-size-xs;
    position: relative;
    z-index: 1;
  }
}

.meta-links {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  position: relative;
  z-index: 1;
}

.meta-link {
  display: inline-flex;
  align-items: center;
  color: $color-accent-2;
  font-weight: 600;
  transition: transform 0.3s ease, color 0.3s ease;
  position: relative;
  padding: 5px 0;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, $color-accent-2, $color-accent-1);
    transition: width 0.3s ease;
  }

  &::after {
    content: "→";
    margin-left: $spacing-sm;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    color: lighten($color-accent-2, 10%);

    &::before {
      width: 100%;
    }

    &::after {
      transform: translateX(5px);
    }
  }
}

.meta-link-icon {
  margin-right: $spacing-xs;
  transition: all 0.3s ease;
  color: #fff;
  width: 16px;
  height: 16px;

  &.link-icon:first-child {
    .meta-link:hover & {
      color: lighten($color-accent-2, 10%);
    }
  }

  &.link-icon:last-child {
    .meta-link:hover & {
      color: lighten($color-accent-2, 10%);
    }
  }

  .meta-link:hover & {
    color: lighten($color-accent-2, 10%);
    transform: scale(1.1);
  }
}

.project-full-description {
  margin-bottom: $spacing-xl;

  p {
    margin-bottom: $spacing-md;
    font-size: $font-size-md;
    line-height: 1.7;
    color: $color-text-secondary;
  }
}

.features-title {
  font-size: $font-size-xl;
  margin-bottom: $spacing-md;
  color: $color-text-primary;
}

.features-list {
  list-style-type: none;
  margin-left: $spacing-md;
}

.feature-item {
  position: relative;
  padding-left: $spacing-lg;
  margin-bottom: $spacing-md;
  color: $color-text-secondary;
  transition: transform 0.3s ease, color 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(90deg, $color-accent-2, $color-accent-1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  &:hover {
    transform: translateX(5px);
    color: $color-text-primary;

    &::before {
      transform: scale(1.5);
      box-shadow: 0 0 10px rgba($color-accent-1, 0.6);
    }
  }
}

.related-projects-section {
  background: rgba($color-secondary, 0.3);
  padding: $spacing-2xl 0;
}

.related-projects-carousel {
  margin: 0 auto;
  position: relative;
  padding: 0 35px;
  max-width: 98%;
}

.carousel-nav {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba($color-secondary, 0.8);
  border: 1px solid rgba($color-accent-1, 0.3);
  color: $color-text-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba($color-accent-1, 0.3);
    box-shadow: 0 0 15px rgba($color-accent-1, 0.4);
  }

  span {
    font-size: 22px;
    line-height: 1;
  }
}

.carousel-prev {
  left: 5px;
}

.carousel-next {
  right: 5px;
}

:deep(.carousel__pagination) {
  margin-top: $spacing-2xl;
  padding-bottom: $spacing-lg;
}

:deep(.carousel__pagination-button) {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba($color-accent-1, 0.3);
  transition: all 0.3s ease;
  margin: 0 6px;
}

:deep(.carousel__pagination-button:hover),
:deep(.carousel__pagination-button--active) {
  background: $color-accent-1;
  transform: scale(1.2);
}

.related-project-card {
  background: rgba($color-secondary, 0.7);
  border-radius: 10px;
  overflow: hidden;
  transition: all $transition-normal ease;
  position: relative;
  margin: 15px;
  height: 420px;
  width: calc(100% - 30px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 10px;
    padding: 1px;
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
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);

    &::after {
      opacity: 1;
    }
  }
}

.related-project-image {
  height: 280px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  filter: brightness(85%);

  &:hover {
    .related-project-thumbnail {
      transform: scale(1.05);
    }
  }
}

.related-project-content {
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.related-project-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-sm;
  color: $color-text-primary;
  line-height: 1.3;
  max-height: 2.6em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-project-thumbnail {
  max-width: 80%;
  max-height: 80%;
  position: relative;
  z-index: 1;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: translateY(0);
}

.related-project-link {
  color: $color-accent-2;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
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

.text-center {
  text-align: center;
}

.btn-lg {
  padding: $spacing-md $spacing-2xl;
  font-size: $font-size-lg;
}

@keyframes twinkle {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.4;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dots {
  0%,
  20% {
    content: ".";
  }
  40% {
    content: "..";
  }
  60%,
  100% {
    content: "...";
  }
}

@media (max-width: $breakpoint-md) {
  .project-title {
    font-size: $font-size-3xl;
  }

  .project-overview {
    grid-template-columns: 1fr;
  }

  .project-image {
    height: 250px;

    &::after {
      content: "";
      bottom: 0px;
      right: 0px;
    }
  }

  .related-projects-carousel {
    padding: 0 25px;
    max-width: 100%;
  }

  .carousel-nav {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .carousel-prev {
    left: 0px;
  }

  .carousel-next {
    right: 0px;
  }

  .related-project-card {
    margin: 10px;
    height: 390px;
  }

  .related-project-image {
    height: 250px;
  }

  .btn {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-sm;
    width: 100%;
    max-width: 300px;
  }

  .btn-lg {
    padding: $spacing-sm $spacing-lg;
    font-size: $font-size-md;
    width: 100%;
    max-width: 250px;
  }

  :deep(.carousel__pagination) {
    margin-top: $spacing-xl;
  }
}
</style>
