import Link from "next/link"
import Image from "next/image"

export default function LogoHeader() {
  return (
    <header className="bg-slate-900 px-4 py-3 border-b border-slate-700">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
        <span className="text-white font-semibold text-lg">MuslimInfluencers</span>
      </Link>
    </header>
  )
}
