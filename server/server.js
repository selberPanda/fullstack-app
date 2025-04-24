import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"

const app = express()
const port = 3000

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = "game"

const corsOptions = {
  origin: ["http://localhost:5173"]
}
app.use(cors(corsOptions))
app.use(express.json())

async function main() {
  await client.connect()
  console.log("Connected to Database")
  const db = client.db(dbName)
  const collection = db.collection("users")

  app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body
      const user = await collection.findOne({username, password})

      if (user) {
        res.status(200).json({ success: true, message: "Login erfolgreich" })
      } else {
        res.status(401).json({ success: false, message: "Ungültige Zugangsdaten." })
      }
    } catch(e) {
      console.error(e)
      res.status(500).json({ success: false, message: "Serverfehler" })
    }
  })

  app.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body
      const user = await collection.findOne({username})

      if (!user) {
        await collection.insertOne({username, password})
        res.status(200).json({ success: true, message: "Account registriert"})
      } else {
        res.status(401).json({ success: false, message: "Benutzername ist bereits Vergeben"})
      }
    } catch(e) {
      console.error(e)
      res.status(500).json({ success: false, message: "Serverfehler" })
    }
  })

  return "done"
}

app.listen(port, () => {
  console.log(`Server listening on:
    http://localhost:${port}/
    http://localhost:${port}/users\n`)
})

main()
  .then(console.log)
  .catch(console.error)
