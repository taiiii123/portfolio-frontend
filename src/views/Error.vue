<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">{{ displayErrorCode }}</div>
        <h1 class="not-found-title">{{ displayErrorMessage }}</h1>
        <p v-if="customMessage" class="error-description">
          {{ customMessage }}
        </p>
        <div class="buttons">
          <router-link to="/home" class="btn btn-outline home-btn" @click="clearErrorStorage">ホームに戻る</router-link>
          <button @click="goBack" class="btn btn-outline">
            前のページに戻る
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorView",
  data() {
    return {
      code: 404, // デフォルト値
      customMessage: "",
    };
  },
  created() {
    try {
      const storedCode = sessionStorage.getItem("errorCode");
      const storedMessage = sessionStorage.getItem("errorMessage");

      // エラーコードのパース
      if (storedCode) {
        const parsedCode = parseInt(storedCode, 10);
        if (!isNaN(parsedCode)) {
          this.code = parsedCode;
        }
      }

      // エラーメッセージの設定
      if (
        storedMessage &&
        storedMessage !== "null" &&
        storedMessage !== "undefined"
      ) {
        this.customMessage = storedMessage;
      }
    } catch (e) {
      console.error("エラー情報の読み込みに失敗しました", e);
    }
  },
  computed: {
    displayErrorCode() {
      return this.code;
    },
    displayErrorMessage() {
      const messages = {
        400: "Bad Request",
        401: "認証エラー",
        403: "アクセス禁止",
        404: "ページが見つかりません",
        500: "サーバーエラー",
        503: "サービス利用不可",
      };
      return messages[this.displayErrorCode] || "エラーが発生しました";
    },
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/home");
      // セッションストレージからエラー情報をクリア
      this.clearErrorStorage();
    },
    clearErrorStorage() {
      sessionStorage.removeItem("errorCode");
      sessionStorage.removeItem("errorMessage");
    },
  },
  beforeUnmount() {
    // コンポーネント破棄時にエラー情報をクリア
    this.clearErrorStorage();
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.not-found-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: $spacing-2xl 0;
  position: relative;
  z-index: 2;
}

.error-code {
  font-size: 10rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: $spacing-md;
  background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px rgba($color-accent-1, 0.3);
  opacity: 0.8;
}

.not-found-title {
  font-size: $font-size-3xl;
  margin-bottom: $spacing-lg;
}

.error-description {
  color: $color-text-secondary;
  font-size: $font-size-lg;
  margin-bottom: $spacing-lg;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.buttons {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba($color-accent-1, 0.5);
  background-size: 400% 400%;
  background-image: linear-gradient(
    90deg,
    $color-accent-2 0%,
    $color-accent-1 25%,
    $color-accent-2 50%,
    $color-accent-1 75%,
    $color-accent-2 100%
  );
  animation: gradientFlow 20s ease-in-out infinite;
}

.home-btn:hover {
  color: $color-text-light
}

@media (max-width: $breakpoint-md) {
  .error-code {
    font-size: 8rem;
  }

  .not-found-title {
    font-size: $font-size-2xl;
  }

  .error-description {
    font-size: $font-size-md;
    padding: 0 $spacing-md;
  }

  .buttons {
    flex-direction: column;
  }
}

@media (max-width: $breakpoint-sm) {
  .error-code {
    font-size: 6rem;
  }

  .not-found-title {
    font-size: $font-size-xl;
  }
}
</style>
