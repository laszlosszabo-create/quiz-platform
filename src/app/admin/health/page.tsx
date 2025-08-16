export default function AdminHealthPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Health Check</h1>
      <p>Current time: {new Date().toISOString()}</p>
      <p>If you can see this, the admin route is working.</p>
    </div>
  )
}
