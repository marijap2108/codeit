import {connectToDatabase} from "../../utils/mongodb"
import { ObjectId } from 'mongodb';

const createUser = async (req, res) => {
  const {db} = await connectToDatabase()
  const {username, email, password} = req.body

  if (!username || !email || !password) {
    return res.status(300).json()
  }

  const newUser = {
    username: username,
    email: email,
    password: password,
    groups: [],
    posts: []
  }

  const result = await db.collection("user").insertOne(newUser)

  return res.status(200).json({id: result.insertedId, username, email})
}

const handleSavePost = async (req, res) => {
  const {db} = await connectToDatabase()
  const cookies = req.cookies

  const {postId} = req.body

  const {posts} = await db.collection("user").findOne({ _id : new ObjectId(cookies.codeItId) })

  if (!posts || !posts.includes(postId)) {
    posts.push(postId)

    await db.collection("user").updateOne({'_id': new  ObjectId(cookies.codeItId)},{$set: {posts: posts}})
  } else {
    posts.splice(posts.indexOf(postId), 1)

    await db.collection("user").updateOne({'_id': new  ObjectId(cookies.codeItId)},{$set: {posts: posts}})
  }

  return res.status(200).json({saved: posts.includes(postId)})

}

export const handleGroup = async (follow, unFollow, cookies, res) => {
  const {db} = await connectToDatabase()

  const {groups} = await db.collection("user").findOne({ _id : new ObjectId(cookies.codeItId) })

  if (follow) {
    if (groups.includes(follow)) {
      return res.status(300).json()
    }
    groups.push(follow)

    const result = await db.collection("user").updateOne({'_id': new  ObjectId(cookies.codeItId)},{$set: {groups: groups}})

    return res.status(200).json(result)
  }

  if (unFollow) {
    groups.splice(groups.indexOf(unFollow), 1)

    const result = await db.collection("user").updateOne({'_id': new  ObjectId(cookies.codeItId)},{$set: {groups: groups}})

    return res.status(200).json(result)
  }

}

const editUser = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id, password} = req.body

  if (!id) {
    return res.status(300).json()
  }

  const result = await db.collection("user").updateOne({'_id': new  ObjectId(id)},{$set: {password: password}})

  return res.status(200).json(result)
}

const getUser = async (req, res) => {
  const {db} = await connectToDatabase()
  const {username, password, id} = req.query

  if ((!username || !password) && !id) {
    return res.status(300).json()
  }

  let result;

  if (id) {
    result = await db.collection("user").findOne({ '_id': new ObjectId(id)})
    if (result.groups) {
      result.groups = await db.collection("group").find({_id: result.groups.map(v => new ObjectId(v))})
    }
    return res.status(200).json(result)

  } else {
    result = await db.collection("user").findOne({ username: username, password: password })
  }

  return res.status(200).json({id: result._id, username: result.username, email: result.email })
}

export default async (req, res) => {
  switch(req.method) {
    case "POST":
      return await createUser(req, res)
    case "PUT":
      if (req.body.postId) {
        return await handleSavePost(req, res)
      }
      if (req.query.follow || req.query.unfollow) {
        return await handleGroup(req.query.follow, req.query.unfollow, req.cookies, res)
      }
      return await editUser(req, res)
    case "GET":
      return await getUser(req, res)
    default:
      return res.status(404).json()
  }
}