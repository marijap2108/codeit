import {connectToDatabase} from "../../utils/mongodb"
import { getLoggedUser } from "../../utils/getLoggedUser";
import { ObjectId } from 'mongodb';

const createUser = async (req, res) => {
  const {db} = await connectToDatabase()
  const {username, email, password} = req.body

  if (!username || !email || !password) {
    return res.status(400).json()
  }

  const newUser = {
    username: username,
    email: email,
    password: password,
    groups: [],
    posts: [],
    isAdmin: false
  }

  try {
    const result = await db.collection("user").insertOne(newUser)
    return res.status(200).json({id: result.insertedId})
  } catch (e) {
    throw (`Probem with user create, ${e}`)
  }
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
      return res.status(400).json()
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

const promoteUser = async (req, res) => {
  const {db} = await connectToDatabase()
  const {promote} = req.query

  const user = await getLoggedUser(req)

  if (!promote) {
    return res.status(400).json()
  }

  if (!user.isAdmin) {
    return res.status(403).json()
  }

  try {
    await db.collection("user").updateOne({'_id': new  ObjectId(promote)},{$set: {isAdmin: true}})
    return res.status(200).json()
  } catch (e) {
    throw (`Progem with user promote, ${e}`)
  }
}

const editUser = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id} = req.query
  const {password, oldPassword, username, email} = req.body

  const user = await getLoggedUser(req)

  if (!id) {
    return res.status(400).json()
  }

  if (user._id !== id && !user.isAdmin) {
    return res.status(403).json()
  }

  const newUser = await db.collection('user').findOne({'_id': new  ObjectId(id)})

  if (user._id === id) {
    if (password) {
      newUser.password = password
    }
    if (email) {
      newUser.email = email
    }
  }

  if (username) {
    newUser.username = username
  }

  await db.collection("user").updateOne({'_id': new  ObjectId(id)},{$set: newUser})

  return res.status(200).json()
}

const getUser = async (req, res) => {
  const {db} = await connectToDatabase()
  const {username, password, id} = req.query

  const user = await getLoggedUser(req)

  if (user) {
    user.groups = await db.collection("group").find({_id: { $in: user.groups.map(group => new ObjectId(group)) }}).toArray()
    return res.status(200).json(user)
  }

  if ((!username || !password) && !id) {
    return res.status(400).json()
  }

  if (id) {
    const result = await db.collection("user").findOne({ _id: new ObjectId(id) })
    result.groups = await db.collection("group").find({_id: { $in: result.groups.map(group => new ObjectId(group)) }}).toArray()
  
    return res.status(200).json(result)
  }

  const result = await db.collection("user").findOne({ username: username, password: password })
  result.groups = await db.collection("group").find({_id: { $in: result.groups.map(group => new ObjectId(group)) }}).toArray()

  return res.status(200).json(result)
}

const deleteUser = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id} = req.query

  if (!id) {
    return res.status(400).json()
  }

  const result = await db.collection("user").deleteOne({ '_id': new  ObjectId(id) })

  await db.collection("post").deleteMany({'createdBy': id})

  return res.status(200).json(result)
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
      if (req.query.promote) {
        return await promoteUser(req, res)
      }
      return await editUser(req, res)
    case "GET":
      return await getUser(req, res)
    case "DELETE":
      return await deleteUser(req, res)
    default:
      return res.status(404).json()
  }
}