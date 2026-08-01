const users = [
  { name: "John", age: 20 },
  { name: "Alice", age: 18 },
  { name: "Bob", age: 25 }
]

const result = users.reduce((names, user) => {
  if (user.age > 18) names.push({ name: user.name })
  return names
}, [])

console.log(result)
