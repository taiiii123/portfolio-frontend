<template>
  <div class="route-selection-page">
    <!-- 中央のコンテンツ -->
    <div class="selection-container">
      <div class="logo-container" ref="logoContainer">
        <h1 class="site-title animated-gradient">Taiki Note</h1>
      </div>
      <h2 class="title animated-gradient">
        <div class="title-container">
          <div class="title-text">ようこそ</div>
        </div>
      </h2>

      <div class="routes-container">
        <div class="route-option" @click="navigateTo('Home')" ref="homeOption">
          <div class="route-circle">
            <div class="circle-content">
              <div class="circle-icon">
                <img src="@/assets/images/home.png" alt="ホームアイコン">
              </div>
              <h2>ホーム</h2>
            </div>
          </div>
          <p class="route-description">ポートフォリオサイトのトップページへ</p>
        </div>

        <span class="divider"></span>

        <div class="route-option" @click="navigateTo('Blog')" ref="blogOption">
          <div class="route-circle">
            <div class="circle-content">
              <div class="circle-icon">
                <img src="@/assets/images/blog.png" alt="記事アイコン">
              </div>
              <h2>ブログ</h2>
            </div>
          </div>
          <p class="route-description">技術や日常のことを書いたブログへ</p>
        </div>
      </div>
    </div>

    <!-- 中央の光アニメーション用の要素 -->
    <div class="center-orb" ref="centerOrb"></div>
    <div class="energy-wave" ref="energyWave1"></div>
    <div class="energy-wave" ref="energyWave2"></div>
    <div class="energy-wave" ref="energyWave3"></div>
  </div>
</template>

<script>
import { gsap } from "gsap";

export default {
  name: "RouteSelectionPage",
  data() {
    return {
      isNavigating: false,
      targetRoute: null,
    };
  },
  mounted() {
    // ロゴの初期アニメーション
    this.startEntryAnimation();
  },
  methods: {
    startEntryAnimation() {
      // ロゴのアニメーション
      gsap.fromTo(
        this.$refs.logoContainer,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
      );
    },
    navigateTo(routeName) {
      // すでにナビゲーション中なら処理をスキップ
      if (this.isNavigating) return;

      this.isNavigating = true;
      this.targetRoute = routeName;

      // 選択されたオプションを強調表示
      const selectedOption =
        routeName === "Home" ? this.$refs.homeOption : this.$refs.blogOption;
      const otherOption =
        routeName === "Home" ? this.$refs.blogOption : this.$refs.homeOption;
      const centerOrb = this.$refs.centerOrb;
      const energyWave1 = this.$refs.energyWave1;
      const energyWave2 = this.$refs.energyWave2;
      const energyWave3 = this.$refs.energyWave3;

      // 選択されたオプションのエフェクト
      gsap.to(selectedOption.querySelector(".route-circle"), {
        boxShadow: "0 0 30px #00d1ff, 0 0 60px #00a1ff",
        duration: 0.5,
      });

      // 選択されていないオプションをフェードアウト
      gsap.to(otherOption, {
        opacity: 0.2,
        scale: 0.9,
        duration: 0.4,
      });

      // ロゴとタイトルをフェードアウト
      gsap.to([".site-title", ".title"], {
        opacity: 0,
        y: -30,
        duration: 0.5,
      });

      // 選択肢間の区切り線をフェードアウト
      gsap.to(".divider", {
        opacity: 0,
        duration: 0.3,
      });

      // 中央のオーブを表示
      gsap.set(centerOrb, {
        display: "block",
        opacity: 0,
        scale: 0,
      });

      // エネルギー波を設定
      gsap.set([energyWave1, energyWave2, energyWave3], {
        display: "block",
        opacity: 0,
        scale: 0,
      });

      // アニメーションタイムライン
      const tl = gsap.timeline({
        onComplete: () => {
          // アニメーション完了後に指定のルートに遷移
          this.$router.push({ name: this.targetRoute });
        },
      });

      // 中央のオーブが現れる
      tl.to(centerOrb, {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
      });

      // 3つのエネルギー波が順番に広がる
      tl.to(
        energyWave1,
        {
          opacity: 0.8,
          scale: 1,
          duration: 0.8,
          ease: "power1.out",
        },
        "-=0.4"
      );

      tl.to(
        energyWave2,
        {
          opacity: 0.6,
          scale: 1.5,
          duration: 1,
          ease: "power1.out",
        },
        "-=0.6"
      );

      tl.to(
        energyWave3,
        {
          opacity: 0.4,
          scale: 2,
          duration: 1.2,
          ease: "power1.out",
        },
        "-=0.8"
      );

      // オーブが強く輝き、画面を覆うアニメーション
      tl.to(
        centerOrb,
        {
          scale: 20,
          opacity: 1,
          duration: 1.2,
          ease: "power3.in",
        },
        "-=0.7"
      );

      // ページ全体をフェードアウト
      tl.to(
        ".route-selection-page",
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.3"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.route-selection-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000;
  overflow: hidden;
}

// セレクションコンテナ
.selection-container {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 90%;
  max-width: 1000px;
  margin-top: -20vh;
}

.logo-container {
  margin-bottom: 1.5rem;
}

.site-title {
  font-size: 4rem;
  margin-top: 50px;
  font-family: "Satisfy", sans-serif;
  letter-spacing: 0.1em;
  margin: 0;
  background-size: 400% 400%;
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
  animation: gradientFlow 12s ease-in-out infinite;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 4rem;
  font-family: "NotoSansJPBold", serif;
  letter-spacing: 0.05em;
}

.animated-gradient {
  background-size: 400% 400%;
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
  animation: gradientFlow 12s ease-in-out infinite;
}

.routes-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.route-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
  width: 180px;
}

.route-circle {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(25, 25, 35, 0.7);
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.4s ease;
  border: 1px solid rgba(0, 180, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 150, 255, 0.2);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(0, 200, 255, 0.4);
    border-color: rgba(0, 210, 255, 0.6);

    .circle-icon {
      transform: translateY(-5px);
      text-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
    }

    ~ .route-description {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.circle-content {
  text-align: center;
  z-index: 2;
}

.circle-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.4s ease;
  text-shadow: 0 0 10px rgba(0, 180, 255, 0.5);
  width: 70px;
}

.route-circle h2 {
  font-size: 1.5rem;
  margin: 0;
  color: $color-text-primary;
  font-family: "NotoSansJPBold", serif;
}

.route-description {
  color: $color-text-secondary;
  font-size: 0.95rem;
  opacity: 0.7;
  transition: all 0.4s ease;
  padding: 0 1rem;
  transform: translateY(5px);
}

.divider {
  width: 1px;
  height: 100px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 180, 255, 0.5),
    transparent
  );
  margin: 0 3rem;
}

.center-orb {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 0%,
    rgba(0, 200, 255, 0.8) 50%,
    rgba(0, 100, 255, 0) 80%
  );
  box-shadow: 0 0 30px rgba(0, 200, 255, 0.8), 0 0 60px rgba(0, 150, 255, 0.6);
  z-index: 10;
  display: none;
}

