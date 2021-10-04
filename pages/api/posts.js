import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';
import { handleSort } from "../../utils/handleSort";

const getPostsByType = async (type, req, res) => {
  const {db} = await connectToDatabase()
  const {skip, groupid} = req.query
  const {codeItId} = req.cookies

  const {groups} = await db.collection("user").findOne({ _id : new ObjectId(codeItId) })

  const result = await db.collection("post").aggregate([
    { $match: {groupId: { $in: groupid ? [groupid] : groups }}},
    { $addFields: { votesUpCount: {$size: "$votesUp"}, votesDownCount: {$size: "$votesDown"} , voteCount: {$subtract: [{$size: "$votesUp"}, {$size: "$votesDown"}]} } }, 
    { $sort: type },
    { $skip: parseInt(skip) || 0 },
    { $limit: 5 }
  ]).toArray()

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
        if (type === 'suggested') {
          return await getSuggestedPosts(req, res)
        }
        return await getPostsByType(handleSort(type), req, res)
      }
      if (userid) {
        return await getPostsByUser(req, res)
      }
    default:
      return res.status(404).json()
  }
}