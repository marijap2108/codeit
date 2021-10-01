import React, { useCallback, useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { Button, Card, MenuBar, Post } from '../components/uiComponents'
import { useRouter } from 'next/router'
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});


export const App = () => {

  const router = useRouter()

  const [cookies] = useCookies(['codeItId'])
  const [user, setUser] = useState({username: '', email: '', posts: []})
  const [newPost, setNewPost] = useState({isOpen: false, title: '', body: '', group: ''})
  const [posts, setPosts] = useState([])
  const [suggested, setSuggested] = useState([])
  const [groups, setGroups] = useState([])
  const [suggestedGroups, setSuggestedGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState()
  const [sort, setSort] = useState('hot')

  useEffect(() => {
    fetch(`http://localhost:3000/api/user?id=${cookies.codeItId}`, {
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      setUser({username: data.username, email: data.email, posts: data.posts})
    })

    fetch(`http://localhost:3000/api/groups`, {
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      setGroups(data)
    })

    fetch(`http://localhost:3000/api/posts?type=${sort}`, {
      method: "GET"
    })
    .then(response => response.json())
    .then(data => {
      setPosts(data)
    })

    fetch(`http://localhost:3000/api/groups?type=suggested`, {
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      setSuggested(data)
    })
  }, [])

  useEffect(() => {
    fetch(`http://localhost:3000/api/group?title=${router.query.search}`, {
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      setSuggestedGroups(data)
    })
  }, [router.query.search])

  const handleSubscription = useCallback((v) => ({target}) => {
    if (target.innerHTML === 'Follow') {
      setGroups(groups => [...groups, v])

      fetch(`http://localhost:3000/api/user?follow=${v._id}`, {
        method: "PUT"
      })

    } else {
      setGroups(groups => groups.filter(group => group._id !== v._id))

      fetch(`http://localhost:3000/api/user?unfollow=${v._id}`, {
        method: "PUT"
      })

    }
  }, [])

  const openCreatePost = useCallback(() => {
    setNewPost(post => ({...post, isOpen: true}))
  }, [])

  const closeCreatePost = useCallback(() => {
    setNewPost(post => ({...post, isOpen: false}))
  }, [])

  const handleTitleChange = useCallback(({target}) => {
    setNewPost(post => ({...post, title: target.value}))
  }, [])

  const handleBodyChange = useCallback((value) => {
    setNewPost(post => ({...post, body: value}))
  }, [])

  const handleGroupSelect = useCallback(({target}) => {
    setNewPost(post => ({...post, group: target.value}))
  }, [])

  const handleSubmitPost = useCallback(() => {
    if (newPost.title && newPost.body && newPost.group) {
      fetch(`http://localhost:3000/api/post`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })
      .then(response => response.json())
      .then(data => {
        setNewPost({isOpen: false, title: '', body: '', group: ''})
        setPosts(posts => ([data, ...posts]))
      })
    }
  }, [newPost])

  const handleFilterGroup = useCallback((id) => () => {
    if (selectedGroup !== id) {
      setSelectedGroup(id)
      fetch(`http://localhost:3000/api/posts?groupid=${id}`, {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => {
        setPosts(data)
      })
    } else {
      setSelectedGroup('')
      fetch(`http://localhost:3000/api/posts?type=${sort}`, {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => {
        setPosts(data)
      })
    }
  }, [sort, selectedGroup])

  const handleSort = useCallback((value) => () => {
    if (sort === value) {
      return
    } 

    setSort(value)

    fetch(`http://localhost:3000/api/posts?type=${value}`, {
      method: "GET"
    })
    .then(response => response.json())
    .then(data => {
      setPosts(data)
    })

  }, [sort])

  const editPosts = useCallback((newPost) => {
    setPosts(v => v.map(oldPost => oldPost._id === newPost._id ? newPost : oldPost))
  }, [])

  const deletePost = useCallback((deletedPost) => {
    setPosts(v => v.filter(post => post._id !== deletedPost._id))
  }, [])

  return <div className="app">
    <MenuBar />
    <div className="app__groups">
      <div className="app__groups__content">
        <h4>Following groups:</h4>
          {groups.map((group, index) => (
            <Card style={{cursor: 'pointer'}} onClick={handleFilterGroup(group._id)} key={`group_${index}`}>
              <div className="app__groups__content__item">
                {group.title}
                <div style={{backgroundColor: group.color}} className={`${selectedGroup === group._id && "app__groups__content__item__flag--selected"} app__groups__content__item__flag`} />
              </div>
            </Card>
          ))}
      </div>
    </div>
    <div className="app__main">
      <div className="app__main__posts">
        {suggestedGroups.length > 0 ?
          <div className="app__main__posts__suggested">
            {suggestedGroups.map((group, index) => (
              <Card key={`groups_${index}}`}>
                <h4>{group.title}</h4>
                <p>{group.description}</p>
                <Button onClick={handleSubscription(group)}>{groups.some(subscribedGroups => subscribedGroups._id === group._id) ? 'Followed': 'Follow'}</Button>
              </Card>
            ))}
          </div>
        :
          null
        }
        <Card>
          <form onFocus={openCreatePost}>
            <input onChange={handleTitleChange} value={newPost.title}/>
            {newPost.isOpen ? 
              <div>
                <SunEditor defaultValue={newPost.body} onChange={handleBodyChange}/>
                <select value={newPost.group} onChange={handleGroupSelect}>
                  <option value="">None</option>
                  {groups.map((group, index) => 
                    <option value={group._id} key={`group_option_${index}`}>
                      {group.title}
                    </option>
                  )}
                </select>
                <button type="button" onClick={handleSubmitPost}>
                  Send
                </button>
                <button type="button" onClick={closeCreatePost}>
                  Close
                </button>
              </div>
            :
              null
            }
          </form>
        </Card>
        <Card>
          <span onClick={handleSort('hot')}>
            Hot
          </span>
          |
          <span onClick={handleSort('new')}>
            New
          </span>
          |
          <span onClick={handleSort('top')}>
            Top
          </span> 
          |
          <span onClick={handleSort('controversial')}>
            Controversial
          </span>
        </Card>
        {posts.map((post, index) => (
          <Post
            postId={post._id}
            title={post.title}
            creatorName={post.creatorName}
            createdOn={post.createdOn}
            body={post.body}
            votesUp={post.votesUp}
            votesDown={post.votesDown}
            isUserCreator={post.createdBy === cookies.codeItId}
            userId={cookies.codeItId}
            groupName={groups.find(group => group._id === post.groupId)?.title || 'group'}
            key={`post_${index}`}
            editPosts={editPosts}
            deletePost={deletePost}
            isSaved={user['posts']?.includes(post._id)}
          />
        ))}
      </div>
      <div className="app__main__suggested">
        {suggested.map((group, index) => (
          <Card key={`suggested_${index}`}>
            <h4>{group.title}</h4>
            <p>{group.description}</p>
            <Button onClick={handleSubscription(group)}>{groups.some(subscribedGroups => subscribedGroups._id === group._id) ? 'Followed': 'Follow'}</Button>
          </Card>
        ))}
      </div>
    </div>
  </div>
}
