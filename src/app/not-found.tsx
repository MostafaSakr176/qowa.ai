import Link from 'next/link'
import React from 'react'

const notFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]"> 
      <h1 className="text-5xl font-bold text-[#007EF9] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2 rounded bg-[#007EF9] text-white font-medium hover:bg-[#005bb5] transition"
      >
        Go Home
      </Link>
    </div>
  )
}

export default notFound