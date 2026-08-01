const delay = time => new Promise(done => setTimeout(done, time))

function myPromiseAll(list) {
  return new Promise((resolve, reject) => {
    let values = new Array(list.length)
    let left = list.length
    if (left === 0) return resolve(values)

    for (let i = 0; i < list.length; i++) {
      Promise.resolve(list[i]).then(value => {
        values[i] = value
        left--
        if (left === 0) resolve(values)
      }).catch(reject)
    }
  })
}

const getAllData = () => myPromiseAll([fetchUsers(), fetchPosts(), fetchComments()])

console.log("Start")
setTimeout(() => console.log("Timeout"), 0)
Promise.resolve().then(() => console.log("Promise"))
console.log("End")
