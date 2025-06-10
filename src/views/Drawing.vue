<template>
  <div class="drawing-page">
    <div class="drawing-hero">
      <hero-stars />
      <div class="container">
        <h1 class="drawing-title animated-gradient">スペースキャンバス</h1>
        <div class="drawing-subtitle">
          <p
            class="drawing-subtitle-top"
            :class="{ 'typing-decoration': isTypingDec }"
          >
            {{ topText }}
          </p>
          <p
            class="drawing-subtitle-bottom"
            :class="{ 'typing-decoration': !isTypingDec }"
          >
            {{ bottomText }}
          </p>
        </div>
      </div>
      <div class="scroll-indicator">
        <span>スクロール</span>
        <div class="scroll-arrow"></div>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="drawing-container">
          <div class="canvas-section">
            <div id="canvas-anchor" class="scroll-anchor"></div>
            <div class="canvas-container">
              <space-canvas ref="spaceCanvas" />
            </div>
            <div class="canvas-actions">
              <button
                class="save-btn"
                @click="saveCanvas"
                title="画像ダウンロード"
              >
                <span class="action-icon">
                  <img src="@/assets/images/save.png" alt="SAVEアイコン" width="20">
                </span>
                <span>画像ダウンロード</span>
              </button>
            </div>
          </div>

            <div class="drawing-controls">
              <div id="controls-anchor" class="scroll-anchor"></div>
              <div class="control-panel">
              <div class="control-section tools-section">
                <div class="section-header">
                  <h3 class="panel-title tools-title">ツール</h3>
                  <button
                    class="sound-toggle-btn"
                    @click="toggleSound"
                    :class="{ active: soundEnabled }"
                    :title="soundEnabled ? '効果音オフ' : '効果音オン'"
                  >
                    <span class="sound-icon">
                      <img src="@/assets/images/sound.png" alt="音ありアイコン" width="20" v-if="soundEnabled">
                      <img src="@/assets/images/no-sound.png" alt="音なしアイコン" width="20" v-else>
                    </span>
                    <span class="sound-text">効果音</span>
                  </button>
                </div>
                <div class="tool-buttons">
                  <button
                    v-for="tool in tools"
                    :key="tool.id"
                    class="tool-btn"
                    :class="{ active: selectedTool === tool.id }"
                    @click="selectTool(tool.id)"
                    :title="tool.name"
                  >
                    <span class="tool-icon">
                      <img :src="require(`@/assets/images/${tool.icon}`)" :alt="tool.name" width="20">
                    </span>
                    <span class="tool-name">{{ tool.name }}</span>
                  </button>
                </div>
              </div>

              <div class="control-section">
                <h3 class="panel-title color-title">カラー</h3>
                <div class="color-picker-container">
                  <input
                    type="color"
                    v-model="selectedColor"
                    class="color-picker"
                    @change="selectColor(selectedColor)"
                  />
                  <div
                    class="color-preview"
                    :style="{ backgroundColor: selectedColor }"
                  ></div>
                  <span class="color-value">{{ selectedColor }}</span>
                </div>
                <div class="color-palette">
                  <button
                    v-for="color in colors"
                    :key="color.value"
                    class="color-btn"
                    :class="{ active: selectedColor === color.value }"
                    :style="{ backgroundColor: color.value }"
                    @click="selectColor(color.value)"
                    :title="color.name"
                  ></button>
                </div>
              </div>

              <div class="control-section">
                <h3 class="panel-title brush-size-title">ブラシサイズ</h3>
                <input
                  type="range"
                  min="1"
                  max="50"
                  v-model="brushSize"
                  class="brush-size-slider"
                  @change="handleBrushSizeChange"
                />
                <div
                  class="brush-size-preview"
                  :style="{ width: brushSize + 'px', height: brushSize + 'px' }"
                ></div>
              </div>

              <div class="control-section">
                <h3 class="panel-title action-title">アクション</h3>
                <div class="action-buttons">
                  <button
                    class="action-btn"
                    @click="clearCanvas"
                    title="クリア"
                  >
                    <span class="action-icon">
                      <img src="@/assets/images/wastebasket.png" alt="ゴミ箱アイコン" width="20">
                    </span>
                    <span>クリア</span>
                  </button>
                  <button
                    class="action-btn"
                    @click="releaseDrawing"
                    title="描画を星空に解き放つ"
                  >
                    <span class="action-icon">
                      <img src="@/assets/images/rocket.png" alt="ロケットアイコン" width="20">
                    </span>
                    <span>星空に解き放つ</span>
                  </button>
                  <button
                    class="action-btn danger"
                    @click="clearFloatingDrawings"
                    title="浮遊作品をクリア"
                  >
                    <span class="action-icon">
                      <img src="@/assets/images/clean.png" alt="クリアアイコン" width="20">
                    </span>
                    <span>浮遊作品クリア</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="released-drawings">
              <h3 class="panel-title released-title">宇宙に解き放たれた作品</h3>
              <div class="miniature-container">
                <div
                  v-for="(drawing, index) in releasedDrawings"
                  :key="index"
                  class="miniature-drawing"
                  @click="restoreDrawing(index)"
                >
                  <img :src="drawing" alt="Released drawing" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- キャンバスナビゲーションボタン -->
    <canvas-navigation-buttons />
  </div>
