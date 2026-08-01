const debounce = (fn, time) => {
  let id
  return (...args) => {
    clearTimeout(id)
    id = setTimeout(() => fn(...args), time)
  }
}

const throttle = (fn, time) => {
  let lastRun = 0
  return (...args) => {
    if (Date.now() - lastRun < time) return
    lastRun = Date.now()
    fn(...args)
  }
}

class EventEmitter {
  constructor() {
    this.listeners = new Map()
  }

  on(event, callback) {
    let callbacks = this.listeners.get(event) || []
    callbacks.push(callback)
    this.listeners.set(event, callbacks)
  }

  emit(event, ...values) {
    for (let callback of this.listeners.get(event) || []) callback(...values)
  }

  off(event, callback) {
    let callbacks = this.listeners.get(event) || []
    this.listeners.set(event, callbacks.filter(value => value !== callback))
  }

  once(event, callback) {
    const oneTime = (...values) => {
      this.off(event, oneTime)
      callback(...values)
    }
    this.on(event, oneTime)
  }
}

const memoize = fn => {
  let saved = new Map()
  return (...args) => {
    let key = args.join("|")
    if (!saved.has(key)) saved.set(key, fn(...args))
    return saved.get(key)
  }
}

const groupBy = (items, field) => {
  let groups = {}
  for (let item of items) {
    let group = item[field]
    if (!groups[group]) groups[group] = []
    groups[group].push(item)
  }
  return groups
}
