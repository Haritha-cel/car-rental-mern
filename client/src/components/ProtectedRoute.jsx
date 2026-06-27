import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext()

  // If there is no user, kick them back to the home page
  if (!user) {
    return <Navigate to="/" replace />
  }

  // If user exists, render the child component (e.g., MyBookings)
  return children
}

export default ProtectedRoute