</template>

<script>
import SpaceCanvas from "@/components/drawing/SpaceCanvas.vue";
import HeroStars from "@/components/common/HeroStars.vue";
import CanvasNavigationButtons from "@/components/drawing/CanvasNavigationButtons.vue";
import dialogService from "@/utils/dialogService";

export default {
  name: "DrawingView",
  components: {
    SpaceCanvas,
    HeroStars,
    CanvasNavigationButtons,
  },
  data() {
    return {
      isTypingDec: true,
      topText: "",
      bottomText: "",
      selectedTool: "pen",
      selectedColor: "#FFFFFF",
      brushSize: 5,
      soundEnabled: false,
      tools: [
        { id: "pen", name: "ペン", icon: "pen.png" },
        { id: "eraser", name: "消しゴム", icon: "eraser.png" },
        { id: "star", name: "星", icon: "star.png" },
        { id: "planet", name: "惑星", icon: "planet.png" },
      ],
      colors: [
    { name: "白", value: "#FFFFFF" },
    { name: "黒", value: "#000000" },
    { name: "青", value: "#4A90E2" },
    { name: "紫", value: "#8B5CF6" },
    { name: "橙色", value: "#FF8A65" },
    { name: "緑", value: "#66BB6A" },
    { name: "黄", value: "#FFF176" },
    { name: "赤", value: "#EF5350" },
      ],
      releasedDrawings: [],
      showDialog: false,
      dialogData: {
        title: "",
        message: "",
        type: "info",
        confirmButtonText: "OK",
      },
    };
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
      }, 170);
    },
    selectTool(toolId) {
      this.selectedTool = toolId;
      this.$refs.spaceCanvas.setTool(toolId);

      // ツール変更時の効果音を確実に再生
      if (this.soundEnabled) {
        // タイムアウトを使用して他の処理が完了した後に効果音を再生
        setTimeout(() => {
          if (
            this.$refs.spaceCanvas.sounds &&
            this.$refs.spaceCanvas.sounds.toolChange
          ) {
            this.$refs.spaceCanvas.sounds.toolChange(toolId);
          }
        }, 50);
      }
    },
    selectColor(color) {
      this.selectedColor = color;
      this.$refs.spaceCanvas.setColor(color);

      // 色変更の効果音を確実に再生
      if (this.soundEnabled) {
        // タイムアウトを使用して他の処理が完了した後に効果音を再生
        setTimeout(() => {
          if (
            this.$refs.spaceCanvas.sounds &&
            this.$refs.spaceCanvas.sounds.colorChange
          ) {
            this.$refs.spaceCanvas.sounds.colorChange();
          }
        }, 50);
      }
    },
    handleBrushSizeChange() {
      // ブラシサイズ変更時の効果音を確実に再生
      if (this.soundEnabled) {
        // タイムアウトを使用して他の処理が完了した後に効果音を再生
        setTimeout(() => {
          if (
            this.$refs.spaceCanvas.sounds &&
            this.$refs.spaceCanvas.sounds.sizeChange
          ) {
            this.$refs.spaceCanvas.sounds.sizeChange(this.brushSize);
          }
        }, 50);
      }
    },
    clearCanvas() {
      dialogService
        .confirm({
          title: "キャンバスのクリア",
          message: "キャンバスをクリアしますか？",
          type: "warning",
          confirmButtonText: "クリア",
          cancelButtonText: "キャンセル",
          iconPath: require("@/assets/images/wastebasket.png"),
        })
        .then((result) => {
          if (result) {
            this.$refs.spaceCanvas.clearCanvas();
          }
        });
    },
    releaseDrawing() {
      const drawingData = this.$refs.spaceCanvas.getDrawingData();
      if (drawingData) {
        dialogService.alert({
          title: "星空に解き放ちました！",
          message: "あなたの作品が星空へ解放されました。",
          type: "success",
          iconPath: require("@/assets/images/rocket.png"),
        }).then(() => {
          this.releasedDrawings.push(drawingData);
          this.$refs.spaceCanvas.addFloatingDrawing(drawingData);
          this.$refs.spaceCanvas.clearCanvas();
        });
      } else {
        // エラーメッセージを表示
        dialogService.alert({
          title: "描画がありません",
          message:
            "キャンバスに描画がありません。何か描いてから解き放ってください。",
          type: "info",
          iconPath: require("@/assets/images/brush.png"),
        });
      }
    },
    saveCanvas() {
      if (
        this.soundEnabled &&
        this.$refs.spaceCanvas.sounds &&
        this.$refs.spaceCanvas.sounds.save
      ) {
        this.$refs.spaceCanvas.sounds.save();
      }

      // 画像保存処理
      this.$refs.spaceCanvas.saveEntireCanvas();

      // 保存完了メッセージ
      dialogService.alert({
        title: "画像ダウンロード",
        message: "画像を保存しました。",
        iconPath: require("@/assets/images/save.png"),
      });
    },
    clearFloatingDrawings() {
      dialogService
        .confirm({
          title: "浮遊作品のクリア",
          message: "宇宙に解き放った作品をすべてクリアしますか？",
          type: "warning",
          confirmButtonText: "クリア",
          cancelButtonText: "キャンセル",
          iconPath: require("@/assets/images/clean.png"),
        })
        .then((result) => {
          if (result) {
            this.$refs.spaceCanvas.clearFloatingDrawings();
            this.releasedDrawings = [];
          }
        });
    },
    restoreDrawing(index) {
      dialogService
        .confirm({
          title: "作品の復元",
          message: "この作品をキャンバスに復元しますか？",
          type: "info",
          confirmButtonText: "復元",
          cancelButtonText: "キャンセル",
          iconPath: require("@/assets/images/palette.png"),
        })
        .then((result) => {
          if (result) {
            const drawingData = this.releasedDrawings[index];
            this.$refs.spaceCanvas.restoreDrawing(drawingData);

            // 復元時の効果音を確実に再生
            if (this.soundEnabled) {
              // タイムアウトを使用して他の処理が完了した後に効果音を再生
              setTimeout(() => {
                if (
                  this.$refs.spaceCanvas.sounds &&
                  this.$refs.spaceCanvas.sounds.restore
                ) {
                  this.$refs.spaceCanvas.sounds.restore();
                }
              }, 300); // 復元処理が完了するのを待つためにタイムアウトを長めに設定
            }
          }
        });
    },
    // 効果音のオン/オフ切り替え
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      this.$refs.spaceCanvas.toggleSound(this.soundEnabled);

      // 効果音設定が変更されたことを通知
      const message = this.soundEnabled
        ? "効果音をオンにしました"
        : "効果音をオフにしました";
      const icon = this.soundEnabled ? "sound.png" : "no-sound.png";

      dialogService.alert({
        title: "効果音設定",
        message: message,
        type: "info",
        iconPath: require(`@/assets/images/${icon}`),
      });

      // オンにした時に起動音を確実に再生
      if (this.soundEnabled) {
        // この時点でAudioContextとサウンドは初期化されていることを確認する
        setTimeout(() => {
          if (
            this.$refs.spaceCanvas.sounds &&
            this.$refs.spaceCanvas.sounds.startup
          ) {
            this.$refs.spaceCanvas.sounds.startup();
          }
        }, 100); // 少し遅延を入れて確実に起動音を再生
      }
    },
  },
  watch: {
    brushSize(newSize) {
      this.$refs.spaceCanvas.setBrushSize(newSize);
    },
  },
  mounted() {
    // タイピングアニメーション
    this.typing("topText", "描いたものが星空に");

    // タイピングアニメーション
    setTimeout(() => {
      this.isTypingDec = false;
      this.typing("bottomText", "浮かぶ不思議なキャンバス");
    }, 2000);

    // ツール、色、ブラシサイズの初期設定
    this.$nextTick(() => {
      this.$refs.spaceCanvas.setTool(this.selectedTool);
      this.$refs.spaceCanvas.setColor(this.selectedColor);
      this.$refs.spaceCanvas.setBrushSize(this.brushSize);
    });
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

.drawing-page {
  overflow-x: hidden;
}

.drawing-hero {
  height: 40vh;
  min-height: 200px;
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

.drawing-title {
  font-size: $font-size-4xl;
  margin-bottom: $spacing-md;
  text-shadow: $title-shadow;
}

.drawing-subtitle {
  height: 65px;
  font-size: $font-size-xl;
  color: $color-text-secondary;
  display: inline-flex;
  font-family: "ZenMaruGothic", serif;
}

.typing-decoration::after {
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

.drawing-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: $spacing-xl;
}

.canvas-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.canvas-container {
  width: 100%;
  height: 700px;
  background: rgba($color-secondary, 0.7);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba($color-accent-2, 0.2);
}

.canvas-actions {
  display: flex;
  justify-content: center;
}

.save-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md $spacing-xl;
  background: transparent;
  color: $color-text-primary;
  border-radius: 5px;
  cursor: pointer;
  transition: all $transition-normal ease;
  font-size: $font-size-lg;
  font-weight: 600;
  box-shadow: 0 5px 15px rgba($color-accent-1, 0.3);
  border: none;
  filter: brightness(90%);

  background-size: 500% 500%;
  background-image: linear-gradient(
    90deg,
    $color-accent-2 0%,
    $color-accent-1 20%,
    $color-accent-2 40%,
    $color-accent-1 60%,
    $color-accent-2 80%,
    $color-accent-1 100%
  );
  animation: gradientFlow 30s ease-in-out infinite;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba($color-accent-1, 0.5);
  }

  .action-icon {
    margin-right: $spacing-sm;
    font-size: 1.2em;
  }
}

