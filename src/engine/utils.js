const getRandomFloat = (max) => Math.random() * Math.floor(max)
const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))

const distinct = (value, index, self) => self.indexOf(value) == index
const distinctEdge = (value, index, self) => self.findIndex(el => el[0]==value[0] && el[1]==value[1]) == index

export {
  getRandomFloat,
  getRandomInt,
  distinct,
  distinctEdge
}
