import React, { useState } from "react";
const slidesData = [
  {
    type: "Restart",
    title: "will restart at second ",
    text: "new item text Restart ",
  },
  {
    type: "Prev",
    title: "will go forward to the next ",
    text: "new item text Prev",
  },
  {
    type: "Next",
    title: "will back to the last step",
    text: "new item text Next",
  },
];

function Slides() {
  const [index, setIndex] = useState("Restart");

  //
  const handleUpdate = (e) => {
    e.preventDefault();
    setIndex(e.target.value);
  };

  const [data, setData] = useState(slidesData[index]);

  return (
    <div>
      <div id="navigation" className="text-center">
        {slidesData.map((slide) => (
          <button
            onClick={(e) => handleUpdate(e)}
            value={slide.type}
            data-testid="button-restart"
            className="small outlined"
          >
            {slide.type}
          </button>
        ))}
      </div>
      {data?.map((item, index) => (
        <div key={item.id || index} id="slide" className="card text-center">
          <h1 data-testid="title">{item.title}</h1>
          <p data-testid="text">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export default Slides;

const AddingNewItems = () => {
  const [items, setItems] = useState([
    {
      id: "",
      task: "",
    },
  ]);

  const addItems = () => {};

  const handleSubmit = (e) => {};
  const deleteItem = (e) => {};
  return (
    <div className="add-new-item">
      <h2>To Do App</h2>
      <form action=" " onSubmit={handleSubmit}>
        <label htmlFor="task"></label>
        <input type="text" value="task" name="task" id="task" />
      </form>

      {items.map((item) => (
        <div className="item">
          <p>{item.task}</p> <button onClick={() => deleteItem(item)}></button>
        </div>
      ))}
    </div>
  );
};
