import styles from './MenuBar.module.scss'
import Image from 'next/image'
import { useCookies } from 'react-cookie';
import { FiSettings } from "react-icons/fi";
import { useCallback, useEffect, useState } from 'react';
import Router from 'next/router'
import { DropDown } from '..';

export const MenuBar = () => {

	const [cookies, removeCookie] = useCookies(['codeItId'])
	const [search, setSearch] = useState('')
	const [username, setUsername] = useState('')

	const onSearchChange = useCallback(({ target }) => {
		setSearch(target.value)
	}, [])

	const handleEnter = useCallback((e) => {
		if (e.key === "Enter") {
			Router.push({
				pathname: '/',
				query: search && { search: search },
			})
		} 
	}, [search])

	const handleProfileClick = useCallback(() => {
		Router.push({
			pathname: `/user/${cookies.codeItId}`,
		})
	}, [])

	const handleLogOut = useCallback(() => {
		removeCookie("codeItId")
		Router.push({
			pathname: '/'
		})
	}, [])

	const handleCreateGroup = useCallback(() => {
		
	}, [])

	const onLogoClick = useCallback(() => {
		Router.push({
			pathname: `/`,
		})
	}, [])

	useEffect(() => {
		setUsername(sessionStorage.getItem('username'))
	}, [])

	return (
		<nav className={styles.menuBar}>
			<span onClick={onLogoClick} className={styles.left}>
				<Image src="/logo.svg" width={120} height={30} />
			</span>
			<span className={styles.right}>
				<input value={search} onChange={onSearchChange} onKeyDown={handleEnter} />
				<div onClick={handleProfileClick} className={styles.user}>
					<img width="40" height="40" src={`https://avatars.dicebear.com/api/bottts/${username}.svg`} />
					{username}
				</div>
					<DropDown
						target={<FiSettings fontSize={18} />}
						children={
							<>
								<div onClick={handleProfileClick}>Profile</div>
								<div onClick={handleCreateGroup}>Create Group</div>
								<div>Switch theme</div>
								<div onClick={handleLogOut}>Log Out</div>
							</>
						}
					/>
			</span>
		</nav>
	)
}
