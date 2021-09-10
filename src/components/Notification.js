import React from 'react'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  console.log(message)
  return (
    <div className="message">
      {message}
    </div>
  )
}


export default Notification