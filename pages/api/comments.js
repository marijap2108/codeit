import { connectToDatabase } from "../../utils/mongodb"

const getComments = async (req, res) => {
  const {db} = await connectToDatabase()
  const {id} = req.query

  if (!id) {
    return res.status(400).json()
  }

  const result = await db.collection("comment").find({ postId: id }).toArray()

  return res.status(200).json(result)
}

export default async (req, res) => {
  switch(req.method) {
    case "GET":
      return await getComments(req, res)
    default:
      return res.status(404).json()
  }
}