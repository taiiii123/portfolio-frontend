<template>
  <div
    :style="{
      position: 'fixed',
      left: isMobile ? '15px' : '25px',
      bottom: isMobile ? '15px' : '25px',
      width: isMobile ? '58px' : '70px',
      height: isMobile ? '58px' : '70px',
      zIndex: 9999,
      pointerEvents: 'none',
      transform: isMobile ? 'scale(0.9)' : 'none'
    }"
  >
    <!-- 宇宙ポータルコンテナ -->
    <div
      class="cosmic-portal-content"
      :style="{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: 'rgba(8, 8, 34, 0.75)',
        boxShadow: `0 0 20px rgba(106, 17, 203, 0.3),
                    0 0 40px rgba(37, 117, 252, 0.1)`,
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(106, 17, 203, 0.2)'
      }"
    >
      <!-- 宇宙の渦効果 -->
      <div class="cosmic-vortex"></div>

      <!-- 円グラフのSVG -->
      <svg :width="isMobile ? 58 : 70" :height="isMobile ? 58 : 70" viewBox="0 0 70 70" style="position: absolute; z-index: 2">
        <!-- 背景がきらめくためのフィルター -->
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <!-- グラデーション定義 -->
          <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6A11CB" />
            <stop offset="50%" stop-color="#8E44AD" />
            <stop offset="100%" stop-color="#2575FC" />
          </linearGradient>
        </defs>

        <!-- 背景円 -->
        <circle
          cx="35"
          cy="35"
          r="28"
          fill="transparent"
          stroke="rgba(106, 17, 203, 0.15)"
          stroke-width="4"
          filter="url(#glow)"
        />

        <!-- 進捗円 -->
        <circle
          cx="35"
          cy="35"
          r="28"
          fill="transparent"
          stroke="url(#cosmicGradient)"
          stroke-width="4"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 35 35)"
          filter="url(#glow)"
        />
      </svg>

      <div
        :style="{
          position: 'relative',
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: isMobile ? '14px' : '16px',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textShadow: '0 0 10px rgba(106, 17, 203, 0.5)'
        }"
      >
        {{ scrollPercent }}<span
          :style="{
            fontSize: isMobile ? '9px' : '10px',
            marginLeft: '1px'
          }"
        >%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScrollIndicator',
  data() {
    return {
      scrollPercent: 0,
      isMobile: false,
      circumference: 2 * Math.PI * 28, // 円周 = 2πr, r=28
      timer: null
    };
  },
  computed: {
    // ダッシュオフセットを計算（円グラフの進捗表示に使用）
    dashOffset() {
      return this.circumference * (1 - this.scrollPercent / 100);
    }
  },
  mounted() {
    // モバイル判定
    this.checkMobile();

    // スクロール監視
    window.addEventListener('scroll', this.onScroll);

    // リサイズ対応
    window.addEventListener('resize', this.onResize);

    // 初期値設定
    this.onScroll();

    // 定期更新
    this.timer = setInterval(this.onScroll, 16);

    // CSSスタイルをページに追加
    this.injectStyles();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);

    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    onScroll() {
      // スクロール位置取得
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

      // 全体の高さ
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );

      // ウィンドウの高さ
      const winHeight = window.innerHeight;

      // スクロール可能領域
      const scrollable = docHeight - winHeight;

      // パーセント計算
      if (scrollable > 0) {
        // 最下部判定
        if (scrollPos + winHeight >= docHeight - 2) {
          this.scrollPercent = 100;
        } else {
          const calculated = Math.floor((scrollPos / scrollable) * 100);
          this.scrollPercent = Math.max(0, Math.min(100, calculated));
        }
      } else {
        this.scrollPercent = 0;
      }
    },

    onResize() {
      this.checkMobile();
      this.onScroll();
    },

    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },

    // スタイルをページに追加する
    injectStyles() {
      const styleEl = document.createElement('style');
      styleEl.type = 'text/css';
      styleEl.innerHTML = `
        /* 宇宙の渦効果 */
        .cosmic-vortex {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background:
            radial-gradient(ellipse at center,
              rgba(37, 117, 252, 0) 0%,
              rgba(37, 117, 252, 0.1) 20%,
              rgba(106, 17, 203, 0.2) 50%,
              rgba(8, 8, 34, 0) 70%);
          opacity: 0.7;
          animation: cosmic-spin 15s linear infinite;
        }

        @keyframes cosmic-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* 星のコンテナ */
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 50%;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
};
</script>
