import {NavBar, Button} from '../uiCompents'
import styles from './NotLoggedIn.module.scss'
import Image from 'next/image'

export const NotLoggedIn = () => {
  return (
    <>
      <NavBar />
      <section className={styles.about}>
        <div className={styles.aboutLeft}>
          <h1>Social media for develpoers</h1>
          <p>Neki lepo tekst o aplikaciji koji nije previse kratak da bi mogao da se lomi u dva reda minimalno.</p>
          <Button> <b>Sign up</b> </Button>
        </div>
        <div className={styles.aboutRight}>
          <Image src="/bg.jpg" width="auto" height="auto" ></Image>
        </div>
      </section>
      <section className={styles.features}>
        <div className={styles.featuresHeader}>
          <h3>what we offer</h3>
          <Button variant="textual">See full list</Button> 
        </div>
        <div className={styles.featureList}>
          <div className={styles.feature}>
            <h4>feature 1</h4>
          </div>
          <div className={styles.feature}>
            <h4>feature 2</h4>
          </div>
          <div className={styles.feature}>
            <h4>feature 3</h4>
          </div>
        </div>
      </section>
      <section className={styles.features}>
        <h2>Naslov</h2>
        <p>text</p>
      </section>
      <footer className={styles.features}>
        <h2>Naslov</h2>
        <p>text</p>
      </footer>
    </>
  )
}
