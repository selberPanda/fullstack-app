import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const port = 5000

const url = process.env.MONGO_URI
const client = new MongoClient(url);
const dbName = "game"

const corsOptions = {
  origin: [process.env.APP_ORIGIN]
}
app.use(cors(corsOptions))
app.use(express.json())

async function main() {
  await client.connect()
  console.log("Connected to Database")
  const db = client.db(dbName)
  const collection = db.collection("users")

  app.get("/", async (req, res) => {
    try {
      res.status(200)
    } catch(e) {
      res.status(500).json({ success:false })
      console.error(e)
    }
  })

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
  console.log(`Server listening on http://localhost:${port}/api/`)
})

main()
  .then(console.log)
  .catch(console.error)
