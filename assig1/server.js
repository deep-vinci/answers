const http = require("http")
const path = require("path")
const { readFileSync, writeFileSync } = require("fs")

const file = path.join(__dirname, "students.json")

const reply = (res, code, value) => {
  res.writeHead(code, { "content-type": "application/json" })
  res.end(JSON.stringify(value))
}

const readStudents = () => JSON.parse(readFileSync(file, "utf8"))
const writeStudents = students => writeFileSync(file, JSON.stringify(students, null, 2))

function readRequest(req) {
  return new Promise((resolve, reject) => {
    let text = ""
    req.on("data", part => text += part)
    req.on("end", () => {
      try {
        resolve(text ? JSON.parse(text) : {})
      } catch {
        reject()
      }
    })
  })
}

http.createServer(async (req, res) => {
  let url = new URL(req.url, "http://localhost")
  let parts = url.pathname.split("/").filter(Boolean)
  let studentId = Number(parts[1])
  let students = readStudents()

  if (req.method === "GET" && url.pathname === "/students") return reply(res, 200, students)

  if (req.method === "GET" && url.pathname === "/report") {
    let report = students.reduce((data, student) => {
      data.total++
      data.byCourse[student.course] = (data.byCourse[student.course] || 0) + 1
      return data
    }, { total: 0, byCourse: {} })
    return reply(res, 200, report)
  }

  if (parts[0] !== "students" || (parts[1] && !studentId)) return reply(res, 404, { message: "not found" })

  if (req.method === "GET" && studentId) {
    let found = students.find(item => item.id === studentId)
    return found ? reply(res, 200, found) : reply(res, 404, { message: "student not found" })
  }

  if (req.method === "POST" && !studentId) {
    try {
      let body = await readRequest(req)
      let newStudent = { id: Date.now(), name: body.name, email: body.email, course: body.course }
      students.push(newStudent)
      writeStudents(students)
      return reply(res, 201, newStudent)
    } catch {
      return reply(res, 400, { message: "invalid json" })
    }
  }

  let index = students.findIndex(item => item.id === studentId)
  if (index === -1) return reply(res, 404, { message: "student not found" })

  if (req.method === "PUT") {
    try {
      let body = await readRequest(req)
      students[index] = { ...students[index], ...body, id: studentId }
      writeStudents(students)
      return reply(res, 200, students[index])
    } catch {
      return reply(res, 400, { message: "invalid json" })
    }
  }

  if (req.method === "DELETE") {
    let deleted = students.splice(index, 1)[0]
    writeStudents(students)
    return reply(res, 200, deleted)
  }

  reply(res, 404, { message: "not found" })
}).listen(3000, () => console.log("server running on port 3000"))
