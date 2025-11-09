import React, { useState } from 'react'
import jobs from '../DateBase_files/dataContent.json'
import JobsContent from './jobs__files/JobsContent'
import SaveBtn from './jobs__files/SaveBtn'

const JobsPage = () => {
    const [dataState, setDateState] = useState(true)
    const allJobs = dataState ? jobs.jobs : jobs.jobs.slice(0, 4)

    const handleDataModel = () => {
        setDateState(!dataState)
    }
    return (
        <div className=' jobs-page h-full p-8 flex items-center justify-between gap-8 flex-wrap rounded bg-blue-100   m-auto'>
            <JobsContent allJobs={allJobs} />
            
            <SaveBtn handleDataModel={handleDataModel}
                dataState={dataState} />
        </div>
    )
}

export default JobsPage
