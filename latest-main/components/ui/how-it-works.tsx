export function HowItWorks() {
  const steps = [
    {
      title: "1. Browse Creators",
      description: "Find verified Muslim creators by niche, platform, and budget.",
    },
    {
      title: "2. Post Campaign or Book Direct",
      description: "Order a service or post a brief and get applications.",
    },
    {
      title: "3. Collaborate & Launch",
      description: "Review deliverables, approve, and publish your content.",
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-8 text-center">
      {steps.map((step, i) => (
        <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md hover:scale-[1.02] transition">
          <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
          <p className="text-slate-400 text-sm">{step.description}</p>
        </div>
      ))}
    </div>
  )
}
