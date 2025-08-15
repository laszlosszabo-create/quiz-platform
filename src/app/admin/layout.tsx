import AdminNavigation from './components/admin-navigation'
import AdminAuthWrapper from './components/admin-auth-wrapper'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthWrapper minimumRole="viewer">
      <div className="min-h-screen bg-gray-50">
                <AdminNavigation />
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </AdminAuthWrapper>
  )
}
