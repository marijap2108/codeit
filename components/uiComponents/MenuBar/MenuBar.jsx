import styles from './MenuBar.module.scss'
import Image from 'next/image'
import { useCookies } from 'react-cookie';
import { FiSettings, FiSearch } from "react-icons/fi";
import { useCallback, useEffect, useState } from 'react';
import Router from 'next/router'
import { DropDown, Modal } from '..';
import { CreateGroup } from '../../pages/CreateGroup';

export const MenuBar = () => {

	const [cookies, setCookie] = useCookies(['codeItId'])
	const [search, setSearch] = useState('')
	const [searchStyle, setSearchStyle] = useState({maxWidth: '30%'})
	const [username, setUsername] = useState('')
	const [createGroup, setCreateGroup] = useState(false)

	const onSearchChange = useCallback(({ target }) => {
		setSearch(target.value)
	}, [])

	const handleSearchFocus = useCallback(() => {
		setSearchStyle({maxWidth: '100%'})
	}, [])

	const handleSearchBlur = useCallback(() => {
		setSearchStyle({maxWidth: '30%'})
	}, [])

	const handleEnter = useCallback((e) => {
		if (e.key === "Enter") {
			Router.push({
				pathname: '/',
				query: search && { search: search },
			})
		} 
	}, [search])

	const handleSearch = useCallback(() => {
		if (search) {
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
		setCookie("codeItId", "", {expires: 0})
		Router.reload()
	}, [])

	const handleCreateGroup = useCallback(() => {
		setCreateGroup(true)
	}, [])

	const handleCreateGroupClose = useCallback(() => {
		setCreateGroup(false)
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
		<>
			<nav className={styles.menuBar}>
				<span onClick={onLogoClick} className={styles.left}>
					<Image src="/logo.svg" width={120} height={30} />
				</span>
				<span className={styles.right}>
					<input placeholder="Search" className={styles.search} style={searchStyle} value={search} onChange={onSearchChange} onKeyDown={handleEnter} onFocus={handleSearchFocus} onBlur={handleSearchBlur} />
					<FiSearch onClick={handleSearch} className={styles.searchIcon} />
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
			<Modal
				open={createGroup}
				handleClose={handleCreateGroupClose}
			>
				<CreateGroup handleCreateGroupClose={handleCreateGroupClose} />
			</Modal>
		</>
	)
}
