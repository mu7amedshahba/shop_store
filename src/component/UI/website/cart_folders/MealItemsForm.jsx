import React, { useRef, useState } from "react";
import MealsInput from "./MealsInput";

const MealItemsForm = () => {
    const [validAmount , setValidAmount] = useState()
  const amountInputRef = useRef();
    const amountValue = amountInputRef.current.value;
    const enteredAmount = +amountValue

 

//   
  const handleSubmitForm = (e) => {
    e.preventDefault();

       if(enteredAmount.trim().length === 0 || enteredAmount <  1 || enteredAmount > 5 )
      {
        setValidAmount(false)
        return
    }


    props.onAddCart(enteredAmount)

  };



  const addToCart = amount =>{

  }
  return (
    <form onSubmit={handleSubmitForm}>
      <MealsInput
      
        ref={amountInputRef}
        label="amount"
        input={{
            id:'amount',
          type: "number",
          min: "1",
          max: "5",
          step: "1",
          value:amountValue
        }}
      />
      <button > +Add </button>
      {!validAmount &&  <p>Please add amount value between 1 - 5</p> }
    </form>
  );
};

export default MealItemsForm;
