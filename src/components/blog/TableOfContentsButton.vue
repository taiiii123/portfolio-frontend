<template>
  <transition name="fade">
    <button
      v-show="isVisible && tableOfContents.length > 0"
      class="toc-button"
      @click="toggleTocModal"
      aria-label="目次を表示"
    >
      <svg
        class="toc-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <line x1="3" y1="6" x2="6" y2="6" />
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="6" y2="12" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="6" y2="18" />
        <line x1="8" y1="18" x2="21" y2="18" />
      </svg>
      <div class="neon-border"></div>
    </button>
  </transition>

  <!-- 全画面目次モーダル -->
  <div class="toc-modal" v-if="showTocModal" @click="closeTocModal">
    <div class="toc-modal-content" @click.stop>
      <div class="toc-modal-header">
        <h3 class="toc-modal-title">目次</h3>
        <button class="toc-modal-close" @click="closeTocModal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="toc-modal-body">
        <ul class="toc-list">
          <li
            v-for="(h2Item, h2Index) in tableOfContents"
            :key="`h2-${h2Index}`"
            class="toc-item"
          >
            <div class="toc-heading-wrapper">
              <!-- 展開/折りたたみボタン（子がある場合のみ表示） -->
              <button
                v-if="h2Item.children && h2Item.children.length > 0"
                class="toc-toggle-btn"
                @click.stop="toggleSublist(h2Index)"
                :aria-expanded="expandedSections[h2Index] ? 'true' : 'false'"
                :aria-label="expandedSections[h2Index] ? '折りたたむ' : '展開する'"
              >
                <svg
                  class="toc-toggle-icon"
                  :class="{ 'expanded': expandedSections[h2Index] }"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <!-- h2見出し（番号付き） -->
              <a
                :href="`#${h2Item.id}`"
                class="toc-link"
                :class="{ 'has-children': h2Item.children && h2Item.children.length > 0 }"
                @click.prevent="scrollToSection(h2Index)"
              >
                <span class="toc-number">{{ h2Item.number }}.</span>
                <span class="toc-text">{{ h2Item.text }}</span>
              </a>
            </div>

            <!-- h3見出し（子要素がある場合） -->
            <transition name="slide">
              <ul
                v-if="h2Item.children && h2Item.children.length > 0 && expandedSections[h2Index]"
                class="toc-sublist"
              >
                <li
                  v-for="(h3Item, h3Index) in h2Item.children"
                  :key="`h3-${h2Index}-${h3Index}`"
                  class="toc-subitem"
                >
                  <a
                    :href="`#${h3Item.id}`"
                    class="toc-sublink"
                    @click.prevent="scrollToSection(h2Index, h3Index)"
                  >
                    <span class="toc-subnumber">{{ h3Item.number }}.</span>
                    <span class="toc-subtext">{{ h3Item.text }}</span>
                  </a>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableOfContentsButton",
  props: {
    tableOfContents: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isVisible: false,
      showTocModal: false,
      scrollThreshold: 300,
      scrollListenerAdded: false,
      checkInterval: null,
      expandedSections: {} // 各セクションの展開状態を保持
    };
  },
  mounted() {
    // スクロールイベントを監視
    this.addScrollListener();

    // バックアップとして定期的にチェック
    this.checkInterval = setInterval(this.checkScrollPosition, 300);

    // 初期状態をチェック
    this.checkScrollPosition();

    // 展開状態を初期化（すべて折りたたみ）
    this.initExpandedState();
  },
  watch: {
    // tableOfContentsが変更されたら展開状態を再初期化
    tableOfContents() {
      this.initExpandedState();
    }
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
    // 展開状態を初期化
    initExpandedState() {
      const newExpandedState = {};
      this.tableOfContents.forEach((item, index) => {
        newExpandedState[index] = false; // 初期状態はすべて折りたたみ
      });
      this.expandedSections = newExpandedState;
    },

    // サブリスト（h3）の表示/非表示を切り替え
    toggleSublist(index) {
      // Vue 3では直接プロパティに値を設定できる
      this.expandedSections[index] = !this.expandedSections[index];
    },

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
      // 複数の方法でスクロール位置を取得
      const scrollY = Math.max(
        window.pageYOffset || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      );

      // しきい値よりも大きい場合のみ表示
      const shouldBeVisible = scrollY > this.scrollThreshold;

      // 現在の表示状態と異なる場合のみ更新
      if (this.isVisible !== shouldBeVisible) {
        this.isVisible = shouldBeVisible;
      }
    },
    toggleTocModal() {
      this.showTocModal = !this.showTocModal;
      if (this.showTocModal) {
        document.body.style.overflow = "hidden"; // スクロール防止
      } else {
        document.body.style.overflow = ""; // スクロール再開
      }
    },
    closeTocModal() {
      this.showTocModal = false;
      document.body.style.overflow = ""; // スクロール再開
    },
    scrollToSection(h2Index, h3Index = null) {
      try {
        let targetId;

        if (h3Index !== null &&
            this.tableOfContents[h2Index] &&
            this.tableOfContents[h2Index].children[h3Index]) {
          // h3が指定されている場合
          targetId = this.tableOfContents[h2Index].children[h3Index].id;
        } else if (this.tableOfContents[h2Index]) {
          // h2のみの場合
          targetId = this.tableOfContents[h2Index].id;
        } else {
          console.error('無効なインデックスが指定されました', h2Index, h3Index);
          return;
        }

        // 要素を探す
        const section = document.getElementById(targetId);

        if (section) {
          // スクロールオフセット（ヘッダーの高さなど）
          const offset = 112;

          // モーダルを閉じる
          this.closeTocModal();

          // スムーズスクロール
          setTimeout(() => {
            section.scrollIntoView({ behavior: "smooth" });

            // オフセット調整
            setTimeout(() => {
              window.scrollBy(0, -offset);
            }, 10);
          }, 100);
        } else {
          console.error(`セクション ID: ${targetId} が見つかりません`);
        }
      } catch (error) {
        console.error('スクロール処理中にエラーが発生しました:', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.toc-button {
  position: fixed;
  bottom: 90px;
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

    .toc-icon {
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

  .toc-icon {
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

.toc-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(6px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.toc-modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  background: rgba(19, 19, 45, 0.95);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(106, 17, 203, 0.3), 0 0 60px rgba(37, 117, 252, 0.1);
  border: 1px solid rgba(106, 17, 203, 0.3);
  animation: scaleIn 0.3s ease;
  display: flex;
  flex-direction: column;
}

.toc-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(106, 17, 203, 0.2);
}

.toc-modal-title {
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
  position: relative;
  padding-left: 15px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1em;
    background: linear-gradient(to bottom, #2575fc, #6a11cb);
    border-radius: 2px;
  }
}

.toc-modal-close {
  background: none;
  border: none;
  color: #8a5fff;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  svg {
    width: 24px;
    height: 24px;
    stroke: currentColor;
  }

  &:hover {
    color: #fff;
    background: rgba(106, 17, 203, 0.2);
    transform: rotate(90deg);
  }
}

.toc-modal-body {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.toc-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(106, 17, 203, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.toc-heading-wrapper {
  display: flex;
  align-items: center;
}

.toc-toggle-btn {
  background: none;
  border: none;
  padding: 0;
  margin-right: 10px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a5fff;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    color: #fff;
    background: rgba(106, 17, 203, 0.2);
    border-radius: 50%;
  }
}

.toc-toggle-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  transition: transform 0.3s ease;

  &.expanded {
    transform: rotate(90deg);
  }
}

.toc-link {
  color: #ccc;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: block;
  padding: 8px 15px;
  border-radius: 8px;
  position: relative;
  text-decoration: none;
  flex-grow: 1;

  &.has-children {
    padding-left: 0;
  }

  &::before {
    display: none;
  }

  &:hover {
    color: #fff;
    background: rgba(106, 17, 203, 0.2);
    transform: translateX(8px);
  }
}

.toc-number {
  font-weight: 700;
  color: $color-accent-1;
  margin-right: 6px;
}

.toc-text {
  font-weight: 500;
}

.toc-sublist {
  margin-left: 34px;
  margin-top: 8px;
  list-style: none;
  padding: 0;
}

.toc-subitem {
  padding: 5px 0;
  border-bottom: 1px dotted rgba(106, 17, 203, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.toc-sublink {
  color: rgba(204, 204, 204, 0.8);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: block;
  padding: 6px 15px;
  border-radius: 6px;
  position: relative;
  text-decoration: none;

  &::before {
    display: none;
  }

  &:hover {
    color: #fff;
    background: rgba(106, 17, 203, 0.15);
    transform: translateX(8px);
  }
}

.toc-subnumber {
  font-weight: 700;
  color: rgba($color-accent-1, 0.8);
  margin-right: 6px;
}

.toc-subtext {
  font-weight: 400;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

@media (max-width: $breakpoint-md) {
  .toc-button {
    bottom: 75px;
    right: 20px;
    width: 45px;
    height: 45px;
  }

  .toc-icon {
    width: 22px;
    height: 22px;
  }

  .toc-modal-content {
    max-height: 70%;
    max-width: 90%;
  }

  .toc-sublist {
    margin-left: 30px;
  }

  .toc-sublink {
    font-size: 0.85rem;
    padding: 5px 12px;
  }

  .toc-toggle-btn {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }

  .toc-toggle-icon {
    width: 14px;
    height: 14px;
  }

  .toc-number {
    font-weight: 700;
    color: $color-accent-1;
  }

  .toc-subnumber {
    font-weight: 700;
    color: rgba($color-accent-1, 0.8);
  }
}
</style>
