import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';

const createPost = async (req, res) => {
  const {db} = await connectToDatabase()
  const {title, body, group} = req.body
  const cookies = req.cookies

  if (!title || !body || !group) {
    return res.status(300).json()
  }

  const newPost = {
    title: title,
    body: body,
    groupId: group,
    createdBy: cookies.codeItId,
    createdOn: Date.now(),
    votesUp: [cookies.codeItId],
    votesDown: []
  }

  await db.collection("post").insertOne(newPost)

  return res.status(200).json({...newPost})
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

const getGroups = async (req, res) => {
  const {db} = await connectToDatabase()
  const {codeItId} = req.cookies

  const {groups} = await db.collection("user").findOne({ _id : new ObjectId(codeItId) })

  const result = await db.collection("group").find({_id: { $in: groups.map(group => new ObjectId(group)) }}).toArray()

  return res.status(200).json(result)
}

const getSuggestedGroups = async (req, res) => {
  const {db} = await connectToDatabase()
  const {type} = req.query

  if (!type) {
    return res.status(300).json()
  }

  const result = await db.collection("group").find().sort({datefield: -1}).limit(3).toArray()

  return res.status(200).json(result)
}

export default async (req, res) => {
  switch(req.method) {
    case "POST":
      return await createPost(req, res)
    case "PUT":
      return await editPost(req, res)
    case "GET":
      const {type} = req.query
      if (type === 'suggested') {
        return await getSuggestedGroups(req, res)
      }
      return await getGroups(req, res)
    default:
      return res.status(404).json()
  }
}