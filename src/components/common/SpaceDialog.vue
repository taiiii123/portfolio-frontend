<template>
  <transition name="dialog-fade">
    <div
      class="space-dialog-overlay"
      v-if="visible"
      @click.self="closeOnBackdrop && close()"
    >
      <div class="space-dialog" :class="dialogClass">
        <div class="space-dialog-stars"></div>

        <div class="space-dialog-header">
          <h3 class="space-dialog-title" v-if="title">{{ title }}</h3>
          <button class="close-btn" @click="close()" v-if="showCloseButton">
            <span class="close-icon">×</span>
          </button>
        </div>

        <div class="space-dialog-body">
          <div class="dialog-icon" v-if="icon || iconPath">
            <!-- 画像アイコンを優先して表示 -->
            <img v-if="iconPath" :src="iconPath" :alt="title" class="icon-image" />
            <!-- 文字アイコンはフォールバック -->
            <span v-else-if="icon">{{ icon }}</span>
          </div>
          <div class="dialog-content">
            <slot>{{ message }}</slot>
          </div>
        </div>

        <div
          class="space-dialog-footer"
          v-if="$slots.footer || showConfirmButtons"
        >
          <slot name="footer">
            <div class="dialog-buttons">
              <button
                v-if="showCancelButton"
                class="btn dialog-btn cancel-btn"
                @click="onCancel"
              >
                {{ cancelButtonText }}
              </button>
              <button class="btn dialog-btn confirm-btn" @click="onConfirm">
                {{ confirmButtonText }}
              </button>
            </div>
          </slot>
        </div>

        <div class="space-dialog-glow"></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "SpaceDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    iconPath: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "info", // 'info', 'success', 'warning', 'error'
      validator: (value) =>
        ["info", "success", "warning", "error"].includes(value),
    },
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    showConfirmButtons: {
      type: Boolean,
      default: true,
    },
    showCancelButton: {
      type: Boolean,
      default: true,
    },
    confirmButtonText: {
      type: String,
      default: "確認",
    },
    cancelButtonText: {
      type: String,
      default: "キャンセル",
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:visible", "confirm", "cancel", "close"],
  computed: {
    dialogClass() {
      return {
        [`dialog-${this.type}`]: true,
      };
    },
  },
  mounted() {
    // ダイアログが表示された際にキーボードイベントを追加
    if (this.visible) {
      document.addEventListener("keydown", this.handleKeyDown);
    }

    // 星を生成
    this.$nextTick(() => {
      if (this.visible) {
        this.createStars();
      }
    });
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        document.addEventListener("keydown", this.handleKeyDown);
        this.$nextTick(() => {
          this.createStars();
        });
        // スクロールを無効化
        document.body.style.overflow = "hidden";
      } else {
        document.removeEventListener("keydown", this.handleKeyDown);
        // スクロールを有効化
        document.body.style.overflow = "";
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    // スクロールを有効化（念のため）
    document.body.style.overflow = "";
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    onConfirm() {
      this.$emit("confirm");
      this.close();
    },
    onCancel() {
      this.$emit("cancel");
      this.close();
    },
    handleKeyDown(e) {
      if (e.key === "Escape" && this.closeOnBackdrop) {
        this.close();
      } else if (e.key === "Enter") {
        this.onConfirm();
      }
    },
    createStars() {
      const starsContainer = this.$el.querySelector(".space-dialog-stars");
      if (!starsContainer) return;

      // 既存の星をクリア
      starsContainer.innerHTML = "";

      // 小さな星を生成
      for (let i = 0; i < 50; i++) {
        const star = document.createElement("div");
        star.className = "dialog-star";

        const size = Math.random() * 2 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.animationDelay = `${delay}s`;

        starsContainer.appendChild(star);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

// ダイアログタイプごとの色を設定
$dialog-colors: (
  "info": $color-accent-2,
  "success": #4caf50,
  "warning": #ff9800,
  "error": #f44336,
);

.space-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color-primary, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-index-modal;
}

.space-dialog {
  position: relative;
  width: 90%;
  max-width: 500px;
  background: rgba($color-secondary, 0.9);
  border-radius: 15px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  padding: $spacing-lg;
  z-index: $z-index-modal + 1;

  // ダイアログの種類に応じたスタイル
  @each $type, $color in $dialog-colors {
    &.dialog-#{$type} {
      border: 1px solid rgba($color, 0.3);

      .space-dialog-glow {
        background: radial-gradient(
          circle,
          rgba($color, 0.2) 0%,
          transparent 70%
        );
      }

      .dialog-icon {
        color: $color;
        background: rgba($color, 0.1);
      }

      .confirm-btn {
        background: linear-gradient(90deg, darken($color, 10%), $color);

        &:hover {
          background: linear-gradient(90deg, $color, lighten($color, 10%));
        }
      }
    }
  }
}

.space-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  position: relative;
}

.space-dialog-title {
  font-size: $font-size-xl;
  color: $color-text-primary;
  margin: 0;
  padding-bottom: $spacing-sm;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200px;
    height: 2px;
    background: linear-gradient(
      90deg,
      $color-accent-2,
      rgba($color-accent-2, 0)
    );
  }
}

.close-btn {
  background: none;
  border: none;
  color: $color-text-secondary;
  font-size: $font-size-xl;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all $transition-normal ease;

  &:hover {
    background: rgba($color-text-primary, 0.1);
    color: $color-text-primary;
    transform: rotate(90deg);
  }
}

.space-dialog-body {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.dialog-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;

  .icon-image {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
}

.dialog-content {
  flex: 1;
  font-size: $font-size-md;
  color: $color-text-secondary;
  line-height: 1.6;
}

.space-dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.dialog-buttons {
  display: flex;
  gap: $spacing-md;
}

.dialog-btn {
  padding: $spacing-sm $spacing-lg;
  border-radius: 30px;
  font-size: $font-size-md;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-normal ease;
  border: none;

  &:hover {
    transform: translateY(-3px);
  }
}

.cancel-btn {
  background: rgba($color-text-secondary, 0.2);
  color: $color-text-secondary;

  &:hover {
    background: rgba($color-text-secondary, 0.3);
    color: $color-text-primary;
  }
}

.confirm-btn {
  color: $color-text-primary;
  box-shadow: 0 5px 15px rgba($color-accent-2, 0.3);
}

.space-dialog-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.dialog-star {
  position: absolute;
  background-color: $color-text-primary;
  border-radius: 50%;
  animation: dialog-twinkle 3s infinite ease-in-out;
}

.space-dialog-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  opacity: 0.5;
  filter: blur(20px);
}

// トランジションアニメーション
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.3s ease;
}

.dialog-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.dialog-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

@keyframes dialog-twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: $breakpoint-md) {
  .space-dialog {
    max-width: 90%;
  }

  .space-dialog-body {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .dialog-icon {
    margin-bottom: $spacing-sm;
  }

  .space-dialog-footer {
    justify-content: center;
  }
}
</style>
