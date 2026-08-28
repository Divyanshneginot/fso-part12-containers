import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert severity="success" className="error">
      {message}
    </Alert>
  )
}

export default Notification