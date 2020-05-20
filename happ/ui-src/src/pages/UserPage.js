import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import gql from 'graphql-tag'
import { pick } from 'lodash/fp'
import { useQuery, useMutation } from '@apollo/react-hooks'
import './@type-page.css'

export const LIST_USERS_QUERY = gql`
  query ListUsers {
    listUsers {
      id
      avatarUrl
      name
    }
  }
`

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($userInput: UserInput) {
    createUser (userInput: $userInput) {
      id
      avatarUrl
      name
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: String, $userInput: UserInput) {
    updateUser (id: $id, userInput: $userInput) {
      id
      avatarUrl
      name
    }
  }
`

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: String) {
    deleteUser (id: $id) {
      id
      avatarUrl
      name
    }
  }
`

function UsersPage () {
  const { data } = useQuery(LIST_USERS_QUERY)

  const listUsers = (data && data.listUsers) || []

  const [createUser] = useMutation(CREATE_USER_MUTATION, { refetchQueries: [{ query: LIST_USERS_QUERY }] })
  const [updateUser] = useMutation(UPDATE_USER_MUTATION, { refetchQueries: [{ query: LIST_USERS_QUERY }] })
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, { refetchQueries: [{ query: LIST_USERS_QUERY }] })

  // the id of the user currently being edited
  const [editingId, setEditingId] = useState()
  
  const { push } = useHistory()

  return <div className='type-page'>
  <div className='background-block'/>
  <button className='button' onClick={() => push('/')}>Home Page</button>
  <br/>
    <h1>User Entry</h1>
    <h2>Endpoint Testing</h2>
    <UserForm
      formAction={({ userInput }) => createUser({ variables: { userInput } })}
      formTitle='Create User' />

    <div className='type-list'>
      {listUsers.map(user =>
        <UserRow
          key={user.id}
          user={user}
          editingId={editingId}
          setEditingId={setEditingId}
          deleteUser={deleteUser}
          updateUser={updateUser} />)}
    </div>
  </div>
}

function UserRow ({ user, editingId, setEditingId, updateUser, deleteUser }) {
  const { id } = user

  if (id === editingId) {
    return <UserForm
      user={user}
      formTitle='Update User'
      setEditingId={setEditingId}
      formAction={({ userInput }) => updateUser({ variables: { id, userInput } })} />
  }

  return <UserCard user={user} setEditingId={setEditingId} deleteUser={deleteUser} />
}

function UserCard ({ user: { id, avatarUrl, name }, setEditingId, deleteUser }) {
  return <div className='type-card' data-testid='user-card'>

    <div className='entry-field'><span className='field-label'>avatarUrl: </span><span className='field-content'>{avatarUrl}</span></div>
    <div className='entry-field'><span className='field-label'>name: </span><span className='field-content'>{name}</span></div>
    <br/>
    <button className='button' onClick={() => setEditingId(id)}>Edit</button>
    <button onClick={() => deleteUser({ variables: { id } })}>Remove</button>
  </div>
}

function UserForm ({ user = { avatarUrl: '', name: '' }, formTitle, formAction, setEditingId = () => {} }) {
  const [formState, setFormState] = useState(pick(['avatarUrl', 'name'], user))
  const { avatarUrl, name } = formState

  const setField = field => ({ target: { value } }) => setFormState(formState => ({
    ...formState,
    [field]: value
  }))

  const clearForm = () => {
    setFormState({
      avatarUrl: '',
      name: ''
    })
  }

  const onSubmit = () => {
    formAction({
      userInput: {
        ...formState
      }
    })
    setEditingId(null)
    clearForm()
  }

  const onCancel = () => {
    setEditingId(null)
    clearForm()
  }

  return <div className='type-form'>
    <h3>{formTitle}</h3>
    <div className='form-row'>
      <label htmlFor='avatarUrl'>avatarUrl</label>
      <input id='avatarUrl' name='avatarUrl' value={avatarUrl} onChange={setField('avatarUrl')} />
    </div>
    <div className='form-row'>
      <label htmlFor='name'>name</label>
      <input id='name' name='name' value={name} onChange={setField('name')} />
    </div>

    <div>
      <button onClick={onSubmit}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  </div>
}

export default UsersPage
