<template>
  <div class="app" :class="{ 'route-selection-bg': isRootPath }">
    <!-- BGM Audio Player -->
    <audio ref="bgmAudio" loop preload="auto" @timeupdate="updateBgmPosition">
      <source type="audio/mp3" id="bgm">
    </audio>

    <!-- オフライン画面コンポーネントを追加 -->
    <OfflineScreen @network-status-change="handleNetworkStatusChange" />

    <loading-screen v-if="isLoading" @loading-complete="finishLoading" />

    <template v-if="!isLoading">
      <nav-bar v-if="!isRootPath && isOnline" @toggle-bgm="toggleBgm" :is-bgm-playing="isBgmPlaying" />
      <mouse-trail-effect :enabled="currentRoute !== 'Canvas' && isMouseTrailEnabled && isOnline">

        <div class="main-content">
          <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition || 'fade'">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>

      </mouse-trail-effect>
      <app-footer v-if="!isRootPath && isOnline" />

      <!-- スクロールトップボタン -->
      <scroll-top-button v-if="currentRoute !== 'Canvas' && !isRootPath && isOnline" />

      <!-- 円グラフスクロールインジケーター -->
      <scroll-indicator v-if="currentRoute !== 'Contact'
                            && currentRoute !== 'Canvas'
                            && currentRoute !== 'Blog'
                            && !isRootPath
                            && isOnline" />
    </template>
  </div>
</template>

<script>
import MouseTrailEffect from "@/components/effects/MouseTrailEffect.vue";
import NavBar from "@/components/layout/NavBar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import LoadingScreen from "@/components/common/LoadingScreen.vue";
import ScrollTopButton from "@/components/common/ScrollTopButton.vue";
import ScrollIndicator from "@/components/common/ScrollIndicator.vue";
import OfflineScreen from "@/components/common/OfflineScreen.vue";
import { gsap } from "gsap";

// ############################################################################
// ## マウストレイルエフェクトを設定する方法(隠し設定)                           ##
// ## ローカルストレージで表示を管理する                                        ##
// ##                                                                        ##
// ## localStorage.setItem('mouseTrailEnabled', 'true');   // 有効にする      ##
// ## location.reload();  // ウィンドウ更新                                   ##
// ##                                                                        ##
// ## localStorage.setItem('mouseTrailEnabled', 'false');  // 無効にする      ##
// ## location.reload();  // ウィンドウ更新                                   ##
// ##                                                                        ##
// ## 上記を開発者モードのコンソールで実行する                                   ##
// ###########################################################################

