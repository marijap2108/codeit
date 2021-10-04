import { useCallback, useState } from 'react';
import Router from 'next/router'
import { Button } from '../uiComponents';

export const CreateGroup = ({handleCreateGroupClose, group}) => {

	const [createGroup, setCreateGroup] = useState(group ? {isOpen: false, title: group.title, description: group.description} : {isOpen: false, title: '', description: ''})

	const handleCreateGroupChange = useCallback(({target}) => {
		setCreateGroup(group => ({...group, [target.id]: target.value}))
	}, [])

	const handleSubmit = useCallback(() => {
		if (group) {
			fetch(`http://localhost:3000/api/group`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...createGroup, id: group._id})
      })
      .then(response => response.json())
      .then(data => {
				Router.reload()
      })
		} else {
			fetch(`http://localhost:3000/api/group`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createGroup)
      })
      .then(response => response.json())
      .then(data => {
				Router.reload()
      })
		}
	}, [createGroup])


	return (
		<form className="groupModal">
			<h2>{group ? 'Edit Group' : 'Create Group'}</h2>
			<label>
				Title:
				<input value={createGroup.title} id="title" onChange={handleCreateGroupChange} />
			</label>
			<label>
				Description:
				<textarea value={createGroup.description} id="description" onChange={handleCreateGroupChange} />
			</label>
			<Button onClick={handleSubmit}>Submit</Button>
			<Button onClick={handleCreateGroupClose}>Cancel</Button>
		</form>
	)
}
