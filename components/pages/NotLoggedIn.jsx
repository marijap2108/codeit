import {Card, NavBar} from '../uiComponents'
import styles from './NotLoggedIn.module.scss'
import Image from 'next/image'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'

export const NotLoggedIn = () => {
  return (
    <div id="home" className={styles.home}>
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
        <h2 id="features">Features</h2>
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
            <h2>Save posts for later use</h2>
            <p>
              Have you find some posts that will be helpful later, Just Save It, you can save all posts and see them later in your profile
            </p>
          </div>
        </div>
      </section>
      <section id="contact" className={styles.contact}>
        <Card className="contactCard">
          <h2>Contact information</h2>
          <p>
            Contact us for any help and suggestions, our team is available 24h.
          </p>
          <span><FiPhone /> +817 467346</span>
          <span><FiMail /> support@codeit.com</span>
          <span><FiMapPin /> 102 Street 4511 Mike</span>
        </Card>
      </section>
      <footer className={styles.footer}>
        <span>
          <a href="#home">
            <Image src="/logo.svg" width={120} height={30} />
          </a> 
          created by Marija Petrovic IT41
        </span>
        <span>
          Copyright © 2021–2022 Codeit
        </span>
      </footer>
    </div>
  )
}
