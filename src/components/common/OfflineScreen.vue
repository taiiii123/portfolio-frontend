<template>
  <div class="offline-screen" v-if="!isOnline">
    <!-- 背景の星々 -->
    <div class="hero-stars">
      <div
        v-for="star in stars"
        :key="star.id"
        class="star"
        :style="{
          left: star.left + '%',
          top: star.top + '%',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's'
        }"
      />
    </div>

    <div class="container offline-container">
      <div class="offline-content">
        <!-- アイコンセクション -->
        <div class="offline-icon-section">
          <div class="planet-animation">
            <div class="planet">
              <div class="planet-ring"></div>
              <div class="planet-surface">
                <div class="crater crater-1"></div>
                <div class="crater crater-2"></div>
                <div class="crater crater-3"></div>
              </div>
            </div>
          </div>
          <div class="signal-waves">
            <div class="wave wave-1"></div>
            <div class="wave wave-2"></div>
            <div class="wave wave-3"></div>
          </div>
        </div>

        <!-- メインメッセージ -->
        <div class="offline-message">
          <h1 class="offline-title animated-gradient">
            通信が途絶えました
          </h1>
          <p class="offline-subtitle">
            インターネット接続が検出されません。<br />
            ネットワーク設定を確認してから、もう一度お試しください。
          </p>
        </div>

        <!-- アクションボタン -->
        <div class="offline-actions">
          <button class="btn btn-retry" @click="handleRetry">
            <span class="btn-icon">🔄</span>
            再試行する
            <div class="btn-stars">
              <div class="btn-star star-1"></div>
              <div class="btn-star star-2"></div>
              <div class="btn-star star-3"></div>
            </div>
          </button>
          <div class="retry-count" v-if="retryCount > 0">
            再試行回数: {{ retryCount }}
          </div>
        </div>

        <!-- トラブルシューティング -->
        <div class="troubleshooting">
          <h3 class="troubleshooting-title">
            <span class="title-icon">💡</span>
            <span>トラブルシューティング</span>
          </h3>
          <ul class="troubleshooting-list">
            <li
              v-for="(item, index) in troubleshootingItems"
              :key="index"
              class="troubleshooting-item"
            >
              <span class="item-icon">{{ item.icon }}</span>
              {{ item.text }}
            </li>
          </ul>
        </div>

        <!-- フッター -->
        <div class="offline-footer">
          <div class="footer-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-dot"></div>
            <div class="decoration-line"></div>
          </div>
          <p class="footer-text">
            <span class="footer-brand animated-gradient">Taiki Note</span>
            - ポートフォリオ＆ブログ
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- オンライン復旧通知 -->
  <div v-else-if="showOnlineNotification" class="online-status">
    <div class="online-message">
      <span class="status-dot online"></span>
      接続が復旧しました
    </div>
  </div>
</template>

<script>
export default {
  name: "OfflineScreen",
  emits: ['network-status-change'],
  data() {
    return {
      isOnline: navigator.onLine,
      showOnlineNotification: false,
      retryCount: 0,
      stars: [],
      troubleshootingItems: [
        {
          icon: "📡",
          text: "Wi-Fiまたはモバイルデータが有効になっているか確認"
        },
        {
          icon: "🔧",
          text: "ルーターの電源を一度切って再度入れ直す"
        },
        {
          icon: "🌐",
          text: "他のウェブサイトにアクセスできるか確認"
        },
        {
          icon: "⚡",
          text: "しばらく時間をおいてから再度アクセス"
        }
      ]
    };
  },
  mounted() {
    this.generateStars();
    this.setupNetworkListeners();

    // 初期状態を親コンポーネントに通知
    this.$emit('network-status-change', this.isOnline);
  },
  beforeUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  },
  methods: {
    generateStars() {
      this.stars = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2
      }));
    },
    setupNetworkListeners() {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    },
    handleOnline() {
      this.isOnline = true;
      this.showOnlineNotification = true;

      // 親コンポーネント（App.vue）にオンライン状態を通知
      this.$emit('network-status-change', true);

      // 3秒後に通知を非表示
      setTimeout(() => {
        this.showOnlineNotification = false;
      }, 3000);
    },
    handleOffline() {
      this.isOnline = false;
      this.showOnlineNotification = false;

      // 親コンポーネント（App.vue）にオフライン状態を通知
      this.$emit('network-status-change', false);
    },
    handleRetry() {
      this.retryCount++;

      // ネットワーク状態をチェック
      if (navigator.onLine) {
        this.handleOnline();
        // 実際のアプリケーションでは、ページを再読み込みまたはデータを再取得
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 1秒後にリロード（復旧通知を表示するため）
      } else {
        // オフライン時のフィードバック
        console.log(`再試行回数: ${this.retryCount} - まだオフラインです`);
        this.$emit('retry-attempted', this.retryCount);
      }
    }
  }
};
</script>

<style lang="scss" scoped>

.offline-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: #03040A;
  color: #ffffff;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: "NotoSansJP", serif;
  z-index: 9999;
}

.hero-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #ffffff;
  border-radius: 50%;
  animation: twinkle 3s infinite ease-in-out;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.offline-container {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: $spacing-2xl $spacing-lg;
}

