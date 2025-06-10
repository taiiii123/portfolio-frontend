<template>
  <div
    class="loader-container"
    :class="[
      `size-${responsiveSize}`,
      {
        'with-background': withBackground,
        'full-page': fullPage,
        'fixed-container': fixedSize,
        'inline-loader': inline,
      },
    ]"
    :style="combinedStyleObject"
  >
    <!-- 星のアニメーション背景 (withBackground が true の場合のみ) -->
    <div v-if="withBackground" class="loader-stars">
      <div
        v-for="n in starCount"
        :key="n"
        class="star"
        :style="getStarStyle()"
      ></div>
    </div>

    <div class="loader-content">
      <div v-if="type === 'circle'" class="spinner spinner-circle"></div>
      <div v-else-if="type === 'dots'" class="spinner spinner-dots">
        <span></span>
      </div>
      <div v-else-if="type === 'bar'" class="spinner spinner-bar"></div>

      <div v-if="showText" class="loader-text-container">
        <span class="loader-text">{{ text }}</span>
        <span v-if="showDots" class="loader-dots"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonLoading",
  props: {
    // ローダーのタイプ (circle, dots, bar)
    type: {
      type: String,
      default: "circle",
      validator: (value) => ["circle", "dots", "bar"].includes(value),
    },
    // ローダーのサイズ (sm, md, lg, auto)
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg", "auto"].includes(value),
    },
    // ローダーテキスト
    text: {
      type: String,
      default: "読み込み中",
    },
    // テキストを表示するかどうか
    showText: {
      type: Boolean,
      default: true,
    },
    // ドットアニメーションを表示するかどうか
    showDots: {
      type: Boolean,
      default: true,
    },
    // 背景を表示するかどうか
    withBackground: {
      type: Boolean,
      default: false,
    },
    // 画面全体に表示するかどうか
    fullPage: {
      type: Boolean,
      default: false,
    },
    // ローダーの色（プライマリーカラー）
    primaryColor: {
      type: String,
      default: null,
    },
    // ローダーの色（セカンダリーカラー）
    secondaryColor: {
      type: String,
      default: null,
    },
    // 最小高さ（pxまたは他のCSS単位）
    minHeight: {
      type: String,
      default: "200px",
    },
    // 固定幅（pxまたは他のCSS単位）
    width: {
      type: String,
      default: null,
    },
    // 固定高さ（pxまたは他のCSS単位）
    height: {
      type: String,
      default: null,
    },
    // 親要素に対して幅を100%にするかどうか
    fullWidth: {
      type: Boolean,
      default: false,
    },
    // 親要素に対して高さを100%にするかどうか
    fullHeight: {
      type: Boolean,
      default: false,
    },
    // インラインで表示する（ブロック要素ではなく）
    inline: {
      type: Boolean,
      default: false,
    },
    // 固定サイズにするかどうか（width, heightを使用）
    fixedSize: {
      type: Boolean,
      default: false,
    },
    // ブレークポイント - 小サイズ表示する画面幅（px）
    breakpointSm: {
      type: Number,
      default: 576,
    },
    // ブレークポイント - 中サイズを表示する画面幅（px）
    breakpointMd: {
      type: Number,
      default: 768,
    },
    // 星の数
    starCount: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      containerWidth: 0,
      containerHeight: 0,
      resizeObserver: null,
    };
  },
  computed: {
    // レスポンシブなサイズの計算
    responsiveSize() {
      // auto設定の場合は画面幅に基づいてサイズを決定
      if (this.size === "auto") {
        if (this.windowWidth < this.breakpointSm) {
          return "sm";
        } else if (this.windowWidth < this.breakpointMd) {
          return "md";
        } else {
          return "lg";
        }
      }

      // auto以外はそのまま返す
      return this.size;
    },

    // スタイルオブジェクトの計算
    styleObject() {
      const styles = {};

      if (this.primaryColor) {
        styles["--loader-primary-color"] = this.primaryColor;
      }

      if (this.secondaryColor) {
        styles["--loader-secondary-color"] = this.secondaryColor;
      }

      if (this.minHeight && !this.fixedSize && !this.fullHeight) {
        styles["--loader-min-height"] = this.minHeight;
      }

      return styles;
    },

    // サイズに関するスタイルの計算
    sizeStyles() {
      const styles = {};

      if (this.width) {
        styles.width = this.width;
      } else if (this.fullWidth) {
        styles.width = "100%";
      }

      if (this.height) {
        styles.height = this.height;
      } else if (this.fullHeight) {
        styles.height = "100%";
      }

      return styles;
    },

    // 全てのスタイルを組み合わせる
    combinedStyleObject() {
      return { ...this.styleObject, ...this.sizeStyles };
    },
  },
  mounted() {
    // ウィンドウのリサイズイベントを監視
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    // 親要素のサイズ変更を監視
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(this.handleContainerResize);
      this.resizeObserver.observe(this.$el);
    }
  },
  beforeUnmount() {
    // イベントリスナーの削除
    window.removeEventListener("resize", this.handleResize);

    // ResizeObserverの停止
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    // ウィンドウのリサイズハンドラー
    handleResize() {
      this.windowWidth = window.innerWidth;
    },

    // コンテナのリサイズハンドラー
    handleContainerResize(entries) {
      for (const entry of entries) {
        this.containerWidth = entry.contentRect.width;
        this.containerHeight = entry.contentRect.height;
      }
    },

    // 中心付近に集まるが広がりを持つ星のスタイルを生成
    getStarStyle() {
      // 星の分布方法を調整（中心付近に多いが、広がりを持つ分布）
      let r, theta;

      // ルート状の分布を作成（中心からの距離）
      // より均一に広がりを持たせるために緩やかなべき乗を使用
      r = Math.pow(Math.random(), 0.5) * 0.5; // 0～0.5の範囲（中心から最大で半径の50%まで）

      // 角度はランダム（0～360度）
      theta = Math.random() * 2 * Math.PI;

      // 極座標から直交座標に変換
      const offsetX = r * Math.cos(theta);
      const offsetY = r * Math.sin(theta);

      // 中心（50%）を基準に位置を決定
      const x = 50 + offsetX * 100; // 0-100%の範囲に変換
      const y = 50 + offsetY * 100; // 0-100%の範囲に変換

      // 星のサイズは中心に近いほど大きく、中心から離れるほど小さく
      // ただし、大きなオフセットでも最小サイズを確保
      const size = Math.max(1, 3 - r * 4);

      // アニメーションのディレイと持続時間
      const delay = Math.random() * 5; // 0-5秒のディレイ
      const duration = 2 + Math.random() * 3; // 2-5秒の持続時間

      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
:root {
  --loader-primary-color: #6a11cb;
  --loader-secondary-color: #2575fc;
  --loader-background: rgba(10, 12, 30, 0.8);
  --loader-text-color: rgba(255, 255, 255, 0.9);
}

.loader-container {
  filter: brightness(80%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--loader-min-height, 200px);
  width: 100%;
  position: relative;
  overflow: hidden;

  &.inline-loader {
    display: inline-flex;
    min-height: auto;
    width: auto;
    vertical-align: middle;
    margin: 0 0.5rem;
  }

  &.fixed-container {
    min-height: auto;
    overflow: hidden;
  }

  &.with-background {
    background: linear-gradient(
      135deg,
      rgba(10, 12, 30, 0.8),
      rgba(42, 16, 74, 0.8)
    );
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
      inset 0 1px 1px rgba(255, 255, 255, 0.1),
      inset 0 -1px 1px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  &.full-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background: rgba(10, 12, 30, 0.95);
    backdrop-filter: blur(10px);
    min-height: 100vh;
  }

  .loader-stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;

    .star {
      position: absolute;
      background-color: #fff;
      border-radius: 50%;
      opacity: 0;
      animation: starTwinkle 3s infinite;
      box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.4);
    }
  }
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.spinner-circle {
  display: block;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--loader-primary-color, #6a11cb);
  border-right-color: var(--loader-secondary-color, #2575fc);
  animation: spin 1s infinite linear;
  box-shadow: 0 0 15px rgba(106, 17, 203, 0.5);
}

.spinner-dots {
  display: flex;
  align-items: center;
  gap: 6px;

  &::before,
  &::after,
  & > span {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--loader-primary-color, #6a11cb);
    animation: dots-fade 1.4s infinite ease-in-out both;
    box-shadow: 0 0 10px rgba(106, 17, 203, 0.7);
  }

  &::before {
    animation-delay: -0.32s;
  }

  & > span {
    animation-delay: -0.16s;
    background-color: var(--loader-secondary-color, #2575fc);
    box-shadow: 0 0 10px rgba(37, 117, 252, 0.7);
  }
}

.spinner-bar {
  width: 100px;
  height: 4px;
  background: linear-gradient(
    to right,
    var(--loader-primary-color, #6a11cb),
    var(--loader-secondary-color, #2575fc)
  );
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0 0 15px rgba(106, 17, 203, 0.5);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    animation: bar-slide 1.5s infinite ease-in-out;
  }
}

.loader-text-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-text {
  color: var(--loader-text-color, rgba(255, 255, 255, 0.9));
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.loader-dots {
  position: relative;
  margin-left: 3px;
  margin-bottom: 5px;
  width: 30px;
  height: 20px;
}

.loader-dots::before {
  content: "...";
  position: absolute;
  left: 0;
  color: var(--loader-text-color, rgba(255, 255, 255, 0.9));
  animation: dots 1.5s infinite;
  font-size: 1.2em;
  letter-spacing: 2px;
}

.loader-container.size-sm {
  .spinner-circle {
    width: 24px;
    height: 24px;
    border-width: 2px;
  }

  .spinner-dots {
    &::before,
    &::after,
    & > span {
      width: 6px;
      height: 6px;
    }
  }

  .spinner-bar {
    width: 60px;
    height: 3px;
  }

  .loader-text {
    font-size: 14px;
  }
}

.loader-container.size-md {
  .spinner-circle {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }

  .spinner-dots {
    &::before,
    &::after,
    & > span {
      width: 8px;
      height: 8px;
    }
  }

  .spinner-bar {
    width: 100px;
    height: 4px;
  }

  .loader-text {
    font-size: 16px;
  }
}

.loader-container.size-lg {
  .spinner-circle {
    width: 60px;
    height: 60px;
    border-width: 4px;
  }

  .spinner-dots {
    &::before,
    &::after,
    & > span {
      width: 12px;
      height: 12px;
    }
  }

  .spinner-bar {
    width: 150px;
    height: 5px;
  }

  .loader-text {
    font-size: 18px;
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

@keyframes dots-fade {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.6;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bar-slide {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

@keyframes starTwinkle {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

@media (max-width: 576px) {
  .loader-container:not(.fixed-container) {
    padding: 10px;

    &.with-background {
      padding: 15px;
    }
  }
}
</style>
