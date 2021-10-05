import { useMemo, useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { FiEdit2, FiTrash2, FiMoreHorizontal, FiDelete, FiCopy } from "react-icons/fi";
import { Button, MenuBar, Post, Card, DropDown, Modal, CreateGroup, SearchUsers } from '../../components'
import Router from 'next/router'
import { PayPalButton } from "react-paypal-button-v2";

export async function getServerSideProps({ params }) {
  const userRes = await fetch(`http://localhost:3000/api/user?id=${params.id}`)
  const user = await userRes.json()

  const postsRes = await fetch(`http://localhost:3000/api/posts?userid=${params.id}`)
  const initialPosts = await postsRes.json()

  return {
    props: {
      user,
      initialPosts,
    },
  }
}

const User = ({ user, initialPosts }) => {

  const [cookies] = useCookies(['codeItId'])
  const [loggedInUser, setLoggedInUser] = useState({})
  const [groups, setGroups] = useState(user.groups)
  const [posts, setPosts] = useState(initialPosts)
  const [openGroupModal, setOpenGroupModal] = useState(false)
  const [editGroup, setEditGroup] = useState()
  const [searchUser, setSearchUser] = useState(false)
  const [editUserData, setEditUserData] = useState({username: '', email: '', password: ''})
  const [appliedFilter, setAppliedFilter] = useState('post')
  const [users, setUsers] = useState({[user._id]: user.username})

  useEffect(() => {
    fetch(`http://localhost:3000/api/user?id=${cookies.codeItId}`, {
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      setLoggedInUser(data)
    })
  }, [cookies])

  const isThisUser = useMemo(() => {
    return cookies.codeItId === user._id
  }, [cookies, user])

  const editPosts = useCallback((newPost) => {
    setPosts(oldPosts => oldPosts.map(oldPost => oldPost._id === newPost._id ? newPost : oldPost))
  }, [])

  const deletePost = useCallback((deletedPost) => {
    setPosts(oldPosts => oldPosts.filter(oldPost => oldPost._id !== deletedPost))
  }, [])

  const handleUnFollowGroup = useCallback((id) => () => {
      fetch(`http://localhost:3000/api/user?unfollow=${id}`, {
        method: "PUT"
      })
      setGroups(oldGroups => oldGroups.filter(group => group._id !== id))
  }, [])

  const handleDeleteGroup = useCallback((id) => () => {
    fetch(`http://localhost:3000/api/group?id=${id}`, {
      method: "Delete"
    })
    setGroups(oldGroups => oldGroups.filter(group => group._id !== id))
    setPosts(oldPosts => oldPosts.filter(post => post.groupId !== id))
  }, [])

  const handleOpenGroupModal = useCallback((group) => () => {
    setEditGroup(group)
		setOpenGroupModal(true)
	}, [])

	const handleCloseGroupModal = useCallback(() => {
		setOpenGroupModal(false)
	}, [])

  const handleOpenSearchUser = useCallback(() => {
		setSearchUser(true)
	}, [])

	const handleCloseSearchUser = useCallback(() => {
		setSearchUser(false)
	}, [])

  const handlePromoteToAdmin = useCallback(() => {
    fetch(`http://localhost:3000/api/user?promote=${user._id}`, {
      method: "PUT"
    })
    .then(() => {
      Router.reload()
    })
  }, [])

  const handleDeleteUser = useCallback(() => {
    fetch(`http://localhost:3000/api/user?id=${user._id}`, {
      method: "DELETE"
    })
    .then(() => {
      Router.push({
        pathname: `/`,
      })
    })
  }, [])

  const handleFilter = useCallback((filter) => () => {
    setAppliedFilter(filter)
    if (filter === 'post') {
      fetch(`http://localhost:3000/api/posts?userid=${user._id}`)
      .then(response => response.json())
      .then(data => {
        setPosts(data)
      })
    } else {
      fetch(`http://localhost:3000/api/users?saved=${user._id}`)
      .then(response => response.json())
      .then(data => {
        setPosts(data)
      })
    }
  }, [])

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(user._id)
  }, [])

  const handleEditUsername = useCallback(() => {
    setEditUserData(oldUserData => ({...oldUserData, username: user.username}))
  }, [])

  const handleEditEmail = useCallback(() => {
    setEditUserData(oldUserData => ({...oldUserData, email: user.email}))
  }, [])

  const handleUserDataChange = useCallback(({target}) => {
    setEditUserData(oldUserData => ({...oldUserData, [target.id]: target.value}))
  }, [])

  const handleSaveUserData = useCallback(() => {
    fetch(`http://localhost:3000/api/user?id=${user._id}`,{
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username: editUserData.username || user.username, email: editUserData.email || user.email})
    })
    .then(() => {
      Router.reload()
    })
  }, [editUserData])

  const handleCancelUserData = useCallback(() => {
    setEditUserData({username: '', email: '', password: ''})
  })

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

  useEffect(() => {
    handleUsers()
  }, [posts])

  return (
    <div>
      <MenuBar isAdmin={user.isAdmin} username={loggedInUser.username} />
      <div className="userPage">
        <div className="userPage__left">
          <Card>
            <div className="profile">
              <img width="40" height="40" src={`https://avatars.dicebear.com/api/bottts/${user.username}.svg`} />
              <div className="profile__data">
                <span>Username: </span>
                <span>
                  {editUserData.username ?
                    <input onChange={handleUserDataChange} id="username" value={editUserData.username} />
                  :
                    <>
                      {user.username}
                      {isThisUser || loggedInUser.isAdmin ?
                        <FiEdit2 onClick={handleEditUsername}/>
                      :
                        null
                      }
                    </>
                  }
                </span>
              </div>
              {isThisUser ?
                <>
                  <div className="profile__data">
                    <span>Email: </span>
                    <span>
                      {editUserData.email ?
                        <input onChange={handleUserDataChange} id="email" value={editUserData.email} />
                      :
                        <>
                          {user.email}
                          <FiEdit2 onClick={handleEditEmail}/>
                        </>
                      }
                    </span>
                  </div>
                  {editUserData.username || editUserData.email ?
                    <div className="profile__actions">
                      <PayPalButton
                        amount="1"
                        shippingPreference="NO_SHIPPING"
                        onSuccess={() => {
                          return handleSaveUserData()
                          }
                        }
                      options={{
                        clientId: "AWrCP1zYwFh2r1ez1MsZdRaHUxOb9ZNDNbgWavNgeScyqQn8jQpoql4W7cI8sS0o1Sh0eYufPUx5XQm3"
                      }}
                      />
                      <Button onClick={handleCancelUserData}>Cancel Changes</Button>
                    </div>
                  :
                    null
                  }
                  <Button>Change password</Button>
                </>
              :
                null
              }
              {loggedInUser.isAdmin ?
                <div className="profile__data">
                  <span>UserId:</span>
                  <span>
                    {user._id}
                    <FiCopy onClick={handleCopyToClipboard} />
                  </span>
                </div>
              :
                null
              }
              <hr />
              <div className="profile__groups">
                <b>User groups:</b>
                {groups.map((group, index) => (
                  <div key={`group__${index}`} className="profile__groups__group">
                    <span>{group.title}</span>
                    <DropDown target={<FiMoreHorizontal />}>
                      <>
                        <div onClick={handleUnFollowGroup(group._id)}>
                          UnFollow <FiDelete />
                        </div>
                        {group.createdBy === cookies.codeItId || loggedInUser.isAdmin ?
                          <>
                            <div onClick={handleDeleteGroup(group._id)}>
                              Delete <FiTrash2 />
                            </div>
                            <div onClick={handleOpenGroupModal(group)}>
                              <FiEdit2/>
                            </div>
                          </>
                        :
                          null
                        }
                      </>
                    </DropDown>
                  </div>
                ))}
              </div>
              {loggedInUser.isAdmin ?
                <>
                  <hr />
                  <div className="profile__adminPanel">
                    <b>Admin panel</b>
                    {isThisUser ?
                      <>
                        <Button onClick={handleOpenSearchUser}>Search users</Button>
                        <Button onClick={handleOpenGroupModal()}>Create group</Button>
                      </>
                    :
                      <>
                        {!user.isAdmin ?
                          <>
                            <Button onClick={handlePromoteToAdmin}>Promote to Admin</Button>
                            <Button onClick={handleDeleteUser}>Delete user</Button>
                          </>
                        :
                          "User is Admin"
                        }
                      </>
                    }
                  </div>
                </>
              :
                null
              }
            </div>
          </Card>
        </div>
        <div className="userPage__right">
          <Card>
            <span className={`userPage__right__filter ${appliedFilter === 'post' ? 'active' : '' }`} onClick={handleFilter('post')}>
              Posted By User
            </span>
            <span className={`userPage__right__filter ${appliedFilter === 'save' ? 'active' : '' }`} onClick={handleFilter('save')}>
              Saved By User
            </span>
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
              isUserAdmin={loggedInUser.isAdmin}
              userId={cookies.codeItId}
              groupName={groups.find(group => group._id === post.groupId)?.title || 'group'}
              isSaved={user.posts?.includes(post._id)}
              editPosts={editPosts}
              deletePost={deletePost}
              key={`post_${index}`}
            />
          ))}
        </div>
      </div>
      <Modal
				open={openGroupModal}
				handleClose={handleCloseGroupModal}
			>
        <CreateGroup handleCreateGroupClose={handleCloseGroupModal} group={editGroup} />
			</Modal>
      <Modal
				open={searchUser}
				handleClose={handleCloseSearchUser}
			>
        <SearchUsers />
			</Modal>
    </div>
  )
}

export default User