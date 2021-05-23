import Link from 'next/link'
import Image from 'next/image'
import {Button} from '../Button'
import styles from './NavBar.module.scss'

export const NavBar = () => {
	return (
		<nav className={styles.navBar}>
			<span className={styles.left}>
				<Image src="/logo.svg" width={120} height={30} />
				<span>
					<Link href='/nsto'><Button variant="textual">About</Button></Link>
					<Link href='/'><Button variant="textual">Plan</Button></Link>
					<Link href='/'><Button variant="textual">Contact</Button></Link>
				</span>
			</span>
			<span className={styles.right}>
				<Button variant="outlined">Log in</Button>
				<Button> <b>Sign up</b> </Button>
			</span>
		</nav>
	)
}
