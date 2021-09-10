import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('rendering tests', () => {    
    
    let component

    const user = {
        "token": "helintoken",
        "username": "heli",
        "name": "heli"
    }

    const blog = {
        title: "kuusi",
        author: "aistia",
        url: 'kuusiaistia.fi', 
        likes: 6,
        user: user
      }

      const mockHandler = jest.fn()

beforeEach(() => {

      component = render(
        <Blog blog={blog} addLike={mockHandler} />

      )

      component.debug()
    })

    test('renders content', () => {
        expect(component.container).toHaveTextContent(
          'kuusi'
        )
        
        const url = component.container.querySelector('url')
        const likes = component.container.querySelector('likes')

        expect(url).toBe(null)
        expect(likes).toBe(null)
    })
  
    test('renders all data when view is clicked', () => {
      const button = component.getByText('view')
      fireEvent.click(button)
      
      const ta = component.container.querySelector('#blogTa')
      const url = component.container.querySelector('#url')
      const likes = component.container.querySelector('#likes')

      expect (ta).toBeDefined()
      expect(url).toBeDefined()
      expect(likes).toBeDefined()
      
    })

    test('clicking like twice', () => {
        const button = component.getByText('like')
        fireEvent.click(button)
        fireEvent.click(button)

        expect(mockHandler.mock.calls.length).toBe(2)
    })
  
})