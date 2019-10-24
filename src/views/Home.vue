<template>
<div class="home">
  <img src="../assets/truc.png" ref="image" style="visibility: hidden; position: absolute;">
  <canvas ref="canvas" id="canvas" width="1400" height="900"></canvas>
</div>
</template>

<script>
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
    }
  },
  methods: {
    draw() {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
      ctx.strokeRect(this.posX, this.posY, 100, 100);
      ctx.drawImage(this.image, this.posX, this.posY, 100, 100)
      if (this.posY + 100 > this.windowHeight || this.posY < 0) this.speedY *= -1
      if (this.posX + 100 > this.windowWidth || this.posX < 0) this.speedX *= -1
      this.posX += this.speedX
      this.posY += this.speedY
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
