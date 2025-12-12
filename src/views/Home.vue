<template>
  <div class="home-page">
    <div class="hero-section">
      <hero-stars />
      <div class="container hero-container">
        <div class="hero-content">
          <h1 class="hero-title animated-gradient">
            <span class="hero-title-accent">Taiki Note</span>
          </h1>
          <div class="hero-subtitle">
            <p
              class="drawing-subtitle-top"
              :class="{ 'typing-decoration': isTypingDec }"
            >
              {{ topText }}
            </p>
            <p
              class="drawing-subtitle-bottom"
              :class="{ 'typing-decoration': !isTypingDec }"
            >
              {{ bottomText }}
            </p>
          </div>
        </div>
        <div class="hero-image">
          <planet-animation />
        </div>
      </div>
      <div class="scroll-indicator">
        <span>スクロール</span>
        <div class="scroll-arrow"></div>
      </div>
    </div>

    <section class="section featured-projects" ref="featuredProjectsSection">
      <div class="container">
        <h2
          class="section-title section-featured-projects-title scroll-animated"
          :class="{
            'fade-in-up': true,
            active: animatedSections.featuredProjects,
          }"
        >
          注目のプロジェクト
        </h2>

        <!-- ローディング表示 -->
        <Loading
          v-if="isLoading"
          type="circle"
          size="md"
          text="プロジェクトを読み込み中"
          :with-background="true"
        />

        <!-- プロジェクト表示 -->
        <div v-else class="projects-grid">
          <div
            v-for="(project, index) in featuredProjects"
            :key="project.id"
            class="project-card scroll-animated"
            :class="{
              'fade-in-up': true,
              active: animatedSections.featuredProjects,
            }"
            :style="{ 'animation-delay': `${0.2 * index}s` }"
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
              <div class="project-tags">
                <span
                  v-for="(tag, index) in project.tags"
                  :key="index"
                  class="project-tag"
                >
                  {{ tag }}
                </span>
              </div>
              <router-link :to="`/projects/${project.id}`" class="project-link">
                詳細を見る
              </router-link>
            </div>
          </div>
        </div>
        <div
          v-if="!isLoading"
          class="text-center scroll-animated"
          :class="{
            'fade-in-up': true,
            active: animatedSections.featuredProjects,
          }"
          style="animation-delay: 0.6s"
        >
          <router-link to="/projects" class="btn btn-outline">
            すべてのプロジェクトを見る
          </router-link>
        </div>
      </div>
    </section>

    <section class="section about-preview" ref="aboutSection">
      <div class="container">
        <div class="about-grid">
          <div class="about-content">
            <h2
              class="section-title scroll-animated about-title"
              :class="{
                'fade-in-left': true,
                active: animatedSections.about,
              }"
            >
              自己紹介
            </h2>
            <p
              class="about-text scroll-animated"
              :class="{
                'fade-in-left': true,
                active: animatedSections.about,
              }"
              style="animation-delay: 0.2s"
            >
              はじめまして、Taikiと申します。フロントエンド・バックエンド開発を中心に、ユーザーが使いやすいWebアプリケーションの構築に取り組んでいます。
            </p>
            <p
            class="about-text scroll-animated"
            :class="{
              'fade-in-left': true,
              active: animatedSections.about,
            }"
              style="animation-delay: 0.4s"
            >
              技術を通じて人々の生活をより豊かにすることを目指しています。このサイトでは、これまでに手がけたプロジェクトの紹介や、開発で得た知見をブログとして共有しています。訪れてくださった皆様にとって、何か新しい発見や学びがあれば幸いです。
            </p>
            <div
            class="scroll-animated"
            :class="{
              'fade-in-left': true,
              active: animatedSections.about,
            }"
            style="animation-delay: 0.6s"
            >
              <router-link to="/about" class="btn about-btn">
                もっと詳しく
              </router-link>
            </div>
          </div>
          <div
            class="about-image scroll-animated"
            :class="{
              'fade-in-right': true,
              active: animatedSections.about,
            }"
          >
            <skills-constellation />
          </div>
        </div>
      </div>
    </section>

    <div class="canvas-teaser" ref="canvasSection">
      <div class="container">
        <div class="canvas-teaser-content">
          <h3
            class="canvas-teaser-title scroll-animated"
            :class="{
              'fade-in-up': true,
              active: animatedSections.canvas,
            }"
          >
            星空の中に、あなたのアートを浮かべてみませんか？
          </h3>
          <router-link
            to="/canvas"
            class="btn btn-constellation scroll-animated"
            :class="{
              'fade-in-up': true,
              active: animatedSections.canvas,
            }"
            style="animation-delay: 0.3s"
          >
            キャンバスで描く
            <div class="star star-1"></div>
            <div class="star star-2"></div>
            <div class="star star-3"></div>
            <div class="star star-4"></div>
            <div class="star star-5"></div>
            <div class="star star-6"></div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlanetAnimation from "@/components/home/PlanetAnimation.vue";
