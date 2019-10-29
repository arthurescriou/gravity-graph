import {getRandomFloat, distinct} from './utils'
import {FRICTION, K, DISTMIN, A, NEGLICT} from '../values.js'

const ownEdges = (node, edges) => edges.filter(edge => edge[0] == node.id || edge[1] == node.id)

const attraction = (a, b) => {
  const {x, y} = vectorDiff(a, b)
  const sensX = Math.sign(x) * -1
  const sensY = Math.sign(y) * -1
  return {
    x: A * Math.pow(x, 2) * sensX,
    y: A * Math.pow(y, 2) * sensY
  }
}

const vectorAttraction = (neihgbours, node) => neihgbours.filter(n => n != node).map(n => attraction(n, node)).reduce((acc, val) => ({
  x: acc.x + val.x,
  y: acc.y + val.y
}))

const neglict = (val) => Math.abs(val) < NEGLICT
  ? 0
  : val

const regulateSpeed = (rawSpeed) => Math.max(-6, Math.min(6, rawSpeed))

const vectorDiff = (a, b) => ({
  x: b.pos.x - a.pos.x,
  y: b.pos.y - a.pos.y
})

const repulsion = (a, b) => {
  const {x, y} = vectorDiff(a, b)
  if ((Math.abs(x) + Math.abs(y)) > DISTMIN) {
    return {x: 0, y: 0}
  }
  return ({
    x: neglict(K / x),
    y: neglict(K / y)
  })
}

const vectorRepulsion = (nodes, node) => nodes.filter(n => n != node).map(n => repulsion(n, node)).reduce((acc, val) => ({
  x: acc.x + val.x,
  y: acc.y + val.y
}))

const edgeRepulsion = (threshold, position) => (threshold - position) / 300

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

const nextStep = (nodes, {
  height,
  width
}, edges) => nodes.map(node => {
  const nodeEdges = ownEdges(node, edges)
  let attractionX = 0
  let attractionY = 0
  if (nodeEdges.length > 0) {
    const neighbours = nodeEdges.reduce((acc, val) => acc.concat(val), []).filter(distinct).map(i => nodes[i]);
    const vAtttraction = vectorAttraction(neighbours, node)
    attractionX = vAtttraction.x
    attractionY = vAtttraction.y
  }
  const {x: repulX, y: repulY} = vectorRepulsion(nodes, node)
  const {x: frictionX, y: frictionY} = vectorFriction(node.speed)
  const {x: edgeRepulsionX, y: edgeRepulsionY} = vectorEdgeRepulsion(node, {height, width})
  return {
    id: node.id,
    pos: move(node.pos, node.speed),
    speed: {
      x: regulateSpeed(neglict(frictionX + repulX + edgeRepulsionX + attractionX)),
      y: regulateSpeed(neglict(frictionY + repulY + edgeRepulsionY + attractionY))
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

const friction = (val) => {
  if (val < FRICTION / 2) {
    return val * 0.95
  }
  return val > 0
    ? val - FRICTION
    : val + FRICTION
}

const randomPositionVect = ({height, width}) => ({
  x: getRandomFloat(width - 50) + 50,
  y: getRandomFloat(height - 50) + 50
})

const randomSpeedVect = (max) => ({
  x: getRandomFloat(2 * max) - max,
  y: getRandomFloat(2 * max) - max
})

const initNodes = (size, {height, width}) => {
  return new Array(size).fill(0).map((_, index) => ({
    id: index,
    pos: randomPositionVect({
      height: height - 50,
      width: width - 50
    }),
    speed: randomSpeedVect(6)
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
const moySpeed = (nodes) => nodes.map(n => neglict(Math.abs(n.speed.x) + Math.abs(n.speed.y))).reduce((acc, val) => acc + val, 0) / nodes.length
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
