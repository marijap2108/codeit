import styles from './MenuBar.module.scss'
import Image from 'next/image'
import { FiSettings } from "react-icons/fi";

export const MenuBar = ({username}) => {

	return (
		<nav className={styles.menuBar}>
			<span className={styles.left}>
				<Image src="/logo.svg" width={120} height={30} />
			</span>
			<span className={styles.right}>
				<input />
				<div className={styles.user}>
					<img width="40" height="40" src={`https://avatars.dicebear.com/api/bottts/${username}.svg`} />
					{username}
				</div>
				 <FiSettings fontSize={18} />
			</span>
		</nav>
	)
}
