import styles from './MenuBar.module.scss'
import Image from 'next/image'
import { useCookies } from 'react-cookie';
import { FiSettings, FiSearch } from "react-icons/fi";
import { useCallback, useState, useMemo, useEffect } from 'react';
import Router from 'next/router'
import { DropDown, Modal } from '..';
import { CreateGroup } from '../../pages/CreateGroup';

export const MenuBar = ({isAdmin, username, groups}) => {

	const [cookies, setCookie] = useCookies(['codeItId'])
	const [search, setSearch] = useState('')
	const [searchStyle, setSearchStyle] = useState({maxWidth: '30%'})
	const [createGroup, setCreateGroup] = useState(false)

	useEffect(() => {
		if (localStorage.getItem('theme') === 'dark') {
		  document.body.classList.add('dark')
		}
	  }, [])

	const selectedGroup = useMemo(() => {
		return Router.query.filter
	}, [Router.query.filter])

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

	const handleFilterGroup = useCallback((id) => () => {
		if (id === selectedGroup) {
			Router.replace(`/`, undefined, { shallow: true });
		} else {
			Router.push({
				pathname: '/',
				query: id && { filter: id },
			})
		}
	}, [selectedGroup])

	const handleSwitchTheme = useCallback(() => {
		if (document.body.classList.contains('dark')) {
			localStorage.setItem('theme', 'light')
		} else {
			localStorage.setItem('theme', 'dark')
		}
		document.body.classList.toggle('dark')
	}, [])

	return (
		<>
			<nav className={styles.menuBar}>
				<span className={styles.left}>
					<Image onClick={onLogoClick} src="/logo.svg" width={120} height={30} />
					{groups ?
						<DropDown 
							target={groups?.find(group => group._id === selectedGroup)?.title || "All"}
							targetClass="selectableGroups"
						>
							<>
								{groups.map((group, index) => (
									<div onClick={handleFilterGroup(group._id)} key={`group_${index}`} title={group.title}>
										<span className="app__groups__content__item__text" >{group.title}</span>
										<div style={{backgroundColor: group.color}} className="flag" />
									</div>
								))}
							</>
						</DropDown>
					:
						null
					}
				</span>
				<span className={styles.right}>
					<input placeholder="Search" className={styles.search} style={searchStyle} value={search} onChange={onSearchChange} onKeyDown={handleEnter} onFocus={handleSearchFocus} onBlur={handleSearchBlur} />
					<FiSearch onClick={handleSearch} className={styles.searchIcon} />
					<div onClick={handleProfileClick} className={styles.user}>
						<img title={username} width="30" height="30" src={`https://avatars.dicebear.com/api/bottts/${username}.svg`} />
					</div>
						<DropDown
							target={<FiSettings fontSize={18} />}
							children={
								<>
									<div onClick={handleProfileClick}>Profile</div>
									{isAdmin ?
										<div onClick={handleCreateGroup}>Create Group</div>
									:
										null
									}
									<div onClick={handleSwitchTheme}>Switch theme</div>
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
