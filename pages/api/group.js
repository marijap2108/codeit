import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';
import { getLoggedUser } from "../../utils/getLoggedUser";
import { generateColor } from "../../utils/generateColor";

const createGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {title, description} = req.body

  const user = await getLoggedUser(req)

  if (!title || !description) {
    return res.status(400).json()
  }

  if (!user.isAdmin) {
    return res.status(403).json()
  }

  const color = generateColor(title)

  const newGroup = {
    title: title,
    description: description,
    color: color,
    createdBy: user._id,
    createdOn: Date.now()
  }

  const result = await db.collection("group").insertOne(newGroup)

  user.groups.push(result.insertedId)

  await db.collection("user").updateOne({'_id': new  ObjectId(user._id)},{$set: {groups: user.groups}})

  return res.status(200).json({...newGroup, id: result.insertedId})
}

const editGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id, title, description} = req.body

  if (!id) {
    return res.status(400).json()
  }

  if (!description && !title) {
    return res.status(400).json()
  }

  try {
    const result = await db.collection("group").updateOne({'_id': new  ObjectId(id)},{$set: {title: title, description: description}})
    return res.status(200).json(result)
  } catch (e) {
    throw (`Probelm with group edit, ${e}`)
  }
}

const getGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id} = req.query

  if (!id) {
    return res.status(400).json()
  }

  try {
    const result = await db.collection("group").findOne({ '_id': new  ObjectId(id) })
    return res.status(200).json(result)
  } catch (e) {
    throw (`Probelm with getting group, ${e}`)
  }
}

const deleteGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id} = req.query

  if (!id) {
    return res.status(400).json()
  }

  const user = await getLoggedUser(req)

  if (!user.isAdmin) {
    const group = await db.collection('group').findOne({'_id': new ObjectId(id)})

    if (group.createdBy !== user._id) {
      return res.status(403).json()
    }
  }

  const result = await db.collection("group").deleteOne({ '_id': new  ObjectId(id) })

  await db.collection("post").deleteMany({'groupId': id})

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
    case "DELETE":
      return await deleteGroup(req, res)
    default:
      return res.status(404).json()
  }
}