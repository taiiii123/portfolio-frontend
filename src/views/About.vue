<template>
  <div class="about-page">
    <div class="about-hero">
      <hero-stars />
      <div class="container">
        <h1 class="about-title animated-gradient">自己紹介</h1>
        <p class="about-subtitle typing-animation">{{ subtitleText }}</p>
      </div>
      <div class="scroll-indicator">
        <span>スクロール</span>
        <div class="scroll-arrow"></div>
      </div>
    </div>

    <section class="section about-section">
      <div class="container">
        <div class="about-grid">
          <div
            class="about-image animate-on-scroll"
            data-animation="fade-right"
          >
            <div class="profile-placeholder">
              <div
                class="profile-circle"
                :class="{
                  'floating-animation': !isProfileAnimating,
                  'profile-clicked': isProfileAnimating,
                  'jelly-animation':
                    isProfileAnimating && currentAnimation === 'jelly',
                  'bounce-animation':
                    isProfileAnimating && currentAnimation === 'bounce',
                  'pulse-animation':
                    isProfileAnimating && currentAnimation === 'pulse',
                  'swing-animation':
                    isProfileAnimating && currentAnimation === 'swing',
                }"
              >
                <img
                  src="@/assets/images/profile.png"
                  alt="プロフィール画像"
                  class="profile-image"
                  loading="eager"
                  decoding="sync"
                  @click="handleProfileClick"
                />
              </div>
              <div class="profile-name">Yamada Taiki</div>
              <div class="profile-title">Web Developer</div>
            </div>
          </div>
          <div
            class="about-content animate-on-scroll"
            data-animation="fade-left"
          >
            <h2 class="section-title about-section-title">私について</h2>
            <p class="about-text">
              はじめまして、WebエンジニアのTaikiと申します。<br>
              &nbsp;&nbsp;新卒からITエンジニアになり、Vue.jsによるフロント開発やSpring Bootによるバックエンド開発、AWSを用いたインフラ構築などの経験をしてきました。主にバックエンドを担当しています。<br>
              &nbsp;&nbsp;技術の進歩が目まぐるしく変化する現代において、常に最新の技術トレンドをキャッチアップを心がけ、日々技術力の向上に努めています。また、日常生活を効率よく過ごせるように、便利なアプリを開発しています。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section journey-section">
      <div class="container">
        <h2
          class="section-title section-my-career-title text-center animate-on-scroll"
          data-animation="fade-up"
        >
          私の経歴
        </h2>
        <div
          class="rocket-container animate-on-scroll"
          data-animation="zoom-in"
        >
          <img
            src="@/assets/images/rocket-thrust.gif"
            alt="Rocket thrust animation"
            class="rocket-animation"
            v-if="!loading"
            @click="launchRocket"
            :class="{ 'rocket-launching': isRocketLaunching }"
          />

          <img
            src="@/assets/images/fueling-rocket.png"
            alt="Rocket fueling"
            width="120"
            v-if="loading && !isMobile"
          />
        </div>

        <!-- パソコン表示のローディング -->
        <Loading
          v-if="loading && !isMobile"
          type=""
          text="ロケットに燃料を補給中"
          size="md"
        />

        <!-- スマホ表示のローディング -->
        <Loading v-if="loading && isMobile" text="経歴の読み込み中" size="md" />

        <!-- 経歴のタイムラインを表示 -->
        <div v-if="!loading" class="timeline">
          <div
            v-for="(item, index) in timelineItems"
            :key="index"
            class="timeline-item animate-on-scroll"
            :data-animation="index % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-delay="index * 0.2"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-date">{{ item.date }}
                <span v-if="index === 0">&nbsp;-&nbsp;現在</span>
              </div>
              <h3 class="timeline-title">{{ item.title }}</h3>
              <p class="timeline-text">
                {{ item.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section values-section">
      <div class="container">
        <h2
          class="section-title section-my-values-title text-center animate-on-scroll"
          data-animation="fade-up"
        >
          私の価値観
        </h2>
        <div class="values-grid">
          <div
            v-for="(value, index) in valuesItems"
            :key="index"
            class="value-card animate-on-scroll"
            data-animation="flip-up"
            :data-delay="index * 0.2"
          >
            <div class="value-icon">
              <div class="value-icon-inner">
                <img :src="require(`@/assets/images/${value.icon}`)" :alt="value.title" width="40">
              </div>
            </div>
            <h3 class="value-title">{{ value.title }}</h3>
            <p class="value-text">
              {{ value.text }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeroStars from "@/components/common/HeroStars.vue";
import Loading from "@/components/common/Loading.vue";

// 開発環境のみモックAPIを使用
if (process.env.VUE_APP_NODE_ENV === "development") {
  console.log("開発モードでモックAPIが有効になっています");
  import("@/api/about/mock").catch((err) => {
    console.warn("モックのインポートに失敗しました:", err);
  });
}

export default {
  name: "AboutView",
  components: {
    HeroStars,
    Loading,
  },
  data() {
    return {
      subtitleText: "",
      isMobile: false,
      isProfileAnimating: false,
      profileClickCount: 0,
      currentAnimation: null,
      isRocketLaunching: false,
      timelineItems: [],
      valuesItems: [
        {
          icon: "innovation-value.png",
          title: "創造性",
          text: "独創的なアイデアと美しいデザインを通じて、ユーザーに喜びと驚きを提供することを心がけています。",
        },
        {
          icon: "search-value.png",
          title: "探求心",
          text: "常に新しい技術や手法を学び、自分のスキルと知識を拡張することに情熱を注いでいます。",
        },
        {
          icon: "gear-value.png",
          title: "効率性",
          text: "日々の業務プロセスを見直し、小さな改善を積み重ねることで効率性を高めています。",
        },
        {
          icon: "quality-value.png",
          title: "品質",
          text: "細部にこだわり、高品質でパフォーマンスの優れたソフトウェアの開発を目指しています。",
        },
      ],
      loading: true,
      observerOptions: {
        root: null,
        rootMargin: "0px",
        threshold: 0.2,
      },
      observers: [],
    };
  },
  created() {
    this.checkIfMobile();
    window.addEventListener("resize", this.checkIfMobile);
  },
  mounted() {
    // タイピングアニメーション
    this.typing("subtitleText", "Webエンジニア");

    // タイムラインデータの取得
    this.fetchTimelineData();

    // 初期スクロールアニメーションのセットアップ
    this.setupScrollAnimations();
  },
  unmounted() {
    window.removeEventListener("resize", this.checkIfMobile);
    // Observerをクリーンアップ
    this.observers.forEach((observer) => observer.disconnect());
  },
  methods: {
    // タイムラインデータをAPIから取得
    fetchTimelineData() {
      this.loading = true;

      this.$axios
        .get('/api/timeline')
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`APIエラー: ${response.status}`);
          }

          this.timelineItems = response.data.timeline;
          this.loading = false;

          this.$nextTick(() => {
            this.setupScrollAnimations();
          });
        })
        .catch((error) => {
          console.error("タイムラインデータの取得に失敗しました:", error);
          this.timelineItems = [];
          this.loading = false;

          // エラーページにリダイレクト
          sessionStorage.setItem('errorCode', '500');
          this.$router.push('/error');
        });
    },
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
      }, 170);
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    handleProfileClick() {
      // クリックカウントを増やす
      this.profileClickCount++;

      // アニメーション状態を有効化
      this.isProfileAnimating = true;

      // クリック回数に応じて異なるアニメーションを適用
      switch (this.profileClickCount % 4) {
        case 1:
          this.currentAnimation = "jelly"; // 1回目：ジェリーアニメーション
          break;
        case 2:
          this.currentAnimation = "bounce"; // 2回目：バウンスアニメーション
          break;
        case 3:
          this.currentAnimation = "pulse"; // 3回目：パルスアニメーション
          break;
        case 0:
          this.currentAnimation = "swing"; // 4回目：スウィングアニメーション
          break;
      }

      // アニメーション終了後、元の状態に戻す
      setTimeout(() => {
        this.isProfileAnimating = false;
        this.currentAnimation = null;
      }, 1500);
    },
    // ロケット発射アニメーションのメソッド
    launchRocket() {
      // 既に発射中なら何もしない
      if (this.isRocketLaunching) {
        return;
      }

      this.isRocketLaunching = true;

      // アニメーション完了後、ロケットを元の位置に戻す
      setTimeout(() => {
        this.isRocketLaunching = false;
      }, 4000);
    },
    setupScrollAnimations() {
      const animatedElements = document.querySelectorAll(".animate-on-scroll");

      if (!animatedElements.length) return;

      // 新しいIntersection Observerを作成
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const animation = element.dataset.animation || "fade-in";
            const delay = element.dataset.delay || 0;

            element.style.animationDelay = `${delay}s`;
            element.classList.add("animated", animation);

            setTimeout(() => {
              const resetObserver = new IntersectionObserver(
                (resetEntries) => {
                  resetEntries.forEach((resetEntry) => {
                    if (!resetEntry.isIntersecting) {
                      resetEntry.target.classList.remove("animated", animation);
                      resetObserver.unobserve(resetEntry.target);
                    }
                  });
                },
                { threshold: 0 }
              );

              resetObserver.observe(element);
              this.observers.push(resetObserver);
            }, (parseFloat(delay) + 1) * 1000); // アニメーション完了後に監視を開始
          }
        });
      }, this.observerOptions);

      // 各要素を監視対象に追加
      animatedElements.forEach((element) => {
        observer.observe(element);
      });

      // observerを保存して後でクリーンアップできるようにする
      this.observers.push(observer);
    },
  },
  beforeUnmount() {
    // コンポーネント破棄時にインターバルをクリア
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.about-page {
  overflow-x: hidden;
}

.profile-clicked {
  animation-duration: 1.5s;
  animation-fill-mode: both;
  transform-origin: center center;
}

@keyframes jelly {
  0%,
  100% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(0.9, 1.1);
  }
  50% {
    transform: scale(1.1, 0.9);
  }
  75% {
    transform: scale(0.95, 1.05);
  }
}

