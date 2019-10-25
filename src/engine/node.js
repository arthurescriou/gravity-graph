const FRICTION = 0.1
const K = 0.01
const neglict = (val) => Math.abs(val) < 0.01
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
  const minY = 150
  const minX = 150
  const maxY = height - 150
  const maxX = width - 150
  if (posY < minY)
    vectorEdgeRepulsion.y += edgeRepulsion(minY, posY)
  if (posX < minX)
    vectorEdgeRepulsion.x += edgeRepulsion(minX, posX)
  if (posY > maxY)
    vectorEdgeRepulsion.y += edgeRepulsion(maxY, posY)
  if (posX > maxX)
    vectorEdgeRepulsion.x += edgeRepulsion(maxX, posX)
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
      x: Math.min(15, frictionX + repulX + edgeRepulsionX),
      y: Math.min(15, frictionY + repulY + edgeRepulsionY)
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
  x: getRandomInt(width - 50) + 50,
  y: getRandomInt(height - 50) + 50
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
const moySpeed = (nodes) => nodes.map(n => neglict(Math.abs(n.speed.x) + Math.abs(n.speed.y))).reduce((acc, val) => acc + val, 0)/nodes.length
const maxSpeed = (nodes) => Math.max(...nodes.map(n => neglict(Math.abs(n.speed.x) + Math.abs(n.speed.y))))
const minSpeed = (nodes) => Math.min(...nodes.map(n => neglict(Math.abs(n.speed.x) + Math.abs(n.speed.y))))

export {
  initNodes,
  nextStep,
  totalSpeed,
  moySpeed,
  maxSpeed,
  minSpeed
}
