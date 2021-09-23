import { MenuBar, Post as PostCard } from '../../components/uiComponents'

export async function getServerSideProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/post?id=${params.id}`)
  const post = await res.json()

  return {
    props: {
      post,
    },
  }
}

const Post = ({post}) => {

  console.log(post)

  return (
    <div>
      <MenuBar />
      <PostCard
        title={post.title}
        creatorName={post.creatorName}
        createdOn={post.createdOn}
        body={post.body}
        votesUp={post.votesUp}
        votesDown={post.votesDown}
      />
    </div>
  )
}

export default Post