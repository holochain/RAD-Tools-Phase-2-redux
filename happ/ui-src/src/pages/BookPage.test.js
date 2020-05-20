import React from 'react'
import wait from 'waait'
import { fireEvent, act } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { renderAndWait } from '../utils'
import BookPage, { LIST_BOOKS_QUERY, CREATE_BOOK_MUTATION, UPDATE_BOOK_MUTATION, DELETE_BOOK_MUTATION } from './BookPage'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}))

const books = [
  {
    id: 1,
    author: 'esse repellat quisquam',
    title: 'recusandae alias consequuntur',
    topic: 'corporis repellat ratione'
  },
  {
    id: 2,
    author: 'ut sunt qui',
    title: 'amet iure ut',
    topic: 'libero qui recusandae'
  }
]

const book = {
  author: 'ut nulla quam',
  title: 'ipsam nobis cupiditate',
  topic: 'sed dignissimos debitis'
}

it('renders "Book" title', async () => {
  const mocks = []
  const { getByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <BookPage />
  </MockedProvider>)

  const title = getByText('Book Entry')
  expect(title).toBeInTheDocument()
})

it('renders a list of Books', async () => {
  const listMock = {
    request: {
      query: LIST_BOOKS_QUERY
    },
    result: {
      data: {
        listBooks: books
      }
    }
  }
  const mocks = [listMock]
  const { getAllByTestId } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <BookPage />
  </MockedProvider>)

  const bookCards = getAllByTestId('book-card')
  expect(bookCards).toHaveLength(books.length)
})

it('calls the create mutation', async () => {
  const createMock = {
    request: {
      query: CREATE_BOOK_MUTATION,
      variables: { bookInput: book }
    },
    newData: jest.fn(() => ({
      data: {
        createBook: {
          id: 1,
          ...book
        }
      }
    }))
  }

  const listMock = {
    request: {
      query: LIST_BOOKS_QUERY
    },
    result: {
      data: {
        listBooks: []
      }
    }
  }

  const mocks = [createMock, listMock, listMock]
  const { getByLabelText, getByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <BookPage />
  </MockedProvider>)

  act(() => {
    fireEvent.change(getByLabelText('author'), { target: { value: book.author } })
    fireEvent.change(getByLabelText('title'), { target: { value: book.title } })
    fireEvent.change(getByLabelText('topic'), { target: { value: book.topic } })
  })

  await act(async () => {
    fireEvent.click(getByText('Submit'))
    await wait(0)
  })

  expect(createMock.newData).toHaveBeenCalled()
})

it('calls the update mutation', async () => {
  const newBook = {
    author: 'incidunt accusantium sed',
    title: 'libero repudiandae esse',
    topic: 'blanditiis natus et'
  }

  const updateMock = {
    request: {
      query: UPDATE_BOOK_MUTATION,
      variables: { id: books[0].id, bookInput: newBook }
    },
    newData: jest.fn(() => ({
      data: {
        updateBook: {
          id: books[0].id,
          ...newBook
        }
      }
    }))
  }

  const listMock = {
    request: {
      query: LIST_BOOKS_QUERY
    },
    result: {
      data: {
        listBooks: books
      }
    }
  }

  const mocks = [updateMock, listMock, listMock]
  const { getByDisplayValue, getAllByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <BookPage />
  </MockedProvider>)

  const editButton = getAllByText('Edit')[0]

  act(() => {
    fireEvent.click(editButton)
  })

  act(() => {
    fireEvent.change(getByDisplayValue(books[0].author), { target: { value: newBook.author } })
    fireEvent.change(getByDisplayValue(books[0].title), { target: { value: newBook.title } })
    fireEvent.change(getByDisplayValue(books[0].topic), { target: { value: newBook.topic } })
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
      query: DELETE_BOOK_MUTATION,
      variables: { id: books[0].id }
    },
    newData: jest.fn(() => ({
      data: {
        deleteBook: {
          ...books[0]
        }
      }
    }))
  }

  const listMock = {
    request: {
      query: LIST_BOOKS_QUERY
    },
    result: {
      data: {
        listBooks: books
      }
    }
  }

  const mocks = [deleteMock, listMock, listMock]
  const { getAllByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <BookPage />
  </MockedProvider>)

  const removeButton = getAllByText('Remove')[0]

  await act(async () => {
    fireEvent.click(removeButton)
    await wait(0)
  })

  expect(deleteMock.newData).toHaveBeenCalled()
})
