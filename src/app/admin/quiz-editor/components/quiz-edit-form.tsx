'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-config'
import QuestionsEditor from '../../components/questions-editor'
import type { AdminUser } from '@/lib/admin-auth'

type Quiz = {
  id: string
  title: string
  slug: string
  description: string | null
  language: string
  status: 'draft' | 'active' | 'archived'
  default_lang: string
  feature_flags: Record<string, any>
  theme: Record<string, any>
  created_at: string
  is_active: boolean
  is_premium: boolean
  quiz_questions?: Array<{
    id: string
    key: string
    type: string
  }>
}

interface QuizEditFormProps {
  quiz: Quiz
  adminUser: AdminUser
}

const defaultFeatureFlags = {
  email_gate_position: 'end',
  ai_result_enabled: true,
  layout_version: 'v1'
}

const defaultTheme = {
  primary_color: '#3B82F6',
  secondary_color: '#1F2937',
  logo_url: '',
  hero_url: '',
  calendly_url: ''
}

export default function QuizEditForm({ quiz, adminUser }: QuizEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  
  // Quiz meta data
  const [title, setTitle] = useState(quiz.title || '')
  const [slug, setSlug] = useState(quiz.slug)
  const [description, setDescription] = useState(quiz.description || '')
  const [status, setStatus] = useState(quiz.status)
  const [defaultLang, setDefaultLang] = useState(quiz.default_lang)
  const [isPremium, setIsPremium] = useState(quiz.is_premium)
  
  // Feature flags
  const [featureFlags, setFeatureFlags] = useState({
    ...defaultFeatureFlags,
    ...quiz.feature_flags
  })
  
  // Theme settings
  const [theme, setTheme] = useState({
    ...defaultTheme,
    ...quiz.theme
  })

  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleSave = async () => {
    if (adminUser.role === 'viewer') {
      alert('Nincs jogosultságod a módosításhoz')
      return
    }

    try {
      setLoading(true)

      const updateData = {
        title,
        slug,
        description: description || null,
        language: defaultLang,
        is_active: status === 'active',
        is_premium: isPremium,
        feature_flags: featureFlags,
        theme: theme,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('quizzes')
        .update(updateData)
        .eq('id', quiz.id)

      if (error) {
        console.error('Error updating quiz:', error)
        alert('Hiba történt a mentés során')
        return
      }

      alert('Sikeresen mentve!')
      
    } catch (error) {
      console.error('Error:', error)
      alert('Hiba történt a mentés során')
    } finally {
      setLoading(false)
    }
  }

  const updateFeatureFlag = (key: string, value: any) => {
    setFeatureFlags(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateTheme = (key: string, value: string) => {
    setTheme(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const tabs = [
    { id: 'general', name: 'Általános', icon: '⚙️' },
    { id: 'questions', name: 'Kérdések', icon: '❓' },
    { id: 'theme', name: 'Téma', icon: '🎨' },
    { id: 'features', name: 'Funkciók', icon: '🔧' },
  ]

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Általános Beállítások</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cím *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={adminUser.role === 'viewer'}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Quiz címe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={adminUser.role === 'viewer'}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="quiz-slug"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL útvonal: /{defaultLang}/{slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Státusz
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  disabled={adminUser.role === 'viewer'}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Tervezet</option>
                  <option value="active">Aktív</option>
                  <option value="archived">Archivált</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alapnyelv
                </label>
                <select
                  value={defaultLang}
                  onChange={(e) => setDefaultLang(e.target.value)}
                  disabled={adminUser.role === 'viewer'}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="hu">Magyar (HU)</option>
                  <option value="en">English (EN)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leírás
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={adminUser.role === 'viewer'}
                  rows={3}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Quiz leírása..."
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    disabled={adminUser.role === 'viewer'}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Premium quiz
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz ID
                </label>
                <input
                  type="text"
                  value={quiz.id}
                  disabled
                  className="w-full border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Kérdések Kezelése</h3>
              <div className="text-sm text-gray-500">
                Kérdések száma: {quiz.quiz_questions?.length || 0}
              </div>
            </div>
            <QuestionsEditor quizId={quiz.id} adminUser={adminUser} />
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Téma Beállítások</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elsődleges szín
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={theme.primary_color}
                    onChange={(e) => updateTheme('primary_color', e.target.value)}
                    disabled={adminUser.role === 'viewer'}
                    className="h-10 w-20 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={theme.primary_color}
                    onChange={(e) => updateTheme('primary_color', e.target.value)}
                    disabled={adminUser.role === 'viewer'}
                    className="flex-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Másodlagos szín
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={theme.secondary_color}
                    onChange={(e) => updateTheme('secondary_color', e.target.value)}
                    disabled={adminUser.role === 'viewer'}
                    className="h-10 w-20 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={theme.secondary_color}
                    onChange={(e) => updateTheme('secondary_color', e.target.value)}
                    disabled={adminUser.role === 'viewer'}
                    className="flex-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="#1F2937"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={theme.logo_url}
                  onChange={(e) => updateTheme('logo_url', e.target.value)}
                  disabled={adminUser.role === 'viewer'}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero kép URL
                </label>
                <input
                  type="url"
                  value={theme.hero_url}
                  onChange={(e) => updateTheme('hero_url', e.target.value)}
                  disabled={adminUser.role === 'viewer'}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/hero.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calendly URL
                </label>
                <input
                  type="url"
                  value={theme.calendly_url}
                  onChange={(e) => updateTheme('calendly_url', e.target.value)}
                  disabled={adminUser.role === 'viewer'}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://calendly.com/username/consultation"
                />
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Funkció Beállítások</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email gate pozíció
                </label>
                <select
                  value={featureFlags.email_gate_position}
                  onChange={(e) => updateFeatureFlag('email_gate_position', e.target.value)}
                  disabled={adminUser.role === 'viewer'}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="start">Kezdet</option>
                  <option value="middle">Közép</option>
                  <option value="end">Vége</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={featureFlags.ai_result_enabled}
                    onChange={(e) => updateFeatureFlag('ai_result_enabled', e.target.checked)}
                    disabled={adminUser.role === 'viewer'}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    AI eredmény generálás engedélyezve
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Layout verzió
                </label>
                <select
                  value={featureFlags.layout_version}
                  onChange={(e) => updateFeatureFlag('layout_version', e.target.value)}
                  disabled={adminUser.role === 'viewer'}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="v1">Verzió 1</option>
                  <option value="v2">Verzió 2</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-6 mt-8 flex justify-between">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Vissza
          </button>
          
          {adminUser.role !== 'viewer' && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Mentés...' : 'Mentés'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
