import styles from './Card.module.scss'

export const Card = ({
  onClick,
  style,
  children,
}) => {
    return (
      <div style={style} onClick={onClick} className={styles.card}>
        {children}
      </div>
    )
}
