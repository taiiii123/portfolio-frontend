<template>
  <div class="hero-stars-container" ref="starsContainer">
    <canvas ref="starsCanvas" class="stars-canvas"></canvas>
    <vue-particles
      v-if="particlesVisible"
      :id="particlesId"
      class="particles-container"
      :particlesInit="particlesInit"
      :options="particlesOptions"
    />
  </div>
</template>

<script>
import { loadSlim } from "tsparticles-slim";

export default {
  name: "HeroStars",
  props: {
    particles: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      stars: [],
      shootingStars: [],
      canvas: null,
      ctx: null,
      animationFrameId: null,
      width: 0,
      height: 0,
      mouseX: 0,
      mouseY: 0,
      particlesVisible: false,
      particlesId: 'tsparticles-' + Math.random().toString(36).substr(2, 9),
      particlesOptions: {
        fpsLimit: 120,
        fullScreen: {
          enable: false,
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 100,
              duration: 3,
            },
          },
        },
        particles: {
          color: {
            value: '#dedede',
          },
          links: {
            color: '#dedede',
            distance: 100,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: 'none',
            enable: true,
            outMode: 'bounce',
            random: false,
            speed: 0.3,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.4,
          },
          shape: {
            type: 'circle',
          },
          size: {
            random: true,
            value: 3,
          },
        },
        detectRetina: true,
      }
    };
  },
  mounted() {
    this.initCanvas();
    this.createStars();
    this.createShootingStars();
    this.startAnimation();

    // particles.jsの初期化を少し遅らせる
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.particles) {
          this.particlesVisible = true;
        }
      }, 100);
    });

    // マウス移動に応じてパララックス効果
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.handleResize);
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    // particles.jsのクリーンアップ
    this.particlesVisible = false;
  },
  watch: {
    // ルート変更を監視
    '$route'() {
      this.$nextTick(() => {
        this.reinitializeParticles();
      });
    },
    particles: {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.particlesVisible = true;
            }, 100);
          });
        } else {
          this.particlesVisible = false;
        }
      },
      immediate: true
    }
  },
  methods: {
    async particlesInit(engine) {
      await loadSlim(engine);
    },

    reinitializeParticles() {
      // particles.jsを再初期化
      if (this.particles) {
        this.particlesVisible = false;
        this.$nextTick(() => {
          // 新しいIDを生成して完全に再初期化
          this.particlesId = 'tsparticles-' + Math.random().toString(36).substr(2, 9);
          setTimeout(() => {
            this.particlesVisible = true;
          }, 150);
        });
      }
    },

    initCanvas() {
      this.canvas = this.$refs.starsCanvas;
      if (this.canvas) {
        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();
      }
    },

    resizeCanvas() {
      const container = this.$refs.starsContainer;
      if (container && this.canvas) {
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // ウィンドウサイズ変更時に星を再生成
        this.createStars();
        this.createShootingStars();
      }
    },

    handleResize() {
      this.resizeCanvas();
      // リサイズ時にparticlesも再初期化
      this.reinitializeParticles();
    },

    createStars() {
      this.stars = [];

      if (this.width === 0 || this.height === 0) return;

      // 背景の小さな星（多数）
      const smallStarsCount = Math.floor((this.width * this.height) / 1000);
      for (let i = 0; i < smallStarsCount; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 1 + 0.1,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.05,
          blinkSpeed: Math.random() * 0.01 + 0.005,
          blinkDirection: Math.random() > 0.5 ? 1 : -1,
          layer: 3, // 背景層
        });
      }

      // 中くらいの星（少なめ）
      const mediumStarsCount = Math.floor((this.width * this.height) / 10000);
      for (let i = 0; i < mediumStarsCount; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 1.5 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.1 + 0.05,
          blinkSpeed: Math.random() * 0.02 + 0.01,
          blinkDirection: Math.random() > 0.5 ? 1 : -1,
          layer: 2, // 中間層
        });
      }
    },

    createShootingStars() {
      this.shootingStars = [];

      if (this.width === 0) return;

      // 流れ星の数（画面サイズに応じて調整）
      const shootingStarsCount = Math.floor(this.width / 300);

      for (let i = 0; i < shootingStarsCount; i++) {
        this.addShootingStar();
      }
    },

    addShootingStar() {
      if (this.width === 0 || this.height === 0) return;

      // 開始位置（画面上部または左側）
      const startFromTop = Math.random() > 0.5;
      let x, y;

      if (startFromTop) {
        x = Math.random() * this.width;
        y = -20;
      } else {
        x = -20;
        y = Math.random() * (this.height / 2); // 上半分から開始
      }

      // 速度と角度
      const speed = Math.random() * 5 + 5;
      const angle = (Math.random() * Math.PI) / 4 + Math.PI / 4; // 45〜90度の角度

      // 長さと遅延
      const length = Math.random() * 80 + 50;
      const delay = Math.random() * 30000;

      // まれに赤い流れ星を生成
      const isRed = Math.random() < 0.015;

      this.shootingStars.push({
        x,
        y,
        speed,
        angle,
        length,
        opacity: 0,
        active: false,
        delay,
        startTime: Date.now() + delay,
        isRed: isRed, // 赤い星の判定フラグを追加
      });
    },

    handleMouseMove(e) {
      const container = this.$refs.starsContainer;
      if (container) {
        const rect = container.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
      }
    },

    startAnimation() {
      const animate = () => {
        if (this.ctx && this.canvas) {
          this.ctx.clearRect(0, 0, this.width, this.height);
          this.updateStars();
          this.updateShootingStars();
          this.drawStars();
          this.drawShootingStars();
        }
        this.animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    },

    updateStars() {
      this.stars.forEach((star) => {
        // 明滅効果
        star.opacity += star.blinkSpeed * star.blinkDirection;

        if (star.opacity >= 1) {
          star.opacity = 1;
          star.blinkDirection = -1;
        } else if (star.opacity <= 0.2) {
          star.opacity = 0.2;
          star.blinkDirection = 1;
        }

        // マウス位置による視差効果
        if (this.width > 0 && this.height > 0) {
          const centerX = this.width / 2;
          const centerY = this.height / 2;
          const moveX = (this.mouseX - centerX) / centerX;
          const moveY = (this.mouseY - centerY) / centerY;

          // 層に応じて視差の強さを変える
          const parallaxFactor = 6 - star.layer * 2;

          star.parallaxX = moveX * parallaxFactor;
          star.parallaxY = moveY * parallaxFactor;
        }
      });
    },

    updateShootingStars() {
      const now = Date.now();

      this.shootingStars.forEach((star) => {
        // 遅延後に流れ星をアクティブにする
        if (!star.active && now >= star.startTime) {
          star.active = true;
          star.opacity = 1;
        }

        if (star.active) {
          // 移動
          star.x += Math.cos(star.angle) * star.speed;
          star.y += Math.sin(star.angle) * star.speed;

          // 画面外に出たら再セット
          if (star.x > this.width + 100 || star.y > this.height + 100) {
            const index = this.shootingStars.indexOf(star);
            if (index !== -1) {
              this.shootingStars.splice(index, 1);
              this.addShootingStar();
            }
          }
        }
      });
    },

    drawStars() {
      if (!this.ctx) return;

      this.stars.forEach((star) => {
        this.ctx.beginPath();
        this.ctx.arc(
          star.x + (star.parallaxX || 0),
          star.y + (star.parallaxY || 0),
          star.radius,
          0,
          Math.PI * 2
        );

        // グラデーションを作成
        const gradient = this.ctx.createRadialGradient(
          star.x + (star.parallaxX || 0),
          star.y + (star.parallaxY || 0),
          0,
          star.x + (star.parallaxX || 0),
          star.y + (star.parallaxY || 0),
          star.radius * 2
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      });
    },

    drawStarGlow(star) {
      if (!this.ctx) return;

      const x = star.x + (star.parallaxX || 0);
      const y = star.y + (star.parallaxY || 0);
      const glowSize = star.radius * 5;

      // 十字の光芒
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity * 0.3})`;
      this.ctx.lineWidth = 0.5;

      // 水平線
      this.ctx.beginPath();
      this.ctx.moveTo(x - glowSize, y);
      this.ctx.lineTo(x + glowSize, y);
      this.ctx.stroke();

      // 垂直線
      this.ctx.beginPath();
      this.ctx.moveTo(x, y - glowSize);
      this.ctx.lineTo(x, y + glowSize);
      this.ctx.stroke();

      // 丸いグロー効果
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowSize);

      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.5})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, glowSize, 0, Math.PI * 2);
      this.ctx.fill();
    },

    drawShootingStars() {
      if (!this.ctx) return;

      this.shootingStars.forEach((star) => {
        if (star.active) {
          // 色の決定（赤い星かどうかで分岐）
          const colorStart = star.isRed
            ? `rgba(255, 50, 50, ${star.opacity})`
            : `rgba(255, 255, 255, ${star.opacity})`;
          const colorEnd = star.isRed
            ? "rgba(255, 50, 50, 0)"
            : "rgba(255, 255, 255, 0)";

          // 流れ星の頭
          this.ctx.beginPath();
          this.ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
          this.ctx.fillStyle = colorStart;
          this.ctx.fill();

          // 流れ星の尾
          const tailX = star.x - Math.cos(star.angle) * star.length;
          const tailY = star.y - Math.sin(star.angle) * star.length;

          const gradient = this.ctx.createLinearGradient(
            star.x,
            star.y,
            tailX,
            tailY
          );

          gradient.addColorStop(0, colorStart);
          gradient.addColorStop(1, colorEnd);

          this.ctx.beginPath();
          this.ctx.moveTo(star.x, star.y);
          this.ctx.lineTo(tailX, tailY);
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.hero-stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.stars-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

:deep(#tsparticles canvas),
:deep([id^="tsparticles-"] canvas) {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
}
</style>
