import {connectToDatabase} from "../../utils/mongodb"
import { ObjectId } from 'mongodb';

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
  const {db} = await connectToDatabase()
  const {username, password, id} = req.query

  if ((!username || !password) && !id) {
    return res.status(300).json()
  }

  let result;

  if (id) {
    result = await db.collection("user").findOne({ '_id': new  ObjectId(id) })
    return res.status(200).json(result)

  } else {
    result = await db.collection("user").findOne({ username: username, password: password })
  }

  return res.status(200).json({id: result._id, username: result.username, email: result.email })
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
}