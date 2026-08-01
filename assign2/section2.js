const turnWord = sentence => {
  let words = sentence.split(" ")
  return words.map(word => [...word].reverse().join("")).join(" ")
}

const uniqueLetters = text => {
  let seen = ""
  for (let index = 0; index < text.length; index++) {
    if (seen.indexOf(text[index]) === -1) seen += text[index]
  }
  return seen
}

Array.prototype.myMap = function (fn) {
  let mapped = []
  this.forEach((value, index) => mapped.push(fn(value, index)))
  return mapped
}

const makeFlat = values => values.reduce((result, value) => {
  return result.concat(Array.isArray(value) ? makeFlat(value) : value)
}, [])

const copyValue = value => {
  if (value === null || typeof value !== "object") return value
  let result = Array.isArray(value) ? [] : {}
  Object.keys(value).forEach(key => result[key] = copyValue(value[key]))
  return result
}

console.log(turnWord("Hello JavaScript World"))
console.log(uniqueLetters("programming"))
console.log([1, 2, 3].myMap(value => value + 1))
console.log(makeFlat([1, [2, [3, [4, [5]]]]]))
