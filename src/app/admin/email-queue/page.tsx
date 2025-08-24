'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw, Send, X, AlertCircle, CheckCircle, Clock, Play } from 'lucide-react'

interface QueueItem {
  id: string
  recipient_email: string
  subject: string
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled'
  created_at: string
  scheduled_at: string
  sent_at?: string
  error_message?: string
  template_id: string
  email_templates?: {
    id: string
    template_name: string
    template_type: string
  }
}

export default function EmailQueuePage() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [quizzes, setQuizzes] = useState<Array<{id: string, name: string}>>([])
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    sent: 0,
    failed: 0,
    cancelled: 0
  })
  const [message, setMessage] = useState('')

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  // Load quizzes for filter
  useEffect(() => {
    async function loadQuizzes() {
      try {
        const response = await fetch('/api/admin/quizzes')
        if (response.ok) {
          const data = await response.json()
          setQuizzes(data.quizzes || [])
          if (data.quizzes?.length > 0) {
            setSelectedQuiz(data.quizzes[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to load quizzes:', error)
      }
    }
    loadQuizzes()
  }, [])

  // Load queue items when quiz or filter changes
  useEffect(() => {
    if (selectedQuiz) {
      loadQueueItems()
    }
  }, [selectedQuiz, statusFilter])

  const loadQueueItems = async () => {
    if (!selectedQuiz) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams({
        quiz_id: selectedQuiz,
        limit: '100',
        offset: '0',
        order: 'updated_desc'
      })
      
      if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }

      const response = await fetch(`/api/admin/email-queue?${params}`)
      if (response.ok) {
        const data = await response.json()
        setQueueItems(data.queueItems || [])
        
        // Calculate stats
        const newStats = { pending: 0, processing: 0, sent: 0, failed: 0, cancelled: 0 }
        data.queueItems?.forEach((item: QueueItem) => {
          newStats[item.status]++
        })
        setStats(newStats)
      } else {
        showMessage('Failed to load email queue', 'error')
      }
    } catch (error) {
      console.error('Failed to load queue items:', error)
      showMessage('Failed to load email queue', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleForceProcess = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cron/process-email-queue?safe=true&rate=10&backfill=true&retry=true')
      if (response.ok) {
        const result = await response.json()
        showMessage(`Email processing completed: ${result.succeeded || 0} sent, ${result.failed || 0} failed, ${result.skipped || 0} skipped`)
        await loadQueueItems() // Reload to see updates
      } else {
        showMessage('Failed to process email queue', 'error')
      }
    } catch (error) {
      console.error('Failed to process queue:', error)
      showMessage('Failed to process email queue', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleForceSend = async (queueId: string) => {
    try {
      const response = await fetch('/api/admin/email-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'force_send',
          queue_id: queueId 
        })
      })
      
      if (response.ok) {
        showMessage('Email sent successfully')
        await loadQueueItems()
      } else {
        const error = await response.json()
        showMessage(error.error || 'Failed to send email', 'error')
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      showMessage('Failed to send email', 'error')
    }
  }

  const handleCancel = async (queueId: string) => {
    try {
      const response = await fetch(`/api/admin/email-queue?id=${queueId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        showMessage('Email cancelled successfully')
        await loadQueueItems()
      } else {
        showMessage('Failed to cancel email', 'error')
      }
    } catch (error) {
      console.error('Failed to cancel email:', error)
      showMessage('Failed to cancel email', 'error')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'cancelled': return <X className="h-4 w-4 text-gray-500" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'sent': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email Queue Management</h1>
        <div className="flex gap-2">
          <Button onClick={loadQueueItems} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleForceProcess} disabled={loading}>
            <Play className="h-4 w-4 mr-2" />
            Process Queue
          </Button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md ${message.includes('completed') || message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
              </div>
              <X className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Quiz</label>
              <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quiz" />
                </SelectTrigger>
                <SelectContent>
                  {quizzes.map(quiz => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      {quiz.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Queue ({queueItems.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Recipient</th>
                  <th className="text-left p-2">Subject</th>
                  <th className="text-left p-2">Template</th>
                  <th className="text-left p-2">Scheduled</th>
                  <th className="text-left p-2">Sent</th>
                  <th className="text-left p-2">Error</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queueItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-2 font-mono text-sm">
                      {item.recipient_email}
                    </td>
                    <td className="p-2 max-w-48 truncate">
                      {item.subject}
                    </td>
                    <td className="p-2">
                      {item.email_templates?.template_name || 'Unknown'}
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {new Date(item.scheduled_at).toLocaleString()}
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {item.sent_at ? new Date(item.sent_at).toLocaleString() : '-'}
                    </td>
                    <td className="p-2 max-w-48 truncate text-sm text-red-600">
                      {item.error_message || '-'}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        {item.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleForceSend(item.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {(item.status === 'pending' || item.status === 'failed') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {queueItems.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No email queue items found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
