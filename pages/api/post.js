import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';

const createPost = async (req, res) => {
  const {db} = await connectToDatabase()
  const {title, body, createdBy} = req.body

  if (!title || !body || !createdBy) {
    return res.status(300).json()
  }

  const newPost = {
    title: title,
    body: body,
    createdBy: createdBy,
    createdOn: Date.now()
  }

  const result = await db.collection("post").insertOne(newPost)

  return res.status(200).json({...newPost, id: result.insertedId})
}

const editPost = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id, body} = req.body

  if (!id) {
    return res.status(300).json()
  }

  const result = await db.collection("post").updateOne({'_id': new  ObjectId(id)},{$set: {body: body}})

  return res.status(200).json(result)
}

const getPost = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id, type, limit} = req.query

  if (!id && !type) {
    return res.status(300).json()
  }

  let result;

  if (id) {
    result = await db.collection("post").findOne({ '_id': new  ObjectId(id) })
    return res.status(200).json(result)
  }
  if (type === "recent") {
    result = await db.collection("post").find().limit(parseInt(limit) || 5).sort({datefield: -1}).toArray()
  }

  return res.status(200).json(result)
}

export default async (req, res) => {
  switch(req.method) {
    case "POST":
      return await createPost(req, res)
    case "PUT":
      return await editPost(req, res)
    case "GET":
      return await getPost(req, res)
    default:
      return res.status(404).json()
  }
}