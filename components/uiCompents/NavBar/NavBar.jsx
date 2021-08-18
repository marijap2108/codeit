import Link from 'next/link'
import Image from 'next/image'
import {Button} from '../Button'
import styles from './NavBar.module.scss'
import { useCallback, useState } from 'react'
import { Modal } from '../Modal/Modal'
import { Authentication } from '../../pages/Authentication'

export const NavBar = () => {

	const [open, setOpen] = useState(false)
	const [isLogIn, setIsLogIn] = useState(false)

	const openLogIn = useCallback(() => {
		setIsLogIn(true)
		setOpen(true)
	}, [])

	const openSignUp = useCallback(() => {
		setIsLogIn(false)
		setOpen(true)
	}, [])

	const handleClose = useCallback(() => {
		setOpen(false)
	}, [])

	return (
		<nav className={styles.navBar}>
			<span className={styles.left}>
				<Image src="/logo.svg" width={120} height={30} />
				<span>
					<Link href='/'><Button variant="textual">About</Button></Link>
					<Link href='/'><Button variant="textual">Plan</Button></Link>
					<Link href='/'><Button variant="textual">Contact</Button></Link>
				</span>
			</span>
			<span className={styles.right}>
				<Button variant="outlined" onClick={openLogIn}>Log in</Button>
				<Button onClick={openSignUp}> <b>Sign up</b> </Button>
			</span>
			<Modal open={open} handleClose={handleClose}>
				<Authentication isLogIn={isLogIn} />
			</Modal>
		</nav>
	)
}
