import { ObjectId } from 'mongodb';
import { connectToDatabase } from "../../utils/mongodb"

const getUsersByUsername = async (req, res) => {
  const {db} = await connectToDatabase()
  const {username} = req.query

  if (!username) {
    return res.status(300).json()
  }

  const result = await db.collection("user").find({username: new RegExp(username, 'i')}).toArray()

  return res.status(200).json(result)
}

const getUsersSavedPosts = async (req, res) => {
  const {db} = await connectToDatabase()
  const {saved} = req.query

  if (!saved) {
    return res.status(300).json()
  }

  const user = await db.collection("user").findOne({_id: new ObjectId(saved)})

  const result = await db.collection("post").find({_id: { $in: user.posts.map(post => new ObjectId(post)) }}).toArray()

  return res.status(200).json(result)
}

export default async (req, res) => {
  switch(req.method) {
    case "GET":
      if (req.query.username) {
        return await getUsersByUsername(req, res)
      }
      if (req.query.saved) {
        return await getUsersSavedPosts(req, res)
      }
    default:
      return res.status(404).json()
  }
}