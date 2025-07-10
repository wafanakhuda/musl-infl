"use client"

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Large gradient blob - top right */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-500/30 via-orange-500/20 to-red-500/10 rounded-full blur-3xl animate-float-gentle"></div>

      {/* Medium gradient blob - bottom left */}
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-blue-500/20 via-teal-500/30 to-green-500/10 rounded-full blur-3xl animate-float-reverse"></div>

      {/* Small accent shapes */}
      <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-teal-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>

      {/* Diamond shapes */}
      <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-1/4 right-1/2 w-4 h-4 bg-gradient-to-r from-green-400 to-teal-400 rotate-45 animate-pulse"></div>

      {/* Floating rings */}
      <div className="absolute top-1/2 left-1/6 w-16 h-16 border-2 border-purple-400/30 rounded-full animate-float-gentle"></div>
      <div className="absolute bottom-1/3 right-1/6 w-12 h-12 border-2 border-teal-400/40 rounded-full animate-float-reverse"></div>
    </div>
  )
}
