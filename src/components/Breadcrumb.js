import React from 'react'
import { Link } from 'react-router-dom'

const Breadcrumb = ({currentPage}) => {
  return (
    <div className="font-light flex space-x-4">
      <Link to="/">
        <span className="cursor-pointer text-blue-500">Home</span>
      </Link>
      <span>{'>'}</span>
      <Link to="/items">
        <span className="cursor-pointer text-blue-500">Items</span>
      </Link>
      <span>{'>'}</span>
      <span className="cursor-pointer">{currentPage}</span>
    </div>
  )
}

export default Breadcrumb
