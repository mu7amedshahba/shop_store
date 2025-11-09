import { Spinner } from 'flowbite-react'
import React from 'react'

const SpinnerLoad = () => {
    return (

        <div className="flex justify-center items-center h-64">
            <Spinner aria-label="Loading data" size="xl" />
        </div>

    )
}

export default SpinnerLoad