.energy-wave {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 9;
  display: none;
  pointer-events: none;
}

.energy-wave:nth-of-type(2) {
  width: 300px;
  height: 300px;
  border: 4px solid rgba(0, 210, 255, 0.6);
  box-shadow: 0 0 30px rgba(0, 180, 255, 0.5),
    inset 0 0 30px rgba(0, 180, 255, 0.3);
}

.energy-wave:nth-of-type(3) {
  width: 600px;
  height: 600px;
  border: 3px solid rgba(0, 180, 255, 0.4);
  box-shadow: 0 0 40px rgba(0, 150, 255, 0.3),
    inset 0 0 40px rgba(0, 150, 255, 0.2);
}

.energy-wave:nth-of-type(4) {
  width: 900px;
  height: 900px;
  border: 2px solid rgba(0, 150, 255, 0.3);
  box-shadow: 0 0 50px rgba(0, 120, 255, 0.2),
    inset 0 0 50px rgba(0, 120, 255, 0.1);
}

// アニメーション定義
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

@media (max-width: $breakpoint-md) {
  .site-title {
    font-size: 3.2rem;
    margin-top: 200px;
  }

  .title {
    font-size: 2rem;
    margin-bottom: 3rem;
  }

  .routes-container {
    flex-direction: column;
    gap: 3rem;
  }

  .divider {
    width: 100px;
    height: 1px;
    margin: 0.5rem 0;
    background: linear-gradient(
      to right,
      transparent,
      rgba(0, 180, 255, 0.5),
      transparent
    );
  }

  .route-circle {
    width: 130px;
    height: 130px;
  }

  .circle-icon {
    font-size: 2rem;
    width: 60px;
    transform: translateX(5px);
  }

  .site-title.animated-gradient {
    margin-bottom: -20px;
  }
}

@media (max-width: $breakpoint-sm) {
  .site-title {
    font-size: 2.8rem;
  }

  .title {
    font-size: 1.6rem;
    margin-bottom: 2.5rem;
  }

  .route-circle {
    width: 120px;
    height: 120px;
  }

  .circle-icon {
    font-size: 1.8rem;
    width: 60px;
    transform: translateX(0px);
  }

  .route-circle h2 {
    font-size: 1.3rem;
  }
}
</style>
