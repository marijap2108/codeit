import React, { useCallback, useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { Card, Post } from '../components/uiComponents'

export const App = () => {

  const [cookies] = useCookies(['codeItId'])
  const [user, setUser] = useState({username: sessionStorage.getItem('username'), email: sessionStorage.getItem('email')})
  const [newPost, setNewPost] = useState({isOpen: false, body: '<p></p>'})

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
      })
    }
  }, [])

  const openCreatePost = useCallback(() => {
    setNewPost(post => ({...post, isOpen: true}))
  }, [])

  const setNewPostBody = useCallback((_e, newBody) => {
    setNewPost(post => ({...post, body: newBody.getData()}))
  }, [])

  return <div>
    <div className="navBar">

    </div>
    <div className="groups">

    </div>
    <div className="posts">
      <Card>
        <form onFocus={openCreatePost}>
          <input />
          {newPost.isOpen ? 
            <div>
              <input/>
              <button>
                Send
              </button>
            </div>
          :
            null
          }
        </form>
      </Card>

    </div>
    <div className="sugested">

    </div>
    rasa{user.username}
  </div>
}
