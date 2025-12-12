<template>
  <div class="skills-page">
    <div class="skills-hero">
      <hero-stars />
      <div class="container">
        <h1 class="skills-title animated-gradient">スキル</h1>
        <p class="skills-subtitle typing-animation">{{ subtitleText }}</p>
      </div>
      <div class="scroll-indicator">
        <span>スクロール</span>
        <div class="scroll-arrow"></div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <h2 class="section-title section-technical-Skills-title text-center">
          技術スキル
        </h2>

        <!-- ローディング中は技術スキルローディングを表示 -->
        <Loading
          v-if="loadingSkills"
          text="技術スキルを読み込み中"
          :with-background="true"
          :min-height="'300px'"
        />

        <!-- 技術スキルのコンテンツを表示 -->
        <div v-else class="skills-grid">
          <div
            v-for="(category, index) in skillCategories"
            :key="index"
            class="skill-category"
          >
            <div class="skill-category-title">{{ category.title }}</div>
            <div class="skill-list">
              <div
                v-for="(skill, skillIndex) in category.skills"
                :key="skillIndex"
                class="skill-item"
              >
                <div class="skill-name">{{ skill }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 保有資格セクション -->
    <section class="section">
      <div class="container">
        <h2 class="section-title section-certifications-title text-center">
          保有資格
        </h2>

        <!-- ローディング中は資格ローディングを表示 -->
        <Loading
          v-if="loadingCertifications"
          text="資格情報を読み込み中"
          :with-background="true"
          :min-height="'300px'"
        />

        <!-- 資格のコンテンツを表示 -->
        <div v-else class="certifications-grid">
          <div
            v-for="(certification, index) in certifications"
            :key="index"
            class="certification-item"
            :style="{
              borderLeftColor: certification.color,
              borderTopColor: certification.color
            }"
          >
            <div
              class="certification-icon"
              :style="{
                background: `linear-gradient(135deg, ${certification.color}1A, ${certification.color}33)`,
                color: certification.color,
              }"
            >
              <!-- SVGアイコンの場合 -->
              <span
                v-if="certification.iconType === 'svg'"
                v-html="certification.icon"
              ></span>
              <!-- 画像の場合 -->
              <img
                v-else-if="certification.iconType === 'image'"
                :src="certification.icon"
                alt="資格アイコン"
              />
              <!-- 絵文字の場合 -->
              <span
                v-else-if="certification.iconType === 'emoji'"
                class="emoji-icon"
                >{{ certification.icon }}</span
              >
              <!-- デフォルトの場合（アイコンがない場合） -->
              <i v-else class="fas fa-certificate"></i>
            </div>
            <div class="certification-details">
              <div
                class="certification-name"
                :style="{ color: certification.color }"
              >
                {{ certification.name }}
                <span
                  class="certification-underline"
                  :style="{
                    background: `linear-gradient(90deg, ${certification.color}, transparent)`,
                  }"
                ></span>
              </div>
              <div class="certification-date" v-if="certification.date">
                <span
                  class="dot"
                  :style="{ backgroundColor: `${certification.color}80` }"
                ></span>
                取得日: {{ certification.date }}
              </div>
              <div class="certification-org" v-if="certification.organization">
                <span
                  class="dot"
                  :style="{ backgroundColor: `${certification.color}80` }"
                ></span>
                発行元: {{ certification.organization }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeroStars from "@/components/common/HeroStars.vue";
import Loading from "@/components/common/Loading.vue";

// 開発環境のみモックAPIを使用
if (process.env.VUE_APP_NODE_ENV === "development") {
  console.log("開発モードでモックAPIが有効になっています");
  import("@/api/skills/mock").catch((err) => {
    console.warn("モックのインポートに失敗しました:", err);
  });
}

export default {
  name: "SkillsView",
  components: {
    HeroStars,
    Loading,
  },
  data() {
    return {
      subtitleText: "",
      loadingSkills: true,
      loadingCertifications: true,
      skillCategories: [],
      certifications: [],
    };
  },
  mounted() {
    // タイピングアニメーション
    this.typing("subtitleText", "私のテクニカルスキルと経験");

    // データを取得
    this.fetchAllSkillsData();
  },
  methods: {
    // 全てのスキルデータを一括取得するメソッド
    fetchAllSkillsData() {
      this.loadingSkills = true;
      this.loadingCertifications = true;

      this.$axios
        .get("/api/skills/all")
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`APIエラー: ${response.status}`);
          }
          // スキルカテゴリーと資格情報をセット
          this.skillCategories = response.data.skillCategories;
          this.certifications = response.data.certifications;

          // ローディング状態を更新
          this.loadingSkills = false;
          this.loadingCertifications = false;
        })
        .catch((error) => {
          console.error("スキルデータの取得に失敗しました:", error);

          this.skillCategories = [];
          this.certifications = [];

          // エラー時もローディングを終了
          this.loadingSkills = false;
          this.loadingCertifications = false;

          // エラーページにリダイレクト
          sessionStorage.setItem('errorCode', '500');
          this.$router.push('/error');
        });
    },

    typing(textProperty, sentence) {
      let currentIndex = 0;

      // 既存のタイピングインターバルをクリア
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }

      // テキストをリセット
      this[textProperty] = "";

      // 新しいインターバルを設定
      this.typingInterval = setInterval(() => {
        if (currentIndex < sentence.length) {
          this[textProperty] += sentence[currentIndex];
          currentIndex++;
        } else {
          clearInterval(this.typingInterval);
        }
      }, 170);
    },
  },
  beforeUnmount() {
    // コンポーネント破棄時にインターバルをクリア
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.skills-page {
  overflow-x: hidden;
}

.skills-hero {
  height: 40vh;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  text-align: center;
  margin-bottom: $spacing-xl;
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

.skills-title {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-md;
}

.skills-subtitle {
  font-size: $font-size-xl;
  color: $color-text-secondary;
}

.typing-animation::after {
  content: "";
  border-right: 1px solid #333;
  margin-left: 2px;
  animation: flashing 1s linear infinite;
  opacity: 0;
}

.scroll-indicator {
  position: absolute;
  bottom: $spacing-xl;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $color-text-secondary;
  font-size: $font-size-sm;

  .scroll-arrow {
    width: 20px;
    height: 20px;
    border-left: 2px solid $color-text-secondary;
    border-bottom: 2px solid $color-text-secondary;
    transform: rotate(-45deg);
    margin-top: $spacing-sm;
    animation: scroll-arrow 2s infinite;
  }
}

.section {
  padding: $spacing-2xl 0;
}

.section-title {
  position: relative;
  margin-bottom: $spacing-xl;

  &.text-center {
    text-align: center;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    height: 3px;
    background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
  }

  &.section-technical-Skills-title::after {
    width: 160px;
  }

  &.section-certifications-title::after {
    width: 130px;
  }
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-xl;
}

.skill-category {
  margin-bottom: $spacing-xl;
  background: rgba($color-secondary, 0.2);
  border-radius: 12px;
  padding: $spacing-lg;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
}

.skill-category-title {
  font-size: $font-size-xl;
  font-weight: 700;
  margin-bottom: $spacing-md;
  color: $color-text-primary;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 150%;
    height: 2px;
    background: linear-gradient(
      90deg,
      $color-accent-1,
      $color-accent-2,
      transparent
    );
  }
}

.skill-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: $spacing-md;
}

