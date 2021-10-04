import { usePopper } from 'react-popper';
import React, { useCallback, useState } from 'react';
import { Card } from '..';
import style from './DropDown.module.scss'


export const DropDown = ({
  target,
  targetClass,
  children
}) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  const [isOpen, setIsOpen] = useState(false)

  const handleIsOpen = useCallback(() => {
    setIsOpen(open => !open)
  }, [])

  return (
    <>
    <span className={`${style.target} ${targetClass}`} onClick={handleIsOpen} ref={setReferenceElement}>
      {target}
    {isOpen ?
      <div className={style.overlay}>
        <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
          <Card className="list">
            {children}
          </Card>
        </div>
      </div>
      :
      null
    }
    </span>
  </>
  )
}
