import { useCallback, useState } from 'react';
import Router from 'next/router'
import { Button } from '../uiComponents';

export const SearchUsers = ({handleClose}) => {

  const [searchValue, setSearchValue] = useState('')
  const [users, setUsers] = useState([])

	const handleSearchValueChange = useCallback(({target}) => {
		setSearchValue(target.value)
	}, [])

	const handleSubmit = useCallback(() => {
    fetch(`http://localhost:3000/api/users?username=${searchValue}`, {
      method: "GET",
    })
    .then(response => response.json())
    .then(data => {
      setUsers(data)
    })
	}, [searchValue])

  const handleOpenUser = useCallback((id) => () => {
    Router.push({
			pathname: `/user/${id}`,
		}).then(() => {
      Router.reload()
    })
  }, [])

	return (
		<div className="searchUsers">
      <div className="searchUsers__search">
			  <input value={searchValue}  onChange={handleSearchValueChange} />
        <Button onClick={handleSubmit}>Search</Button>
      </div>
      <div className="list">
        {users.map((user, index) => (
          <div onClick={handleOpenUser(user._id)} className="userSearch__list__item" key={`user_${index}`}>
            {user.username}
          </div>
        ))}
      </div>
		</div>
	)
}
