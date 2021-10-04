import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';
import { getLoggedUser } from "../../utils/getLoggedUser";
import { handleSort } from "../../utils/handleSort";

const getHotPosts = async (req, res) => {
  const {db} = await connectToDatabase()
  const {type} = req.query
  const {codeItId} = req.cookies

  if (!type) {
    return res.status(400).json()
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
    return res.status(400).json()
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