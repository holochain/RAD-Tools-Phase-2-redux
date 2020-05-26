import React from 'react'
import waait from 'waait'
import { fireEvent, act, wait } from '@testing-library/react'
import { renderAndWait, runTestType } from '../utils'
import { orchestrator, conductorConfig } from '../utils/integration-testing/tryoramaIntegration'
import { HApp } from '../index.js'

const testDescription = 'Book Endpoints'

orchestrator.registerScenario(`${testDescription} Scenario`, async s => {
  it('Arrives at Book Entries Page with Display Title', async () => {
    // const { alice } = await s.players({ "localhost:9000": { alice: conductorConfig } })
    const { alice } = await s.players({alice: conductorConfig}, true)
    // const { getByText, getByLabelText, getByDisplayValue, getAllByText, debug } = await renderAndWait(<HApp />)
    // const welcomeMsg = 'Welcome to your generated Happ UI'
    // expect(getByText(welcomeMsg)).toBeInTheDocument()
    
    // await act(async () => {
    //   fireEvent.click(getByText('Book'))
    // })
    // expect(getByText('Book Entry')).toBeInTheDocument()

    // const book = {
    //   author: 'ut nulla quam',
    //   title: 'ipsam nobis cupiditate',
    //   topic: 'sed dignissimos debitis'
    // }

    // // create book
    // act(() => {
    //   fireEvent.change(getByLabelText('author'), { target: { value: book.author } })
    //   fireEvent.change(getByLabelText('title'), { target: { value: book.title } })
    //   fireEvent.change(getByLabelText('topic'), { target: { value: book.topic } })
    // })
    // await act(async () => {
    //   fireEvent.click(getByText('Submit'))
    //   await waait(0)
    // })

    // await s.consistency()
    // expect(getByText(book.author)).toBeInTheDocument()
    // expect(getByText(book.title)).toBeInTheDocument()
    // expect(getByText(book.topic)).toBeInTheDocument()


    // const newBook = {
    //   author: 'incidunt accusantium sed',
    //   title: 'libero repudiandae esse',
    //   topic: 'blanditiis natus et'
    // }

    // // update book
    // const editButton = getAllByText('Edit')[0]

    // act(() => {
    //   fireEvent.click(editButton)
    // })
  
    // act(() => {
    //   fireEvent.change(getByDisplayValue(book.author), { target: { value: newBook.author } })
    //   fireEvent.change(getByDisplayValue(book.title), { target: { value: newBook.title } })
    //   fireEvent.change(getByDisplayValue(book.topic), { target: { value: newBook.topic } })
    // })
  
    // const submitButton = getAllByText('Submit')[1]
  
    // await act(async () => {
    //   fireEvent.click(submitButton)
    //   await wait(0)
    // })

    // await s.consistency()
    // expect(getByText(newBook.author)).toBeInTheDocument()
    // expect(getByText(newBook.title)).toBeInTheDocument()
    // expect(getByText(newBook.topic)).toBeInTheDocument()

    // // delete book
    // const removeButton = getAllByText('Remove')[0]
    // await act(async () => {
    //   fireEvent.click(removeButton)
    //   await wait(0)
    // })

    // await s.consistency()
    // expect(getByText(newBook.author)).not.toBeInTheDocument()
    // expect(getByText(newBook.title)).not.toBeInTheDocument()
    // expect(getByText(newBook.topic)).not.toBeInTheDocument()

    // debug()
    await alice.kill()
  })
})

runTestType(process.env.REACT_APP_TEST_TYPE, 'integration', orchestrator.run)
