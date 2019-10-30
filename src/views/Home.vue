<template>
<div class="home">
  <div style="position: absolute; display: flex; flex-direction: column;">
    <button type="button" name="button" @click="reset()">Reset</button>
    <div>
      TotalSpeed: {{totalSpeed}}
    </div>
    <div>
      MoySpeed: {{moySpeed}}
    </div>
    <div>
      MaxSpeed: {{maxSpeed}}
    </div>
    <div>
      MinSpeed: {{minSpeed}}
    </div>
    <div v-if="highligtedNode!=-1" class="info">
      <div v-for="key in Object.keys(nodes[highligtedNode])" class="value">
        {{key}}: {{nodes[highligtedNode][key]}}
      </div>
      <div class="value">
        neihgbours: {{findNeighbours(edges, nodes[highligtedNode])}}
      </div>
    </div>
  </div>
  <img src="../assets/truc.png" ref="image" style="visibility: hidden; position: absolute;">
  <canvas ref="canvas" id="canvas" width="1400" height="900"></canvas>
</div>
</template>

<script>
import {
  FRICTION,
  K,
  DISTMIN,
  A,
  NEGLICT,
  NODESSIZE,
  EDGESSIZE,
} from '@/values'
import {
  getRandomInt,
  distinct,
  distinctEdge,
} from '@/engine/utils.js'
import {
  initNodes,
  nextStep,
  totalSpeed,
  moySpeed,
  minSpeed,
  maxSpeed,
} from '@/engine/node.js'
export default {
  mounted() {
    this.init()
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
      edges: [],
      totalSpeed: 0,
      moySpeed: 0,
      minSpeed: 0,
      maxSpeed: 0,
      highligtedNode: -1,
      highligtedNeighbours: [],
    }
  },
  methods: {
    reset() {
      this.nodes = initNodes(NODESSIZE, {
        height: this.windowHeight,
        width: this.windowWidth
      })
      this.edges = this.getRandomEdges(EDGESSIZE, NODESSIZE)
      this.draw()
    },
    init() {
      window.addEventListener('resize', this.resize);

      this.edges = this.getRandomEdges(EDGESSIZE, NODESSIZE)
      const canvas = this.$refs['canvas']
      this.canvas = canvas
      this.image = this.$refs['image']
      this.image.height = 100
      this.image.width = 100
      this.resize()
      canvas.onmousemove = (e) => {
        const hover = this.nodes.filter(node => (Math.abs(node.pos.x - e.clientX) + Math.abs(node.pos.y - e.clientY)) < 5)
        if (hover.length == 1) {
          const node = hover[0]
          this.highligtedNode = node.id
          this.highligtedNeighbours = this.findNeighbours(this.edges, node)
          window.requestAnimationFrame(this.draw)
        } else {
          const previous = this.highligtedNode
          this.highligtedNode = -1
          this.highligtedNeighbours = []
          if (previous != -1) {
            window.requestAnimationFrame(this.draw)
          }
        }
      }
      this.nodes = initNodes(NODESSIZE, {
        height: this.windowHeight,
        width: this.windowWidth
      })
      this.image.onload = () => this.draw()
    },
    draw() {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);

      this.nodes = nextStep(this.nodes, {
        height: this.windowHeight,
        width: this.windowWidth
      }, this.edges)

      const highligtedNode = this.highligtedNode
      const highligtedNeighbours = this.highligtedNeighbours

      this.drawEdges(ctx, this.nodes, this.edges, {
        highligtedNode,
        highligtedNeighbours
      })
      this.drawNodes(ctx, this.nodes, {
        highligtedNode,
        highligtedNeighbours
      })

      this.totalSpeed = totalSpeed(this.nodes)
      this.moySpeed = moySpeed(this.nodes)
      this.minSpeed = minSpeed(this.nodes)
      this.maxSpeed = maxSpeed(this.nodes)

      if (this.maxSpeed == 0) {
        console.log('STAAAAAAAAHP')
        return
      }
      window.requestAnimationFrame(this.draw)
    },
    drawNodes(ctx, nodes, {
      highligtedNode,
      highligtedNeighbours
    }) {
      nodes.forEach(node => {
        ctx.beginPath();
        if (node.id == highligtedNode) {
          ctx.strokeStyle = 'red'
          ctx.fillStyle = 'red'
        } else {
          if (highligtedNeighbours.includes(node.id)) {
            ctx.strokeStyle = 'blue'
            ctx.fillStyle = 'blue'
          } else {
            ctx.strokeStyle = 'black'
            ctx.fillStyle = 'black'
          }
        }
        ctx.arc(node.pos.x, node.pos.y, 5, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()
      })
    },
    drawEdges(ctx, nodes, edges, {
      highligtedNode,
      highligtedNeighbours
    }) {
      edges.forEach(edge => {
        const first = edge[0]
        const second = edge[1]
        if (first == highligtedNode || second == highligtedNode) {
          ctx.strokeStyle = 'green'

        } else {
          ctx.strokeStyle = 'black'
        }
        const fNode = nodes[first]
        const sNode = nodes[second]
        ctx.beginPath();
        ctx.moveTo(fNode.pos.x, fNode.pos.y);
        ctx.lineTo(sNode.pos.x, sNode.pos.y);
        ctx.stroke()
      })

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
    },
    getRandomEdges(numEdges, nodesSize) {
      return new Array(numEdges).fill(0)
        .map((_) => {
          const ret = [getRandomInt(nodesSize), getRandomInt(nodesSize)]
          ret.sort((a, b) => a - b)
          return ret
        })
        .filter(t => t[0] != t[1])
        .filter(distinctEdge)
    },
    findNeighbours(edges, node) {
      return edges.filter(e => e.includes(node.id)).reduce((acc, val) => acc.concat(val), []).filter(num => num != node.id).sort((a, b) => a - b)
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
