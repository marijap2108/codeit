import { checkUser } from "../../utils/checkUser"
import {connectToDatabase} from "../../utils/mongodb"

const createUser = async (req, res) => {
  const {db} = await connectToDatabase()
  const {username, email, password} = req.body

  if (!username || !email || !password) {
    return res.status(300).json()
  }

  const newUser = {
    username: username,
    email: email,
    password: password,
  }

  const result = await db.collection("user").insertOne(newUser)

  return res.status(200).json({id: result.insertedId, username, email})
}

const editUser = async (req, res) => {
  return res.status(200).json({rasa: "haha"})
}

const getUser = async (req, res) => {
  return res.status(200).json({rasa: "haha"})
}

export default async (req, res) => {
  switch(req.method) {
    case "POST":
      return await createUser(req, res)
    case "PUT":
      return await editUser(req, res)
    case "GET":
      return await getUser(req, res)
    default:
      return res.status(404).json()
  }
  // const {db} = await connectToDatabase()
  // const data = await db.collection("user").insertOne({
    
  // })

  return res.status(200).json(data)
  if (checkUser(req)) {
    return res.status(400).json({})
  }
  //konekcija sa bazom i kreiranje korisnika
  res.status(200).json({ name: user })
}