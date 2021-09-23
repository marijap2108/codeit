import { MenuBar } from '../../components/uiComponents'

export async function getServerSideProps({ params }) {
  const userRes = await fetch(`http://localhost:3000/api/user?id=${params.id}`)
  const user = await userRes.json()

  const postsRes = await fetch(`http://localhost:3000/api/posts?userid=${params.id}`)
  const posts = await postsRes.json()

  return {
    props: {
      user,
      posts,
    },
  }
}

const User = ({ user, posts }) => {

  return (
    <div>
      <MenuBar />
      {user.username}
    </div>
  )
}

export default User