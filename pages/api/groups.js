import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';

const getGroups = async (req, res) => {
  const {db} = await connectToDatabase()
  const {codeItId} = req.cookies

  const {groups} = await db.collection("user").findOne({ _id : new ObjectId(codeItId) })

  const result = await db.collection("group").find({_id: { $in: groups.map(group => new ObjectId(group)) }}).toArray()

  return res.status(200).json(result)
}

const getGroupsByTite = async (req, res) => {
  const {db} = await connectToDatabase()
  const {title} = req.query

  if (!title) {
    return res.status(400).json()
  }

  const result = await db.collection("group").find({title: new RegExp(title, 'i')}).toArray()

  return res.status(200).json(result)
}

const getSuggestedGroups = async (req, res) => {
  const {db} = await connectToDatabase()
  const {type} = req.query

  if (!type) {
    return res.status(400).json()
  }

  const result = await db.collection("group").find().sort({datefield: -1}).limit(3).toArray()

  return res.status(200).json(result)
}

export default async (req, res) => {
  switch(req.method) {
    case "GET":
      if (req.query.title) {
        return await getGroupsByTite(req, res)
      }
      const {type} = req.query
      if (type === 'suggested') {
        return await getSuggestedGroups(req, res)
      }
      return await getGroups(req, res)
    default:
      return res.status(404).json()
  }
}