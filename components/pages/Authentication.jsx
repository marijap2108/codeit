import React, { useCallback, useState } from 'react'
import {Button} from '../uiComponents'
import styles from './Authentication.module.scss'

export const Authentication = ({
  isLogIn,
}) => {

  const [logIn, setLogIn] = useState(isLogIn)

  const toggleLogIn = useCallback(() => {
    setLogIn(currentLogIn => !currentLogIn)
  }, [])

	return (
    <form className={styles.authentication}>
      {logIn ?
        <>
          <label>
            Username:
            <input type="text" />
          </label>
          <label>
            Password:
            <input type="password" />
          </label>
          <Button>
            Log in
          </Button>
          <Button onClick={toggleLogIn}>
            Sign up
          </Button>
        </>
      :
        <>
        <label>
            Username:
            <input type="text" />
          </label>
          <label>
            Email:
            <input type="email" />
          </label>
          <label>
            Password:
            <input type="password" />
          </label>
          <Button>
            Sign up
          </Button>
          <Button onClick={toggleLogIn}>
            Log in
          </Button>
        </>
      }
    </form>
	)
}