import styles from './Button.module.scss'
import PropTypes from 'prop-types'

export const Button = ({
  variant="contained",
  size="normal",
  children,
}) => {
    return (
      <button className={`${styles.button} ${styles[size]} ${styles[variant]}`}>{children}</button>
    )
}

Button.propTypes = {
  variant: PropTypes.oneOf(['outlined', 'contained', 'textual'])
}

