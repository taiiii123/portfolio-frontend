<template>
  <div
    class="contact-page"
    :class="{
      'success-animation': showSuccessAnimation,
      'error-animation': showErrorAnimation,
    }"
  >
    <div class="contact-hero">
      <hero-stars />
      <div class="container">
        <h1 class="contact-title animated-gradient">お問い合わせ</h1>
        <p class="contact-subtitle typing-animation">{{ subtitleText }}</p>
      </div>
      <div class="scroll-indicator">
        <span>スクロール</span>
        <div class="scroll-arrow"></div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <h2 class="section-title contact-info-title">お問い合わせ情報</h2>
            <p class="contact-text">
              ご覧いただきありがとうございます！<br>
              ご質問等がありましたら、お気軽にメッセージをお送りください。
            </p>

            <div class="contact-method">
              <div class="contact-icon">
                <img src="@/assets/images/mail.png" alt="メールアイコン" width="20">
              </div>
              <div class="contact-method-details">
                <h3 class="contact-method-title">メール</h3>
                <a href="mailto:taiiii88uqtg@gmail.com">taiiii88uqtg@gmail.com</a>
              </div>
            </div>

            <div class="contact-method">
              <div class="contact-icon">
                <img src="@/assets/images/globe.png" alt="メールアイコン" width="20">
              </div>
              <div class="contact-method-details">
                <h3 class="contact-method-title">ソーシャル</h3>
                <div class="contact-social-links">
                  <a
                    href="https://github.com/taiiii123"
                    class="contact-social-link"
                    target="_blank"
                    >GitHub</a
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="contact-form-container">
            <h2 class="section-title contact-form-title">
              お問い合わせフォーム
            </h2>

            <!-- APIバリデーションエラーの表示 -->
            <div v-if="apiErrors.length > 0" class="api-errors">
              <h4 class="api-errors-title">入力内容をご確認ください</h4>
              <ul class="api-errors-list">
                <li
                  v-for="error in apiErrors"
                  :key="error"
                  class="api-error-item"
                >
                  {{ error }}
                </li>
              </ul>
            </div>

            <form class="contact-form" @submit.prevent="submitForm">
              <div class="form-group">
                <label for="name" class="form-label"
                  >お名前 <span class="required-mark">必須</span></label
                >
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label"
                  >メールアドレス <span class="required-mark">必須</span></label
                >
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="subject" class="form-label"
                  >件名 <span class="required-mark">必須</span></label
                >
                <input
                  type="text"
                  id="subject"
                  v-model="formData.subject"
                  class="form-input"
                  :class="{ 'input-error': formErrors.subject }"
                  required
                  @input="validateSubject"
                  maxlength="80"
                />
                <div v-if="formErrors.subject" class="form-error-message">
                  {{ formErrors.subject }}
                </div>
                <div
                  class="character-count"
                  :class="{ 'count-warning': isSubjectNearLimit }"
                >
                  {{ formData.subject.length }}/80
                </div>
              </div>

              <div class="form-group">
                <label for="message" class="form-label"
                  >メッセージ <span class="required-mark">必須</span>
                </label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  class="form-textarea"
                  rows="6"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-submit"
                :disabled="isSubmitting || hasFormErrors"
              >
                {{ isSubmitting ? "送信中..." : "送信する" }}
              </button>

              <div v-if="submitSuccess" class="form-success">
                メッセージが送信されました。ありがとうございます！
              </div>

              <div v-if="submitError" class="form-error">
                エラーが発生しました。もう一度お試しください。
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- 成功アニメーション用の星エフェクト -->
    <div v-if="showSuccessAnimation" class="success-stars-container">
      <div
        v-for="i in 30"
        :key="i"
        class="success-star"
        :style="getRandomStarStyle()"
      ></div>
    </div>

    <!-- 通知モーダル -->
    <transition name="modal-fade">
      <div v-if="showSuccessModal" class="notification-modal success-modal">
        <div class="modal-content">
          <div class="modal-icon">✓</div>
          <h3>送信完了！</h3>
          <p>お問い合わせありがとうございます。</p>
          <button @click="closeSuccessModal" class="btn btn-primary close-btn">
            閉じる
          </button>
        </div>
      </div>
    </transition>

    <transition name="modal-fade">
      <div v-if="showErrorModal" class="notification-modal error-modal">
        <div class="modal-content">
          <div class="modal-icon">!</div>
          <h3>エラーが発生しました</h3>
          <p>
            申し訳ありません。<br />もう一度お試しいただくか、別の方法でお問い合わせください。
          </p>
          <button @click="closeErrorModal" class="btn btn-primary close-btn">
            閉じる
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import HeroStars from "@/components/common/HeroStars.vue";

