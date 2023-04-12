import React from 'react'

interface AlertProps {
  children: React.ReactNode;
}

const Alert = ({ children }: AlertProps) => {
  return (
    <div className='alert alert-primary'>{children}</div>
  )
}

export default Alert
