import styles from './Post.module.scss'
import { Card, DropDown } from '../index'
import { FiThumbsUp, FiThumbsDown, FiMoreHorizontal, FiShare2, FiSave, FiMessageSquare } from "react-icons/fi";
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WorkplaceShareButton
} from "react-share";
import { Modal } from '../Modal';
import { Button } from '../Button';
import Router from 'next/router'

export const Post = ({
	postId,
  title,
	creatorName,
	createdOn,
	body,
	votesUp,
	votesDown,
	userId,
	groupName,
	isUserCreator,
	editPosts,
	isSaved,
	deletePost,
}) => {

	const [url, setUrl] = useState('')
	const [saved, setSaved] = useState(isSaved)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalChildren, setModalChildren] = useState()

	const getTime = useMemo(() => {
		var difference = Date.now() - createdOn;

		var daysDifference = Math.floor(difference/1000/60/60/24);

		if (daysDifference > 1) {
			return `${daysDifference} days ago`
		}

		difference -= daysDifference*1000*60*60*24

		var hoursDifference = Math.floor(difference/1000/60/60);

		if (hoursDifference > 1) {
			return `${hoursDifference} hours ago`
		}

		difference -= hoursDifference*1000*60*60

		var minutesDifference = Math.floor(difference/1000/60);

		if (minutesDifference > 1) {
			return `${minutesDifference} minutes ago`
		}

		difference -= minutesDifference*1000*60

		var secondsDifference = Math.floor(difference/1000);

		return `${secondsDifference} seconds ago`
	}, [createdOn])

	const getVotes = useMemo(() => {

		let value = votesUp.length - votesDown.length

		if (value < 1000 && value > -1000) {
			return value
		}

		value = Math.round(value / 100) / 10 

		if (value < 1000 && value > -1000) {
			return `${value}k`
		}

		value = Math.round(value / 100) / 10 

		if (value < 100 && value > -100) {
			return `${value}m`
		}

		value = Math.round(value / 100) / 10 

		if (value < 100 && value > -100) {
			return `${value}t`
		}

	}, [votesUp, votesDown])

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false)
	}, [])

	const handleDeletePost = useCallback(() => {
		fetch(`http://localhost:3000/api/post?id=${postId}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
			handleCloseModal()
      deletePost(data)
    })
	}, [])

	const handleDeletePostModal = useCallback(() => {
		setIsModalOpen(true)
		setModalChildren(
			<form>
				<h3>Delete Post</h3>
				<Button onClick={handleDeletePost}>Yes</Button>
				<Button onClick={handleCloseModal}>No</Button>
			</form>
		)
	}, [])

	const handleEdit = useCallback(() => {
    Router.push({
      pathname: `/post/${postId}`,
			query: { edit: true },
    })
	}, [])

	const openPost = useCallback(() => {
    Router.push({
      pathname: `/post/${postId}`
    })
  }, [])

	const dropDownChildren = useMemo(() => {
		return isUserCreator ?
			<>
				<div onClick={handleEdit}>
					Edit
				</div>
				<div onClick={handleDeletePostModal}>
					Delete
				</div>
			</>
			:
			<>
				<div>
					Save
				</div>
				<div>
					Hide
				</div>
			</>
	}, [])

	const handleVote = useCallback((type) => () => {
		fetch(`http://localhost:3000/api/post`, {
			method: "PUT",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({type: type, id: postId})
		})    
		.then(response => response.json())
    .then(data => {
			editPosts(data)
    })
	}, [])

	const handleSavePost = useCallback(() => {
		fetch(`http://localhost:3000/api/user`, {
			method: "PUT",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({postId: postId})
		})    
		.then(response => response.json())
    .then(data => {
			setSaved(data.saved)
    })
	}, [])

	useEffect(() => {
		setUrl(window.location.href)
	}, [])

  return(
    <Card>
			<div className={styles.header}>
				<img width="24" height="24" src={`https://avatars.dicebear.com/api/bottts/${creatorName}.svg`} />
				<div className={styles.text}>
					<div className={styles.title}>{title}</div>
					<div className={styles.data}>{creatorName || 'user'} | {getTime} | {groupName}</div>
				</div>
				<DropDown 
					target={<FiMoreHorizontal />}
					children={dropDownChildren}
				/>
			</div>
			<div dangerouslySetInnerHTML={{ __html: body }} className={styles.body} />
			<div className={styles.footer}>
				<div className={styles.votes}>
					<FiThumbsUp onClick={handleVote('votesUp')} fill={votesUp?.includes(userId) ? "green" : "white"}/> 
						<span>{getVotes}</span> 
					<FiThumbsDown onClick={handleVote('votesDown')} fill={votesDown ?.includes(userId) ? "red" : "white"}/>
				</div>
				<div className={styles.media}>
					<DropDown
						target={<><FiShare2 /> Share</>}
						children={
							<>
								<EmailShareButton url={`${url}post/${postId}`}> Share on email </EmailShareButton> <br />
								<FacebookShareButton url={`${url}post/${postId}`}> Share on facebook </FacebookShareButton> <br />
								<LinkedinShareButton url={`${url}post/${postId}`}> Share on linkedIn </LinkedinShareButton> <br />
								<RedditShareButton url={`${url}post/${postId}`}> Share on reddit </RedditShareButton> <br />
								<TelegramShareButton url={`${url}post/${postId}`}> Share on telegram </TelegramShareButton> <br />
								<TwitterShareButton url={`${url}post/${postId}`}> Share on twitter </TwitterShareButton> <br />
								<WorkplaceShareButton url={`${url}post/${postId}`}> Share on workplace </WorkplaceShareButton> <br />
							</>
						}
					/>
					<span onClick={handleSavePost}>
						<FiSave fill={saved ? "lightseagreen" : "white"} /> Save
					</span>
					<span onClick={openPost}>
						<FiMessageSquare /> Comment
					</span>
				</div>
			</div>
			<Modal 
				open={isModalOpen}
				handleClose={handleCloseModal}
			>
				{modalChildren}
			</Modal>
		</Card>
	)
}