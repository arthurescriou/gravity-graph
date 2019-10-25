<template>
<div class="home">
  <div style="position: absolute;">
    TotalSpeed: {{totalSpeed}}
  </div>
  <img src="../assets/truc.png" ref="image" style="visibility: hidden; position: absolute;">
  <canvas ref="canvas" id="canvas" width="1400" height="900"></canvas>
</div>
</template>

<script>
import {
  initNodes,
  nextStep,
  totalSpeed
} from '@/engine/node.js'
export default {
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.resize);

      const canvas = this.$refs['canvas']
      this.canvas = canvas
      this.image = this.$refs['image']
      this.image.height = 100
      this.image.width = 100
      this.resize()
      this.nodes = initNodes(10, {
        height: this.windowHeight,
        width: this.windowWidth
      })
      this.image.onload = () => this.draw()
    })
  },
  data() {
    return {
      image: null,
      windowWidth: 0,
      windowHeight: 0,
      posX: 10,
      posY: 10,
      speedX: 5,
      speedY: 5,
      nodes: [],
      totalSpeed: 0,
    }
  },
  methods: {
    draw() {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);

      this.nodes = nextStep(this.nodes, {
        height: this.windowHeight,
        width: this.windowWidth
      })

      this.nodes.forEach(node => {
        ctx.beginPath();

        ctx.arc(node.pos.x, node.pos.y, 5, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()
      })
      this.totalSpeed = totalSpeed(this.nodes)

      window.requestAnimationFrame(this.draw)
    },
    resize() {
      this.getWindowWidth()
      this.getWindowHeight()
      this.canvas.width = this.windowWidth
      this.canvas.height = this.windowHeight
    },
    getWindowWidth(event) {
      this.windowWidth = document.documentElement.clientWidth;
    },

    getWindowHeight(event) {
      this.windowHeight = document.documentElement.clientHeight;
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  },
  computed: {
    width() {
      return window.innerWidth * 0.99
    },
    height() {
      return window.innerHeight * 0.99
    },
  },
}
</script>
