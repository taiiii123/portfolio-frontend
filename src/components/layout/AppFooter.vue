<template>
  <footer class="footer">

    <div class="footer-waves">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          class="wave wave-1"
          d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
        <path
          class="wave wave-2"
          d="M0,160L48,186.7C96,213,192,267,288,266.7C384,267,480,213,576,202.7C672,192,768,224,864,224C960,224,1056,192,1152,170.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
    <div class="container footer-container">

      <div class="footer-content">
        <div class="footer-logo">
          <router-link to="/home" class="footer-logo-link">
            <div class="logo-orbit">
              <span class="logo-planet"></span>
            </div>
            <span class="logo-text">
              <span class="animated-gradient">Taiki<span class="accent"> Note</span></span>
            </span>
          </router-link>
          <p class="footer-tagline">ポートフォリオ＆ブログ</p>

          <div class="constellation">
            <div
              class="constellation-dot"
              v-for="i in 5"
              :key="`dot-${i}`"
            ></div>
            <div
              class="constellation-line"
              v-for="i in 4"
              :key="`line-${i}`"
            ></div>
          </div>
        </div>

        <div class="footer-links">
          <div class="footer-section navigation-section">
            <h3 class="footer-heading">
              <img src="@/assets/images/menu.png" alt="ナビゲーションアイコン" width="20">
              <span>ナビゲーション</span>
            </h3>
            <ul class="footer-nav">
              <li v-for="(item, index) in navItems" :key="item.path">
                <router-link
                  :to="item.path"
                  class="footer-nav-link"
                  :style="{ 'animation-delay': `${0.1 * index}s` }"
                >
                  <img :src="require(`@/assets/images/${item.icon}`)" :alt="item.name" width="20">
                  <span class="link-text">{{ item.name }}</span>
                  <span class="link-indicator"></span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="footer-section social-section">
            <h3 class="footer-heading">
              <img src="@/assets/images/stars.png" alt="ソーシャルアイコン" width="20">
              <span>ソーシャル</span>
            </h3>
            <ul class="footer-social">
              <li v-for="(social, index) in socialLinks" :key="social.name">
                <a
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="footer-social-link"
                  :style="{ 'animation-delay': `${0.1 * index}s` }"
                >
                  <img :src="social.icon" alt="" class="social-icon-img" />
                  <span class="link-text">{{ social.name }}</span>
                  <span class="link-indicator"></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="animated-footer-line">
          <div class="animated-line"></div>
          <div class="dot left-dot"></div>
          <div class="dot right-dot"></div>
        </div>
        <p class="copyright">
          <span class="copyright-year">© {{ new Date().getFullYear() }}</span>
          <span class="copyright-text">Taiki Note</span>
          <span>All Rights Reserved.</span>
        </p>
        <p class="icon-credit">
          アイコン提供：<a href="https://icons8.com" target="_blank" rel="noopener noreferrer">Icons8</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
  data() {
    return {
      navItems: [
        { name: "ホーム", path: "/home", icon: "home.png" },
        { name: "自己紹介", path: "/about", icon: "about.png" },
        { name: "プロジェクト", path: "/projects", icon: "projects.png" },
        { name: "スキル", path: "/skills", icon: "skills.png" },
        { name: "ブログ", path: "/blog", icon: "blog.png" },
        { name: "お問い合わせ", path: "/contact", icon: "contact.png" },
        { name: "スペースキャンバス", path: "/canvas", icon: "canvas.png" },
      ],
      socialLinks: [
        { name: "GitHub", url: "https://github.com/taiiii123", icon: require("@/assets/images/github-icon.png") },
        { name: "Qiita", url: "https://qiita.com/taiiii123", icon: require("@/assets/images/qiita-icon.png") },
      ],
    };
  },
  mounted() {
    this.animateConstellation();
  },
  methods: {
    animateConstellation() {
      // コンステレーション（星座）のアニメーション
      const dots = document.querySelectorAll(".constellation-dot");
      const lines = document.querySelectorAll(".constellation-line");

      // ランダムな位置に星を配置
      dots.forEach((dot) => {
        const x = 20 + Math.random() * 60; // 20%-80%の範囲
        const y = 20 + Math.random() * 60;
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;

        // サイズもランダムに
        const size = 2 + Math.random() * 3;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;

        // 輝きのアニメーション
        dot.style.animationDelay = `${Math.random() * 3}s`;
      });

      // 星同士を線で結ぶ
      lines.forEach((line, index) => {
        if (index < dots.length - 1) {
          const dot1 = dots[index];
          const dot2 = dots[index + 1];

          const dot1Rect = dot1.getBoundingClientRect();
          const dot2Rect = dot2.getBoundingClientRect();

          const parentRect = line.parentElement.getBoundingClientRect();

          const x1 = dot1Rect.left + dot1Rect.width / 2 - parentRect.left;
          const y1 = dot1Rect.top + dot1Rect.height / 2 - parentRect.top;
          const x2 = dot2Rect.left + dot2Rect.width / 2 - parentRect.left;
          const y2 = dot2Rect.top + dot2Rect.height / 2 - parentRect.top;

          const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

          line.style.width = `${length}px`;
          line.style.left = `${x1}px`;
          line.style.top = `${y1}px`;
          line.style.transform = `rotate(${angle}deg)`;

          // アニメーションの遅延
          line.style.animationDelay = `${0.5 + index * 0.2}s`;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.footer {
  position: relative;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba($color-accent-1, 0.2);
  padding: $spacing-2xl 0 $spacing-lg;
  margin-top: $spacing-2xl;
  overflow: hidden;
}

.footer-waves {
  position: absolute;
  top: -100px;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 0;
  overflow: hidden;

  svg {
    width: 100%;
    height: 100%;
  }

  .wave {
    fill: rgba($color-secondary, 0.3);

    &.wave-1 {
      opacity: 0.3;
      animation: waveAnimation 15s linear infinite;
    }

    &.wave-2 {
      opacity: 0.2;
      animation: waveAnimation 10s linear infinite reverse;
    }
  }
}

.footer-container {
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: $spacing-xl;
  position: relative;
}

.footer-logo {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.footer-logo-link {
  display: flex;
  align-items: center;
  font-size: $font-size-xl;
  font-weight: 700;
  margin-bottom: $spacing-sm;
  transition: all $transition-normal ease;
  position: relative;

  .logo-orbit {
    position: relative;
    width: 30px;
    height: 30px;
    border: 1px solid rgba($color-accent-2, 0.3);
    border-radius: 50%;
    margin-right: $spacing-sm;
    animation: orbitRotate 8s infinite linear;

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

  &:hover {
    transform: translateY(-2px);

    .logo-orbit {
      animation-duration: 4s;
    }

    .animated-gradient {
      animation: gradientFlow 4s ease infinite;

      .accent {
        animation: gradientFlow 4s ease infinite reverse;
      }
    }
  }
}

.footer-tagline {
  color: $color-text-secondary;
  margin-top: $spacing-sm;
  font-size: $font-size-sm;
}

.constellation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.constellation-dot {
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: $color-text-primary;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba($color-text-primary, 0.5);
  animation: twinkle 3s infinite alternate;
  filter: blur(1.5px);
}

.constellation-line {
  position: absolute;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba($color-text-primary, 0),
    rgba($color-text-primary, 0.3),
    rgba($color-text-primary, 0)
  );
  transform-origin: left center;
  animation: lineGlow 3s infinite alternate;
}

.footer-links {
  display: flex;
  flex: 2;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: $spacing-xl;
}

.footer-section {
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  &.navigation-section {
    .footer-nav-link {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      position: relative;
      overflow: hidden;

      .nav-icon {
        font-size: 1.2em;
        transition: all $transition-normal ease;
      }

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
        .nav-icon {
          transform: scale(1.2);
          text-shadow: 0 0 8px rgba($color-accent-2, 0.7);
        }

        .link-indicator {
          width: 100%;
          opacity: 0.7;
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
  }

  &.social-section {
    .footer-social-link {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      position: relative;
      overflow: hidden;

      .social-icon {
        font-size: 1.2em;
        transition: all $transition-normal ease;
      }

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
        .social-icon {
          transform: scale(1.2);
          text-shadow: 0 0 8px rgba($color-accent-2, 0.7);
        }

        .link-indicator {
          width: 100%;
          opacity: 0.7;
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
  }
}

.footer-nav-link:hover .nav-icon,
.footer-social-link:hover .social-icon {
  animation: navIconFloat 2s infinite ease-in-out;
}

.footer-heading {
  font-size: $font-size-md;
  margin-bottom: $spacing-sm;
  color: $color-text-primary;
  position: relative;
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  .heading-icon {
    font-size: 1.2em;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, $color-accent-2, transparent);
  }
}

.footer-nav,
.footer-social {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.footer-nav-link,
.footer-social-link {
  color: $color-text-secondary;
  transition: all $transition-normal ease;
  position: relative;
  padding-left: $spacing-md;
  opacity: 0.8;
  font-weight: 500;

  &:hover {
    color: $color-text-primary;
    opacity: 1;
    transform: translateX(5px);
  }
}

.contact-section {
  display: none;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: $spacing-lg;
  position: relative;
}

.social-icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba($color-secondary, 0.5);
  color: $color-text-primary;
  transition: all $transition-normal ease;
  border: 1px solid rgba($color-accent-2, 0.2);
  font-size: $font-size-lg;

  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(
      135deg,
      rgba($color-accent-1, 0.2),
      rgba($color-accent-2, 0.2)
    );
    box-shadow: 0 5px 15px rgba($color-accent-1, 0.2);
  }
}

.animated-footer-line {
  width: 80%;
  height: 1px;
  position: relative;
  margin-bottom: $spacing-md;
}

.animated-footer-line:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba($color-text-secondary, 0.2) 50%,
    transparent 100%
  );
}

.animated-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba($color-accent-2, 0) 0%,
    rgba($color-accent-2, 1) 50%,
    rgba($color-accent-2, 0) 100%
  );
  transform: translateX(-50%);
  animation: linePulse 3s infinite alternate ease-in-out;
  opacity: 1;
  z-index: 10;
  box-shadow: 0 0 8px rgba($color-accent-2, 0.1);
}

.dot {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: $color-accent-2;
  border-radius: 50%;
  top: -2px;
  box-shadow: 0 0 8px rgba($color-accent-2, 0.7);
  z-index: 6;
}

.left-dot {
  left: 20%;
}

.right-dot {
  right: 20%;
}

.copyright {
  color: $color-text-secondary;
  font-size: $font-size-sm;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-sm;

  .copyright-year {
    font-weight: 600;
  }

  .copyright-text {
    background-image: linear-gradient(
      -45deg,
      $color-text-secondary 0%,
      $color-accent-2 50%,
      $color-text-secondary 100%
    );
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientFlow 6s ease infinite;
  }
}

.social-icon-img {
  width: 20px;
  height: 20px;
  transition: all $transition-normal ease;
  object-fit: contain;
}

.icon-credit {
  color: $color-text-secondary;
  font-size: $font-size-xs;
  text-align: center;
  margin-top: $spacing-sm;
  opacity: 0.7;

  a {
    color: $color-accent-2;
    transition: all $transition-normal ease;

    &:hover {
      color: $color-accent-1;
      opacity: 1;
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

@keyframes navIconFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    box-shadow: 0 0 3px rgba($color-text-primary, 0.3);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 7px rgba($color-text-primary, 0.7);
  }
}

@keyframes lineGlow {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes waveAnimation {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes linePulse {
  0% {
    width: 0;
    opacity: 0.7;
  }
  100% {
    width: 60%;
    opacity: 1;
  }
}

@media (max-width: $breakpoint-md) {
  .footer-content {
    flex-direction: column;
  }

  .footer-section {
    width: 100%;
  }

  .footer-links {
    width: 100%;
    gap: $spacing-xl;
  }
}
</style>
