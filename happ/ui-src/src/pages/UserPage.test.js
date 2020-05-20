import React from 'react'
import wait from 'waait'
import { fireEvent, act } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { renderAndWait } from '../utils'
import UserPage, { LIST_USERS_QUERY, CREATE_USER_MUTATION, UPDATE_USER_MUTATION, DELETE_USER_MUTATION } from './UserPage'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}))

const users = [
  {
    id: 1,
    avatarUrl: 'eos itaque velit',
    name: 'omnis et porro'
  },
  {
    id: 2,
    avatarUrl: 'ut et ipsam',
    name: 'explicabo eligendi occaecati'
  }
]

const user = {
  avatarUrl: 'debitis et saepe',
  name: 'eum dicta eum'
}

it('renders "User" title', async () => {
  const mocks = []
  const { getByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <UserPage />
  </MockedProvider>)

  const title = getByText('User Entry')
  expect(title).toBeInTheDocument()
})

it('renders a list of Users', async () => {
  const listMock = {
    request: {
      query: LIST_USERS_QUERY
    },
    result: {
      data: {
        listUsers: users
      }
    }
  }
  const mocks = [listMock]
  const { getAllByTestId } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <UserPage />
  </MockedProvider>)

  const userCards = getAllByTestId('user-card')
  expect(userCards).toHaveLength(users.length)
})

it('calls the create mutation', async () => {
  const createMock = {
    request: {
      query: CREATE_USER_MUTATION,
      variables: { userInput: user }
    },
    newData: jest.fn(() => ({
      data: {
        createUser: {
          id: 1,
          ...user
        }
      }
    }))
  }

  const listMock = {
    request: {
      query: LIST_USERS_QUERY
    },
    result: {
      data: {
        listUsers: []
      }
    }
  }

  const mocks = [createMock, listMock, listMock]
  const { getByLabelText, getByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <UserPage />
  </MockedProvider>)

  act(() => {
    fireEvent.change(getByLabelText('avatarUrl'), { target: { value: user.avatarUrl } })
    fireEvent.change(getByLabelText('name'), { target: { value: user.name } })
  })

  await act(async () => {
    fireEvent.click(getByText('Submit'))
    await wait(0)
  })

  expect(createMock.newData).toHaveBeenCalled()
})

it('calls the update mutation', async () => {
  const newUser = {
    avatarUrl: 'eaque enim ipsum',
    name: 'inventore debitis libero'
  }

  const updateMock = {
    request: {
      query: UPDATE_USER_MUTATION,
      variables: { id: users[0].id, userInput: newUser }
    },
    newData: jest.fn(() => ({
      data: {
        updateUser: {
          id: users[0].id,
          ...newUser
        }
      }
    }))
  }

  const listMock = {
    request: {
      query: LIST_USERS_QUERY
    },
    result: {
      data: {
        listUsers: users
      }
    }
  }

  const mocks = [updateMock, listMock, listMock]
  const { getByDisplayValue, getAllByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <UserPage />
  </MockedProvider>)

  const editButton = getAllByText('Edit')[0]

  act(() => {
    fireEvent.click(editButton)
  })

  act(() => {
    fireEvent.change(getByDisplayValue(users[0].avatarUrl), { target: { value: newUser.avatarUrl } })
    fireEvent.change(getByDisplayValue(users[0].name), { target: { value: newUser.name } })
  })

  const submitButton = getAllByText('Submit')[1]

  await act(async () => {
    fireEvent.click(submitButton)
    await wait(0)
  })

  expect(updateMock.newData).toHaveBeenCalled()
})

it('calls the delete mutation', async () => {
  const deleteMock = {
    request: {
      query: DELETE_USER_MUTATION,
      variables: { id: users[0].id }
    },
    newData: jest.fn(() => ({
      data: {
        deleteUser: {
          ...users[0]
        }
      }
    }))
  }

  const listMock = {
    request: {
      query: LIST_USERS_QUERY
    },
    result: {
      data: {
        listUsers: users
      }
    }
  }

  const mocks = [deleteMock, listMock, listMock]
  const { getAllByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <UserPage />
  </MockedProvider>)

  const removeButton = getAllByText('Remove')[0]

  await act(async () => {
    fireEvent.click(removeButton)
    await wait(0)
  })

  expect(deleteMock.newData).toHaveBeenCalled()
})