import SkillsConstellation from "@/components/home/SkillsConstellation.vue";
import HeroStars from "@/components/common/HeroStars.vue";
import Loading from "@/components/common/Loading.vue";

// 開発環境のみモックAPIを使用
if (process.env.VUE_APP_NODE_ENV === "development") {
  console.log("開発モードでモックAPIが有効になっています");
  import("@/api/home/mock").catch((err) => {
    console.warn("モックのインポートに失敗しました:", err);
  });
}

export default {
  name: "HomeView",
  components: {
    PlanetAnimation,
    SkillsConstellation,
    HeroStars,
    Loading,
  },
  data() {
    return {
      isTypingDec: true,
      topText: "",
      bottomText: "",
      hoveredProject: null,
      isLoading: true,
      // スクロールアニメーション用の状態を追加
      observers: [],
      // オブジェクト形式でアニメーション状態を管理
      animatedSections: {
        featuredProjects: false,
        about: false,
        canvas: false,
      },
      featuredProjects: [],
    };
  },
  mounted() {
    console.log(
      "%cTaiki Noteへようこそ！",
      "font-size: 24px; font-weight: bold; background: linear-gradient(to right, #6A11CB, #2575FC); -webkit-background-clip: text; color: transparent;"
    );
    // タイピングアニメーション
    this.typing("topText", "当サイトはポートフォリオ＆", () => {
      this.isTypingDec = false;
      this.typing("bottomText", "ブログサイトです");
    });

    // おすすめプロジェクトのデータを取得
    this.fetchFeaturedProjects();

    // Intersection Observerの設定
    this.setupScrollObservers();

    // スクロールイベントリスナーの追加
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    // コンポーネントが破棄される前にObserverとイベントリスナーを解除
    this.destroyObservers();
    window.removeEventListener("scroll", this.handleScroll);
    // コンポーネント破棄時にインターバルをクリア
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  },
  methods: {
    typing(textProperty, sentence, callback) {
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
          // タイピング完了後にコールバックを実行
          if (typeof callback === 'function') {
            callback();
          }
        }
      }, 200);
    },
    // おすすめプロジェクトのデータをAPIから取得
    fetchFeaturedProjects() {
      this.isLoading = true;

      this.$axios
        .get('/projects/featured')
        .then((response) => {
          this.featuredProjects = response.data.featuredProjects;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error("おすすめプロジェクトデータの取得に失敗しました:", error);
          this.isLoading = false;
          this.featuredProjects = [];

          // エラーページにリダイレクト
          sessionStorage.setItem('errorCode', '500');
          this.$router.push('/error');
        });
    },
    hoverProject(id) {
      this.hoveredProject = id;
    },
    unhoverProject() {
      this.hoveredProject = null;
    },
    // スクロールオブザーバーの設定
    setupScrollObservers() {
      // 監視するセクション要素を定義
      const sections = [
        { ref: this.$refs.featuredProjectsSection, id: "featuredProjects" },
        { ref: this.$refs.aboutSection, id: "about" },
        { ref: this.$refs.canvasSection, id: "canvas" },
      ];

      // 各セクションに対してIntersection Observerを設定
      sections.forEach((section) => {
        if (section.ref) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                // セクションが画面内に入るときのみアニメーションを実行
                if (entry.isIntersecting) {
                  // アニメーション再生用にフラグをtrueに設定
                  this.animatedSections[section.id] = true;

                  // 要素が画面外に出たときのみアニメーションをリセットして
                  // 次回のスクロール時にもアニメーションを実行できるようにする
                } else {
                  // 画面外に出たらアニメーションをリセット
                  this.animatedSections[section.id] = false;
                }
              });
            },
            {
              root: null, // ビューポートを基準
              threshold: 0.1, // 10%見えた時に発火
              rootMargin: "-50px 0px", // 少し上にスクロールしてから発火
            }
          );

          observer.observe(section.ref);
          this.observers.push(observer);
        }
      });
    },
    // オブザーバーのクリーンアップ
    destroyObservers() {
      this.observers.forEach((observer) => {
        observer.disconnect();
      });
      this.observers = [];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.scroll-animated {
  opacity: 0;
  will-change: transform, opacity;
  transition-property: transform, opacity;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-in-up.active {
  animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.fade-in-left.active {
  animation: fadeInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.fade-in-right.active {
  animation: fadeInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.home-page {
  overflow-x: hidden;
}

.hero-section {
  height: 600px;
  display: flex;
  align-items: center;
  position: relative;
}

.hero-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: $spacing-xl;
  text-shadow: $title-shadow;

  .hero-title-line {
    display: block;
  }

  .hero-title-accent {
    display: block;
    font-size: 6rem;
    font-family: "Satisfy", sans-serif;
    letter-spacing: 0.1em;
  }
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

.hero-subtitle {
  font-size: $font-size-xl;
  color: $color-text-secondary;
  margin-bottom: $spacing-xl;
  max-width: 500px;
  display: inline-flex;
  font-family: "ZenMaruGothic", serif;
}

.typing-decoration::after {
  content: "";
  border-right: 1px solid #333;
  margin-left: 2px;
  animation: flashing 1s linear infinite;
  opacity: 0;
}

.hero-image {
  flex: 1;
  max-width: 500px;
  height: 500px;
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

.section {
  padding: $spacing-2xl 0;
}

.section-title {
  text-align: center;
  margin-bottom: $spacing-xl;
  position: relative;
  font-family: "NotoSansJPBold", serif;

  &.about-title::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 3px;
    background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
  }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.project-card {
  background: rgba($color-secondary, 0.8);
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
  height: 180px;
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
  background: rgba($color-primary, 0.8);
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
}

.project-title {
  font-size: $font-size-xl;
  margin-bottom: $spacing-sm;
  color: $color-text-primary;
}

.section-featured-projects-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    $color-accent-2 20%,
    $color-accent-1 50%,
    $color-accent-2 80%,
    transparent 100%
  );
}

.project-description {
  color: $color-text-secondary;
  margin-bottom: $spacing-md;
  font-size: $font-size-md;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.project-tag {
  background: rgba($color-accent-1, 0.1);
  color: $color-accent-2;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: $font-size-xs;
}

.project-link {
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

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-xl;
  align-items: center;
}

.about-text {
  margin-bottom: $spacing-md;
  color: $color-text-secondary;
}

.about-image {
  width: 100%;
  height: 400px;
}

.btn-lg {
  padding: $spacing-md $spacing-2xl;
  font-size: $font-size-lg;
}

.btn {
  background-image: linear-gradient(90deg, $color-accent-5, $color-accent-6);
  filter: brightness(98%);
  background-size: 400% 400%;
  background-image: linear-gradient(
    90deg,
    $color-accent-1 0%,
    $color-accent-2 30%,
    $color-accent-1 70%,
    $color-accent-2 100%
  );
  animation: gradientFlow 20s ease-in-out infinite;

  &.btn-outline {
    border: 1px solid $color-accent-7;
  }

  &.btn-outline:hover {
    border: 1px solid $color-accent-7;
    color: $color-text-light;
    background-size: 400% 400%;
    background-image: linear-gradient(
      90deg,
      $color-accent-1 0%,
      $color-accent-2 30%,
      $color-accent-1 70%,
      $color-accent-2 100%
      );
      animation: gradientFlow 20s ease-in-out infinite;
  }

  &.about-btn:hover {
    color: $color-text-light;
  }
}

.canvas-teaser {
  background: #05051a;
  padding: $spacing-xl 0;
  margin-top: $spacing-2xl;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.canvas-teaser-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
  gap: $spacing-lg;
}

.canvas-teaser-title {
  font-size: $font-size-xl;
  margin: 0;
  flex: 1;
  min-width: 300px;
}

.btn-constellation {
  position: relative;
  padding: $spacing-md $spacing-xl;
  font-size: $font-size-md;
  font-weight: 600;
  background: transparent;
  border: 1px solid rgba(48, 52, 54, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
  overflow: hidden;

  .star {
    position: absolute;
    width: 3px;
    height: 3px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .star-1 {
    top: 25%;
    left: 20%;
  }
  .star-2 {
    top: 60%;
    left: 25%;
  }
  .star-3 {
    top: 30%;
    left: 40%;
  }
  .star-4 {
    top: 70%;
    left: 50%;
  }
  .star-5 {
    top: 20%;
    left: 70%;
  }
  .star-6 {
    top: 50%;
    left: 80%;
  }

  &:hover {
    transform: translateY(-3px);
    background: hsla(200, 5.9%, 10%, 0.08);
    border-color: rgba(48, 52, 54, 0.4);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);

    .star {
      opacity: 1;
      animation: starTwinkle 2s infinite alternate;
    }

    .star-2 {
      animation-delay: 0.3s;
    }
    .star-3 {
      animation-delay: 0.1s;
    }
    .star-4 {
      animation-delay: 0.5s;
    }
    .star-5 {
      animation-delay: 0.2s;
    }
    .star-6 {
      animation-delay: 0.4s;
    }

    .constellation-line {
      opacity: 1;
      transform: scaleX(1);
    }

    .line-1 {
      transform: rotate(30deg) scaleX(1);
      transition-delay: 0.1s;
    }
    .line-2 {
      transform: rotate(-5deg) scaleX(1);
      transition-delay: 0.2s;
    }
    .line-3 {
      transform: rotate(-30deg) scaleX(1);
      transition-delay: 0.3s;
    }
    .line-4 {
      transform: rotate(-10deg) scaleX(1);
      transition-delay: 0.4s;
    }
    .line-5 {
      transform: rotate(40deg) scaleX(1);
      transition-delay: 0.5s;
    }
  }

  &:active {
    transform: translateY(0);
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

@keyframes starTwinkle {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.5);
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

@media (max-width: $breakpoint-md) {

  .typing-decoration::after {
    border-right: 2px solid #333;
  }

  .hero-subtitle {
    height: 60px;
  }

  .hero-container {
    flex-direction: column;
    text-align: center;
    padding-top: 70px;
  }

  .hero-section {
    height: auto;
    min-height: 80vh;
    padding: 80px 0 30px;
  }

  .hero-content {
    margin-bottom: $spacing-lg;
    padding: 0 $spacing-md;
  }

  .hero-title {
    font-size: 3rem;

    .hero-title-accent {
      font-size: 4rem;
    }
  }

  .section-featured-projects-title::after {
    width: 300px;
  }

  .hero-image {
    max-width: 100%;
    height: 300px;
    margin-top: -30px;
    transform: scale(0.85);
    padding: 0 $spacing-md;
  }

  .canvas-teaser-content {
    justify-content: center;
    text-align: center;
  }

  .canvas-teaser-title {
    margin-bottom: $spacing-md;
  }

  .about-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .about-content {
    order: 2;
  }

  .about-image {
    order: 1;
    height: 300px;
    margin-bottom: $spacing-md;
  }

  /* ボタンの位置調整 */
  .about-btn {
    margin: 0 auto;
    display: inline-block;
  }

  .canvas-teaser-title {
    font-size: $font-size-md;
  }
}

@media (max-width: $breakpoint-sm) {
  .about-image {
    height: 250px;
  }

  .about-text {
    font-size: 0.9rem;
  }

  .container.hero-container {
    margin-bottom: 50px;
  }

  .hero-subtitle {
    display: block;
  }

  .drawing-subtitle-bottom {
    margin-left: 6rem;
  }

  .hero-title {
    font-size: 3rem;

    .hero-title-accent {
      font-size: 3rem;
    }
  }
}
</style>
