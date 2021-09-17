import React, { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';

export const App = () => {

  const [cookies] = useCookies(['codeItId'])
  const [user, setUser] = useState({username: sessionStorage.getItem('username'), email: sessionStorage.getItem('email')})

  useEffect(() => {
    if (!user.username) {
      fetch(`http://localhost:3000/api/user?id=${cookies.codeItId}`,{
        method: "GET"
      }) 
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem('username', data.username)
        sessionStorage.setItem('email', data.email)
        setUser({username: data.username, email: data.email})
        console.log(data)
      })
    }
  }, [])

  return <div>rasa{user.username}</div>
}