// 開発環境のみモックAPIを使用
if (process.env.VUE_APP_NODE_ENV === "development") {
  console.log("開発モードでお問い合わせのモックAPIが有効になっています");
  import("@/api/contact/mock").catch((err) => {
    console.warn("お問い合わせモックのインポートに失敗しました:", err);
  });
}

export default {
  name: "ContactView",
  components: {
    HeroStars,
  },
  data() {
    return {
      subtitleText: "",
      formData: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
      formErrors: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
      apiErrors: [],
      isSubmitting: false,
      submitSuccess: false,
      submitError: false,
      showSuccessAnimation: false,
      showErrorAnimation: false,
      showSuccessModal: false,
      showErrorModal: false,
      typingInterval: null,
    };
  },
  computed: {
    hasFormErrors() {
      // フォームにエラーがあるかチェック
      return (
        Object.values(this.formErrors).some((error) => error !== "") ||
        this.apiErrors.length > 0
      );
    },
    isSubjectNearLimit() {
      // 文字数が上限に近づいているかをチェック
      return this.formData.subject.length >= 70;
    },
  },
  mounted() {
    // タイピングアニメーション
    this.typing("subtitleText", "ご質問等はこちらから");
  },
  beforeUnmount() {
    // コンポーネント破棄時にインターバルをクリア
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  },
  methods: {
    typing(textProperty, sentence) {
      let currentIndex = 0;

      // 既存のタイピングインターバルをクリア
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }

      this[textProperty] = "";

      // 新しいインターバルを設定
      this.typingInterval = setInterval(() => {
        if (currentIndex < sentence.length) {
          this[textProperty] += sentence[currentIndex];
          currentIndex++;
        } else {
          clearInterval(this.typingInterval);
        }
      }, 180);
    },

    validateSubject() {
      const maxLength = 80;
      if (this.formData.subject.length > maxLength) {
        this.formData.subject = this.formData.subject.substring(0, maxLength);
        this.formErrors.subject = `件名は${maxLength}文字以内で入力してください。`;
      } else if (this.formData.subject.length === maxLength) {
        this.formErrors.subject = `件名は${maxLength}文字の上限に達しています。`;
      } else {
        this.formErrors.subject = "";
      }
    },

    submitForm() {
      // 送信前に全てのフィールドを検証
      this.validateSubject();

      // エラーがある場合は送信しない
      if (this.hasFormErrors) {
        return;
      }

      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;
      this.showSuccessAnimation = false;
      this.showErrorAnimation = false;

      // API呼び出しのパラメータ準備
      const params = {
        name: this.formData.name,
        email: this.formData.email,
        subject: this.formData.subject,
        message: this.formData.message,
        timestamp: new Date().toISOString(),
      };

      this.$axios
        .post('/contact', null, {
          params: params,
          timeout: 30000
        })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
          }

          if (response.data) {
            // 送信成功時の処理
            this.submitSuccess = true;
            this.triggerSuccessAnimation();

            // フォームをリセット
            this.formData = {
              name: "",
              email: "",
              subject: "",
              message: "",
            };

            // エラーもリセット
            this.formErrors = {
              name: "",
              email: "",
              subject: "",
              message: "",
            };
            this.apiErrors = [];
          } else {
            console.error("レスポンスデータが空です");
            this.submitError = true;
            this.triggerErrorAnimation();
          }

          this.isSubmitting = false;
        })
        .catch((error) => {
          console.error("お問い合わせの送信に失敗しました:", error);

          // バリデーションエラーの場合
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data &&
            error.response.data.errors
          ) {
            this.apiErrors = error.response.data.errors;
            this.submitError = true;
          }

          // 失敗時の処理
          this.submitError = true;
          this.triggerErrorAnimation();
          this.isSubmitting = false;
        });
    },

    triggerSuccessAnimation() {
      // 成功アニメーションを開始
      this.showSuccessAnimation = true;

      // モーダルを表示
      setTimeout(() => {
        this.showSuccessModal = true;
      }, 800);

      // アニメーションを終了
      setTimeout(() => {
        this.showSuccessAnimation = false;
      }, 4000);
    },

    triggerErrorAnimation() {
      // エラーアニメーションを開始
      this.showErrorAnimation = true;

      // モーダルを表示
      setTimeout(() => {
        this.showErrorModal = true;
      }, 800);

      // アニメーションを終了
      setTimeout(() => {
        this.showErrorAnimation = false;
      }, 2000);
    },

    closeSuccessModal() {
      this.showSuccessModal = false;
    },

    closeErrorModal() {
      this.showErrorModal = false;
    },

    getRandomStarStyle() {
      // ランダムな星のスタイルを生成
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 2 + 2;
      const delay = Math.random() * 0.5;

      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDuration: `${animationDuration}s`,
        animationDelay: `${delay}s`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.contact-page {
  overflow-x: hidden;
  transition: all 0.3s ease;
}

.contact-hero {
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

.contact-title {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-md;
  text-shadow: $title-shadow;
}

.contact-subtitle {
  font-size: $font-size-xl;
  color: $color-text-secondary;
  font-family: "ZenMaruGothic", serif;
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

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-2xl;
}

.section-title {
  position: relative;
  margin-bottom: $spacing-lg;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      $color-accent-1,
      $color-accent-2,
      transparent
    );
  }
}

