import { requireAdmin } from '@/lib/admin-auth'
import AdminNavigation from './components/admin-navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Require admin authentication
  const adminUser = await requireAdmin('viewer')

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation adminUser={adminUser} />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  )
}
