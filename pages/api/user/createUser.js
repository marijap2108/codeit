import { checkUser } from "../../../utils/checkUser"
import {connectToDatabase} from "../../../utils/mongodb"

export default async (req, res) => {
  const {db} = await connectToDatabase()
  const data = await db.collection("codeIt").find({}).toArray()

  return res.status(200).json(data)
  if (checkUser(req)) {
    return res.status(400).json({})
  }
  //konekcija sa bazom i kreiranje korisnika
  res.status(200).json({ name: user })
}