import React, { useEffect, useState } from "react";
import jobs from "../../DateBase_files/dataContent.json";

const FilteredJobs = () => {
  const data = jobs.jobs;
  const TAGS = [...new Set(data.map((item) => item.title))];
// 
  const [tagsArray, setTagsArray] = useState(TAGS);
  const [activeTag, setActiveTag] = useState(TAGS[0]);
  const [activeData, setActiveData] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isNewTag, setIsNewTag] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter jobs based on active tag and search term
  useEffect(() => {
    let filteredJobs = data.filter((item) => item.title === activeTag);

    if (searchTerm) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.company?.name &&
            job.company.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          job.requirement?.some((req) =>
            req.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setActiveData(filteredJobs);
  }, [activeTag, searchTerm]);

  const handleTag = (tag) => {
    setActiveTag(tag);
    setSearchTerm("");
  };

  const handleNewTag = (value) => {
    setNewTag(value);
  };

  const submitTag = (e) => {
    e.preventDefault();
    const trimmed = newTag.trim();
    if (!trimmed || tagsArray.includes(trimmed)) return;
    setTagsArray((prev) => [trimmed, ...prev]);
    setActiveTag(trimmed);
    setNewTag("");
    setIsNewTag(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 to-cyan-950 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-80 bg-cyan-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              Job Categories
            </h2>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full px-4 py-2 rounded-lg border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {tagsArray.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleTag(tag)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    tag === activeTag
                      ? "bg-cyan-600 text-white font-medium"
                      : "bg-cyan-700 text-cyan-100 hover:bg-cyan-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Add New Tag */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setIsNewTag(!isNewTag)}
                className={`w-full px-4 py-3 rounded-lg transition-all ${
                  isNewTag
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-700 text-emerald-100 hover:bg-emerald-600"
                }`}
              >
                {isNewTag ? "Cancel" : "Add New Category"}
              </button>

              {isNewTag && (
                <form onSubmit={submitTag} className="mt-4 space-y-3">
                  <input
                    id="new-tag"
                    name="newTag"
                    value={newTag}
                    onChange={(e) => handleNewTag(e.target.value)}
                    placeholder="Enter new category"
                    className="w-full px-4 py-2 rounded-lg border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Add Category
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 bg-gray-50">
            <h1 className="text-2xl font-bold text-cyan-900 mb-6">
              {activeTag} Jobs ({activeData.length})
            </h1>

            {activeData.length > 0 ? (
              <div className="space-y-6">
                {activeData.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      {/* Company Header */}
                      <div className="flex items-start">
                        {item.company?.src && (
                          <img
                            width={80}
                            height={80}
                            className="w-20 h-20 object-contain mr-4"
                            src={item.company.src}
                            alt={`${item.company.name || "Company"} Logo`}
                          />
                        )}
                        <div>
                          <h2 className="text-xl font-bold text-cyan-800">
                            {item.title}
                          </h2>
                          <div className="flex items-center mt-1">
                            {item.company?.name && (
                              <p className="text-gray-700 mr-3">
                                {item.company.name}
                              </p>
                            )}
                            {item.location && (
                              <p className="text-sm text-gray-500 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
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
                                {item.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="mt-4">
                        <p className="text-gray-700">{item.description}</p>

                        {item.requirement?.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-medium text-gray-900">
                              Requirements:
                            </h3>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              {item.requirement.map((req, reqIndex) => (
                                <li
                                  key={`req-${reqIndex}`}
                                  className="text-gray-700"
                                >
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Salary and Apply */}
                      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-4 sm:mb-0">
                          {item.salary && (
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-emerald-600">
                                {item.salary.currency} {item.salary.range}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-x-3">
                          {item.company?.website && (
                            <a
                              href={item.company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            >
                              Visit Website
                            </a>
                          )}
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm
                    ? `No "${activeTag}" jobs match your search for "${searchTerm}"`
                    : `No jobs available in "${activeTag}" category`}
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilteredJobs;
