import styles from './Button.module.scss'
import PropTypes from 'prop-types'

export const Button = ({
  variant="contained",
  size="normal",
  children,
  ...rest
}) => {
    return (
      <button className={`${styles.button} ${styles[size]} ${styles[variant]}`} {...rest}>{children}</button>
    )
}

Button.propTypes = {
  variant: PropTypes.oneOf(['outlined', 'contained', 'textual'])
}

