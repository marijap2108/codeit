import {NavBar} from '../uiComponents'
import styles from './NotLoggedIn.module.scss'
import Image from 'next/image'

export const NotLoggedIn = () => {
  return (
    <div className={styles.home}>
      <NavBar />
      <section className={styles.about}>
        <div className={styles.aboutLeft}>
          <h1>Social media for developers</h1>
          <p>Social media designed to help developers with their path to greatness.</p>
        </div>
        <div className={styles.aboutRight}>
          <Image src="/home.png" width="auto" height="auto" />
        </div>
      </section>
      <section className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.left}>
            <Image src="/groups.png" width="auto" height="auto" />
          </div>
          <div className={styles.right}>
            <h2>Follow languages you are interested in</h2>
            <p>
              In Codeit you can follow groups witch are representing one programing language, so it's easy to customize your post feed
            </p>
          </div>
        </div>
        <div className={styles.feature}>
          <div className={styles.left}>
            <h2>Share your knowledge with others</h2>
            <p>
              You can create posts in groups you are following and share your knowledge with others interested in same language
            </p>
          </div>
          <div className={styles.right}>
            <Image src="/createPost.png" width="auto" height="auto" />
          </div>
        </div>
        <div className={styles.feature}>
          <div className={styles.left}>
            <Image src="/savedPosts.png" width="auto" height="auto" />
          </div>
          <div className={styles.right}>
            <h2>Save posts for later user</h2>
            <p>
              Have you find some posts that will be helpful later, Just Save It, you can save all posts and see them later in your profile
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
