import { useEffect, useState, useCallback } from 'react'
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router'
import { MenuBar, Post as PostCard } from '../../components/uiComponents'

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

  useEffect(() => {
    fetch(`http://localhost:3000/api/user?id=${cookies.codeItId}`, {
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      setUser(data)
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
      </div>
    </>
  )
}

export default Post