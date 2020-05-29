import React from 'react'
import waait from 'waait'
import { fireEvent, act, wait } from '@testing-library/react'
import { renderAndWait, runTestType, closeTestConductor } from '../utils'
import { orchestrator, conductorConfig } from '../utils/integration-testing/tryoramaIntegration'
import { HApp } from '../index.js'

const testDescription = 'Book Endpoints'

orchestrator.registerScenario(`${testDescription} Scenario`, async s => {
  let aliceInstance
  const configureNewTestInstance = async () => {
    const { alice } = await s.players({alice: conductorConfig}, true)
    aliceInstance = alice
    return { alice }
  }
  afterEach(() => closeTestConductor(aliceInstance))

  it(`Tests all ${testDescription} e2e. - Integration Test`, async () => {
    await configureNewTestInstance()
    const { getByText, getByLabelText, getByDisplayValue, getAllByText, queryByText } = await renderAndWait(<HApp />)
    const welcomeMsg = 'Welcome to your generated Happ UI'
    expect(getByText(welcomeMsg)).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(getByText('Book'))
    })
    await wait(() => getByText('Book Entry'))

    const book = {
      author: 'ut nulla quam',
      title: 'ipsam nobis cupiditate',
      topic: 'sed dignissimos debitis'
    }

    // create book
    act(() => {
      fireEvent.change(getByLabelText('author'), { target: { value: book.author } })
      fireEvent.change(getByLabelText('title'), { target: { value: book.title } })
      fireEvent.change(getByLabelText('topic'), { target: { value: book.topic } })
    })
    await act(async () => {
      fireEvent.click(getByText('Submit'))
      await waait(0)
    })

    await act(async () => await s.consistency())
    await act(async () => {
      fireEvent.click(getByText('Refetch Book List'))
      await waait(1000)
    })

    expect(getByText(book.author)).toBeInTheDocument()
    expect(getByText(book.title)).toBeInTheDocument()
    expect(getByText(book.topic)).toBeInTheDocument()

    const newBook = {
      author: 'incidunt accusantium sed',
      title: 'libero repudiandae esse',
      topic: 'blanditiis natus et'
    }

    // update book
    const editButton = getByText('Edit')
    await act(async () => {
      fireEvent.click(editButton)
      await waait(0)     
    })

    act(() => {
      fireEvent.change(getByDisplayValue(book.author), { target: { value: newBook.author } })
      fireEvent.change(getByDisplayValue(book.title), { target: { value: newBook.title } })
      fireEvent.change(getByDisplayValue(book.topic), { target: { value: newBook.topic } })
    })
    const submitButton = getAllByText('Submit')[1]
    
    await act(async () => {
      fireEvent.click(submitButton)
      await waait(0)
    })

    await act(async () => await s.consistency())
    
    await act(async () => {
      fireEvent.click(getByText('Refetch Book List'))
      await waait(1000)
    })

    expect(getByText(newBook.author)).toBeInTheDocument()
    expect(getByText(newBook.title)).toBeInTheDocument()
    expect(getByText(newBook.topic)).toBeInTheDocument()

    expect(queryByText(book.author)).not.toBeInTheDocument()
    expect(queryByText(book.title)).not.toBeInTheDocument()
    expect(queryByText(book.topic)).not.toBeInTheDocument()

    // delete book
    const removeButton = getByText('Remove')
    await act(async () => {
      fireEvent.click(removeButton)
      await waait(1000)
    })
    
    await act(async () => await s.consistency())

    await act(async () => {
      fireEvent.click(getByText('Refetch Book List'))
      await waait(1000)
    })

    expect(queryByText(newBook.author)).not.toBeInTheDocument()
    expect(queryByText(newBook.title)).not.toBeInTheDocument()
    expect(queryByText(newBook.topic)).not.toBeInTheDocument()
  })
})

runTestType(process.env.REACT_APP_TEST_TYPE, 'integration', orchestrator.run)
