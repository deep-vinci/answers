const input = document.querySelector("#taskInput")
const list = document.querySelector("#taskList")
const search = document.querySelector("#searchTask")
const filterSelect = document.querySelector("#filterTask")
const count = document.querySelector("#taskCount")
let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function update() {
  localStorage.setItem("tasks", JSON.stringify(tasks))
  let current = tasks.filter(task => task.text.toLowerCase().includes(search.value.toLowerCase()))
  if (filterSelect.value === "done") current = current.filter(task => task.done)
  if (filterSelect.value === "pending") current = current.filter(task => !task.done)
  list.innerHTML = ""
  current.forEach(task => {
    let item = document.createElement("li")
    item.innerHTML = `<input type="checkbox" ${task.done ? "checked" : ""}> <span>${task.text}</span> <button>edit</button> <button>delete</button>`
    let [check, , edit, remove] = item.children
    check.onchange = () => {
      task.done = check.checked
      update()
    }
    edit.onclick = () => {
      let text = prompt("edit task", task.text)
      if (text && text.trim()) task.text = text.trim()
      update()
    }
    remove.onclick = () => {
      tasks = tasks.filter(value => value.id !== task.id)
      update()
    }
    list.append(item)
  })
  count.textContent = tasks.filter(task => !task.done).length
}

document.querySelector("#addTask").onclick = () => {
  if (!input.value.trim()) return
  tasks.unshift({ id: Date.now(), text: input.value.trim(), done: false })
  input.value = ""
  update()
}

search.oninput = update
filterSelect.onchange = update
document.querySelector("#clearCompleted").onclick = () => {
  tasks = tasks.filter(task => !task.done)
  update()
}

update()
