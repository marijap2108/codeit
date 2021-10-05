import React, { useCallback, useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { Button, Card, DropDown, MenuBar, Post } from '../components/uiComponents'
import { useRouter } from 'next/router'
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export const App = () => {

  const router = useRouter()

  const [cookies] = useCookies(['codeItId'])
  const [user, setUser] = useState({})
  const [newPost, setNewPost] = useState({isOpen: false, title: '', body: '', group: ''})
  const [posts, setPosts] = useState([])
  const [suggested, setSuggested] = useState([])
  const [groups, setGroups] = useState([])
  const [suggestedGroups, setSuggestedGroups] = useState([])
  const [sort, setSort] = useState('hot')
  const [users, setUsers] = useState({})
  const [skip, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:3000/api/user`, {
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      setUser(data)
      setUsers(oldUsers => ({...oldUsers, [data._id]: data.username}))
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
    if (router.query.search) {
      fetch(`http://localhost:3000/api/groups?title=${router.query.search}`, {
        method: "GET"
      }) 
      .then(response => response.json())
      .then(data => {
        setSuggestedGroups(data)
      })
    }
  }, [router.query.search])

  const handleUsers = useCallback(() => {
    const newUsers = [];
    posts.map(({createdBy}) => {
      if (!users[createdBy] && !newUsers.includes(createdBy)) {
        newUsers.push(createdBy)
      }
    })

    if (newUsers.length > 0) {
      newUsers.map(id => (
        fetch(`http://localhost:3000/api/user?id=${id}`, {
          method: "GET"
        }) 
        .then(response => response.json())
        .then(data => {
          setUsers(oldUsers => ({...oldUsers, [data._id]: data.username}))
        })
      ))
    }
  }, [posts, users])

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


  useEffect(() => {
    setPosts([])
    setStep(0)
  }, [router.query.filter, sort])

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

  const handleGroupSelect = useCallback((id) => () => {
    setNewPost(post => ({...post, group: id}))
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

  useEffect(() => {
    if (router.query.filter) {
      fetch(`http://localhost:3000/api/posts?type=${sort}&groupid=${router.query.filter}&skip=${skip}`, {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => {
        setPosts(oldPosts => ([...oldPosts, ...data]))
        if (data.length > 4) {
          setLoading(false)
        }
      })
    } else {
      fetch(`http://localhost:3000/api/posts?type=${sort}&skip=${skip}`, {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => {
        setPosts(oldPosts => ([...oldPosts, ...data]))
        if (data.length > 3) {
          setLoading(false)
        }
      })
    }
  }, [sort, router.query.filter, skip])

  useEffect(() => {
    setStep(step => step + 5)
  }, [loading])

  const handleSort = useCallback((value) => () => {
    if (sort === value) {
      return
    } 

    setSort(value)
  }, [sort])

  const editPosts = useCallback((newPost) => {
    setPosts(v => v.map(oldPost => oldPost._id === newPost._id ? newPost : oldPost))
  }, [])

  const deletePost = useCallback((deletedPost) => {
    setPosts(oldPosts => oldPosts.filter(oldPost => oldPost._id !== deletedPost))
  }, [])

  useEffect(() => {
    handleUsers()
  }, [posts])

  const handleScroll = useCallback((_e) => {
    if (!loading && document.body.clientHeight - 100 < window.scrollY + window.innerHeight) {
      setLoading(true)
    }
  }, [loading])

  useEffect(() => {
    window.addEventListener('scroll', (e) => handleScroll(e))
    return (
      window.removeEventListener('scroll', (e) => handleScroll(e))
    )
  }, [loading])

  return <div className="app">
    <MenuBar username={user.username} isAdmin={user.isAdmin} groups={groups} />
    <div className="app__main">
      <div className="app__main__posts">
        {suggestedGroups.length > 0 ?
          <div className="app__main__posts__suggested">
            {suggestedGroups.map((group, index) => (
              <Card key={`groups_${index}}`}>
                <h4>{group.title}</h4>
                <p>{group.description}</p>
                <Button onClick={handleSubscription(group)}>{groups.some(subscribedGroups => subscribedGroups._id === group._id) ? 'UnFollow': 'Follow'}</Button>
              </Card>
            ))}
          </div>
        :
          null
        }
        <Card className="newPost">
          <form className="app__main__posts__new" onFocus={openCreatePost}>
            <img title={user.username} width="50" height="50" src={`https://avatars.dicebear.com/api/bottts/${user.username}.svg`} />
            <div className="app__main__posts__new__header">
            <input placeholder="Crete Post" onChange={handleTitleChange} value={newPost.title}/>
              <DropDown target={groups?.find(group => group._id === newPost.group)?.title || "Select Group"}>
              {groups.map((group, index) => 
                  <div onClick={handleGroupSelect(group._id)} key={`group_option_${index}`}>
                    {group.title}
                  </div>
                )}
              </DropDown>
            </div>
            {newPost.isOpen ? 
              <div className="app__main__posts__new__content">
                <SunEditor defaultValue={newPost.body} onChange={handleBodyChange}/>
                <div className="app__main__posts__new__content__action">
                  <Button type="button" onClick={handleSubmitPost}>
                    Send
                  </Button>
                  <Button type="button" onClick={closeCreatePost}>
                    Close
                  </Button>
                </div>
              </div>
            :
              null
            }
          </form>
        </Card>
        <Card>
          <div className="app__main__posts__sort">
            <span className={sort === 'hot' ? 'active' : ''} onClick={handleSort('hot')}>
              Hot
            </span>
            <span className={sort === 'new' ? 'active' : ''} onClick={handleSort('new')}>
              New
            </span>
            <span className={sort === 'top' ? 'active' : ''} onClick={handleSort('top')}>
              Top
            </span> 
            <span className={sort === 'controversial' ? 'active' : ''} onClick={handleSort('controversial')}>
              Controversial
            </span>
          </div>
        </Card>
        {posts.map((post, index) => (
          <Post
            postId={post._id}
            title={post.title}
            creatorName={users[post.createdBy]}
            createdOn={post.createdOn}
            body={post.body}
            votesUp={post.votesUp}
            votesDown={post.votesDown}
            isUserCreator={post.createdBy === cookies.codeItId}
            isUserAdmin={user.isAdmin}
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
            <Button onClick={handleSubscription(group)}>{groups.some(subscribedGroups => subscribedGroups._id === group._id) ? 'UnFollow': 'Follow'}</Button>
          </Card>
        ))}
      </div>
    </div>
  </div>
}
