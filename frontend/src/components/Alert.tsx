import React from 'react'

interface AlertProps {
  children: React.ReactNode;
  onClose?: () => void;
}

const Alert = ({ children, onClose }: AlertProps) => {
  return (
    <div className='alert alert-danger alert-dismissible fade show' data-testid="alert" >
      {children}
      <button type="button" className="btn-close" onClick={onClose} data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}

export default Alert
