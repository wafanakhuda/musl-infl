"use client"

export function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Large floating blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-slow-reverse"></div>
      <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-float-medium"></div>

      {/* Small floating circles */}
      <div className="absolute top-32 left-1/4 w-4 h-4 bg-teal-400 rounded-full animate-bounce-slow"></div>
      <div className="absolute top-64 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-bounce-slow-reverse"></div>
      <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-orange-400 rounded-full animate-bounce-slow"></div>

      {/* Geometric shapes */}
      <div className="absolute top-48 right-1/4 w-6 h-6 bg-gradient-to-r from-teal-400 to-blue-400 transform rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-32 right-1/4 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 transform rotate-45 animate-spin-slow-reverse"></div>
    </div>
  )
}
