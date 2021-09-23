import styles from './Card.module.scss'

export const Card = ({
  onClick,
  children,
}) => {
    return (
      <div onClick={onClick} className={styles.card}>
        {children}
      </div>
    )
}