.skill-item {
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
  }
}

.skill-name {
  font-size: $font-size-md;
  color: $color-text-secondary;
  position: relative;
  padding-left: $spacing-md;

  &:before {
    content: "•";
    position: absolute;
    left: 0;
    color: $color-accent-1;
    font-size: $font-size-lg;
  }
}

.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-xl;
  max-width: 900px;
  margin: 0 auto;
}

.certification-item {
  display: flex;
  align-items: center;
  background: rgba(24, 26, 27, 0.9);
  border-radius: 12px;
  padding: $spacing-lg;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border-left: 4px solid;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.02),
      rgba(0, 0, 0, 0.05)
    );
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px) translateX(3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
    }
  }
}

.certification-icon {
  font-size: $font-size-2xl;
  margin-right: $spacing-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  transition: transform 0.3s ease;
  overflow: hidden;

  svg {
    width: 36px;
    height: 36px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  img {
    max-width: 70%;
    max-height: 70%;
    object-fit: contain;
  }

  .emoji-icon {
    font-size: 2rem;
    line-height: 1;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .certification-item:hover & {
    transform: rotate(10deg);
  }
}

.certification-details {
  flex: 1;
}

.certification-name {
  font-size: $font-size-lg;
  font-weight: 700;
  margin-bottom: $spacing-xs;
  position: relative;
  display: inline-block;

  .certification-underline {
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 2px;
    transition: width 0.3s ease;
    display: block;
  }

  .certification-item:hover & {
    .certification-underline {
      width: 100%;
    }
  }
}

.certification-date,
.certification-org {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  margin-bottom: $spacing-xs;
  display: flex;
  align-items: center;

  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: $spacing-xs;
  }
}

.text-center {
  text-align: center;
}

.btn-lg {
  padding: $spacing-md $spacing-2xl;
  font-size: $font-size-lg;
}

@keyframes flashing {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: $breakpoint-md) {
  .typing-animation::after {
    border-right: 2px solid #333;
  }

  .skills-grid,
  .certifications-grid {
    grid-template-columns: 1fr;
  }

  .skill-list {
    grid-template-columns: 1fr;
  }

  .certification-item {
    flex-direction: column;
    text-align: center;
    border-left: none;
    border-top: 4px solid;
    padding-top: $spacing-lg;
  }

  .certification-icon {
    margin-right: 0;
    margin-bottom: $spacing-md;
  }

  .certification-name {
    .certification-underline {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .certification-date,
  .certification-org {
    justify-content: center;

    .dot {
      display: none;
    }
  }
}
</style>
