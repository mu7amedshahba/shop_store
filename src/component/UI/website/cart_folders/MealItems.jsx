import React from 'react'
import MealItemsForm from './MealItemsForm'

const MealItems = (props) => {
    const  price = `$${props.price.toFixed(2) }` 

    const addToCart = amount =>{}
  return (
    <div>
      <h2>{props.name}</h2>
    <div>{props.description}</div>
    <div> {price}</div>
    <MealItemsForm  onAddCart={addToCart}/>
    </div>
  )
}

export default MealItems
