<template>
  <div class="planet-animation" ref="planetContainer">
    <div class="planet">
      <div class="planet-surface"></div>
      <div class="planet-glow"></div>
      <div class="planet-ring"></div>

      <div class="orbit-container">
        <div class="orbit orbit-1">
          <div class="moon moon-1"></div>
        </div>
        <div class="orbit orbit-2">
          <div class="moon moon-2"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";

export default {
  name: "PlanetAnimation",
  mounted() {
    this.initializeAnimation();

    // マウスに合わせてパララックス効果
    this.$refs.planetContainer.addEventListener(
      "mousemove",
      this.handleMouseMove
    );

    // アニメーションをデバイスの向きに合わせる（モバイルデバイス向け）
    window.addEventListener("deviceorientation", this.handleDeviceOrientation);

    // リサイズに対応するため
    window.addEventListener("resize", this.handleResize);

    // 初期表示時にもレスポンシブ調整を適用
    this.handleResize();
  },
  beforeUnmount() {
    this.$refs.planetContainer.removeEventListener(
      "mousemove",
      this.handleMouseMove
    );
    window.removeEventListener(
      "deviceorientation",
      this.handleDeviceOrientation
    );
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    initializeAnimation() {
      // 惑星の自転アニメーション
      gsap.to(".planet-surface", {
        rotation: 360,
        duration: 80,
        repeat: -1,
        ease: "linear",
      });

      // 惑星のグローエフェクトのパルスアニメーション
      gsap.to(".planet-glow", {
        opacity: 0.5,
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 月の公転アニメーション
      gsap.to(".orbit-1", {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "linear",
      });

      gsap.to(".orbit-2", {
        rotation: -360,
        duration: 50,
        repeat: -1,
        ease: "linear",
      });

      // 小さな月のパルスアニメーション
      gsap.to(".moon-1", {
        scale: 1.2,
        opacity: 0.7,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".moon-2", {
        scale: 1.3,
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // 惑星リングのアニメーション
      gsap.to(".planet-ring", {
        rotation: -10,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    handleMouseMove(e) {
      const planetContainer = this.$refs.planetContainer;
      const rect = planetContainer.getBoundingClientRect();

      // マウス位置に対するコンテナの中心からの相対位置
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // 中心からの距離を計算（-1から1の範囲）
      const moveX = (mouseX - centerX) / centerX;
      const moveY = (mouseY - centerY) / centerY;

      // 惑星の動きをマウス位置に合わせて調整
      gsap.to(".planet", {
        x: moveX * 30,
        y: moveY * 30,
        rotationY: moveX * 10,
        rotationX: -moveY * 10,
        duration: 1,
        ease: "power2.out",
      });

      // リングのパララックス効果（惑星より大きな動き）
      gsap.to(".planet-ring", {
        x: moveX * 40,
        y: moveY * 40,
        duration: 1.2,
        ease: "power2.out",
      });

      // 月の軌道のパララックス効果
      gsap.to(".orbit-container", {
        x: moveX * 20,
        y: moveY * 20,
        rotationY: moveX * 5,
        rotationX: -moveY * 5,
        duration: 1.4,
        ease: "power2.out",
      });

    },
    handleDeviceOrientation(e) {
      // スマホ・タブレットの場合はジャイロ操作を無効にする
      if (window.innerWidth <= 768) {
        return;
      }

      if (!e.beta || !e.gamma) return;

      // デバイスの向きを-1から1の範囲に変換
      const moveX = e.gamma / 30; // gamma: 左右の傾き (-90〜90)
      const moveY = e.beta / 30; // beta: 前後の傾き (0〜180)

      // 惑星の動きをデバイスの向きに合わせて調整
      gsap.to(".planet", {
        x: moveX * 20,
        y: moveY * 20,
        rotationY: moveX * 8,
        rotationX: -moveY * 8,
        duration: 0.5,
        ease: "power1.out",
      });

      // リングのパララックス効果
      gsap.to(".planet-ring", {
        x: moveX * 30,
        y: moveY * 30,
        duration: 0.6,
        ease: "power1.out",
      });

      // 月の軌道のパララックス効果
      gsap.to(".orbit-container", {
        x: moveX * 15,
        y: moveY * 15,
        duration: 0.7,
        ease: "power1.out",
      });
    },
    handleResize() {
      // 画面サイズに応じて惑星のサイズを調整
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;

      // 画面サイズに基づいてスケールとコンテナサイズを調整
      if (isSmallMobile) {
        // 小さなスマホ向け
        gsap.set(".planet", { scale: 0.6 });
        // 軌道の位置を中央に合わせるよう調整し、より広く設定
        gsap.set(".orbit-1", {
          width: 300,
          height: 300,
          top: "calc(50% - 150px)",
          left: "calc(50% - 150px)"
        });
        gsap.set(".orbit-2", {
          width: 380,
          height: 380,
          top: "calc(50% - 190px)",
          left: "calc(50% - 190px)"
        });
      } else if (isMobile) {
        // 通常のタブレット・スマホ向け
        gsap.set(".planet", { scale: 0.7 });
        // 軌道の位置を中央に合わせるよう調整し、より広く設定
        gsap.set(".orbit-1", {
          width: 340,
          height: 340,
          top: "calc(50% - 170px)",
          left: "calc(50% - 170px)"
        });
        gsap.set(".orbit-2", {
          width: 420,
          height: 420,
          top: "calc(50% - 210px)",
          left: "calc(50% - 210px)"
        });
      } else {
        // デスクトップ向け
        gsap.set(".planet", { scale: 1 });
        gsap.set(".orbit-1", { width: 320, height: 320, top: -40, left: -40 });
        gsap.set(".orbit-2", { width: 400, height: 400, top: -80, left: -80 });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.planet-animation {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  overflow: visible;
}

.planet {
  position: relative;
  width: 240px;
  height: 240px;
  transform-style: preserve-3d;
}

.planet-surface {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg,
    darken($color-accent-5, 10%),
    darken($color-secondary, 7%)
  );
  background-size: 400% 400%;
  box-shadow: inset -40px -40px 80px rgba(0, 0, 0, 0.55),
    inset 10px 10px 30px rgba(24, 26, 27, 0.3);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background-image: radial-gradient(
        circle at 30% 40%,
        rgba($color-accent-2, 0.35) 0%,
        transparent 20%
      ),
      radial-gradient(
        circle at 70% 60%,
        rgba($color-accent-3, 0.3) 0%,
        transparent 30%
      ),
      radial-gradient(
        circle at 50% 50%,
        rgba($color-accent-1, 0.2) 0%,
        transparent 60%
      );
    filter: brightness(0.95);
  }
}

.planet-glow {
  position: absolute;
  width: 130%;
  height: 130%;
  top: -15%;
  left: -15%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba($color-accent-2, 0.2) 0%,
    transparent 70%
  );
  filter: blur(20px) brightness(0.9);
}

.planet-ring {
  position: absolute;
  width: 200%;
  height: 50px;
  top: 50%;
  left: -50%;
  transform: translateY(-50%) rotateX(80deg);
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba($color-accent-2, 0.15) 20%,
    rgba($color-accent-2, 0.4) 50%,
    rgba($color-accent-2, 0.15) 80%,
    transparent 100%
  );
  overflow: hidden;
  filter: brightness(1);

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
        90deg,
        transparent 20%,
        rgba(255, 255, 255, 0.05) 21%,
        transparent 22%
      ),
      linear-gradient(
        90deg,
        transparent 30%,
        rgba(255, 255, 255, 0.05) 31%,
        transparent 32%
      ),
      linear-gradient(
        90deg,
        transparent 65%,
        rgba(255, 255, 255, 0.05) 66%,
        transparent 67%
      ),
      linear-gradient(
        90deg,
        transparent 80%,
        rgba(255, 255, 255, 0.05) 81%,
        transparent 82%
      );
    filter: blur(2px);
  }
}

.orbit-container {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba($color-text-secondary, 0.25);
  transform-style: preserve-3d;

  &.orbit-1 {
    width: 320px;
    height: 320px;
    top: -40px;
    left: -40px;
  }

  &.orbit-2 {
    width: 400px;
    height: 400px;
    top: -80px;
    left: -80px;
  }
}

.moon {
  position: absolute;
  border-radius: 50%;
  filter: brightness(0.95);

  &.moon-1 {
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg,
      darken($color-accent-2, 5%),
      darken($color-accent-1, 5%)
    );
    box-shadow: 0 0 8px rgba($color-accent-2, 0.5);
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  &.moon-2 {
    width: 12px;
    height: 12px;
    background: darken($color-accent-3, 8%);
    box-shadow: 0 0 6px rgba($color-accent-3, 0.45);
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}

@media (max-width: $breakpoint-md) {
  .planet-animation {
    transform: scale(1);
    padding: 0;
    height: 300px;
  }
}

@media (max-width: $breakpoint-sm) {
  .planet-animation {
    height: 250px;
  }
}
</style>
