import React, { useCallback, useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { Card, MenuBar, Post } from '../components/uiComponents'

export const App = () => {

  const [cookies] = useCookies(['codeItId'])
  const [user, setUser] = useState({username: sessionStorage.getItem('username'), email: sessionStorage.getItem('email')})
  const [newPost, setNewPost] = useState({isOpen: false, body: '<p></p>'})
  const [posts, setPosts] = useState([])
  const [suggested, setSuggested] = useState([])
  const [groups, setGroups] = useState([])

  useEffect(() => {
    if (!user.username) {
      fetch(`http://localhost:3000/api/user?id=${cookies.codeItId}`, {
        method: "GET"
      }) 
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem('username', data.username)
        sessionStorage.setItem('email', data.email)
        setGroups(data.groups)
        setUser({username: data.username, email: data.email})
      })
    }
    fetch(`http://localhost:3000/api/post?type=recent&limit=3`, {
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setSuggested(data)
    })
  }, [])

  const openCreatePost = useCallback(() => {
    setNewPost(post => ({...post, isOpen: true}))
  }, [])

  const closeCreatePost = useCallback(() => {
    setNewPost(post => ({...post, isOpen: false}))
  }, [])

  return <div className="app">
    <MenuBar username={user.username} />
    <div className="app__groups">
        {groups.map(group => (
          group.name
        ))}
    </div>
    <div className="app__main">
      <div className="app__main__posts">
        <Card>
          <form onFocus={openCreatePost}>
            <input />
            {newPost.isOpen ? 
              <div>
                <input/>
                <button>
                  Send
                </button>
                <button onClick={closeCreatePost}>
                  Close
                </button>
              </div>
            :
              null
            }
          </form>
        </Card>
        {posts.map((post, index) => (
          <Post
            title={post.title}
            creatorName={post.creatorName}
            time={post.timeStamp}
            body={post.body}
            votes={post.votes}
            isUserCreator={post.createdBy === user.id}
            key={`post_${index}`}
          />
        ))}
      </div>
      <div className="app__main__suggested">
        {suggested.map(group => (
          <Card>
            {group.name}
          </Card>
        ))}
      </div>
    </div>
  </div>
}
