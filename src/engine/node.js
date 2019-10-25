const FRICTION = 0.2
const K = 0.1
const neglict = (val) => Math.abs(val) < 0.001
  ? 0
  : val

const vectorDiff = (a, b) => ({
  x: b.pos.x - a.pos.x,
  y: b.pos.y - a.pos.y
})

const repulsion = (a, b) => {
  const {x, y} = vectorDiff(a, b)
  return ({
    x: neglict(K / x),
    y: neglict(K / y)
  })
}

const vectorRepulsion = (nodes, node) => nodes.filter(n => n != node).map(n => repulsion(n, node)).reduce((acc, val) => ({
  x: acc.x + val.x,
  y: acc.y + val.y
}))

const edgeRepulsion = (threshold, position) => true
  ?  (threshold - position) / 300
  : 0

const vectorEdgeRepulsion = (node, {height, width}) => {
  const {x: posX, y: posY} = node.pos
  const vectorEdgeRepulsion = {
    x: 0,
    y: 0
  }
  if (posY < 0)
    vectorEdgeRepulsion.y += edgeRepulsion(0, posY)
  if (posX < 0)
    vectorEdgeRepulsion.x += edgeRepulsion(0, posX)
  if (posY > height)
    vectorEdgeRepulsion.y += edgeRepulsion(height, posY)
  if (posX > width)
    vectorEdgeRepulsion.x += edgeRepulsion(width, posX)
  return vectorEdgeRepulsion
}
const nextStep = (nodes, {height, width}) => nodes.map(node => {
  const {x: repulX, y: repulY} = vectorRepulsion(nodes, node)
  const {x: frictionX, y: frictionY} = vectorFriction(node.speed)
  const {x: edgeRepulsionX, y: edgeRepulsionY} = vectorEdgeRepulsion(node, {height, width})
  return {
    id: node.id,
    pos: move(node.pos, node.speed),
    speed: {
      x: frictionX + repulX + edgeRepulsionX,
      y: frictionY + repulY + edgeRepulsionY
    }
  }
})

const move = (pos, speed) => ({
  x: pos.x + speed.x,
  y: pos.y + speed.y
})

const vectorFriction = ({x, y}) => ({
  x: neglict(friction(x)),
  y: neglict(friction(y))
})

const friction = (val) => val > 0
  ? val - FRICTION
  : val + FRICTION

const getRandomInt = (max) => Math.random() * Math.floor(max);

const randomPositionVect = ({height, width}) => ({
  x: getRandomInt(height - 50) + 50,
  y: getRandomInt(width - 50) + 50
})

const randomSpeedVect = (max) => ({
  x: getRandomInt(2 * max) - max,
  y: getRandomInt(2 * max) - max
})

const initNodes = (size, {height, width}) => {
  return new Array(size).fill(0).map((_, index) => ({
    id: index,
    pos: randomPositionVect({height, width}),
    speed: randomSpeedVect(10)
  }))
}

const initNodestest = (size, {height, width}) => [
  {
    id: 0,
    pos: {
      x: 1100,
      y: 500
    },
    speed: {
      x: 2,
      y: 1
    }
  }
]

const totalSpeed = (nodes) => nodes.map(n => neglict(Math.abs(n.speed.x) + Math.abs(n.speed.y))).reduce((acc, val) => acc + val, 0)

export {
  initNodes,
  nextStep,
  totalSpeed
}