@keyframes swing {
  20% {
    transform: rotate(15deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(5deg);
  }
  80% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes bounce-effect {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

@keyframes pulse-effect {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.jelly-animation {
  animation-name: jelly;
  animation-timing-function: ease-in-out;
  animation: jelly 1.5s ease-in-out both !important;
}

.swing-animation {
  animation-name: swing;
  animation-timing-function: ease-in-out;
  animation: swing 1.5s ease-in-out both !important;
}

.bounce-animation {
  animation-name: bounce-effect;
  animation-timing-function: ease-in-out;
  animation: bounce-effect 1.5s ease-in-out both !important;
}

.pulse-animation {
  animation-name: pulse-effect;
  animation-timing-function: ease-in-out;
  animation: pulse-effect 1.5s ease-in-out both !important;
}

@keyframes rocket-launch {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  10% {
    transform: translateY(-5px) scale(1.05);
    opacity: 1;
  }
  30% {
    transform: translateY(-100px) scale(0.9);
    opacity: 1;
  }
  70% {
    transform: translateY(-500px) scale(0.7);
    opacity: 1;
  }
  100% {
    transform: translateY(-1000px) scale(0.5);
    opacity: 0;
  }
}

.rocket-animation {
  max-width: 200px;
  height: auto;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px) scale(1.05);
  }
}

.rocket-launching {
  animation: rocket-launch 4s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  pointer-events: none;
  will-change: transform, opacity;
  z-index: 10;
}

.animate-on-scroll {
  opacity: 0;
  will-change: transform, opacity;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-down {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-left {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-right {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes flip-up {
  from {
    opacity: 0;
    transform: perspective(400px) rotateX(90deg);
  }
  to {
    opacity: 1;
    transform: perspective(400px) rotateX(0deg);
  }
}

.animated {
  opacity: 1;
  animation-duration: 0.8s;
  animation-fill-mode: both;
}

.animated.fade-in {
  animation-name: fade-in;
}

.animated.fade-up {
  animation-name: fade-up;
}

.animated.fade-down {
  animation-name: fade-down;
}

.animated.fade-left {
  animation-name: fade-left;
}

.animated.fade-right {
  animation-name: fade-right;
}

.animated.zoom-in {
  animation-name: zoom-in;
}

.animated.bounce {
  animation-name: bounce;
}

.animated.flip-up {
  animation-name: flip-up;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.about-hero {
  height: 40vh;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  text-align: center;
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

.about-title {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-md;
  text-shadow: $title-shadow;
}

.about-subtitle {
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

.section {
  padding: $spacing-2xl 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-xl;
  align-items: center;
}

.profile-placeholder {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-circle {
  width: 250px;
  height: 250px;
  margin-bottom: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-accent-5, $color-accent-6);
  box-shadow: 0 10px 30px rgba($color-accent-1, 0.5);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border-radius: 50%;
    background: $color-secondary;
    z-index: 1;
    will-change: opacity;
  }
}

.floating-animation {
  animation: floating 6s ease-in-out infinite;
}

.profile-name {
  font-family: 'Courier New', Courier, monospace;
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  font-size: $font-size-3xl;
  font-weight: 700;
  color: white;
  text-align: center;
  z-index: 5;
}

.profile-title {
  transform: translateY(-13px);
  font-family: 'Courier New', Courier, monospace;
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  font-size: $font-size-xl;
  font-weight: 400;
  color: rgba(138, 43, 226, 0.7);
  text-align: center;
  z-index: 5;
  letter-spacing: 1px;
}

@keyframes floating {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-10px) translateX(5px);
  }
  50% {
    transform: translateY(0px) translateX(0px);
  }
  75% {
    transform: translateY(10px) translateX(-5px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}

.profile-image {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  z-index: 3;
  will-change: transform;
  transform: translateZ(0);
}

.profile-placeholder {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 250px;
}

.section-title {
  position: relative;
  margin-bottom: $spacing-lg;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
  }

  &.section-my-career-title::after {
    width: 120px;
  }

  &.section-my-values-title::after {
    width: 160px;
  }

  &.text-center {
    text-align: center;

    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

.about-section-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 80%;
  height: 3px;
  background: linear-gradient(
    90deg,
    $color-accent-1,
    $color-accent-2,
    transparent
  );
}

.about-text {
  margin-bottom: $spacing-md;
  line-height: 1.7;

  &:last-child {
    margin-bottom: 0;
  }
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding-top: $spacing-lg;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent,
      $color-accent-1,
      $color-accent-2,
      $color-accent-1,
      transparent
    );
  }
}

.timeline-item {
  position: relative;
  display: flex;
  margin-bottom: $spacing-xl;

  &:nth-child(odd) {
    flex-direction: row-reverse;

    .timeline-content {
      margin-right: $spacing-xl;
      margin-left: 0;
      text-align: left;

      &::before {
        left: auto;
        right: -10px;
        transform: rotate(45deg);
      }
    }
  }

  &:nth-child(even) {
    .timeline-content {
      margin-left: $spacing-xl;
      text-align: left;
    }
  }
}

.timeline-dot {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $color-accent-2;
  box-shadow: 0 0 10px rgba($color-accent-2, 0.5);
  z-index: 1;
}

.timeline-content {
  width: calc(50% - 30px);
  padding: $spacing-md;
  background: rgba(6, 9, 21, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba($color-accent-2, 0.1);
  position: relative;
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease,
    background-color 0.3s ease;
  overflow: hidden;

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
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    background: rgba(6, 9, 21, 0.8);

    &::after {
      opacity: 1;
    }

    .timeline-title {
      color: $color-accent-1;
    }

    .timeline-date {
      transform: scale(1.05);
    }
  }
}

.timeline-date {
  display: inline-block;
  padding: 5px 10px;
  background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
  color: $color-text-primary;
  border-radius: 20px;
  font-size: $font-size-sm;
  font-weight: 600;
  margin-bottom: $spacing-sm;
  transition: transform 0.3s ease;
  filter: brightness(90%);
}

.timeline-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-sm;
  color: $color-text-primary;
  transition: color 0.3s ease;
}

.timeline-dot {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $color-accent-2;
  box-shadow: 0 0 10px rgba($color-accent-2, 0.5);
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.timeline-item:hover .timeline-dot {
  transform: translateX(-50%) scale(1.2);
  box-shadow: 0 0 15px rgba($color-accent-1, 0.8);
  background: $color-accent-1;
}

.timeline-text {
  font-size: $font-size-md;
  color: $color-text-secondary;
  line-height: 1.6;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-lg;
  margin-top: $spacing-xl;
}

.value-card {
  background: rgba(6, 9, 21, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: $spacing-lg;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba($color-accent-2, 0.1);
  transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  top: 0;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0);
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    z-index: -1;
  }

  &:hover {
    transform: translateY(-10px) scale(1.03) !important;
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba($color-accent-2, 0.4);

    &::after {
      opacity: 1;
      box-shadow: 0 25px 40px rgba(0, 0, 0, 0.4);
    }

    .value-icon {
      transform: scale(1.1);
      box-shadow: 0 8px 20px rgba($color-accent-1, 0.5);
    }

    .value-title {
      color: $color-accent-1;
      transform: translateY(-2px);
    }
  }
}

.value-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-accent-1, $color-accent-2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto $spacing-md;
  box-shadow: 0 5px 15px rgba($color-accent-1, 0.3);
  transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.value-icon-inner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: $color-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.value-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-sm;
  color: $color-text-primary;
  transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.value-text {
  font-size: $font-size-md;
  color: $color-text-secondary;
  line-height: 1.6;
}

.text-center {
  text-align: center;
}

.btn-lg {
  padding: $spacing-md $spacing-2xl;
  font-size: $font-size-lg;
}

.rocket-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: $spacing-lg;
  position: relative;
}

.rocket-animation {
  max-width: 200px;
  height: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
  will-change: transform, opacity;

  &:hover {
    transform: translateY(-5px) scale(1.05);
    filter: drop-shadow(0 0 8px rgba($color-accent-1, 0.6));
  }
}

.loader-container.size-md {
  margin-top: -80px;
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

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
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
  .typing-animation::after {
    border-right: 2px solid #333;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .profile-placeholder {
    height: 300px;
    padding-bottom: 130px;
  }

  .timeline::before {
    left: 30px;
  }

  .timeline-item {
    flex-direction: row !important;
  }

  .timeline-content {
    width: calc(100% - 30px) !important;
    margin-left: 30px !important;
    margin-right: 0 !important;
    text-align: left !important;
    position: relative !important;
    padding: $spacing-md;
    padding-left: calc($spacing-md + 15px);
    background: rgba($color-secondary, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 10px !important;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba($color-accent-2, 0.1);
    overflow: visible !important;

    &:hover {
      transform: none !important;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5) !important;
      background: rgba($color-secondary, 0.7) !important;
    }

    &:hover .timeline-title {
      color: $color-text-primary !important;
    }

    &:hover .timeline-date {
      transform: none !important;
    }
  }

  .timeline-date {
    margin-left: 0 !important;
  }

  .timeline-content::before {
    content: "" !important;
    position: absolute !important;
    top: 20px !important;
    left: -12px !important;
    width: 24px !important;
    height: 24px !important;
    z-index: 1 !important;
  }

  .timeline-dot {
    left: 30px;
  }

  .rocket-container {
    justify-content: flex-start;
    margin-left: -20px;
    margin-bottom: 0;
  }

  .rocket-animation {
    max-width: 150px;
  }

  .profile-name {
    bottom: 40px;
    font-size: $font-size-2xl;
  }

  .profile-title {
    bottom: 5px;
    font-size: $font-size-md;
  }

  .profile-circle {
    margin-bottom: 0;
    width: 210px;
    height: 210px;
  }

  .loader-container.size-md {
    margin-top: 0;
  }
}
</style>
