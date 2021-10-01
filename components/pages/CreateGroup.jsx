import { useCallback, useState } from 'react';
import Router from 'next/router'
import { Button } from '../uiComponents';

export const CreateGroup = ({handleCreateGroupClose}) => {

	const [createGroup, setCreateGroup] = useState({isOpen: false, title: '', description: ''})

	const handleCreateGroupChange = useCallback(({target}) => {
		setCreateGroup(group => ({...group, [target.id]: target.value}))
	}, [])

	const handleSubmitCreteGroup = useCallback(() => {
		fetch(`http://localhost:3000/api/group`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createGroup)
      })
      .then(response => response.json())
      .then(data => {
				Router.reload()
      })
	}, [createGroup])


	return (
		<form>
			<label>
				Title:
				<input value={createGroup.title} id="title" onChange={handleCreateGroupChange} />
			</label>
			<label>
				Description:
				<textarea value={createGroup.description} id="description" onChange={handleCreateGroupChange} />
			</label>
			<Button onClick={handleSubmitCreteGroup}>Submit</Button>
			<Button onClick={handleCreateGroupClose}>Cancel</Button>
		</form>
	)
}
