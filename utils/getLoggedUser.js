import {connectToDatabase} from "./mongodb"
import { ObjectId } from 'mongodb';

export const getLoggedUser = async (req) => { 
  const cookies = req.cookies

  const {db} = await connectToDatabase()

  try {
    const user = await db.collection("user").findOne({ _id : new ObjectId(cookies.codeItId) })
    return user
  } catch (e) {
    throw (`Problem with getting user, ${e}`)
  }
}