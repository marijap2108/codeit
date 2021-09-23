import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';

const createComment = async (req, res) => {
  const {db} = await connectToDatabase()
  const {parentId, parentType, body, createdBy} = req.body

  if (!parentId || !body || !createdBy) {
    return res.status(300).json()
  }

  const newComment = {
    parentId: parentId,
    parentType: parentType,
    body: body,
    createdBy: createdBy,
    createdOn: Date.now(),
    voteCount: []
  }

  const result = await db.collection("comment").insertOne(newComment)

  return res.status(200).json({...newComment, id: result.insertedId})
}

const editComment = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id, body} = req.body

  if (!id) {
    return res.status(300).json()
  }

  const result = await db.collection("comment").updateOne({'_id': new  ObjectId(id)},{$set: {body: body}})

  return res.status(200).json(result)
}

const getComment = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id} = req.query

  if (!id) {
    return res.status(300).json()
  }

  let result;

  if (id) {
    result = await db.collection("post").findOne({ '_id': new  ObjectId(id) })
    result = [result]
  }

  return res.status(200).json(result)
}

export default async (req, res) => {
  switch(req.method) {
    case "POST":
      return await createComment(req, res)
    case "PUT":
      return await editComment(req, res)
    case "GET":
      return await getComment(req, res)
    default:
      return res.status(404).json()
  }
}