.drawing-controls {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.control-panel {
  background: rgba($color-secondary, 0.7);
  border-radius: 10px;
  padding: $spacing-lg;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba($color-accent-2, 0.2);
}

.control-section {
  margin-bottom: $spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }
}

.tools-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
  }
}

.panel-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-md;
  color: $color-text-primary;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      $color-accent-1,
      $color-accent-2,
      transparent
    );
  }
}

.tools-title::after {
  width: 80px;
}

.tools-title {
  margin-bottom: 0;
}

.color-title::after {
  width: 90px;
}

.brush-size-title::after {
  width: 150px;
}

.action-title::after {
  width: 120px;
}

.released-title::after {
  width: 250px;
}

.sound-toggle-btn {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  border-radius: 5px;
  background: rgba($color-primary, 0.5);
  color: $color-text-secondary;
  cursor: pointer;
  transition: all $transition-normal ease;
  border: none;

  &:hover,
  &.active {
    background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
    color: $color-text-primary;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba($color-accent-1, 0.3);
  }

  .sound-icon {
    margin-right: $spacing-sm;
    font-size: 1.2em;
  }

  .sound-text {
    font-size: 0.9em;
  }
}

.tool-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.tool-btn {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background: rgba($color-primary, 0.5);
  color: $color-text-secondary;
  border-radius: 5px;
  cursor: pointer;
  transition: all $transition-normal ease;

  &:hover,
  &.active {
    background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
    color: $color-text-primary;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba($color-accent-1, 0.3);

    background-size: 400% 400%;
    background-image: linear-gradient(
      90deg,
      $color-accent-1 0%,
      $color-accent-2 30%,
      $color-accent-1 70%,
      $color-accent-2 100%
    );
    animation: gradientFlow 20s ease-in-out infinite;
  }

  .tool-icon {
    margin-right: $spacing-sm;
    font-size: 1.2em;
  }
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-top: $spacing-sm;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.color-picker {
  width: 60px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
}

.color-preview {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.color-value {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.color-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: all $transition-normal ease;
  border: 2px solid transparent;

  &:hover,
  &.active {
    transform: scale(1.2);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  &.active {
    border-color: white;
  }

  &[style*="background-color: #FFFFFF"],
  &[style*="background-color: rgb(255, 255, 255)"],
  &[style*="background-color: white"] {
    border: 2px solid rgba(200, 200, 200, 0.8);
    box-shadow: 0 0 5px rgba(150, 150, 150, 0.5);
  }
}

.brush-size-slider {
  width: 100%;
  margin-bottom: $spacing-md;
  -webkit-appearance: none;
  height: 5px;
  border-radius: 5px;
  background: rgba($color-text-primary, 0.2);
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: $color-accent-2;
    cursor: pointer;
    transition: all $transition-normal ease;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 10px rgba($color-accent-2, 0.5);
    }
  }
}

.brush-size-preview {
  background-color: $color-text-primary;
  border-radius: 50%;
  margin: 0 auto;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background: rgba($color-primary, 0.5);
  color: $color-text-secondary;
  border-radius: 5px;
  cursor: pointer;
  transition: all $transition-normal ease;

  &:hover {
    background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
    color: $color-text-primary;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba($color-accent-1, 0.3);
  }

  &.active {
    background: linear-gradient(90deg, $color-accent-1, $color-accent-2);
    color: $color-text-primary;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba($color-accent-1, 0.3);
  }

  &.danger {
    background: #23060e;

    &:hover {
      background: linear-gradient(90deg, #9c0000, #7f0000);
      filter: brightness(80%);
    }
  }

  .action-icon {
    margin-right: $spacing-sm;
    font-size: 1.2em;
  }
}

.released-drawings {
  background: rgba($color-secondary, 0.7);
  border-radius: 10px;
  padding: $spacing-lg;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba($color-accent-2, 0.2);
  flex: 1;
  overflow: auto;
}

.miniature-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-sm;
  max-height: 220px;
  overflow-y: auto;
  padding-right: $spacing-sm;
}

.miniature-drawing {
  width: 100%;
  height: 80px;
  background: rgba($color-primary, 0.3);
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-normal ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba($color-accent-1, 0.3);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
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

@media (max-width: $breakpoint-lg) {
  .drawing-container {
    grid-template-columns: 1fr;
  }

  .canvas-container {
    height: 500px;
  }

  .miniature-container {
    grid-template-columns: repeat(4, 1fr);
    max-height: none;
  }
}

@media (max-width: $breakpoint-md) {
  .typing-decoration::after {
    border-right: 2px solid #333;
  }

  .miniature-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: $breakpoint-sm) {
  .miniature-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .drawing-subtitle {
    width: 340px;
    margin: 0 auto;
    text-align: center;
    display: block;

    .drawing-subtitle-top {
      text-align: left;
    }

    .drawing-subtitle-bottom {
      margin-left: 5em;
      text-align: left;
    }
  }
}
.scroll-anchor {
  position: relative;
  top: -112px; // ヘッダーの高さ分のオフセット
  left: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
</style>