.contact-info-title::after {
  width: 280px;
}

.contact-form-title::after {
  width: 350px;
}

.contact-text {
  color: $color-text-secondary;
  margin-bottom: $spacing-xl;
  line-height: 1.6;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  margin-bottom: $spacing-lg;
}

.contact-icon {
  font-size: 24px;
  margin-right: $spacing-md;
  background: rgba($color-accent-1, 0.1);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-method-title {
  font-weight: 600;
  margin-bottom: $spacing-xs;
}

.contact-method-value {
  color: $color-text-secondary;
}

.contact-social-links {
  display: flex;
  gap: $spacing-md;
}

.contact-social-link {
  color: $color-accent-2;
  transition: all $transition-normal ease;

  &:hover {
    color: $color-accent-1;
    text-decoration: underline;
  }
}

.contact-form-container {
  background: #03050c;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: $spacing-xl;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba($color-accent-2, 0.1);
  transition: all 0.4s ease-in-out;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  position: relative;
}

.form-label {
  font-weight: 500;
  color: $color-text-secondary;
}

/* 必須マークのスタイル */
.required-mark {
  color: #ff4757;
  font-weight: 700;
  font-size: $font-size-sm;
  margin-left: $spacing-xs;
  padding: 2px 5px;
  background: rgba(255, 71, 87, 0.1);
  border-radius: 3px;
}

.form-input,
.form-textarea {
  padding: $spacing-sm $spacing-md;
  background: rgba($color-primary, 0.3);
  border: 1px solid rgba($color-accent-2, 0.2);
  border-radius: 5px;
  color: $color-text-primary;
  transition: all $transition-normal ease;

  &:focus {
    outline: none;
    border-color: $color-accent-2;
    box-shadow: 0 0 10px rgba($color-accent-2, 0.3);
  }
}

.input-error {
  border-color: #f44336;
  box-shadow: 0 0 5px rgba(244, 67, 54, 0.3);
}

.form-error-message {
  color: #f44336;
  margin-top: 2px;
}

.character-count {
  position: absolute;
  right: 10px;
  top: 35px;
  color: $color-text-secondary;
}

.count-warning {
  color: #ff9800;
  font-weight: bold;
}

.form-textarea {
  resize: vertical;
}

.btn {
  box-shadow: 0 5px 15px rgba($color-accent-1, 0.5);
  background-size: 500% 500%;
  background-image: linear-gradient(
    90deg,
    $color-accent-2 0%,
    $color-accent-1 25%,
    $color-accent-2 50%,
    $color-accent-1 75%,
    $color-accent-2 100%
  );
  animation: gradientFlow 12s ease-in-out infinite;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  filter: brightness(90%);
}

//  自動入力時の背景色を補正
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus,
.form-textarea:-webkit-autofill,
.form-textarea:-webkit-autofill:hover,
.form-textarea:-webkit-autofill:focus {
  -webkit-text-fill-color: $color-text-primary;
  -webkit-box-shadow: 0 0 0px 1000px rgba($color-primary, 0.3) inset;
  transition: background-color 5000s ease-in-out 0s;
}

.btn-submit {
  align-self: flex-start;
  padding: $spacing-sm $spacing-xl;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.form-success {
  color: #4caf50;
  font-weight: 500;
  margin-top: $spacing-sm;
}

.form-error {
  color: #f44336;
  font-weight: 500;
  margin-top: $spacing-sm;
}

/* APIエラー表示 */
.api-errors {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  padding: $spacing-md;
  margin-bottom: $spacing-lg;
  animation: error-fade-in 0.5s ease-out;
}

.api-errors-title {
  color: #f44336;
  font-size: $font-size-md;
  font-weight: 600;
  margin-bottom: $spacing-sm;
}

.api-errors-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.api-error-item {
  color: #f44336;
  font-size: $font-size-sm;
  margin-bottom: $spacing-xs;
  padding-left: $spacing-md;
  position: relative;

  &:before {
    content: "•";
    position: absolute;
    left: 0;
    color: #f44336;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

@keyframes error-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.galaxy-section {
  position: relative;
  padding: $spacing-2xl;
  background: rgba($color-accent-1, 0.05);
  overflow: hidden;
  border-radius: 20px;
  margin: 0 $spacing-lg;
}

.close-btn {
  margin-top: 10px;
}

.success-animation {
  animation: success-glow 4s ease-out;
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

@keyframes success-glow {
  0% {
    box-shadow: inset 0 0 0 transparent;
  }
  20% {
    box-shadow: inset 0 0 200px rgba(76, 175, 80, 0.3);
  }
  100% {
    box-shadow: inset 0 0 0 transparent;
  }
}

.error-animation {
  animation: error-shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes error-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

.success-stars-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1000;
}

.success-star {
  position: absolute;
  bottom: -20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgba(76, 175, 80, 0.6);
  animation: star-float linear forwards;
  z-index: 1000;
}

@keyframes star-float {
  0% {
    opacity: 0;
    transform: translateY(0) rotate(0deg) scale(0.5);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-100vh) rotate(360deg) scale(0);
  }
}

.notification-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: linear-gradient(
    135deg,
    rgba($color-primary, 0.95) 0%,
    rgba($color-secondary, 0.95) 100%
  );
  border-radius: 15px;
  padding: $spacing-xl;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba($color-accent-2, 0.3);
  backdrop-filter: blur(10px);
}

.modal-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto $spacing-lg;
}

.success-modal .modal-icon {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 2px solid #4caf50;
  animation: pulse-success 2s infinite;
}

.error-modal .modal-icon {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 2px solid #f44336;
  animation: pulse-error 2s infinite;
}

@keyframes pulse-success {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.6);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

@keyframes pulse-error {
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.6);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(244, 67, 54, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: $breakpoint-md) {

  .section-title {
    font-size: $font-size-2xl;
  }

  .typing-animation::after {
    border-right: 2px solid #333;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .contact-info {
    margin-bottom: $spacing-xl;
  }

  .contact-info-title::after,
  .contact-form-title::after {
    width: 60%;
  }

  .form-textarea {
    height: 210px;
  }
}

@media (max-width: $breakpoint-sm) {
  .contact-info-title::after,
  .contact-form-title::after {
    width: 85%;
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
</style>
