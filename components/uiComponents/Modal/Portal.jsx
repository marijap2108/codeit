import { useEffect, useState } from "react"
import ReactDOM from 'react-dom'

export const Portal = ({
  children,
}) => {
  const [element, setElement] = useState(null)

  useEffect(() => {
    document.body && setElement(ReactDOM.createPortal(children, document.body))
  }, [])
  
  return element
}
