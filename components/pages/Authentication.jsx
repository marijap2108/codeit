import React, { useCallback, useState } from 'react'
import {Button} from '../uiComponents'
import styles from './Authentication.module.scss'
import { useCookies } from 'react-cookie';
import Router from 'next/router'

export const Authentication = ({
  isLogIn,
}) => {

  const initialForm = {username: "", email: "", password: ""}

  const [logIn, setLogIn] = useState(isLogIn)
  const [form, setForm] = useState(initialForm)
  const [_cookies, setCookie] = useCookies(['codeItId'])

  const changeValue = useCallback(({ target }) => {
    setForm(curForm => ({...curForm, [target.id]: target.value}))
  }, [])

  const toggleLogIn = useCallback(() => {
    setForm(initialForm)
    setLogIn(currentLogIn => !currentLogIn)
  }, [])

  const submitLogIn = useCallback(() => {
    fetch(`http://localhost:3000/api/user?username=${form.username}&password=${form.password}`,{
      method: "GET"
    }) 
    .then(response => response.json())
    .then(data => {
      setCookie('codeItId', data._id, { path: '/' })
      Router.reload(window.location.pathname)
    })
  }, [form])

  const submitSignIn = useCallback(() => {
    fetch("http://localhost:3000/api/user", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(response => response.json())
    .then(data => {
      setCookie('codeItId', data._id, { path: '/' })
      Router.reload(window.location.pathname)
    })
  }, [form])

	return (
    <form className={styles.authentication}>
      {logIn ?
        <>
          <label>
            Username:
            <input onChange={changeValue} id="username" value={form.username} type="text" />
          </label>
          <label>
            Password:
            <input onChange={changeValue} id="password" value={form.password} type="password" />
          </label>
          <Button onClick={submitLogIn}>
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
            <input onChange={changeValue} id="username" value={form.username} type="text" />
          </label>
          <label>
            Email:
            <input onChange={changeValue} id="email" value={form.email} type="email" />
          </label>
          <label>
            Password:
            <input onChange={changeValue} id="password" value={form.password} type="password" />
          </label>
          <Button onClick={submitSignIn}>
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