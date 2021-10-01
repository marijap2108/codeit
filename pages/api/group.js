import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';
import { handleGroup } from "./user";

const createGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {title, description} = req.body
  const cookies = req.cookies

  if (!title || !description) {
    return res.status(300).json()
  }

  let hash = 0
  let color = '#';

  for (var i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 255;
      color += ('00' + value.toString(16)).substr(-2);
  }

  const newGroup = {
    title: title,
    description: description,
    color: color,
    createdBy: cookies.codeItId,
    createdOn: Date.now()
  }

  const result = await db.collection("group").insertOne(newGroup)

  await handleGroup(result.insertedId, null, cookies, res)

  return res.status(200).json({...newGroup, id: result.insertedId})
}

const editGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id, description} = req.body

  if (!id) {
    return res.status(300).json()
  }

  const result = await db.collection("group").updateOne({'_id': new  ObjectId(id)},{$set: {description: description}})

  return res.status(200).json(result)
}

const getGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id, title} = req.query

  if (!id && !title) {
    return res.status(300).json()
  }

  let result;

  if (id) {
    result = await db.collection("group").findOne({ '_id': new  ObjectId(id) })
    result = [result]
  }
  if (title) {
    result = await db.collection("group").find({title: new RegExp(title, 'i')}).toArray()
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