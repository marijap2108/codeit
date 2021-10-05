import { useEffect, useState, useCallback } from 'react'
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router'
import { Button, MenuBar, Post as PostCard, Card } from '../../components/uiComponents'
import { FiDelete } from 'react-icons/fi';

export async function getServerSideProps({ params }) {
  const resPost = await fetch(`http://localhost:3000/api/post?id=${params.id}`)
  const initialPost = await resPost.json()

  return {
    props: {
      initialPost,
    },
  }
}

const Post = ({initialPost}) => {

  const router = useRouter()
  const [cookies] = useCookies(['codeItId'])
  const [user, setUser] = useState({})
  const [post, setPost] = useState(initialPost)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [users, setUsers] = useState({})

  useEffect(() => {
    fetch(`http://localhost:3000/api/user?id=${cookies.codeItId}`, {
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      setUser(data)
    })

    fetch(`http://localhost:3000/api/comments?id=${post._id}`, {
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      setComments(data)
    })
  }, [cookies])

  const editPosts = useCallback((newPost) => {
    setPost(newPost)
  }, [])

  const deletePost = useCallback(() => {
    router.push({
			pathname: `/`,
		})
  }, [])

  const handleNewCommentChange = useCallback(({target}) => {
    setNewComment(target.value)
  }, [])

  const submitNewComment = useCallback(() => {
    setNewComment('')
    fetch(`http://localhost:3000/api/comment`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({body: newComment, parentId: post._id})
    }) 
    .then(response => response.json())
    .then(data => {
      setComments(oldComments => ([...oldComments, data]))
    })
  }, [newComment])

  const handleUsers = useCallback(() => {
    const newUsers = [];
    comments.map(({createdBy}) => {
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
  }, [comments, users])

  useEffect(() => {
    handleUsers()
  }, [comments])

  const handleCommentDelete = useCallback((id) => () => {
		fetch(`http://localhost:3000/api/comment?id=${id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(_data => {
      setComments(oldComments => oldComments.filter(oldComment => oldComment._id !== id))
    })
  }, [])

  return (
    <>
      <MenuBar isAdmin={user.isAdmin} username={user.username} />
      <div className="postPage">
        <PostCard
          postId={post._id}
          title={post.title}
          creatorName={post.creatorUsername}
          createdOn={post.createdOn}
          body={post.body}
          votesUp={post.votesUp}
          votesDown={post.votesDown}
          isUserCreator={post.createdBy === cookies.codeItId}
          isUserAdmin={user.isAdmin}
          userId={cookies.codeItId}
          groupName={post.groupName}
          isSaved={user.posts?.includes(post._id)}
          isEditable={router.query.edit}
          editPosts={editPosts}
          deletePost={deletePost}
        />
        <Card className="comments">
          {comments.map((comment, index) => (
            <div key={`comment_${index}`} className="comment">
              <div className="userInfo">
                <img title={users[comment.createdBy]} width="30" height="30" src={`https://avatars.dicebear.com/api/bottts/${users[comment.createdBy]}.svg`} />
                <span>{users[comment.createdBy]}</span>
              </div>
              <div className="content">
                <span>{comment.body}</span>
                {comment.createdBy === user._id || user.isAdmin ?
                  <FiDelete title="Delete" onClick={handleCommentDelete(comment._id)} />
                :
                  null
                }
              </div>
            </div>
          ))}
          <div className="newComment">
            <input placeholder="Write new comment" onChange={handleNewCommentChange} value={newComment} />
            <Button onClick={submitNewComment}>Post</Button>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Post