<template>
  <nav class="navbar" :class="{ scrolled: scrolled }">
    <div class="container navbar-container" :class="{ 'bgm-playing': isBgmPlaying }">
      <router-link to="/home" class="navbar-logo">
        <div class="logo-orbit">
          <span class="logo-planet"></span>
        </div>
        <span class="logo-text">
          <span class="animated-gradient">Taiki<span class="accent">&nbsp;Note</span></span>
        </span>
      </router-link>

      <!-- モバイル用BGMボタン -->
      <div class="mobile-controls">
        <button class="bgm-button-mobile" @click="toggleBgm" :class="{ 'is-playing': isBgmPlaying }">
          <div class="sound-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="bgm-text-mobile">BGM</span>
        </button>

        <button
          class="menu-toggle"
          @click="toggleMobileMenu"
          :class="{ active: mobileMenuOpen }"
          aria-label="メニュー"
        >
          <div class="toggle-wrapper">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      <div class="navbar-links">
        <template v-for="(item) in navItems" :key="item.path">
          <router-link
            :to="item.path"
            class="navbar-link"
            active-class="active"
            @click="scrollToTop"
          >
            <span class="link-text">{{ item.name }}</span>
            <span class="link-indicator"></span>
          </router-link>
        </template>

        <!-- デスクトップ用BGMボタン -->
        <button class="bgm-button" @click="toggleBgm" :class="{ 'is-playing': isBgmPlaying }">
          <div class="sound-waves" :class="{ 'active': isBgmPlaying }">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="bgm-label">BGM</span>
        </button>
      </div>
    </div>

    <!-- オーバーレイ背景 -->
    <div class="menu-overlay" v-if="mobileMenuOpen" @click="closeMobileMenu"></div>

    <!-- ポップアップ式モバイルメニュー -->
    <div class="mobile-menu-popup" :class="{ open: mobileMenuOpen }">
      <div class="popup-header">
        <div class="popup-title">Menu</div>
        <button class="close-button" @click="closeMobileMenu">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="popup-content">
        <template v-for="(item, index) in navItems" :key="item.path">
          <router-link
            :to="item.path"
            class="popup-menu-item"
            active-class="active"
            :style="{ 'animation-delay': `${0.05 * index}s` }"
            @click="handleMobileClick"
          >
            <div class="item-icon">
              <div class="icon-orbit">
                <span class="icon-dot"></span>
              </div>
            </div>
            <span class="item-text">{{ item.name }}</span>
          </router-link>
        </template>
      </div>

      <div class="popup-footer">
        <div class="footer-decoration">
          <span class="decoration-dot"></span>
          <span class="decoration-line"></span>
          <span class="decoration-dot"></span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    isBgmPlaying: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      navItems: [
        { name: "ホーム", path: "/home" },
        { name: "自己紹介", path: "/about" },
        { name: "プロジェクト", path: "/projects" },
        { name: "スキル", path: "/skills" },
        { name: "ブログ", path: "/blog" },
        { name: "お問い合わせ", path: "/contact" },
        { name: "スペースキャンバス", path: "/canvas" },
      ],
      scrolled: false,
      hoveredLink: null,
      mobileMenuOpen: false,
    };
  },
  computed: {
    // 現在のルートパスを取得
    currentPath() {
      return this.$route.path;
    }
  },
  mounted() {
    // スクロールイベントリスナーを追加
    window.addEventListener("scroll", this.handleScroll);

    // ESCキーでメニューを閉じる
    window.addEventListener("keydown", this.handleKeyDown);
  },
  beforeUnmount() {
    // イベントリスナーを削除
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 50;
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    },
    handleMobileClick() {
      this.closeMobileMenu();
      // Vue Routerの場合は即座にスクロールしない
      this.$nextTick(() => {
        this.scrollToTop();
      });
    },
    handleKeyDown(e) {
      // ESCキーでメニューを閉じる
      if (e.key === "Escape" && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    },
    animateMenuItems() {
      // メニュー項目のアニメーションをリセットして再開
      const menuItems = document.querySelectorAll('.popup-menu-item');
      menuItems.forEach(item => {
        item.style.animation = 'none';
        setTimeout(() => {
          item.style.animation = '';
        }, 10);
      });
    },
    toggleBgm() {
      // BGMの再生を処理するために、イベントを親コンポーネント（App.vue）に送信する
      this.$emit('toggle-bgm');

      if (this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: $z-index-navbar;
  padding: $spacing-md 0;
  transition: all $transition-normal ease;
  backdrop-filter: blur(10px);
  background: rgba($color-secondary, 0.5);
  border-bottom: 1px solid rgba($color-accent-1, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  &.scrolled {
    background: rgba($color-secondary, 0.85);
    padding: $spacing-sm 0;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);

    .navbar-logo {
      transform: scale(0.9);
    }

    .navbar-link {
      padding: $spacing-xs 0;
      font-size: $font-size-sm;
    }

    .bgm-button {
      transform: scale(0.9);
    }
  }
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.navbar-logo {
  display: flex;
  align-items: center;
  font-size: $font-size-xl;
  font-weight: 700;
  position: relative;
  transition: all $transition-normal ease;
  padding: $spacing-sm $spacing-md;

  .logo-text {
    position: relative;
    z-index: 2;
    font-family: 'Satisfy', sans-serif;
    letter-spacing: 0.1em;
    text-shadow: $title-shadow;
  }

  .animated-gradient {
    background-size: 300% 300%;
    background-image: linear-gradient(
      -45deg,
      $color-text-primary 0%,
      $color-accent-2 25%,
      $color-accent-1 50%,
      $color-accent-2 75%,
      $color-text-primary 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientFlow 8s ease infinite;

    .accent {
      background-size: 300% 300%;
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
      animation: gradientFlow 8s ease infinite reverse;
    }
  }

  .logo-orbit {
    position: relative;
    width: 30px;
    height: 30px;
    border: 1px solid rgba($color-accent-2, 0.5);
    border-radius: 50%;
    margin-right: $spacing-sm;
    animation: orbitRotate 8s infinite linear;
    transition: all $transition-normal ease;

    &:hover {
      box-shadow: 0 0 15px rgba($color-accent-1, 0.5);
    }

    .logo-planet {
      position: absolute;
      width: 6px;
      height: 6px;
      background: linear-gradient(135deg, $color-accent-1, $color-accent-2);
      border-radius: 50%;
      top: -3px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0 0 7px rgba($color-accent-2, 0.7);
    }
  }
}

.mobile-controls {
  display: none;
  align-items: center;
  gap: $spacing-md;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
  font-family: "NotoSansJPSemiBold", serif;
}

.navbar-link {
  position: relative;
  font-weight: 500;
  transition: all $transition-normal ease;
  padding: $spacing-sm 0;
  overflow: hidden;
  color: $color-text-secondary;
  font-size: $font-size-md;

  .link-text {
    position: relative;
    z-index: 2;
    transition: all $transition-normal ease;
  }

  .link-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, $color-accent-2, $color-accent-1);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 4px;
    opacity: 0;
  }

  &:hover {
    color: $color-text-primary;

    .link-indicator {
      width: 100%;
      opacity: 0.7;
    }
  }

  &.active {
    font-weight: 600;
    color: $color-accent-1;

    .link-indicator {
      width: 100%;
      height: 3px;
      opacity: 1;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -10px;
    right: -10px;
    bottom: -5px;
    background: linear-gradient(135deg,
      rgba($color-accent-1, 0.05),
      rgba($color-accent-2, 0.05));
    border-radius: 4px;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1;
  }

}

.bgm-button {
  display: flex;
  align-items: center;
  background: rgba($color-secondary, 0.3);
  border: 1px solid rgba($color-accent-1, 0.2);
  border-radius: 22px;
  padding: $spacing-xs $spacing-md;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg,
      rgba($color-accent-1, 0.1),
      rgba($color-accent-2, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($color-accent-1, 0.2);

    &::before {
      opacity: 1;
    }
  }

  &.is-playing {
    background: rgba($color-accent-1, 0.15);
    border-color: rgba($color-accent-1, 0.5);
    box-shadow: 0 0 15px rgba($color-accent-1, 0.3);

    .bgm-label {
      color: $color-accent-1;
    }
  }

  .sound-waves {
    position: relative;
    width: 22px;
    height: 22px;
    margin-right: $spacing-sm;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      position: absolute;
      width: 2.5px;
      height: 10px;
      border-radius: 1px;
      background: rgba(rgba(24, 26, 27, 0.5), 0.5);
      transition: all 0.2s ease;

      &:nth-child(1) {
        left: 4px;
        height: 8px;
      }

      &:nth-child(2) {
        left: 10px;
        height: 12px;
      }

      &:nth-child(3) {
        left: 16px;
        height: 16px;
      }
    }

    &.active span {
      background: $color-accent-1;
      animation: soundBars 1.2s ease infinite alternate;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }

  .bgm-label {
    font-size: $font-size-md;
    font-weight: 600;
    color: $color-text-primary;
    transition: color 0.2s ease;
  }
}

.bgm-button-mobile {
  display: none;
  align-items: center;
  gap: $spacing-xs;
  background: rgba($color-secondary, 0.3);
  border: 1px solid rgba($color-accent-1, 0.2);
  border-radius: 20px;
  padding: $spacing-xs $spacing-sm;
  position: relative;
  cursor: pointer;
  transition: all 0.25s ease;

  &.is-playing {
    background: rgba($color-accent-1, 0.15);
    border-color: rgba($color-accent-1, 0.5);
    box-shadow: 0 0 10px rgba($color-accent-1, 0.3);

    .bgm-text-mobile {
      color: $color-accent-1;
    }
  }

  .sound-icon {
    position: relative;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;

    span {
      position: absolute;
      width: 1.8px;
      background: rgba(rgba(24, 26, 27, 0.5), 0.5);
      transition: all 0.2s ease;

      &:nth-child(1) {
        height: 7px;
        left: 4px;
      }

      &:nth-child(2) {
        height: 12px;
        left: 9px;
      }

      &:nth-child(3) {
        height: 16px;
        left: 14px;
      }
    }
  }

  &.is-playing .sound-icon span {
    background: $color-accent-1;
    animation: soundBars 1.2s ease infinite alternate;

    &:nth-child(1) {
      animation-delay: 0s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  .bgm-text-mobile {
    font-size: 12px;
    font-weight: 600;
    color: $color-text-primary;
    transition: color 0.2s ease;
  }
}

@media (max-width: $breakpoint-md) {
  .navbar-links {
    display: none;
  }

  .mobile-controls {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bgm-button-mobile {
    display: flex;
    min-width: 80px;
    padding: $spacing-sm $spacing-md;
    border-radius: 22px;
    margin-right: 12px;
  }

  .bgm-text-mobile {
    font-size: 13px !important;
    letter-spacing: 0.5px;
  }

  .sound-icon {
    width: 20px !important;
    height: 20px !important;
    margin-right: 6px !important;

    span {
      width: 2px !important;

      &:nth-child(1) {
        height: 8px !important;
        left: 5px !important;
      }

      &:nth-child(2) {
        height: 13px !important;
        left: 10px !important;
      }

      &:nth-child(3) {
        height: 17px !important;
        left: 15px !important;
      }
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .mobile-menu-popup {
    width: 200px;
    right: $spacing-sm;
  }

  .mobile-controls {
    gap: $spacing-sm;
  }

  .bgm-button-mobile {
    min-width: 70px;
    padding: $spacing-xs $spacing-sm;
    margin-right: 8px;

    .bgm-text-mobile {
      font-size: 12px !important;
    }

    .sound-icon {
      width: 16px !important;
      height: 16px !important;
      margin-right: 4px !important;

      span {
        width: 1.5px !important;

        &:nth-child(1) {
          height: 6px !important;
          left: 4px !important;
        }

        &:nth-child(2) {
          height: 10px !important;
          left: 8px !important;
        }

        &:nth-child(3) {
          height: 14px !important;
          left: 12px !important;
        }
      }
    }
  }
}

// ハンバーガーメニュートグル
.menu-toggle {
  display: none;
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 10;
  background: transparent;
  border: none;
  outline: none;

  .toggle-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 22px;
    position: relative;

    span {
      display: block;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, $color-accent-2, $color-accent-1);
      border-radius: 3px;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);

      &:nth-child(1) {
        width: 70%;
      }

      &:nth-child(2) {
        width: 100%;
      }

      &:nth-child(3) {
        width: 85%;
        align-self: flex-end;
      }
    }
  }

  &.active {
    .toggle-wrapper {
      span {
        width: 100% !important;

        &:nth-child(1) {
          transform: translateY(10px) rotate(45deg);
        }

        &:nth-child(2) {
          opacity: 0;
          transform: scale(0);
        }

        &:nth-child(3) {
          transform: translateY(-10px) rotate(-45deg);
        }
      }
    }
  }
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: 9;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
  pointer-events: auto;
}

.mobile-menu-popup {
  position: fixed;
  top: 70px;
  right: $spacing-lg;
  width: 220px;
  max-height: 360px;
  background: rgba($color-secondary, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3),
              0 0 5px rgba($color-accent-1, 0.2);
  z-index: 10;
  overflow: hidden;
  transform: translateY(-10px) scale(0.95);
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;

  &.open {
    transform: translateY(0) scale(1);
    opacity: 1;
    visibility: visible;
  }
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-sm $spacing-md;
  border-bottom: 1px solid rgba($color-accent-1, 0.1);

  .popup-title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $color-accent-1;
  }

  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: rgba($color-text-primary, 0.1);
    color: $color-text-primary;
    cursor: pointer;
    transition: all 0.2s ease;
  }
}

.popup-content {
  padding: $spacing-sm 0;
  max-height: 260px;
  overflow-y: auto;
  font-family: "NotoSansJPSemiBold", serif;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: rgba($color-text-primary, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient($color-accent-1, $color-accent-2);
    border-radius: 3px;
  }
}

.popup-menu-item {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  transition: all 0.2s ease;
  animation: slideInRight 0.3s forwards;
  opacity: 0;
  transform: translateX(20px);
  position: relative;

  .item-icon {
    margin-right: $spacing-sm;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-orbit {
    position: relative;
    width: 16px;
    height: 16px;
    border: 1px solid rgba($color-accent-1, 0.3);
    border-radius: 50%;
    transition: all 0.3s ease;

    .icon-dot {
      position: absolute;
      width: 3px;
      height: 3px;
      background: $color-accent-1;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 3px rgba($color-accent-1, 0.5);
      transition: all 0.3s ease;
    }
  }

  .item-text {
    font-size: $font-size-sm;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  &.active {
    background: rgba($color-accent-1, 0.15);
    font-weight: 600;
    padding-left: $spacing-lg;
    border-left: 3px solid $color-accent-1;

    .item-text {
      color: $color-accent-1;
    }

    .icon-orbit {
      border-color: rgba($color-accent-1, 0.8);

      .icon-dot {
        background: $color-accent-2;
        box-shadow: 0 0 4px rgba($color-accent-2, 0.7);
      }
    }
  }
}

.popup-footer {
  padding: $spacing-xs;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba($color-accent-1, 0.1);

  .footer-decoration {
    display: flex;
    align-items: center;

    .decoration-dot {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: $color-accent-1;
      box-shadow: 0 0 3px rgba($color-accent-1, 0.5);
    }

    .decoration-line {
      width: 30px;
      height: 1px;
      background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
      margin: 0 $spacing-sm;
    }
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

@keyframes orbitRotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes starsFloat {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

@keyframes soundBars {
  0% {
    height: 5px;
    opacity: 0.5;
  }
  100% {
    height: 18px;
    opacity: 1;
  }
}

@media (max-width: $breakpoint-md) {
  .navbar-links {
    display: none;
  }

  .mobile-controls {
    display: flex;
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bgm-button-mobile {
    display: flex;
    margin-right: 10px;
  }

}

@media (max-width: $breakpoint-sm) {
  .mobile-menu-popup {
    width: 200px;
    right: $spacing-sm;
  }

  .mobile-controls {
    gap: $spacing-sm;
  }

  .bgm-button-mobile {
    width: 28px;
    height: 28px;

    .sound-icon {
      width: 12px;
      height: 12px;

      span {
        &:nth-child(1) {
          height: 5px;
          left: 3px;
        }

        &:nth-child(2) {
          height: 8px;
          left: 6px;
        }

        &:nth-child(3) {
          height: 11px;
          left: 9px;
        }
      }
    }
  }
}
</style>
