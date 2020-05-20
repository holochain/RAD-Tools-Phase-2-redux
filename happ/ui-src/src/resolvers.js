import { createZomeCall } from './holochainClient'

const currentInstance = process.env.NODE_ENV === 'test' ? process.env.REACT_APP_TEST_INSTANCE_ID : process.env.REACT_APP_INSTANCE_ID
const dnaPath = zomeFunc => `${currentInstance}/zome/${zomeFunc}`
  
export const resolvers = {
  Query: {
    getBook: (_, { id }) =>
      createZomeCall(dnaPath('get_book'))({ id }),

    listBooks: () =>
      createZomeCall(dnaPath('list_books'))(),

    getUser: (_, { id }) =>
      createZomeCall(dnaPath('get_user'))({ id }),

    listUsers: () =>
      createZomeCall(dnaPath('list_users'))(),
  },

  Mutation: {
    createBook: (_, { bookInput }) =>
      createZomeCall(dnaPath('create_book'))({ book_input: bookInput }),

    updateBook: (_, { id, bookInput }) =>
      createZomeCall(dnaPath('update_book'))({ id, book_input: bookInput }),

    deleteBook: (_, { id }) =>
      createZomeCall(dnaPath('delete_book'))({ id }),

    createUser: (_, { userInput }) =>
      createZomeCall(dnaPath('create_user'))({ user_input: userInput }),

    updateUser: (_, { id, userInput }) =>
      createZomeCall(dnaPath('update_user'))({ id, user_input: userInput }),

    deleteUser: (_, { id }) =>
      createZomeCall(dnaPath('delete_user'))({ id }),
  }
}

export default resolvers
