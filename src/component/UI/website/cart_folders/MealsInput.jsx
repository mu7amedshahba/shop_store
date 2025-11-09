import React, { useState } from 'react'

const MealsInput = React.forwardRef((props , ref) => {
    const [amount ,setAmount] = useState()
  return (
    <div className='input'>
      <label htmlFor={props.label.id}> {props.label}</label>
      <input ref={ref} {...props.input} />
    </div>
  )
}
)
export default MealsInput

