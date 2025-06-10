<template>
  <div class="space-canvas-container" ref="container">
    <!-- 背景の星空 -->
    <canvas ref="backgroundCanvas" class="background-canvas"></canvas>

    <!-- 浮遊する描画物 -->
    <canvas ref="floatingCanvas" class="floating-canvas"></canvas>

    <!-- 描画用キャンバス -->
    <canvas
      ref="drawingCanvas"
      class="drawing-canvas"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="stopDrawing"
    ></canvas>
  </div>
</template>

<script>
export default {
  name: "SpaceCanvas",
  data() {
    return {
      // キャンバス要素
      drawingCanvas: null,
      drawingCtx: null,
      floatingCanvas: null,
      floatingCtx: null,
      backgroundCanvas: null,
      backgroundCtx: null,

      // 描画設定
      currentTool: "pen",
      currentColor: "#FFFFFF",
      brushSize: 5,
      isDrawing: false,
      lastX: 0,
      lastY: 0,

      // 浮遊する描画物
      floatingDrawings: [],

      // 効果音設定
      soundEnabled: false,
      audioContext: null,
      sounds: {
        pen: null,
        eraser: null,
        star: null,
        planet: null,
        release: null,
        clear: null,
        colorChange: null,
        sizeChange: null,
        toolChange: null,
        save: null,
        restore: null,
        startup: null,
      },

      // アニメーションフレーム
      animationFrameId: null,

      // サウンドファイルのバッファ
      audioBuffers: {
        shutter: null,
        release: null,
      },
    };
  },
  mounted() {
    this.initCanvas();
    this.createStarryBackground();

    // floatingDrawingsを確実に初期化
    this.floatingDrawings = [];

    // アニメーション開始
    this.startAnimation();

    // ウィンドウリサイズ対応
    window.addEventListener("resize", this.handleResize);

  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.cancelAnimationFrame(this.animationFrameId);

    // AudioContextを閉じる
    if (this.audioContext) {
      this.audioContext.close();
    }
  },
  methods: {
    // キャンバスの初期化
    initCanvas() {
      // 描画用キャンバス
      this.drawingCanvas = this.$refs.drawingCanvas;
      this.drawingCtx = this.drawingCanvas.getContext("2d");

      // 浮遊用キャンバス
      this.floatingCanvas = this.$refs.floatingCanvas;
      this.floatingCtx = this.floatingCanvas.getContext("2d");

      // 背景用キャンバス
      this.backgroundCanvas = this.$refs.backgroundCanvas;
      this.backgroundCtx = this.backgroundCanvas.getContext("2d");

      // キャンバスサイズの設定
      this.setCanvasSize();
    },

    // キャンバスサイズの設定
    setCanvasSize() {
      const container = this.$refs.container;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // 描画用キャンバス
      this.drawingCanvas.width = width;
      this.drawingCanvas.height = height;

      // 浮遊用キャンバス
      this.floatingCanvas.width = width;
      this.floatingCanvas.height = height;

      // 背景用キャンバス
      this.backgroundCanvas.width = width;
      this.backgroundCanvas.height = height;
    },

    // ウィンドウリサイズ時の処理
    handleResize() {
      this.setCanvasSize();
      this.createStarryBackground();
    },

    // 星空の背景を作成
    createStarryBackground() {
      const ctx = this.backgroundCtx;
      const width = this.backgroundCanvas.width;
      const height = this.backgroundCanvas.height;

      // 背景をクリア
      ctx.clearRect(0, 0, width, height);

      // 背景を黒に
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // 小さな星を描画
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1 + 0.5;
        const opacity = Math.random() * 0.8 + 0.2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      // 中くらいの星
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.5 + 1;
        const opacity = Math.random() * 0.8 + 0.2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // 星の輝き効果
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
        glow.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // 大きな星
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 2 + 1.5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();

        // 光芒効果
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;

        // 水平線
        ctx.beginPath();
        ctx.moveTo(x - radius * 4, y);
        ctx.lineTo(x + radius * 4, y);
        ctx.stroke();

        // 垂直線
        ctx.beginPath();
        ctx.moveTo(x, y - radius * 4);
        ctx.lineTo(x, y + radius * 4);
        ctx.stroke();
      }
    },

    // 描画ツールの設定
    setTool(tool) {
      this.currentTool = tool;
    },

    // 描画色の設定
    setColor(color) {
      this.currentColor = color;
    },

    // ブラシサイズの設定
    setBrushSize(size) {
      this.brushSize = size;
    },

    // 描画開始
    startDrawing(e) {
      this.isDrawing = true;

      const rect = this.drawingCanvas.getBoundingClientRect();
      this.lastX = e.clientX - rect.left;
      this.lastY = e.clientY - rect.top;

      // 星または惑星ツールの場合は、クリック位置に形を描画
      if (this.currentTool === "star" || this.currentTool === "planet") {
        this.drawShape(this.lastX, this.lastY);

        // ツールに応じた効果音
        if (this.sounds[this.currentTool]) {
          this.sounds[this.currentTool](300);
        }
      } else if (this.currentTool === "pen" && this.sounds.pen) {
        this.sounds.pen(50);
      } else if (this.currentTool === "eraser" && this.sounds.eraser) {
        this.sounds.eraser(50);
      }
    },

    // タッチ開始処理
    handleTouchStart(e) {
      e.preventDefault();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        this.startDrawing(mouseEvent);
      }
    },

    // タッチ移動処理
    handleTouchMove(e) {
      e.preventDefault();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        this.draw(mouseEvent);
      }
    },

    // 描画処理
    draw(e) {
      if (!this.isDrawing) return;

      const rect = this.drawingCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = this.drawingCtx;

      // 前回の座標から十分に移動した場合のみ効果音を再生（頻度制限）
      const distance = Math.sqrt(
        Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2)
      );
      const shouldPlaySound = distance > this.brushSize * 2;

      if (this.currentTool === "pen") {
        // ペンツール
        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = this.currentColor;
        ctx.lineWidth = this.brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // 効果音（移動距離に応じて）
        if (shouldPlaySound && this.sounds.pen) {
          this.sounds.pen(30);
        }
      } else if (this.currentTool === "eraser") {
        // 消しゴムツール
        ctx.beginPath();
        ctx.arc(x, y, this.brushSize, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.globalCompositeOperation = "destination-out";
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";

        // 効果音（移動距離に応じて）
        if (shouldPlaySound && this.sounds.eraser) {
          this.sounds.eraser(30);
        }
      } else if (this.currentTool === "star" || this.currentTool === "planet") {
        // 星または惑星は、ドラッグ中には描画しない（クリック位置にのみ描画）
      }

      this.lastX = x;
      this.lastY = y;
    },

    // 図形を描画（星または惑星）
    drawShape(x, y) {
      const ctx = this.drawingCtx;

      if (this.currentTool === "star") {
        // 星を描画
        this.drawStar(ctx, x, y, 5, this.brushSize * 2, this.brushSize);
      } else if (this.currentTool === "planet") {
        // 惑星を描画
        ctx.beginPath();
        ctx.arc(x, y, this.brushSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.currentColor;
        ctx.fill();

        // 惑星のリング（半透明）
        ctx.beginPath();
        ctx.ellipse(
          x,
          y,
          this.brushSize * 3,
          this.brushSize,
          Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = this.currentColor;
        ctx.lineWidth = this.brushSize / 2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
    },

    // 星を描画する関数
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      let step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }

      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = this.currentColor;
      ctx.fill();
    },

    // 描画終了
    stopDrawing() {
      this.isDrawing = false;
    },

    // キャンバスをクリア
    clearCanvas() {
      this.drawingCtx.clearRect(
        0,
        0,
        this.drawingCanvas.width,
        this.drawingCanvas.height
      );

      // 効果音
      if (this.sounds.clear) {
        this.sounds.clear(300);
      }
    },

    // 描画データを取得
    getDrawingData() {
      // キャンバスが空かチェック
      const imageData = this.drawingCtx.getImageData(
        0,
        0,
        this.drawingCanvas.width,
        this.drawingCanvas.height
      );
      const pixelData = imageData.data;

      // すべてのピクセルが透明かチェック
      let hasData = false;
      for (let i = 3; i < pixelData.length; i += 4) {
        if (pixelData[i] > 0) {
          hasData = true;
          break;
        }
      }

      if (!hasData) {
        return null;
      }

      return this.drawingCanvas.toDataURL();
    },

    // 浮遊する描画物を追加
    addFloatingDrawing(dataUrl) {
      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        // ランダムなサイズ、位置、速度などを設定
        const canvasWidth = this.floatingCanvas.width;
        const canvasHeight = this.floatingCanvas.height;

        // 画像サイズに基づいて適切なスケールを計算
        const scale = Math.random() * 0.3 + 0.1; // 0.1〜0.4のランダムなスケール

        this.floatingDrawings.push({
          img,
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          scale,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          velocityX: (Math.random() - 0.5) * 0.5, // -0.25〜0.25のランダムな速度
          velocityY: (Math.random() - 0.5) * 0.5,
          opacity: 0.8,
          origWidth: img.width,
          origHeight: img.height,
        });

        // 効果音
        if (this.sounds.release) {
          this.sounds.release(800);
        }
      };
    },

    // 描画を復元
    restoreDrawing(dataUrl) {
      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        // キャンバスをクリアしてから描画
        this.clearCanvas();

        const ctx = this.drawingCtx;
        ctx.drawImage(img, 0, 0);

        // 復元音を再生
        if (this.sounds.restore) {
          this.sounds.restore();
        }
      };
    },

    // アニメーションループを開始
    startAnimation() {
      const animate = () => {
        // 浮遊キャンバスをクリア
        this.floatingCtx.clearRect(
          0,
          0,
          this.floatingCanvas.width,
          this.floatingCanvas.height
        );

        // 浮遊する描画物をすべて描画
        // この時点でfloatingDrawingsが初期化されていることを確認
        if (this.floatingDrawings && this.floatingDrawings.length > 0) {
          this.floatingDrawings.forEach((drawing) => {
            // 位置を更新
            drawing.x += drawing.velocityX;
            drawing.y += drawing.velocityY;
            drawing.rotation += drawing.rotationSpeed;

            // 画面端での跳ね返り
            const maxX =
              this.floatingCanvas.width +
              (drawing.origWidth * drawing.scale) / 2;
            const minX = (-drawing.origWidth * drawing.scale) / 2;
            const maxY =
              this.floatingCanvas.height +
              (drawing.origHeight * drawing.scale) / 2;
            const minY = (-drawing.origHeight * drawing.scale) / 2;

            if (drawing.x > maxX) drawing.x = minX;
            if (drawing.x < minX) drawing.x = maxX;
            if (drawing.y > maxY) drawing.y = minY;
            if (drawing.y < minY) drawing.y = maxY;

            // 描画
            this.floatingCtx.save();
            this.floatingCtx.globalAlpha = drawing.opacity;
            this.floatingCtx.translate(drawing.x, drawing.y);
            this.floatingCtx.rotate(drawing.rotation);
            this.floatingCtx.scale(drawing.scale, drawing.scale);
            this.floatingCtx.drawImage(
              drawing.img,
              -drawing.origWidth / 2,
              -drawing.origHeight / 2,
              drawing.origWidth,
              drawing.origHeight
            );
            this.floatingCtx.restore();
          });
        }

        // 次のフレームをリクエスト
        this.animationFrameId = window.requestAnimationFrame(animate);
      };

      animate();
    },

    // 浮遊する描画物をすべてクリア
    clearFloatingDrawings() {
      this.floatingDrawings = [];
      // 浮遊キャンバスをクリア
      this.floatingCtx.clearRect(
        0,
        0,
        this.floatingCanvas.width,
        this.floatingCanvas.height
      );

      // 効果音
      if (this.sounds.clear) {
        this.sounds.clear(500);
      }
    },

    // 描画を保存
    saveDrawing() {
      const dataUrl = this.getDrawingData();
      if (!dataUrl) {
        alert("キャンバスに描画がありません。何か描いてから保存してください。");
        return;
      }

      // ダウンロード用のリンクを作成
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `space-drawing-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 保存音を再生
      if (this.sounds.save) {
        this.sounds.save();
      }
    },

    // キャンバス全体（浮遊する描画物を含む）を保存
    saveEntireCanvas() {
      // 一時的なキャンバスを作成
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = this.floatingCanvas.width;
      tempCanvas.height = this.floatingCanvas.height;
      const tempCtx = tempCanvas.getContext("2d");

      // 背景、浮遊描画物、現在の描画をコピー
      tempCtx.drawImage(this.backgroundCanvas, 0, 0);
      tempCtx.drawImage(this.floatingCanvas, 0, 0);
      tempCtx.drawImage(this.drawingCanvas, 0, 0);

      // データURLに変換
      const dataUrl = tempCanvas.toDataURL("image/png");

      // ダウンロード用のリンクを作成
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `space-canvas-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // 効果音関連のメソッド
    // 効果音の読み込み
    loadSounds() {
      // AudioContextの作成
      if (this.soundEnabled && !this.audioContext) {
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();

        // 基本効果音
        this.sounds.pen = this.createEnhancedPenSound();
        this.sounds.eraser = this.createEnhancedEraserSound();

        this.sounds.star = this.createStarSound();
        this.sounds.planet = this.createPlanetSound();

        this.sounds.release = this.createEnhancedReleaseSound();
        this.sounds.clear = this.createSound(150, 200, "sawtooth", 0.25);

        // 新しいメソッドを登録
        this.sounds.clearSound = this.createClearSound();
        this.sounds.floatingClearSound = this.createFloatingClearSound();

        // 拡張効果音
        this.sounds.colorChange = this.createColorChangeSound();
        this.sounds.sizeChange = this.createSizeChangeSound();
        this.sounds.toolChange = this.createToolChangeSound();
        this.sounds.save = this.createShutterSound();
        this.sounds.restore = this.createRestoreSound();
        this.sounds.startup = this.createStartupSound();
      }
    },

    // 星ツールの新しい効果音 - キラキラとした明るい音
    createStarSound() {
      return (duration = 300) => {
        if (!this.soundEnabled || !this.audioContext) return;

        // メイン音
        const mainOsc = this.audioContext.createOscillator();
        const mainGain = this.audioContext.createGain();

        // 明るい高周波数の音
        mainOsc.type = "sine";
        mainOsc.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        mainOsc.frequency.exponentialRampToValueAtTime(
          800,
          this.audioContext.currentTime + duration / 1000
        );

        mainGain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
        mainGain.gain.linearRampToValueAtTime(
          0.3,
          this.audioContext.currentTime + 0.01
        );
        mainGain.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        mainOsc.connect(mainGain);
        mainGain.connect(this.audioContext.destination);

        mainOsc.start();
        mainOsc.stop(this.audioContext.currentTime + duration / 1000);

        // キラキラエフェクト（複数の高音域で短い音）
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            if (!this.soundEnabled || !this.audioContext) return;

            const sparkleOsc = this.audioContext.createOscillator();
            const sparkleGain = this.audioContext.createGain();

            // 各音ごとにランダムな高音
            const randomFreq = 1500 + Math.random() * 1000;
            sparkleOsc.type = "triangle";
            sparkleOsc.frequency.setValueAtTime(
              randomFreq,
              this.audioContext.currentTime
            );

            // 短い音
            sparkleGain.gain.setValueAtTime(
              0.01,
              this.audioContext.currentTime
            );
            sparkleGain.gain.linearRampToValueAtTime(
              0.15,
              this.audioContext.currentTime + 0.01
            );
            sparkleGain.gain.exponentialRampToValueAtTime(
              0.01,
              this.audioContext.currentTime + 0.1
            );

            sparkleOsc.connect(sparkleGain);
            sparkleGain.connect(this.audioContext.destination);

            sparkleOsc.start();
            sparkleOsc.stop(this.audioContext.currentTime + 0.1);
          }, 30 + i * 60); // 少し遅延をつけて順番に鳴らす
        }
      };
    },

    // 惑星ツールの新しい効果音 - より宇宙的で低音の効果音
    createPlanetSound() {
      return (duration = 400) => {
        if (!this.soundEnabled || !this.audioContext) return;

        // メイン低音
        const mainOsc = this.audioContext.createOscillator();
        const mainGain = this.audioContext.createGain();

        // より低い周波数を使用
        mainOsc.type = "sine";
        mainOsc.frequency.setValueAtTime(120, this.audioContext.currentTime);
        mainOsc.frequency.exponentialRampToValueAtTime(
          80,
          this.audioContext.currentTime + duration / 1000
        );

        // より長い持続時間
        mainGain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
        mainGain.gain.linearRampToValueAtTime(
          0.35,
          this.audioContext.currentTime + 0.05
        );
        mainGain.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        // フィルターを追加して音質を調整
        const filter = this.audioContext.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 300;
        filter.Q.value = 1;

        mainOsc.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(this.audioContext.destination);

        mainOsc.start();
        mainOsc.stop(this.audioContext.currentTime + duration / 1000);

        // リング/大気効果（中音域のうねり）
        setTimeout(() => {
          if (!this.soundEnabled || !this.audioContext) return;

          const ringOsc = this.audioContext.createOscillator();
          const ringGain = this.audioContext.createGain();

          ringOsc.type = "sine";
          ringOsc.frequency.setValueAtTime(240, this.audioContext.currentTime);
          ringOsc.frequency.exponentialRampToValueAtTime(
            160,
            this.audioContext.currentTime + duration / 2 / 1000
          );

          // うねり効果（LFO）
          const lfo = this.audioContext.createOscillator();
          const lfoGain = this.audioContext.createGain();
          lfo.type = "sine";
          lfo.frequency.value = 8; // ゆっくりとしたうねり
          lfoGain.gain.value = 50; // うねりの深さ

          lfo.connect(lfoGain);
          lfoGain.connect(ringOsc.frequency);

          ringGain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
          ringGain.gain.linearRampToValueAtTime(
            0.2,
            this.audioContext.currentTime + 0.05
          );
          ringGain.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration / 2 / 1000
          );

          ringOsc.connect(ringGain);
          ringGain.connect(this.audioContext.destination);

          lfo.start();
          ringOsc.start();

          ringOsc.stop(this.audioContext.currentTime + duration / 2 / 1000);
          lfo.stop(this.audioContext.currentTime + duration / 2 / 1000);
        }, 100);
      };
    },

    // 基本効果音の作成 - クリアと浮遊作品クリアの分岐用
    createSound(startFreq, endFreq, type, volume) {
      return (duration = 100) => {
        if (!this.soundEnabled || !this.audioContext) return;

        // 呼び出しコンテキストに基づいて効果音をカスタマイズ
        if (duration >= 300 && duration <= 310) {
          // クリア音（標準のclearCanvas呼び出しで使用される）
          this.createClearSound()(duration);
        } else if (duration >= 490 && duration <= 510) {
          // 浮遊作品クリア音
          this.createFloatingClearSound()(duration);
        } else {
          // デフォルトの効果音（他の場合に使用）
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();

          oscillator.type = type;
          oscillator.frequency.setValueAtTime(
            startFreq,
            this.audioContext.currentTime
          );
          oscillator.frequency.exponentialRampToValueAtTime(
            endFreq,
            this.audioContext.currentTime + duration / 1000
          );

          gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration / 1000
          );

          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);

          oscillator.start();
          oscillator.stop(this.audioContext.currentTime + duration / 1000);
        }
      };
    },

    createEnhancedReleaseSound() {
      return (duration = 800) => {
        if (!this.soundEnabled || !this.audioContext) return;

        const mainOsc = this.audioContext.createOscillator();
        const mainGain = this.audioContext.createGain();

        // より高音域からスタート
        mainOsc.type = "sine";
        mainOsc.frequency.setValueAtTime(600, this.audioContext.currentTime);
        mainOsc.frequency.exponentialRampToValueAtTime(
          1500,
          this.audioContext.currentTime + duration / 1000
        );

        mainGain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
        mainGain.gain.linearRampToValueAtTime(
          0.2, // より控えめな音量
          this.audioContext.currentTime + duration / 4000
        );
        mainGain.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        mainOsc.connect(mainGain);
        mainGain.connect(this.audioContext.destination);

        mainOsc.start();
        mainOsc.stop(this.audioContext.currentTime + duration / 1000);

        // キラキラエフェクト（高音域）
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            if (!this.soundEnabled || !this.audioContext) return;

            const sparkleOsc = this.audioContext.createOscillator();
            const sparkleGain = this.audioContext.createGain();

            sparkleOsc.type = "sine";
            // ランダムな高周波数
            const randomFreq = 1800 + Math.random() * 800;
            sparkleOsc.frequency.setValueAtTime(
              randomFreq,
              this.audioContext.currentTime
            );
            sparkleOsc.frequency.exponentialRampToValueAtTime(
              randomFreq * 1.2,
              this.audioContext.currentTime + duration / 2000
            );

            sparkleGain.gain.setValueAtTime(
              0.01,
              this.audioContext.currentTime
            );
            sparkleGain.gain.linearRampToValueAtTime(
              0.1, // 控えめな音量
              this.audioContext.currentTime + duration / 6000
            );
            sparkleGain.gain.exponentialRampToValueAtTime(
              0.01,
              this.audioContext.currentTime + duration / 2000
            );

            sparkleOsc.connect(sparkleGain);
            sparkleGain.connect(this.audioContext.destination);

            sparkleOsc.start();
            sparkleOsc.stop(this.audioContext.currentTime + duration / 2000);
          }, i * (duration / 5));
        }
      };
    },

    // クリア効果音
    createClearSound() {
      return (duration = 300) => {
        if (!this.soundEnabled || !this.audioContext) return;

        // スイープダウン音
        const sweepOsc = this.audioContext.createOscillator();
        const sweepGain = this.audioContext.createGain();

        sweepOsc.type = "sawtooth";
        sweepOsc.frequency.setValueAtTime(400, this.audioContext.currentTime);
        sweepOsc.frequency.exponentialRampToValueAtTime(
          100,
          this.audioContext.currentTime + duration / 1000
        );

        sweepGain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
        sweepGain.gain.linearRampToValueAtTime(
          0.2,
          this.audioContext.currentTime + 0.01
        );
        sweepGain.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        const filter = this.audioContext.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 800;

        sweepOsc.connect(filter);
        filter.connect(sweepGain);
        sweepGain.connect(this.audioContext.destination);

        sweepOsc.start();
        sweepOsc.stop(this.audioContext.currentTime + duration / 1000);
      };
    },

    // 浮遊作品クリア効果音
    createFloatingClearSound() {
      return (duration = 500) => {
        if (!this.soundEnabled || !this.audioContext) return;

        // 消失音エフェクト
        const fadeOsc = this.audioContext.createOscillator();
        const fadeGain = this.audioContext.createGain();

        fadeOsc.type = "triangle";
        fadeOsc.frequency.setValueAtTime(600, this.audioContext.currentTime);
        fadeOsc.frequency.exponentialRampToValueAtTime(
          150,
          this.audioContext.currentTime + duration / 1000
        );

        fadeGain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
        fadeGain.gain.linearRampToValueAtTime(
          0.3,
          this.audioContext.currentTime + 0.05
        );
        fadeGain.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        const filter = this.audioContext.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 500;
        filter.Q.value = 2;

        fadeOsc.connect(filter);
        filter.connect(fadeGain);
        fadeGain.connect(this.audioContext.destination);

        fadeOsc.start();
        fadeOsc.stop(this.audioContext.currentTime + duration / 1000);

        // 二次的なエフェクト（消失後の余韻）
        setTimeout(() => {
          if (!this.soundEnabled || !this.audioContext) return;

          const echoOsc = this.audioContext.createOscillator();
          const echoGain = this.audioContext.createGain();

          echoOsc.type = "sine";
          echoOsc.frequency.setValueAtTime(300, this.audioContext.currentTime);
          echoOsc.frequency.exponentialRampToValueAtTime(
            100,
            this.audioContext.currentTime + duration / 2 / 1000
          );

          echoGain.gain.setValueAtTime(0.01, this.audioContext.currentTime);
          echoGain.gain.linearRampToValueAtTime(
            0.15,
            this.audioContext.currentTime + 0.01
          );
          echoGain.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration / 2 / 1000
          );

          echoOsc.connect(echoGain);
          echoGain.connect(this.audioContext.destination);

          echoOsc.start();
          echoOsc.stop(this.audioContext.currentTime + duration / 2 / 1000);
        }, duration / 2);
      };
    },

    // ペンの効果音
    createEnhancedPenSound() {
      return (duration = 100) => {
        if (!this.soundEnabled || !this.audioContext) return;

        // 基本的な音のオシレーター
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // 高い周波数でより明るい音色に
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          400,
          this.audioContext.currentTime + duration / 1000
        );

        // 短い音にする
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        // フィルターを追加して音質を向上
        const filter = this.audioContext.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 200;

        // 接続
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
      };
    },

    // 消しゴムの効果音
    createEnhancedEraserSound() {
      return (duration = 100) => {
        if (!this.soundEnabled || !this.audioContext) return;

        // ノイズジェネレーター関数
        const createNoise = () => {
          const bufferSize = 4096;
          const noiseBuffer = this.audioContext.createBuffer(
            1,
            bufferSize,
            this.audioContext.sampleRate
          );
          const output = noiseBuffer.getChannelData(0);

          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }

          const noise = this.audioContext.createBufferSource();
          noise.buffer = noiseBuffer;
          noise.loop = true;
          return noise;
        };

        // ノイズ生成
        const noise = createNoise();
        const gainNode = this.audioContext.createGain();

        // バンドパスフィルターでこすり音っぽく
        const filter = this.audioContext.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 800;
        filter.Q.value = 3;

        // エンベロープ設定
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.2,
          this.audioContext.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        // 接続
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        noise.start();
        noise.stop(this.audioContext.currentTime + duration / 1000);
      };
    },

    // シャッター音(疑似音)
    createShutterSound() {
      return () => {
        if (!this.soundEnabled || !this.audioContext) return;

        // 合成シャッター音を直接実行
        this.createSyntheticShutterSound();

      };
    },

    // 合成シャッター音
    createSyntheticShutterSound() {
      if (!this.soundEnabled || !this.audioContext) return;

      // シャッター音を合成で作成 - 「カシャ」音
      const firstClickDuration = 0.04;  // 前半音の長さ
      const secondClickDuration = 0.06; // 後半音の長さ
      const delayBetweenClicks = 50;    // クリック間の遅延（ms）

      // 前半の「カ」音
      const click1 = this.audioContext.createOscillator();
      const gain1 = this.audioContext.createGain();

      click1.type = 'square';
      click1.frequency.setValueAtTime(1200, this.audioContext.currentTime);
      click1.frequency.exponentialRampToValueAtTime(
        800,
        this.audioContext.currentTime + firstClickDuration
      );

      gain1.gain.setValueAtTime(0.01, this.audioContext.currentTime);
      gain1.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.005);
      gain1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + firstClickDuration);

      // フィルターでシャープな音に
      const filter1 = this.audioContext.createBiquadFilter();
      filter1.type = 'highpass';
      filter1.frequency.value = 600;

      click1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(this.audioContext.destination);

      click1.start();
      click1.stop(this.audioContext.currentTime + firstClickDuration);

      // 後半の「シャ」音（少し遅れて）
      setTimeout(() => {
        if (!this.soundEnabled || !this.audioContext) return;

        const click2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();

        click2.type = 'square';
        click2.frequency.setValueAtTime(700, this.audioContext.currentTime);
        click2.frequency.exponentialRampToValueAtTime(
          400,
          this.audioContext.currentTime + secondClickDuration
        );

        gain2.gain.setValueAtTime(0.01, this.audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.01);
        gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + secondClickDuration);

        const filter2 = this.audioContext.createBiquadFilter();
        filter2.type = 'highpass';
        filter2.frequency.value = 500;

        click2.connect(filter2);
        filter2.connect(gain2);
        gain2.connect(this.audioContext.destination);

        click2.start();
        click2.stop(this.audioContext.currentTime + secondClickDuration);
      }, delayBetweenClicks);
    },

    // フォールバック用のシャッター音（無限ループ防止）
    createFallbackShutterSound() {
      return () => {
        console.log('シャッター音: 合成音を使用中');
      };
    },

    // 色変更音
    createColorChangeSound() {
      return () => {
        if (!this.soundEnabled || !this.audioContext) return;

        const duration = 200;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = "sine";

        // より目立つ周波数変化
        const startFreq = 600;
        const endFreq = 300;

        oscillator.frequency.setValueAtTime(
          startFreq,
          this.audioContext.currentTime
        );
        oscillator.frequency.linearRampToValueAtTime(
          endFreq,
          this.audioContext.currentTime + duration / 1000
        );

        // 音量を大きく
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
      };
    },

    // ブラシサイズ変更音
    createSizeChangeSound() {
      return (size) => {
        if (!this.soundEnabled || !this.audioContext) return;

        const duration = 150; // 少し長く
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = "triangle"; // より目立つ波形

        // サイズに比例した周波数（小さいほど高音、大きいほど低音）
        const freq = Math.max(100, 1000 - size * 15);
        oscillator.frequency.setValueAtTime(
          freq,
          this.audioContext.currentTime
        );

        // 音量を大きく
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
      };
    },

    // ツール変更音
    createToolChangeSound() {
      return (tool) => {
        if (!this.soundEnabled || !this.audioContext) return;

        const duration = 250; // より長く
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // ツールごとに異なる音色と周波数を設定
        let freq = 440;
        let type = "sine";

        switch (tool) {
          case "pen":
            freq = 440;
            type = "sine";
            break;
          case "eraser":
            freq = 220;
            type = "triangle";
            break;
          case "star":
            freq = 880;
            type = "triangle";
            break;
          case "planet":
            freq = 330;
            type = "sine";
            break;
          default:
            freq = 440;
            type = "sine";
        }

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(
          freq,
          this.audioContext.currentTime
        );

        // 音量を大きく
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
      };
    },

    // 復元音
    createRestoreSound() {
      return () => {
        if (!this.soundEnabled || !this.audioContext) return;

        const duration = 600; // より長く
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          700,
          this.audioContext.currentTime + duration / 3000
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          500,
          this.audioContext.currentTime + duration / 1000
        );

        gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.4,
          this.audioContext.currentTime + duration / 3000
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 1000
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
      };
    },

    // 起動音
    createStartupSound() {
      return () => {
        if (!this.soundEnabled || !this.audioContext) return;

        const duration = 1000; // より長く

        // 最初の音
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(300, this.audioContext.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(
          700,
          this.audioContext.currentTime + duration / 2000
        );

        // 音量を大きく
        gain1.gain.setValueAtTime(0.01, this.audioContext.currentTime);
        gain1.gain.linearRampToValueAtTime(
          0.4,
          this.audioContext.currentTime + duration / 4000
        );
        gain1.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + duration / 2000
        );

        osc1.connect(gain1);
        gain1.connect(this.audioContext.destination);

        osc1.start();
        osc1.stop(this.audioContext.currentTime + duration / 2000);

        // 2番目の音
        setTimeout(() => {
          if (!this.soundEnabled || !this.audioContext) return;

          const osc2 = this.audioContext.createOscillator();
          const gain2 = this.audioContext.createGain();

          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(500, this.audioContext.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(
            900,
            this.audioContext.currentTime + duration / 2000
          );

          // 音量を大きく
          gain2.gain.setValueAtTime(0.01, this.audioContext.currentTime);
          gain2.gain.linearRampToValueAtTime(
            0.35,
            this.audioContext.currentTime + duration / 4000
          );
          gain2.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration / 2000
          );

          osc2.connect(gain2);
          gain2.connect(this.audioContext.destination);

          osc2.start();
          osc2.stop(this.audioContext.currentTime + duration / 2000);
        }, duration / 2);
      };
    },

    // 効果音の有効/無効を切り替え
    toggleSound(enabled) {
      this.soundEnabled = enabled;

      // AudioContextが初期化されていなければ初期化
      if (enabled && !this.audioContext) {
        this.loadSounds();

        // サウンドを有効にした直後に起動音を再生
        setTimeout(() => {
          if (this.sounds && this.sounds.startup) {
            this.sounds.startup();
          }
        }, 100);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.space-canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.background-canvas,
.floating-canvas,
.drawing-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.background-canvas {
  z-index: 1;
}

.floating-canvas {
  z-index: 2;
}

.drawing-canvas {
  z-index: 3;
  cursor: crosshair;
}
</style>
