import { connectToDatabase } from "../../utils/mongodb"
import { ObjectId } from 'mongodb';
import { getLoggedUser } from "../../utils/getLoggedUser";

const createPost = async (req, res) => {
  const {db} = await connectToDatabase()
  const {title, body, group} = req.body

  const user = await getLoggedUser(req)

  if (!title || !body || !group) {
    return res.status(400).json()
  }

  if (!user.groups.includes(group)) {
    return res.status(403).json()
  }

  const newPost = {
    title: title,
    body: body,
    groupId: group,
    createdBy: user._id, 
    createdOn: Date.now(),
    votesUp: [user._id],
    votesDown: []
  }

  try {
    await db.collection("post").insertOne(newPost)
  } catch (e) {
    throw (`Probem with post creation, ${e}`)
  } finally {
    return res.status(200).json({...newPost})
  }
}

const editPost = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id, body} = req.body

  const user = await getLoggedUser(req)

  if (!id || !body) {
    return res.status(400).json()
  }

  if (!user.isAdmin) {
    const post = await db.collection('post').findOne({'_id': new ObjectId(id)})

    if (post.createdBy !== user._id) {
      return res.status(403).json()
    }
  }

  try {
    const result = await db.collection("post").updateOne({'_id': new  ObjectId(id)},{$set: {body: body}})
    return res.status(200).json(result)
  } catch (e) {
    throw (`Problem with post update, ${e}`)
  }
}

const handleVote = async (req, res) => {
  const {db} = await connectToDatabase()
  const cookies = req.cookies

  const opposite = {
    votesUp: 'votesDown',
    votesDown: 'votesUp'
  }

  const {type, id} = req.body

  const post = await db.collection("post").findOne({ _id : new ObjectId(id) })

  if (!post[type].includes(cookies.codeItId)) {

    if (post[opposite[type]].includes(cookies.codeItId)) {
      post[opposite[type]].splice(post[opposite[type]].indexOf(cookies.codeItId), 1)
    }

    post[type].push(cookies.codeItId)

    await db.collection("post").updateOne({'_id': new  ObjectId(id)}, {$set: post})
  } else {
    post[type].splice(post[type].indexOf(cookies.codeItId), 1)

    await db.collection("post").updateOne({'_id': new  ObjectId(id)}, {$set: post})
  }

  const result = await db.collection("post").findOne({'_id': new  ObjectId(id)})

  return res.status(200).json(result)
}

const getPost = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id} = req.query

  if (!id) {
    return res.status(400).json()
  }

  const result = await db.collection("post").findOne({ '_id': new  ObjectId(id) })
  const {username} = await db.collection("user").findOne({'_id': new  ObjectId(result.createdBy)})
  const {title} = await db.collection("group").findOne({'_id': new  ObjectId(result.groupId)})

  result.creatorUsername = username
  result.groupName = title

  return res.status(200).json(result)
}

const deletePost = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id} = req.query

  const user = await getLoggedUser(req)

  if (!id) {
    return res.status(400).json()
  }

  if (!user.isAdmin) {
    const post = await db.collection('post').findOne({'_id': new ObjectId(id)})

    if (post.createdBy !== user._id) {
      return res.status(403).json()
    }
  }

  await db.collection("post").deleteOne({ '_id': new  ObjectId(id) })

  return res.status(200).json(result)
}

export default async (req, res) => {
  switch(req.method) {
    case "POST":
      return await createPost(req, res)
    case "PUT":
      if (req.body.type) {
        return await handleVote(req, res)
      }
      return await editPost(req, res)
    case "GET":
      return await getPost(req, res)
    case "DELETE":
      return await deletePost(req, res)
    default:
      return res.status(404).json()
  }
}