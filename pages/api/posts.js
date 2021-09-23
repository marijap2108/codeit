import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';
import { handleSort } from "../../utils/handleSort";

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

const getHotPosts = async (req, res) => {
  const {db} = await connectToDatabase()
  const {type} = req.query
  const {codeItId} = req.cookies

  if (!type) {
    return res.status(300).json()
  }

  const {groups} = await db.collection("user").findOne({ _id : new ObjectId(codeItId) })

  const d = Date.now() - 86400000

  const result = await db.collection("post").find({createdOn: {$gt: d}, groupId: { $in: groups }}).sort({votesUp: -1}).toArray()

  return res.status(200).json(result)
}

const getPostsByType = async (type, req, res) => {
  const {db} = await connectToDatabase()
  const {codeItId} = req.cookies

  const {groups} = await db.collection("user").findOne({ _id : new ObjectId(codeItId) })

  const result = await db.collection("post").find({groupId: { $in: groups }}).sort({...type}).toArray()

  return res.status(200).json(result)
}

const getSuggestedPosts = async (req, res) => {
  const {db} = await connectToDatabase()
  const {type} = req.query

  if (!type) {
    return res.status(300).json()
  }

  const result = await db.collection("post").find().sort({datefield: -1}).limit(3).toArray()

  return res.status(200).json(result)
}

const getPostsByGroup = async (req, res) => {
  const {db} = await connectToDatabase()
  const {groupid} = req.query

  const result = await db.collection("post").find({groupId: groupid}).toArray()

  return res.status(200).json(result)
}

const getPostsByUser = async (req, res) => {
  const {db} = await connectToDatabase()
  const {userid} = req.query

  const result = await db.collection("post").find({createdBy: userid}).toArray()

  return res.status(200).json(result)
}

export default async (req, res) => {
  switch(req.method) {
    case "POST":
      return await createPost(req, res)
    case "PUT":
      return await editPost(req, res)
    case "GET":
      const {type, groupid, userid} = req.query
      if (type) {
        if (type === 'hot') {
          return await getHotPosts(req, res)
        }
        if (type === 'suggested') {
          return await getSuggestedPosts(req, res)
        }
        return await getPostsByType(handleSort(type), req, res)
      }

      if (groupid) {
        return await getPostsByGroup(req, res)
      }
      if (userid) {
        return await getPostsByUser(req, res)
      }
    default:
      return res.status(404).json()
  }
}