export default {
  name: "App",
  components: {
    MouseTrailEffect,
    NavBar,
    AppFooter,
    LoadingScreen,
    ScrollTopButton,
    ScrollIndicator,
    OfflineScreen
  },
  data() {
    return {
      isLoading: true,
      isFromRouteSelection: false,
      currentRoute: null,
      isBgmPlaying: false,
      isOnline: navigator.onLine, // ネットワーク状態を追加
      // マウストレイル表示フラグ（デフォルトは非表示）
      isMouseTrailEnabled: false,
      // BGM再生位置の更新頻度を制御するための変数
      lastPositionUpdate: 0,
      // 再生位置の更新間隔（ミリ秒）
      positionUpdateInterval: 100,
      // BGM音量設定
      targetVolume: Number(process.env.VUE_APP_VOLUME), // 目標音量（0〜1の範囲）
      currentVolume: 0,   // 現在の音量
      fadeInInterval: null, // フェードインのインターバルID
      fadeInStep: 0.001,   // 一度に増加する音量の値
      fadeInSpeed: 100,     // フェードインの更新間隔（ミリ秒）
    };
  },
  computed: {
    isRootPath() {
      return this.$route.path === '/';
    },
  },
  watch: {
    // ルートの変更を監視してローディング状態をリセット
    $route(to, from) {
      this.isFromRouteSelection = from.name === 'RouteSelectionPage';

      this.currentRoute = to.name;

      // Homeページに遷移する場合は必ずローディングを表示
      if (to.name === 'Home' && !this.isFromRouteSelection) {
        this.isLoading = true;
      }
      // 他のページへの遷移時はキャッシュに基づいて判定
      else if (from.name) { // 初回アクセスではない場合
        const hasCache = localStorage.getItem("has-visited");
        if (!hasCache) {
          this.isLoading = true;
        } else {
          this.isLoading = false;
        }
      }
    },
  },
  methods: {
    // ネットワーク状態の変更を受け取るメソッド
    handleNetworkStatusChange(isOnline) {
      this.isOnline = isOnline;

      // オフライン時はBGMを一時停止
      if (!isOnline && this.isBgmPlaying) {
        this.pauseBgm();
      }
    },
    finishLoading() {

      if (this.currentRoute === "Home") {

        setTimeout(() => {
          this.isLoading = false;
          // ローディング完了後にBGM状態を確認
          this.checkSavedBgmState();
          // マウストレイル状態を確認
          this.checkSavedMouseTrailState();
        }, 3500);

        gsap.to("#loading-screen", {
          y: -50,
          opacity: 0,
          duration: 1.2,
          delay: 2,
          ease: "power2.in",
        });
      } else {
        // 他のページの処理
        const hasCache = localStorage.getItem("has-visited");

        if (hasCache) {
          // キャッシュがある場合は短いローディングなし
          this.isLoading = false;
          // ローディング完了後にBGM状態を確認
          this.checkSavedBgmState();
          // マウストレイル状態を確認
          this.checkSavedMouseTrailState();
        } else {
          setTimeout(() => {
            this.isLoading = false;
            // ローディング完了後にBGM状態を確認
            this.checkSavedBgmState();
            // マウストレイル状態を確認
            this.checkSavedMouseTrailState();
            localStorage.setItem("has-visited", "true");
          }, 3500);

          gsap.to("#loading-screen", {
            y: -50,
            opacity: 0,
            duration: 1.2,
            delay: 2,
            ease: "power2.in",
          });
        }
      }
    },
    checkSavedMouseTrailState() {
      // ローカルストレージに保存されたマウストレイルの状態を確認
      const savedState = localStorage.getItem('mouseTrailEnabled');
      if (savedState !== null) {
        // 保存された設定がある場合はその値を使用
        this.isMouseTrailEnabled = savedState === 'true';
      } else {
        // 保存された設定がない場合は非表示のまま
        this.isMouseTrailEnabled = false;
      }
    },
    // BGM関連メソッド
    toggleBgm() {
      if (this.isBgmPlaying) {
        this.pauseBgm();
      } else {
        this.playBgm();
      }
    },
    playBgm() {
      // オフライン時はBGM再生を無効化
      if (!this.isOnline) {
        console.log('オフライン時はBGMを再生できません');
        return;
      }

      if (this.$refs.bgmAudio) {
        // 既存のフェードインを停止
        this.stopFadeIn();

        // 保存されている再生位置があれば、その位置から再生を開始
        const savedPosition = localStorage.getItem('bgmPosition');
        if (savedPosition) {
          this.$refs.bgmAudio.currentTime = parseFloat(savedPosition);
        }

        // 音量を0に設定してからフェードイン開始
        this.$refs.bgmAudio.volume = 0;
        this.currentVolume = 0;

        this.$refs.bgmAudio.play()
          .then(() => {
            this.isBgmPlaying = true;
            localStorage.setItem('bgmPlaying', 'true');

            // フェードイン開始
            this.startFadeIn();
          })
          .catch(error => {
            console.error('BGM再生に失敗しました:', error);
          });
      }
    },
    pauseBgm() {
      if (this.$refs.bgmAudio) {
        // フェードイン中なら停止
        this.stopFadeIn();

        // 一時停止する前に現在の再生位置を保存
        localStorage.setItem('bgmPosition', this.$refs.bgmAudio.currentTime);

        this.$refs.bgmAudio.pause();
        this.isBgmPlaying = false;
        localStorage.setItem('bgmPlaying', 'false');
      }
    },
    // フェードイン開始
    startFadeIn() {
      // すでに実行中のフェードインがあれば停止
      this.stopFadeIn();

      // フェードインのインターバルを設定
      this.fadeInInterval = setInterval(() => {
        // 現在の音量が目標音量より小さい場合は増加
        if (this.currentVolume < this.targetVolume) {
          this.currentVolume += this.fadeInStep;

          // 音量が目標を超えないように調整
          if (this.currentVolume > this.targetVolume) {
            this.currentVolume = this.targetVolume;
          }

          // 音声要素の音量を設定
          if (this.$refs.bgmAudio) {
            this.$refs.bgmAudio.volume = this.currentVolume;
          }
        } else {
          // 目標音量に達したらインターバルを停止
          this.stopFadeIn();
        }
      }, this.fadeInSpeed);
    },
    // フェードインの停止
    stopFadeIn() {
      if (this.fadeInInterval) {
        clearInterval(this.fadeInInterval);
        this.fadeInInterval = null;
      }
    },
    // BGMの再生位置を定期的に更新
    updateBgmPosition() {
      // パフォーマンスを向上させるため、一定間隔でのみ位置を更新
      const now = Date.now();
      if (now - this.lastPositionUpdate > this.positionUpdateInterval) {
        this.lastPositionUpdate = now;
        if (this.$refs.bgmAudio && this.isBgmPlaying) {
          localStorage.setItem('bgmPosition', this.$refs.bgmAudio.currentTime);
        }
      }
    },
    checkSavedBgmState() {
      // オンライン時のみBGM状態を確認
      if (this.isOnline) {
        const savedBgmState = localStorage.getItem('bgmPlaying');
        if (savedBgmState === 'true') {
          this.playBgm();
        }
      }
    },
    handleUserInteraction() {
      // 一度イベントが発火したら、そのイベントリスナーを削除する
      document.removeEventListener('click', this.handleUserInteraction);
      document.removeEventListener('keydown', this.handleUserInteraction);

      if (this.isOnline && localStorage.getItem('bgmPlaying') === 'true') {
        this.playBgm();
      }
    },
    // ページを離れる前に再生位置を保存
    saveCurrentPosition() {
      if (this.$refs.bgmAudio && this.isBgmPlaying) {
        localStorage.setItem('bgmPosition', this.$refs.bgmAudio.currentTime);
      }
    },
    // ネットワークイベントリスナーの設定
    setupNetworkListeners() {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    },
    handleOnline() {
      this.isOnline = true;
      console.log('ネットワークが復旧しました');

      // オンライン復旧時にBGM状態を確認
      this.checkSavedBgmState();
    },
    handleOffline() {
      this.isOnline = false;
      console.log('ネットワークが切断されました');

      // オフライン時はBGMを停止
      if (this.isBgmPlaying) {
        this.pauseBgm();
      }
    }
  },
  mounted() {
    // 初期ルートを設定
    this.currentRoute = this.$route.name;

    // Homeページの場合は必ずローディングを表示
    if (this.currentRoute === 'Home') {
      this.isLoading = true;
    }

    // ネットワークイベントリスナーを設定
    this.setupNetworkListeners();

    // すでにページが完全に読み込まれている場合は即時ローディング完了
    if (document.readyState === 'complete') {
      this.finishLoading();
    } else {
      // まだ読み込み中の場合はloadイベントを待つ
      window.addEventListener("load", () => {
        if (this.isLoading) {
          this.finishLoading();
        }
      });
    }

    // BGMを追加
    const bgm = document.getElementById('bgm');
    bgm.setAttribute("src", process.env.VUE_APP_BGM);

    // イベントリスナーを追加
    document.addEventListener('click', this.handleUserInteraction);
    document.addEventListener('keydown', this.handleUserInteraction);

    // ページ離脱時に再生位置を保存するためのイベントリスナーを追加
    window.addEventListener('beforeunload', this.saveCurrentPosition);

    // Vueルーター遷移前に再生位置を保存
    this.$router.beforeEach((to, from, next) => {
      this.saveCurrentPosition();
      next();
    });
  },
  beforeUnmount() {
    window.removeEventListener("load", this.finishLoading);
    document.removeEventListener('click', this.handleUserInteraction);
    document.removeEventListener('keydown', this.handleUserInteraction);
    window.removeEventListener('beforeunload', this.saveCurrentPosition);

    // ネットワークイベントリスナーを削除
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);

    // コンポーネント破棄時にフェードインを停止
    this.stopFadeIn();
  },
};
</script>

<style lang="scss">
@import "@/styles/main.scss";

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "NotoSansJP", serif;
}

.main-content {
  flex: 1;
  padding-top: 80px;
}

.route-selection-bg {
  background-color: #000000;
}
</style>
