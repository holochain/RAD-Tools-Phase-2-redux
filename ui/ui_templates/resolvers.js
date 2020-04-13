import { createZomeCall } from './holochainClient'

export const resolvers = {
  Query: {
    getNote: (_, { id }) =>
      createZomeCall('/notes/notes/get_note')({ id }),

    listNotes: () =>
      createZomeCall('/notes/notes/list_notes')()
  },

  Mutation: {
    createNote: (_, { noteInput }) =>
      createZomeCall('/notes/notes/create_note')({ note_input: noteInput }),

    updateNote: (_, { id, noteInput }) =>
      createZomeCall('/notes/notes/update_note')({ id, note_input: noteInput }),

    removeNote: (_, { id }) =>
      createZomeCall('/notes/notes/remove_note')({ id })
  }
}

export default resolvers
