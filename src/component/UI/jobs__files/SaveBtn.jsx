import React from 'react'

const SaveBtn = ({ handleDataModel,
    dataState }) => {
    return (
        <div className="button">
            <button onClick={handleDataModel} >
                {dataState ? ' showMore' : ' show Less '}
            </button>
        </div>
    )
}

export default SaveBtn
