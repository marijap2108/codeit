import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';

const createGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {title, description, createdBy} = req.body

  if (!title || !description || !createdBy) {
    return res.status(300).json()
  }

  const newPost = {
    title: title,
    description: description,
    createdBy: createdBy,
    createdOn: Date.now()
  }

  const result = await db.collection("post").insertOne(newPost)

  return res.status(200).json({...newPost, id: result.insertedId})
}

const editGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id, description} = req.body

  if (!id) {
    return res.status(300).json()
  }

  const result = await db.collection("post").updateOne({'_id': new  ObjectId(id)},{$set: {description: description}})

  return res.status(200).json(result)
}

const getGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id, name} = req.query

  if (!id && !name) {
    return res.status(300).json()
  }

  let result;

  if (id) {
    result = await db.collection("post").findOne({ '_id': new  ObjectId(id) })
    result = [result]
  }
  if (name) {
    result = await db.collection("group").find({name: new RegExp(name, 'i')}).toArray()
  }

  return res.status(200).json(result)
}

export default async (req, res) => {
  switch(req.method) {
    case "POST":
      return await createGroup(req, res)
    case "PUT":
      return await editGroup(req, res)
    case "GET":
      return await getGroup(req, res)
    default:
      return res.status(404).json()
  }
}