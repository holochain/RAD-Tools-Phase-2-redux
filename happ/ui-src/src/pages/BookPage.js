import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import gql from 'graphql-tag'
import { pick } from 'lodash/fp'
import { useQuery, useMutation } from '@apollo/react-hooks'
import './@type-page.css'

export const LIST_BOOKS_QUERY = gql`
  query ListBooks {
    listBooks {
      id
      author
      title
      topic
    }
  }
`

export const CREATE_BOOK_MUTATION = gql`
  mutation CreateBook($bookInput: BookInput) {
    createBook (bookInput: $bookInput) {
      id
      author
      title
      topic
    }
  }
`

export const UPDATE_BOOK_MUTATION = gql`
  mutation UpdateBook($id: String, $bookInput: BookInput) {
    updateBook (id: $id, bookInput: $bookInput) {
      id
      author
      title
      topic
    }
  }
`

export const DELETE_BOOK_MUTATION = gql`
  mutation DeleteBook($id: String) {
    deleteBook (id: $id) {
      id
      author
      title
      topic
    }
  }
`

function BooksPage () {
  const { data } = useQuery(LIST_BOOKS_QUERY)

  const listBooks = (data && data.listBooks) || []

  const [createBook] = useMutation(CREATE_BOOK_MUTATION, { refetchQueries: [{ query: LIST_BOOKS_QUERY }] })
  const [updateBook] = useMutation(UPDATE_BOOK_MUTATION, { refetchQueries: [{ query: LIST_BOOKS_QUERY }] })
  const [deleteBook] = useMutation(DELETE_BOOK_MUTATION, { refetchQueries: [{ query: LIST_BOOKS_QUERY }] })

  // the id of the book currently being edited
  const [editingId, setEditingId] = useState()
  
  const { push } = useHistory()

  return <div className='type-page'>
  <div className='background-block'/>
  <button className='button' onClick={() => push('/')}>Home Page</button>
  <br/>
    <h1>Book Entry</h1>
    <h2>Endpoint Testing</h2>
    <BookForm
      formAction={({ bookInput }) => createBook({ variables: { bookInput } })}
      formTitle='Create Book' />

    <div className='type-list'>
      {listBooks.map(book =>
        <BookRow
          key={book.id}
          book={book}
          editingId={editingId}
          setEditingId={setEditingId}
          deleteBook={deleteBook}
          updateBook={updateBook} />)}
    </div>
  </div>
}

function BookRow ({ book, editingId, setEditingId, updateBook, deleteBook }) {
  const { id } = book

  if (id === editingId) {
    return <BookForm
      book={book}
      formTitle='Update Book'
      setEditingId={setEditingId}
      formAction={({ bookInput }) => updateBook({ variables: { id, bookInput } })} />
  }

  return <BookCard book={book} setEditingId={setEditingId} deleteBook={deleteBook} />
}

function BookCard ({ book: { id, author, title, topic }, setEditingId, deleteBook }) {
  return <div className='type-card' data-testid='book-card'>

    <div className='entry-field'><span className='field-label'>author: </span><span className='field-content'>{author}</span></div>
    <div className='entry-field'><span className='field-label'>title: </span><span className='field-content'>{title}</span></div>
    <div className='entry-field'><span className='field-label'>topic: </span><span className='field-content'>{topic}</span></div>
    <br/>
    <button className='button' onClick={() => setEditingId(id)}>Edit</button>
    <button onClick={() => deleteBook({ variables: { id } })}>Remove</button>
  </div>
}

function BookForm ({ book = { author: '', title: '', topic: '' }, formTitle, formAction, setEditingId = () => {} }) {
  const [formState, setFormState] = useState(pick(['author', 'title', 'topic'], book))
  const { author, title, topic } = formState

  const setField = field => ({ target: { value } }) => setFormState(formState => ({
    ...formState,
    [field]: value
  }))

  const clearForm = () => {
    setFormState({
      author: '',
      title: '',
      topic: ''
    })
  }

  const onSubmit = () => {
    formAction({
      bookInput: {
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
      <label htmlFor='author'>author</label>
      <input id='author' name='author' value={author} onChange={setField('author')} />
    </div>
    <div className='form-row'>
      <label htmlFor='title'>title</label>
      <input id='title' name='title' value={title} onChange={setField('title')} />
    </div>
    <div className='form-row'>
      <label htmlFor='topic'>topic</label>
      <input id='topic' name='topic' value={topic} onChange={setField('topic')} />
    </div>

    <div>
      <button onClick={onSubmit}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  </div>
}

export default BooksPage
