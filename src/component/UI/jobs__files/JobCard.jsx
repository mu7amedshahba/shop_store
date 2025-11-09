import React from "react";

const JobCard = ({ job }) => {
  return (
    <div className="job-card w-full max-w-md border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden">
      {/* Company Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-start gap-4">
          {job.company?.logo && (
            <img
              src={job.company.logo}
              alt={`${job.company.name} logo`}
              className="w-12 h-12 object-contain rounded-lg border border-gray-200"
            />
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
            <div className="flex items-center mt-1">
              {job.company?.name && (
                <p className="text-gray-700 mr-3">{job.company.name}</p>
              )}
              {job.postedDate && (
                <p className="text-sm text-gray-500">
                  {new Date(job.postedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="px-6 py-4">
        <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

        {/* Requirements */}
        {job.requirements?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Requirements:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {job.requirements.map((req, index) => (
                <li key={index} className="text-sm">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Location and Type */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {job.type}
              </span>
            </div>

            {/* Salary */}
            {job.salary && (
              <p className="text-lg font-bold text-gray-900">
                <span>{job.salary.currency}</span>
                <span> {job.salary.range}</span>
              </p>
            )}
          </div>

          {/* Apply Button */}
          <div className="mt-4">
            <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