.offline-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.offline-icon-section {
  position: relative;
  margin-bottom: $spacing-2xl;
  display: flex;
  justify-content: center;
  align-items: center;
}

.planet-animation {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.planet {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-accent-1 0%, $color-accent-2 100%);
  box-shadow: 0 0 30px rgba($color-accent-1, 0.5);
  animation: planetRotate 10s infinite linear;
}

.planet-ring {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border: 2px solid rgba($color-accent-2, 0.3);
  border-radius: 50%;
  animation: ringRotate 8s infinite linear;
}

.planet-surface {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.crater {
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);

  &.crater-1 {
    width: 20px;
    height: 20px;
    top: 20%;
    left: 30%;
  }

  &.crater-2 {
    width: 15px;
    height: 15px;
    top: 60%;
    left: 60%;
  }

  &.crater-3 {
    width: 12px;
    height: 12px;
    top: 40%;
    left: 70%;
  }
}

.signal-waves {
  position: absolute;
  top: 50%;
  right: -80px;
  transform: translateY(-50%);
}

.wave {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid #ef4444;
  border-radius: 50%;
  animation: waveExpand 2s infinite ease-out;

  &.wave-1 {
    animation-delay: 0s;
  }

  &.wave-2 {
    animation-delay: 0.5s;
  }

  &.wave-3 {
    animation-delay: 1s;
  }
}

.offline-message {
  margin-bottom: $spacing-2xl;
}

.offline-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: $spacing-lg;
  line-height: 1.2;
}

.animated-gradient {
  background-size: 400% 400%;
  background-image: linear-gradient(
    -45deg,
    $color-accent-1 0%,
    $color-accent-2 25%,
    $color-accent-1 50%,
    $color-accent-2 75%,
    $color-accent-1 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 3s ease-in-out infinite;
}

.title-accent {
  font-family: "Satisfy", sans-serif;
  letter-spacing: 0.1em;
}

.offline-subtitle {
  font-size: $font-size-xl;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: $spacing-xl;
}

.offline-actions {
  margin-bottom: $spacing-2xl;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  background: linear-gradient(135deg, $color-accent-1, $color-accent-2);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: $font-size-lg;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all $transition-normal ease;
  box-shadow: 0 4px 15px rgba($color-accent-1, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba($color-accent-1, 0.4);

    .btn-star {
      animation: starFloat 1.5s infinite ease-in-out;
    }
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-icon {
  font-size: 1.2em;
  animation: rotate 2s infinite linear;
}

.btn-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.btn-star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  opacity: 0;

  &.star-1 {
    top: 20%;
    left: 20%;
    animation-delay: 0s;
  }

  &.star-2 {
    top: 30%;
    right: 25%;
    animation-delay: 0.5s;
  }

  &.star-3 {
    bottom: 25%;
    left: 50%;
    animation-delay: 1s;
  }
}

.retry-count {
  margin-top: $spacing-md;
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.6);
}

.troubleshooting {
  text-align: left;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: $spacing-xl;
  margin-bottom: $spacing-2xl;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.troubleshooting-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-xl;
  margin-bottom: $spacing-lg;
  color: $color-accent-2;
}

.title-icon {
  font-size: 1.2em;
}

.troubleshooting-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.troubleshooting-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all $transition-normal ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding-left: $spacing-sm;
  }
}

.item-icon {
  font-size: 1.1em;
  min-width: 20px;
}

.offline-footer {
  padding-top: $spacing-xl;
}

.footer-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-md;
  gap: $spacing-sm;
}

.decoration-line {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, $color-accent-2, transparent);
}

.decoration-dot {
  width: 6px;
  height: 6px;
  background: $color-accent-2;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba($color-accent-2, 0.5);
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: $font-size-sm;
}

.footer-brand {
  font-weight: 600;
}

.online-status {
  position: fixed;
  top: $spacing-lg;
  right: $spacing-lg;
  z-index: 1000;
}

.online-message {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  background: rgba(34, 197, 94, 0.9);
  color: white;
  padding: $spacing-sm $spacing-lg;
  border-radius: 25px;
  font-size: $font-size-sm;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  animation: slideInRight 0.3s ease-out;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  animation: pulse 2s infinite;

  &.online {
    background: white;
  }
}

// アニメーション
@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

@keyframes planetRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes ringRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

@keyframes waveExpand {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

@keyframes starFloat {
  0%, 100% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
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

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// レスポンシブ対応
@media (max-width: $breakpoint-md) {
  .offline-title {
    font-size: 2.5rem;
  }

  .offline-subtitle {
    font-size: $font-size-md;
  }

  .troubleshooting {
    padding: $spacing-lg;
  }

  .troubleshooting-item {
    font-size: $font-size-sm;
  }

  .signal-waves {
    right: -60px;
  }

  .planet-animation {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: $breakpoint-sm) {
  .offline-title {
    font-size: 2rem;
  }

  .offline-container {
    padding: $spacing-lg $spacing-md;
    margin-top: 200px;
  }

  .troubleshooting {
    padding: $spacing-md;
  }

  .btn {
    padding: $spacing-sm $spacing-lg;
    font-size: $font-size-md;
  }

  .container {
    padding: 0 $spacing-md;
  }
}
</style>
