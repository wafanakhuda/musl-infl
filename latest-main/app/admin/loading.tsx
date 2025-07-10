import { LoadingSpinner } from "../../components/ui/loading-spinner"

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
      </div>
    </div>
  )
}
