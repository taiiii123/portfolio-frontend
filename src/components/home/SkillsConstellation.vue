<template>
  <div class="skills-constellation" ref="constellationContainer">
    <canvas ref="constellationCanvas" class="constellation-canvas"></canvas>

    <div v-for="(skill, index) in skills" :key="index" class="skill-node" :class="{ active: activeSkill === index }"
      :style="{ left: `${skill.x}%`, top: `${skill.y}%` }" @mouseenter="activateSkill(index)"
      @mouseleave="deactivateSkill()">
      <a :href="skill.url || null" target="_blank" rel="noopener noreferrer">
        <div class="skill-icon">
          <!-- iconh:https://icons8.com/ -->
          <img :src="getIconUrl(skill.icon)" :alt="skill.name" class="tech-icon" />
          <div class="skill-pulse"></div>
        </div>
        <div class="skill-label">{{ skill.name }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "SkillsConstellation",
  data() {
    return {
      skills: [
        {
          name: "HTML",
          x: 10,
          y: 40,
          connections: [0, 1],
          icon: "html",
          url: "https://developer.mozilla.org/ja/docs/Web/HTML",
        },
        {
          name: "CSS",
          x: 30,
          y: 20,
          connections: [1],
          icon: "css",
          url: "https://developer.mozilla.org/ja/docs/Web/CSS",
        },
        {
          name: "JavaScript",
          x: 25,
          y: 60,
          connections: [2, 0],
          icon: "javascript",
          url: "https://developer.mozilla.org/ja/docs/Web/JavaScript",
        },
        {
          name: "Vue.js",
          x: 20,
          y: 85,
          connections: [3, 1, 2],
          icon: "vuejs",
          url: "https://vuejs.org/",
        },
        {
          name: "Java",
          x: 80,
          y: 80,
          connections: [4, 5, 6],
          icon: "java",
          url: "https://www.java.com/ja/"
        },
        {
          name: "Python",
          x: 70,
          y: 20,
          connections: [5],
          icon: "python",
          url: "https://www.python.org/",
        },
        {
          name: "Spring Boot",
          x: 82,
          y: 45,
          connections: [6],
          icon: "SpringBoot",
          url: "https://spring.io/projects/spring-boot",
        },
        {
          name: "Git",
          x: 50,
          y: 40,
          connections: [7, 0, 1, 2, 3, 4, 5, 6, 7],
          icon: "git",
          url: "https://git-scm.com/",
        },
        {
          name: "Visual Studio Code",
          x: 50,
          y: 70,
          connections: [8, 0, 1, 2, 3, 4, 5, 6, 7, 8],
          icon: "VisualStudioCode",
          url: "https://code.visualstudio.com/",
        },
      ],
      activeSkill: null,
      canvas: null,
      ctx: null,
      animationFrameId: null,
      particles: [],
    };
  },
  mounted() {
    this.initCanvas();
    this.createParticles();
    this.animate();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.cancelAnimationFrame(this.animationFrameId);
  },
  methods: {
    getIconUrl(iconName) {
      return require(`@/assets/icons/${iconName}.png`);
    },
    initCanvas() {
      this.canvas = this.$refs.constellationCanvas;
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
    },
    resizeCanvas() {
      const container = this.$refs.constellationContainer;
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;
    },
    handleResize() {
      this.resizeCanvas();
    },
    createParticles() {
      this.particles = [];

      // 小さな粒子を作成
      for (let i = 0; i < 80; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          color: `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`,
          speed: Math.random() * 0.2 + 0.1,
          direction: Math.random() * Math.PI * 2,
        });
      }
    },
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // スキルノード間の接続線を描画
      this.drawConnections();

      // 粒子を描画・更新
      this.drawParticles();

      this.animationFrameId = window.requestAnimationFrame(this.animate);
    },
    drawConnections() {
      this.ctx.strokeStyle = "rgba(106, 17, 203, 0.2)";
      this.ctx.lineWidth = 1;

      const container = this.$refs.constellationContainer;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      this.skills.forEach((skill, index) => {
        const x1 = (skill.x / 100) * containerWidth;
        const y1 = (skill.y / 100) * containerHeight;

        skill.connections.forEach((connectedIndex) => {
          const connectedSkill = this.skills[connectedIndex];
          const x2 = (connectedSkill.x / 100) * containerWidth;
          const y2 = (connectedSkill.y / 100) * containerHeight;

          // アクティブなスキルの接続線を強調
          if (
            this.activeSkill === index ||
            this.activeSkill === connectedIndex
          ) {
            this.ctx.strokeStyle = "rgba(37, 117, 252, 0.7)";
            this.ctx.lineWidth = 2;
          } else {
            this.ctx.strokeStyle = "rgba(106, 17, 203, 0.2)";
            this.ctx.lineWidth = 1;
          }

          this.ctx.beginPath();
          this.ctx.moveTo(x1, y1);
          this.ctx.lineTo(x2, y2);
          this.ctx.stroke();
        });
      });
    },
    drawParticles() {
      this.particles.forEach((particle) => {
        // 粒子の描画
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // 粒子の動き
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;

        // 画面外に出たら反対側から再登場
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
      });
    },
    activateSkill(index) {
      this.activeSkill = index;
    },
    deactivateSkill() {
      this.activeSkill = null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.skills-constellation {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.constellation-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.skill-node {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 2;
  transition: all $transition-normal ease;

  &.active {
    z-index: 3;

    .skill-icon {
      transform: scale(1.3);
      background-color: $color-accent-2;
      box-shadow: 0 0 20px rgba($color-accent-2, 0.7);

      img.tech-icon {
        filter: brightness(1.2) contrast(1.2);
      }
    }

    .skill-label {
      opacity: 1;
      transform: translateY(0);
    }

    .skill-pulse {
      animation: pulse 1.5s infinite;
    }
  }
}

.skill-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba($color-secondary, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all $transition-normal ease;
  box-shadow: 0 0 10px rgba($color-accent-1, 0.5);
  overflow: hidden;
  border: 2px solid rgba($color-accent-1, 0.3);

  &:hover {
    transform: scale(1.2);
  }

  img.tech-icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
    filter: brightness(1) contrast(1);
    transition: all $transition-normal ease;
  }
}

.skill-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba($color-accent-1, 0.5);
  z-index: -1;
}

.skill-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background-color: rgba($color-secondary, 0.8);
  color: $color-text-primary;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: $font-size-sm;
  white-space: nowrap;
  opacity: 0;
  transition: all $transition-normal ease;
  margin-top: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba($color-accent-1, 0.2);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }

  70% {
    transform: scale(2);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
