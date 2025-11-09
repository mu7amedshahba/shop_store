import React from 'react';

const FormFiles = () => {
    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Your Files</h2>
            
            <form action="backend_file" noValidate target='_blank' className="space-y-6">
                {/* Name Input */}
                <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id='name'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                        type="text"
                        name='name'
                        placeholder="John Doe"
                        required
                    />
                    <p className="text-xs text-gray-500">Enter your full name as it appears on official documents</p>
                </div>

                {/* Email Input */}
                <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        id='email'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                        type="email"
                        name='email'
                        placeholder="john@example.com"
                        required
                    />
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        id='password'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                        type="password"
                        name='password'
                        placeholder="••••••••"
                        required
                        minLength="8"
                    />
                    <p className="text-xs text-gray-500">Minimum 8 characters</p>
                </div>

                {/* File Input */}
                <div className="space-y-1">
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                        Upload File <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id="file"
                                        name="file"
                                        type="file"
                                        className="sr-only"
                                        required
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOC, JPG up to 10MB</p>
                        </div>
                    </div>
                </div>

                {/* Date and Time Group */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Date Input */}
                    <div className="space-y-1">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            id='date'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            type="date"
                            name='date'
                            required
                        />
                    </div>

                    {/* Month Input */}
                    <div className="space-y-1">
                        <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                            Month
                        </label>
                        <input
                            id='month'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            type="month"
                            name='month'
                            required
                        />
                    </div>

                    {/* Time Input */}
                    <div className="space-y-1">
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                            Time
                        </label>
                        <input
                            id='time'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            type="time"
                            name='time'
                            required
                        />
                    </div>
                </div>

                {/* Radio Buttons */}
                <fieldset className="space-y-2">
                    <legend className="text-sm font-medium text-gray-700">Document Type <span className="text-red-500">*</span></legend>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center">
                            <input
                                id='radio-one'
                                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300'
                                type='radio'
                                name='radio-group'
                                value="personal"
                                required
                            />
                            <label htmlFor='radio-one' className="ml-2 text-sm text-gray-700">Personal</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id='radio-two'
                                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300'
                                type='radio'
                                name='radio-group'
                                value="business"
                                required
                            />
                            <label htmlFor='radio-two' className="ml-2 text-sm text-gray-700">Business</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id='radio-three'
                                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300'
                                type='radio'
                                name='radio-group'
                                value="educational"
                                required
                            />
                            <label htmlFor='radio-three' className="ml-2 text-sm text-gray-700">Educational</label>
                        </div>
                    </div>
                </fieldset>

                {/* Checkbox */}
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id='terms'
                            className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                            type='checkbox'
                            name='terms'
                            required
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor='terms' className="font-medium text-gray-700">I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">terms and conditions</a></label>
                        <p className="text-gray-500">You agree to our Terms of Service and Privacy Policy.</p>
                    </div>
                </div>

                {/* Select Dropdown */}
                <div className="space-y-1">
                    <label htmlFor="document-category" className="block text-sm font-medium text-gray-700">
                        Document Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        id='document-category'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        name='document-category'
                        required
                    >
                        <option value="">Select a category</option>
                        <optgroup label="Legal Documents">
                            <option value="contract">Contract</option>
                            <option value="agreement">Agreement</option>
                            <option value="certificate">Certificate</option>
                        </optgroup>
                        <optgroup label="Financial Documents">
                            <option value="invoice">Invoice</option>
                            <option value="receipt">Receipt</option>
                            <option value="statement">Statement</option>
                        </optgroup>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                    <button
                        type="reset"
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Clear Form
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Submit Documents
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormFiles;