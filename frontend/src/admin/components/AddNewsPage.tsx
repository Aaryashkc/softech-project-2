import React from 'react'

const AddNewsPage:React.FC = () => {
  return (
    <div>
      <h1>Add News</h1>
      <form>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" required />
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" required />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" required></textarea>
        </div>
        <button type="submit">Add Event</button>
      </form>
    </div>
  )
}

export default AddNewsPage
