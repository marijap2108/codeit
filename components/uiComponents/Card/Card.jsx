import styles from './Card.module.scss'

export const Card = ({
  onClick,
  style,
  className,
  children,
}) => {
    return (
      <div style={style} onClick={onClick} className={`${styles.card} ${className}`}>
        {children}
      </div>
    )
}
