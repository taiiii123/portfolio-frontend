<!-- ScrollTopButton.vue (ネオンスタイル) -->
<template>
  <transition name="fade">
    <button
      v-show="isVisible"
      class="scroll-top-button"
      @click="scrollToTop"
      aria-label="ページトップへスクロール"
    >
      <svg
        class="arrow-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      <div class="neon-border"></div>
    </button>
  </transition>
</template>

<script>
export default {
  name: "ScrollTopButton",
  data() {
    return {
      isVisible: false,
      scrollThreshold: 300,
      scrollListenerAdded: false,
      checkInterval: null,
      isScrolling: false, // スクロールアニメーション中かどうかのフラグ
    };
  },
  mounted() {

    // 複数の方法でスクロールイベントを監視
    this.addScrollListener();

    // バックアップとして定期的にチェック
    this.checkInterval = setInterval(this.checkScrollPosition, 300);

    // 初期状態をチェック
    this.checkScrollPosition();
  },
  beforeUnmount() {
    // スクロールリスナーを削除
    this.removeScrollListener();

    // 定期チェックを停止
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  },
  methods: {
    addScrollListener() {
      if (!this.scrollListenerAdded && typeof window !== "undefined") {
        window.addEventListener("scroll", this.checkScrollPosition, {
          passive: true,
        });
        document.addEventListener("scroll", this.checkScrollPosition, {
          passive: true,
        });

        this.scrollListenerAdded = true;
      }
    },
    removeScrollListener() {
      if (this.scrollListenerAdded && typeof window !== "undefined") {
        window.removeEventListener("scroll", this.checkScrollPosition);
        document.removeEventListener("scroll", this.checkScrollPosition);

        this.scrollListenerAdded = false;
      }
    },
    checkScrollPosition() {
      // アニメーション中は表示状態を変更しない
      if (this.isScrolling) return;

      // 複数の方法でスクロール位置を取得
      const scrollY = Math.max(
        window.pageYOffset || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      );

      // しきい値よりも大きい場合のみ表示
      const shouldBeVisible = scrollY > this.scrollThreshold;

      // 現在の表示状態と異なる場合のみ更新（パフォーマンス最適化）
      if (this.isVisible !== shouldBeVisible) {
        this.isVisible = shouldBeVisible;
      }
    },
    scrollToTop() {
      // アニメーション中なら何もしない
      if (this.isScrolling) return;

      this.isScrolling = true;

      this.animateScrollTop();
    },
    animateScrollTop() {

      const scrollTop = Math.max(
        window.pageYOffset || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      );

      if (scrollTop <= 0) {
        this.isScrolling = false;
        return;
      }

      // よりなめらかな動きのためのイージング関数パラメータを調整
      const duration = 600;
      const startTime = performance.now();
      const startPos = scrollTop;

      const animateFrame = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // イージング関数
        const easedProgress = 1 - Math.pow(1 - progress, 2);

        // 新しい位置を計算（残り距離ではなく、開始位置からの進捗で計算）
        const newPosition = startPos * (1 - easedProgress);

        // スクロール位置を設定（複数の方法を試行）
        window.scrollTo(0, newPosition);

        // 完全な互換性のため両方の方法を使用
        try {
          document.documentElement.scrollTop = newPosition;
          document.body.scrollTop = newPosition;
        } catch (e) {
          console.error("スクロール位置設定エラー:", e);
        }

        // アニメーションが完了したかチェック
        if (progress < 1) {
          // 次のフレームをリクエスト
          requestAnimationFrame(animateFrame);
        } else {
          // 最終位置を確実に0に設定
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;

          this.isScrolling = false;
        }
      };

      // アニメーションを開始
      requestAnimationFrame(animateFrame);
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-top-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
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
  z-index: 10000;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(106, 17, 203, 0.4);

    .arrow-icon {
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

  .arrow-icon {
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
  .scroll-top-button {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
}
</style>
