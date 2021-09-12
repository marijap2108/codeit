export const checkUser = (req) => { 
  const cookies = req.cookies
  return !!cookies.privateKey
}