<template>
  <div
    class="cursor-trail-container"
    ref="container"
    @mousemove="handleMouseMove"
  >
    <!-- スロットでコンテンツを挿入可能 -->
    <div class="content">
      <slot></slot>
    </div>

    <!-- トレイル用のSVG -->
    <svg class="trail-svg" ref="trailSvg"></svg>
  </div>
</template>

<script>
export default {
  name: 'MouseTrailEffect',
  props: {
    // エフェクト全体の有効/無効
    enabled: {
      type: Boolean,
      default: true
    },
    // トレイル設定
    trailColor: {
      type: String,
      default: '#6A11CB'
    },
    trailGradient: {
      type: Boolean,
      default: true
    },
    trailWidth: {
      type: Number,
      default: 2
    },
    trailFadeTime: {
      type: Number,
      default: 500
    },
    trailSmoothing: {
      type: Boolean,
      default: true
    },
    // パーティクル設定
    particleEnabled: {
      type: Boolean,
      default: true
    },
    particleColors: {
      type: Array,
      default: () => ['#60a5fa', '#3b82f6', '#8B5CF6']
    },
    particleSize: {
      type: Number,
      default: 2
    },
    particleCount: {
      type: Number,
      default: 2
    },
    particleLifetime: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      // ウィンドウサイズ
      windowWidth: 0,
      windowHeight: 0,

      // マウス位置とトラッキング
      mouseX: 0,
      mouseY: 0,
      targetX: 0,
      targetY: 0,
      mouseHistory: [],
      maxHistoryLength: 10,
      smoothingFactor: 0.2,

      // トレイル（線）の管理
      trails: [],
      trailIdCounter: 0,

      // パーティクル管理
      particles: [],
      particleIdCounter: 0,

      // アニメーション用
      animationId: null
    };
  },
  computed: {
    config() {
      return {
        trailColor: this.trailColor,
        trailGradient: this.trailGradient,
        trailWidth: this.trailWidth,
        trailFadeTime: this.trailFadeTime,
        trailSmoothing: this.trailSmoothing,
        particleEnabled: this.particleEnabled,
        particleColors: this.particleColors,
        particleSize: this.particleSize,
        particleCount: this.particleCount,
        particleLifetime: this.particleLifetime
      };
    }
  },
  watch: {
    // enabledプロパティの変更を監視
    enabled(newVal) {
      if (newVal) {
        // エフェクトを有効にする
        this.startAnimation();
      } else {
        // エフェクトを無効にする
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
        }
        this.cleanup();
      }
    }
  },
  mounted() {
    this.initializeEffect();
    // エフェクトが有効な場合のみアニメーション開始
    if (this.enabled) {
      this.startAnimation();
    }
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    this.cleanup();
    window.removeEventListener('resize', this.handleResize);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  },
  methods: {
    initializeEffect() {
      // コンテナのサイズを取得
      const rect = this.$refs.container.getBoundingClientRect();
      this.windowWidth = rect.width;
      this.windowHeight = rect.height;

      if (this.$refs.trailSvg) {
        this.$refs.trailSvg.setAttribute('width', this.windowWidth);
        this.$refs.trailSvg.setAttribute('height', this.windowHeight);
      }
    },

    handleMouseMove(event) {
      // エフェクトが無効な場合は何もしない
      if (!this.enabled) return;

      // コンテナの位置を取得
      const rect = this.$refs.container.getBoundingClientRect();

      // コンテナ内での相対座標を計算
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;

      // スムージング用のターゲット位置の更新
      if (this.config.trailSmoothing) {
        this.targetX = this.mouseX;
        this.targetY = this.mouseY;
      } else {
        this.addPointToHistory(this.mouseX, this.mouseY);
      }

      // パーティクルを生成
      if (this.config.particleEnabled && Math.random() > 0.5) {
        for (let i = 0; i < this.config.particleCount; i++) {
          this.createParticle(this.mouseX, this.mouseY);
        }
      }
    },

    addPointToHistory(x, y) {
      this.mouseHistory.push({ x, y, time: Date.now() });

      if (this.mouseHistory.length > this.maxHistoryLength) {
        this.mouseHistory.shift();
      }

      if (this.mouseHistory.length >= 2) {
        const lastPoint = this.mouseHistory[this.mouseHistory.length - 2];
        const currentPoint = this.mouseHistory[this.mouseHistory.length - 1];
        const distance = Math.hypot(currentPoint.x - lastPoint.x, currentPoint.y - lastPoint.y);

        if (distance > 3) {
          this.createTrail();
        }
      }
    },

    animate() {
      if (this.config.trailSmoothing) {
        const currentX = this.mouseHistory.length > 0 ?
          this.mouseHistory[this.mouseHistory.length - 1]?.x || this.targetX : this.targetX;
        const currentY = this.mouseHistory.length > 0 ?
          this.mouseHistory[this.mouseHistory.length - 1]?.y || this.targetY : this.targetY;

        const newX = currentX + (this.targetX - currentX) * this.smoothingFactor;
        const newY = currentY + (this.targetY - currentY) * this.smoothingFactor;

        const lastPoint = this.mouseHistory[this.mouseHistory.length - 1];
        if (!lastPoint || Math.hypot(newX - lastPoint.x, newY - lastPoint.y) > 2) {
          this.addPointToHistory(newX, newY);
        }
      }

      this.animateParticles();
      this.animationId = requestAnimationFrame(this.animate);
    },

    createTrail() {
      const history = this.mouseHistory;
      if (history.length < 2 || !this.$refs.trailSvg) return;

      const pointsToUse = Math.min(history.length, 10);
      const recentHistory = history.slice(-pointsToUse);

      let path = `M ${recentHistory[0].x} ${recentHistory[0].y}`;

      for (let i = 1; i < recentHistory.length; i++) {
        const p0 = recentHistory[Math.max(0, i-2)];
        const p1 = recentHistory[Math.max(0, i-1)];
        const p2 = recentHistory[i];
        const p3 = recentHistory[Math.min(recentHistory.length-1, i+1)];

        const cp1x = p1.x + (p2.x - p0.x) * 0.2;
        const cp1y = p1.y + (p2.y - p0.y) * 0.2;
        const cp2x = p2.x - (p3.x - p1.x) * 0.2;
        const cp2y = p2.y - (p3.y - p1.y) * 0.2;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }

      let gradientId = null;
      if (this.config.trailGradient) {
        gradientId = `gradient-${this.trailIdCounter}`;
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
        gradient.setAttribute('x1', recentHistory[0].x);
        gradient.setAttribute('y1', recentHistory[0].y);
        gradient.setAttribute('x2', recentHistory[recentHistory.length-1].x);
        gradient.setAttribute('y2', recentHistory[recentHistory.length-1].y);

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#3b82f6');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#6A11CB');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.appendChild(gradient);
        this.$refs.trailSvg.appendChild(defs);
      }

      const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathElement.setAttribute('d', path);
      pathElement.setAttribute('stroke', gradientId ? `url(#${gradientId})` : this.config.trailColor);
      pathElement.setAttribute('stroke-width', this.config.trailWidth);
      pathElement.setAttribute('fill', 'none');
      pathElement.setAttribute('stroke-linecap', 'round');
      pathElement.setAttribute('stroke-linejoin', 'round');
      pathElement.style.opacity = '0.8';
      pathElement.style.transition = `opacity ${this.config.trailFadeTime}ms ease-out`;

      this.$refs.trailSvg.appendChild(pathElement);

      const trail = {
        id: this.trailIdCounter++,
        element: pathElement,
        gradient: gradientId ? document.getElementById(gradientId) : null,
        createdAt: Date.now()
      };

      this.trails.push(trail);

      setTimeout(() => {
        pathElement.style.opacity = '0';
      }, 10);

      setTimeout(() => {
        if (pathElement && pathElement.parentNode && pathElement.parentNode === this.$refs.trailSvg) {
          this.$refs.trailSvg.removeChild(pathElement);
        }
        if (trail.gradient && trail.gradient.parentNode && trail.gradient.parentNode.parentNode) {
          trail.gradient.parentNode.parentNode.removeChild(trail.gradient.parentNode);
        }
        const index = this.trails.findIndex(t => t.id === trail.id);
        if (index !== -1) {
          this.trails.splice(index, 1);
        }
      }, this.config.trailFadeTime + 100);
    },

    createParticle(x, y) {
      const colorIndex = Math.floor(Math.random() * this.config.particleColors.length);
      const color = this.config.particleColors[colorIndex];

      const element = document.createElement('div');
      element.className = 'particle';
      element.style.left = `${x + (Math.random() - 0.5) * 20}px`;
      element.style.top = `${y + (Math.random() - 0.5) * 20}px`;
      element.style.width = `${this.config.particleSize + Math.random() * 5}px`;
      element.style.height = `${this.config.particleSize + Math.random() * 5}px`;
      element.style.backgroundColor = color;
      element.style.opacity = '1';

      this.$refs.container.appendChild(element);

      const particle = {
        id: this.particleIdCounter++,
        element: element,
        x: parseFloat(element.style.left),
        y: parseFloat(element.style.top),
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        opacity: 1,
        size: parseFloat(element.style.width),
        createdAt: Date.now()
      };

      this.particles.push(particle);

      setTimeout(() => {
        if (particle.element && particle.element.parentNode && particle.element.parentNode === this.$refs.container) {
          this.$refs.container.removeChild(particle.element);
        }
        const index = this.particles.findIndex(p => p.id === particle.id);
        if (index !== -1) {
          this.particles.splice(index, 1);
        }
      }, this.config.particleLifetime);
    },

    animateParticles() {
      const now = Date.now();

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const age = now - p.createdAt;
        const lifePercent = age / this.config.particleLifetime;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.vx *= 0.99;
        p.opacity = 1 - lifePercent;

        const newSize = p.size * (1 - lifePercent * 0.5);

        if (p.element && p.element.parentNode === this.$refs.container) {
          p.element.style.left = `${p.x}px`;
          p.element.style.top = `${p.y}px`;
          p.element.style.opacity = p.opacity.toString();
          p.element.style.width = `${newSize}px`;
          p.element.style.height = `${newSize}px`;
        }
      }
    },

    handleResize() {
      // コンテナのサイズを取得
      const rect = this.$refs.container.getBoundingClientRect();
      this.windowWidth = rect.width;
      this.windowHeight = rect.height;

      if (this.$refs.trailSvg) {
        this.$refs.trailSvg.setAttribute('width', this.windowWidth);
        this.$refs.trailSvg.setAttribute('height', this.windowHeight);
      }
    },

    startAnimation() {
      this.animate();
    },

    cleanup() {
      // 全てのトレイルとパーティクルをクリーンアップ
      this.trails.forEach(trail => {
        if (trail.element.parentNode) {
          trail.element.parentNode.removeChild(trail.element);
        }
        if (trail.gradient && trail.gradient.parentNode) {
          trail.gradient.parentNode.parentNode.removeChild(trail.gradient.parentNode);
        }
      });

      this.particles.forEach(particle => {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });

      this.trails = [];
      this.particles = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.cursor-trail-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 5;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.trail-svg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 15;
  width: 100%;
  height: 100%;
}

:deep(.particle) {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 20;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  mix-blend-mode: screen;
}
</style>
