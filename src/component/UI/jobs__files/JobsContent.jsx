import React from 'react'
import JobCard from './JobCard'

const JobsContent = ({ allJobs }) => {
    return (
        <div className={`flex  flex-wrap gap-x-2 gap-y-8 justify-evenly items-stretch `}>
            {
                allJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))
            }
        </div>
    )
}

export default JobsContent
