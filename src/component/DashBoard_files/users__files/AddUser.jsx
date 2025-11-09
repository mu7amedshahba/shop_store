import React, { useEffect, useState } from 'react'
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheck,
  FaTimes,
  FaPhone,
} from "react-icons/fa";
// 
import { useNavigate } from "react-router-dom";
import { Add } from '../../../assets/Auth/authPaths';
import SpinnerLoad from './../../UI/ReUsable/SpinnerLoad/SpinnerLoad';
import { Axios } from '../../../assets/Auth/Axios';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role: '',
    progress: "10",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    specialChar: false,
  });

  // 
  const handleChange = async (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  // 
  useEffect(() => {
    if (formData.password) {
      setPasswordRequirements({
        length: formData.password.length >= 8,
        number: /\d/.test(formData.password),
        specialChar: /[!@#$%^&*]/.test(formData.password),
      });
    }

  }, [formData.password]);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    // 
    if (
      formData.phone_number &&
      !/^\+?[\d\s-]{7,}$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = "Invalid phone number format";
    }
    // 
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !passwordRequirements.length ||
      !passwordRequirements.number ||
      !passwordRequirements.specialChar
    ) {
      newErrors.password = "Password doesn't meet requirements";
    }
    // 
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    // 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    // 
    if (!validateForm()) return console.log('invalid data');

    setIsSubmitting(true);
    // 
    try {
      setLoading(true)
      const res = await Axios.post(`${USER}/${Add}`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number || "",
          role: formData.role || "99",
        },
      );
      // 
      if (res.data) {
        setFormData({
          name: "",
          email: "",
          password: "",
          phone_number: "",
          confirmPassword: "",
        })
        console.log(res.status)
        res.status === 200 && navigate('/dashboard/users-data')
      }
      console.log(res.data)
    } catch (error) {
      if (error.response) {
        setApiError(error.response.data?.message || "Registration failed");
      } else if (error.request) {
        setApiError("No response from server");
      } else {
        setApiError("Registration error: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false)
    }
  };



  if (loading) return <SpinnerLoad />
  // 
  return (
    <div >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor='name' className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id='name'
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}

              placeholder="John Doe"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 rounded-lg border ${errors.name ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500" : "border-gray-300"}`}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor='email' className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id='email'
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}

              placeholder="your@email.com"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 rounded-lg border ${errors.email ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500" : "border-gray-300"}`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
          )}
        </div>



        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}

              placeholder="+1234567890"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 rounded-lg border ${errors.phone_number ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500" : "border-gray-300"}`}
            />
          </div>
          {errors.phone_number && (
            <p className="mt-1.5 text-sm text-red-600">{errors.phone_number}</p>
          )}
        </div>


        {/* Password Field */}
        <div>
          <label htmlFor='password' className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id='password'
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}

              placeholder="••••••••"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 rounded-lg border ${errors.password ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500" : "border-gray-300"}`}
            />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <PasswordRequirement
              met={passwordRequirements.length}
              text="8+ characters"
            />

            <PasswordRequirement
              met={passwordRequirements.number}
              text="Number"
            />
            <PasswordRequirement
              met={passwordRequirements.specialChar}
              text="Special char"
            />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor='password_confirmPassword' className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input id='password_confirmPassword'
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}

              placeholder="••••••••"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 rounded-lg border ${errors.confirmPassword ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500" : "border-gray-300"}`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        {/* role */}
        <div>
          <label htmlFor='role' className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id='role'
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="select User role"
              className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 rounded-lg border ${errors.confirmPassword ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500" : "border-gray-300"}`}
            >
              <option value="1995">Owner</option>
              <option value="1001">Admin</option>
              <option value="1996">Moderator</option>
              <option value="2001">User</option>
            </select>
          </div>
          {errors.role && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.role}
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {apiError}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              {isSubmitting ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-blue-300 group-hover:text-blue-200"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
            {isSubmitting ? "Adding account..." : "Add Account"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddUser


const PasswordRequirement = ({ met, text }) => (
  <div className="flex items-center mt-1">
    {met ? (
      <FaCheck className="text-green-500 mr-2" size={10} />
    ) : (
      <FaTimes className="text-red-500 mr-2" size={10} />
    )}
    <span className={met ? "text-green-600" : "text-gray-500"}>{text}</span>
  </div>
);