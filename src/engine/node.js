const initNodes = () => {
  return [{
    id: 0,
    pos: {
      x: 200,
      y: 200
    },
    speed: {
      x: -2,
      y: 2
    }
  }]
}

const nextStep = (nodes) =>
  nodes.map(node => ({
    id: node.id,
    pos: move(node.pos, node.speed),
    speed: friction(node.speed)
  }))




const move = (pos, speed) =>
  ({
    x: pos.x + speed.x,
    y: pos.y + speed.y
  })


const friction = speed => speed

export {
  initNodes,
  nextStep
}
