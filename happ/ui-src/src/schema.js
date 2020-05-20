import gql from 'graphql-tag'

export default gql`
type Book {
  id: ID
  author: String
  title: String
  topic: String
}

input BookInput {
  author: String
  title: String
  topic: String      
}

type User {
  id: ID
  avatarUrl: String
  name: String
}

input UserInput {
  avatarUrl: String
  name: String      
}

type Query {
  getBook(id: ID): Book
  listBooks: [Book]
  getUser(id: ID): User
  listUsers: [User]
}

type Mutation {
  createBook(bookInput: BookInput): Book
  updateBook(id: ID, bookInput: BookInput): Book
  deleteBook(id: ID): Book
  createUser(userInput: UserInput): User
  updateUser(id: ID, userInput: UserInput): User
  deleteUser(id: ID): User
}
`
