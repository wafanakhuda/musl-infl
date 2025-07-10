export function WhyChooseUs() {
  const features = [
    { title: "Secure Payments", desc: "Escrow protection with Stripe" },
    { title: "Vetted Creators", desc: "Verified Muslim creators only" },
    { title: "Fast Turnaround", desc: "Most deliveries within 48–72 hours" },
    { title: "24/7 Support", desc: "Responsive help when you need it most" },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-6 text-center">
      {features.map((f, i) => (
        <div key={i} className="p-4 bg-slate-800 rounded-lg">
          <h4 className="text-lg font-semibold mb-1">{f.title}</h4>
          <p className="text-slate-400 text-sm">{f.desc}</p>
        </div>
      ))}
    </div>
  )
}
