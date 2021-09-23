import styles from './Post.module.scss'
import { Card } from '../index'
import { FiThumbsUp, FiThumbsDown, FiMoreHorizontal, FiShare2, FiSave, FiMessageSquare } from "react-icons/fi";
import { useCallback, useMemo } from 'react';

export const Post = ({
  title,
	creatorName,
	createdOn,
	body,
	votesUp,
	votesDown,
	userId,
	groupName,
	isUserCreator,
	openPost,
}) => {

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

	const handleVoteUp = useCallback(() => {

	}, [])

	const handleVoteDown = useCallback(() => {
		
	}, [])

  return(
    <Card>
			<div className={styles.header}>
				<img width="24" height="24" src={`https://avatars.dicebear.com/api/bottts/${creatorName}.svg`} />
				<div className={styles.text}>
					<div className={styles.title}>{title}</div>
					<div className={styles.data}>{creatorName || 'user'} | {getTime} | {groupName}</div>
				</div>
				<FiMoreHorizontal />
			</div>
			<div className={styles.body}>
				{body}
			</div>
			<div className={styles.footer}>
				<div className={styles.votes}>
					<FiThumbsUp onClick={handleVoteUp} fill={votesUp?.includes(userId) ? "green" : "white"}/> 
						<span>{getVotes}</span> 
					<FiThumbsDown onClick={handleVoteDown} fill={votesDown ?.includes(userId) ? "red" : "white"}/>
				</div>
				<div className={styles.media}>
					<span>
						<FiShare2 /> Share
					</span>
					<span>
						<FiSave /> Save
					</span>
					<span onClick={openPost}>
						<FiMessageSquare /> Comment
					</span>
				</div>
			</div>
		</Card>
	)
}