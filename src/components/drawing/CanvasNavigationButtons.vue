<template>
  <div class="canvas-nav-buttons">
    <!-- キャンバスへ移動ボタン -->
    <transition name="fade">
      <button
        v-show="isMobile"
        class="nav-button canvas-button"
        @click="scrollToCanvas"
        aria-label="キャンバスへ移動"
        title="キャンバスへ移動"
      >
        <svg
          class="nav-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
        <div class="neon-border"></div>
      </button>
    </transition>

    <!-- コントロールパネルへ移動ボタン -->
    <transition name="fade">
      <button
        v-show="isMobile"
        class="nav-button controls-button"
        @click="scrollToControls"
        aria-label="コントロールパネルへ移動"
        title="コントロールパネルへ移動"
      >
        <svg
          class="nav-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v6" />
          <path d="M21 12h-6" />
          <path d="M12 21v-6" />
          <path d="M3 12h6" />
        </svg>
        <div class="neon-border"></div>
      </button>
    </transition>
  </div>
</template>

<script>
export default {
  name: "CanvasNavigationButtons",
  data() {
    return {
      isVisible: true, // 常に表示
      isScrolling: false,
      isMobile: false,
    };
  },
  mounted() {
    // モバイル判定を初期化
    this.checkMobile();

    // リサイズイベントを監視（画面サイズ変更時の対応）
    this.addResizeListener();
  },
  beforeUnmount() {
    // リサイズリスナーを削除
    this.removeResizeListener();
  },
  methods: {
    scrollToCanvas() {
      if (this.isScrolling) return;

      console.log("キャンバスボタンがクリックされました");

      // キャンバス用の隠し要素にスクロール
      const canvasAnchor = document.getElementById("canvas-anchor");
      console.log("キャンバスアンカー要素:", canvasAnchor);

      if (canvasAnchor) {
        console.log(
          "キャンバスアンカー要素が見つかりました。スクロール開始..."
        );
        this.isScrolling = true;
        this.scrollToElement(canvasAnchor);
      } else {
        console.warn("キャンバスアンカー要素が見つかりませんでした");
        // フォールバック: 直接 canvas-container を探す
        const canvasContainer = document.querySelector(".canvas-container");
        if (canvasContainer) {
          console.log("フォールバック: canvas-containerにスクロールします");
          this.isScrolling = true;
          this.scrollToElementWithOffset(canvasContainer, 112);
        }
      }
    },
    scrollToControls() {
      if (this.isScrolling) return;

      console.log("コントロールボタンがクリックされました");

      // コントロール用の隠し要素にスクロール
      const controlsAnchor = document.getElementById("controls-anchor");
      console.log("コントロールアンカー要素:", controlsAnchor);

      if (controlsAnchor) {
        console.log(
          "コントロールアンカー要素が見つかりました。スクロール開始..."
        );
        this.isScrolling = true;
        this.scrollToElement(controlsAnchor);
      } else {
        console.warn("コントロールアンカー要素が見つかりませんでした");
        // フォールバック: 直接 control-panel を探す
        const controlPanel = document.querySelector(".control-panel");
        if (controlPanel) {
          console.log("フォールバック: control-panelにスクロールします");
          this.isScrolling = true;
          this.scrollToElementWithOffset(controlPanel, 112);
        }
      }
    },
    // より正確な要素の絶対位置を取得する関数
    getElementAbsolutePosition(element) {
      let top = 0;
      let current = element;

      while (current) {
        top += current.offsetTop;
        current = current.offsetParent;
      }

      return top;
    },

    // 要素にスクロール（オフセットなし）
    scrollToElement(element) {
      const targetPosition = this.getElementAbsolutePosition(element);
      console.log("要素の絶対位置:", targetPosition);
      this.animateScrollTo(targetPosition);
    },

    // 要素にスクロール（オフセット付き）
    scrollToElementWithOffset(element, offset) {
      const elementPosition = this.getElementAbsolutePosition(element);
      const targetPosition = Math.max(0, elementPosition - offset);
      console.log(
        "要素の絶対位置:",
        elementPosition,
        "オフセット後:",
        targetPosition
      );
      this.animateScrollTo(targetPosition);
    },
    animateScrollTo(targetPosition) {
      const duration = 600;
      const startTime = performance.now();
      const startPos = Math.max(
        window.pageYOffset || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      );

      const animateFrame = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // イージング関数
        const easedProgress = 1 - Math.pow(1 - progress, 2);

        // 新しい位置を計算
        const newPosition =
          startPos + (targetPosition - startPos) * easedProgress;

        // スクロール位置を設定
        window.scrollTo(0, newPosition);

        // 互換性のため
        try {
          document.documentElement.scrollTop = newPosition;
          document.body.scrollTop = newPosition;
        } catch (e) {
          console.error("スクロール位置設定エラー:", e);
        }

        if (progress < 1) {
          requestAnimationFrame(animateFrame);
        } else {
          // 最終位置を確実に設定
          window.scrollTo(0, targetPosition);
          document.documentElement.scrollTop = targetPosition;
          document.body.scrollTop = targetPosition;

          this.isScrolling = false;
        }
      };

      requestAnimationFrame(animateFrame);
    },
    checkMobile() {
      // 768px以下をモバイルとして判定
      this.isMobile = window.innerWidth <= 768;
    },
    addResizeListener() {
      if (typeof window !== "undefined") {
        window.addEventListener("resize", this.handleResize, { passive: true });
      }
    },
    removeResizeListener() {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", this.handleResize);
      }
    },
    handleResize() {
      this.checkMobile();
      // モバイルかどうかに関係なく表示状態を更新
      this.isVisible = this.isMobile;
    },
  },
};
</script>

<style lang="scss" scoped>
.canvas-nav-buttons {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}

.nav-button {
  position: fixed;
  width: 55px;
  height: 55px;
  border-radius: 12px;
  background: #0f0f1e;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  pointer-events: auto;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(106, 17, 203, 0.4);

    .nav-icon {
      stroke: #fff;
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
    }

    .neon-border {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  .nav-icon {
    width: 28px;
    height: 28px;
    stroke: #8a5fff;
    stroke-width: 2;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 3px rgba(138, 95, 255, 0.5));
    z-index: 2;
  }

  .neon-border {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 2px;
    background: linear-gradient(45deg, #6a11cb, #2575fc, #8a5fff);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    animation: border-rotate 3s linear infinite;
  }
}

.canvas-button {
  bottom: 30px;
  left: 30px;

  .nav-icon {
    stroke: #ff6b9d;
    filter: drop-shadow(0 0 3px rgba(255, 107, 157, 0.5));
  }

  .neon-border {
    background: linear-gradient(45deg, #ff6b9d, #c44569, #f8b500);
  }

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 107, 157, 0.4);
  }
}

.controls-button {
  bottom: 30px;
  right: 30px;

  .nav-icon {
    stroke: #20bf6b;
    filter: drop-shadow(0 0 3px rgba(32, 191, 107, 0.5));
  }

  .neon-border {
    background: linear-gradient(45deg, #20bf6b, #26de81, #0fb9b1);
  }

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(32, 191, 107, 0.4);
  }
}

@keyframes border-rotate {
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .nav-button {
    width: 45px;
    height: 45px;

    .nav-icon {
      width: 22px;
      height: 22px;
    }
  }

  .canvas-button {
    bottom: 20px;
    left: 20px;
  }

  .controls-button {
    bottom: 20px;
    right: 20px;
  }
}

@media (max-width: 480px) {
  .controls-button {
    right: 20px;
  }
}
</style>
