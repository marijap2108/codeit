import { connectToDatabase } from "../../utils/mongodb"
import { getLoggedUser } from "../../utils/getLoggedUser";
import { ObjectId } from 'mongodb';

const createComment = async (req, res) => {
  const {db} = await connectToDatabase()
  const {parentId, body} = req.body
  const cookies = req.cookies

  if (!parentId || !body) {
    return res.status(400).json()
  }

  const newComment = {
    postId: parentId,
    body: body,
    createdBy: cookies.codeItId,
    createdOn: Date.now()
  }

  const result = await db.collection("comment").insertOne(newComment)

  return res.status(200).json({...newComment, id: result.insertedId})
}

const deleteComment = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id} = req.query

  const user = await getLoggedUser(req)

  if (!id) {
    return res.status(400).json()
  }

  if (!user.isAdmin) {
    const comment = await db.collection('comment').findOne({'_id': new ObjectId(id)})

    if (comment.createdBy !== user._id) {
      return res.status(403).json()
    }
  }

  const result = await db.collection("comment").deleteOne({ '_id': new  ObjectId(id) })

  return res.status(200).json(result)
}

export default async (req, res) => {
  switch(req.method) {
    case "POST":
      return await createComment(req, res)
    case "DELETE":
      return await deleteComment(req, res)
    default:
      return res.status(404).json()
  }
}