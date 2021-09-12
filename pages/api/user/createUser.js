import { checkUser } from "../../../utils/checkUser"

export default (req, res) => {
  if (checkUser(req)) {
    return res.status(400).json({})
  }
  //konekcija sa bazom i kreiranje korisnika
  res.status(200).json({ name: user })
}