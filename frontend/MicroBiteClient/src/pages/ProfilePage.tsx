"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuthContext } from "../auth/context/useAuthContext"
import { api } from "../api"

type User = {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  securityQuestion: string
  securityAnswer?: string
}

export default function ProfilePage() {
  const { accessToken } = useAuthContext()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedUser, setUpdatedUser] = useState<User | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        setSuccessMessage(null)

        const response = await api.get("/account/profile")

        setUser({
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNumber: response.data.phoneNumber,
          securityQuestion: response.data.securityQuestion || "",
        })
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        setError("Failed to load profile data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      fetchProfile()
    } else {
      setLoading(false)
      setError("Authentication required. Please log in.")
    }
  }, [accessToken])

  const handleEdit = () => {
    setUpdatedUser({ ...user! })
    setIsEditing(true)
    setSuccessMessage(null)
    setError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setUpdatedUser(null)
    setError(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUpdatedUser((prev) => ({ ...prev!, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    try {
      setIsSaving(true)
      await api.put("/account/profile", updatedUser)
      setUser(updatedUser!)
      setSuccessMessage("Profile updated successfully!")
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to update profile:", err)
      setError("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-1">View and update your personal information</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <p>{successMessage}</p>
          </div>
        )}

        {user ? (
          <div className="space-y-6">
            {!isEditing ? (
              <>
                <div className="space-y-4 divide-y divide-gray-100">
                  <ProfileField label="Email" value={user.email} />
                  <ProfileField label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                  <ProfileField label="Phone" value={user.phoneNumber} />
                  <ProfileField label="Security Question" value={user.securityQuestion} />
                </div>
                <button
                  onClick={handleEdit}
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 font-medium"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={updatedUser?.email || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={updatedUser?.phoneNumber || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={updatedUser?.firstName || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={updatedUser?.lastName || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
                  <input
                    type="text"
                    name="securityQuestion"
                    value={updatedUser?.securityQuestion || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Security Answer</label>
                  <input
                    type="text"
                    name="securityAnswer"
                    value={updatedUser?.securityAnswer || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full bg-gray-300 text-gray-800 py-3 rounded-md hover:bg-gray-400 transition duration-300 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No user data available.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3">
      <span className="text-sm font-medium text-gray-500 sm:w-1/3">{label}:</span>
      <span className="font-medium text-gray-800 mt-1 sm:mt-0">{value}</span>
    </div>
  )
}

