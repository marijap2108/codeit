import styles from './Post.module.scss'
import { Card } from '../index'

export const Post = ({
  title,
	creatorName,
	time,
	body,
	votes,
	isUserCreator,
}) => {

  return(
    <Card>
			<div className={styles.header}>
				<img />
				<div className="text">
					<div className="title">{title}</div>
					<div className="data">{creatorName} | {time}</div>
				</div>
				<div className="dropdown">...</div>
			</div>
			<div className={styles.body}>
				{body}
			</div>
			<div className={styles.footer}>
				<div className="votes">
					^ {votes} v
				</div>
				<div className="media">
					Share Save Comment
				</div>
			</div>
		</Card>
	)
}