"use client"

export const FooterCTA = () => {
  return (
    <div className="mt-16 px-4 py-12 text-center border rounded-2xl border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">
        <span className="font-bold">Want to</span> Create a Campaign?
      </h2>
      <p className="mt-2 text-gray-300">
        Join as a brand and start collaborating with authentic Muslim creators for your marketing campaigns.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <a href="/auth/register/brand" className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200">
          Start as Brand
        </a>
        <a href="/auth/register/creator" className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200">
          Join as Creator
        </a>
      </div>
    </div>
  )
}
