'use client'

import { useState } from 'react'

interface QuizData {
  id: string
  slug: string
  status: 'draft' | 'active' | 'archived'
  default_lang: string
  feature_flags: any
  theme: any
  translations: Record<string, Record<string, string>>
  title: string
  description: string
}

interface QuizMetaEditorProps {
  quizData: QuizData
  onDataChange: (data: Partial<QuizData>) => void
}

export default function QuizMetaEditor({ quizData, onDataChange }: QuizMetaEditorProps) {
  const [localData, setLocalData] = useState(quizData)

  const handleChange = (field: string, value: any) => {
    const updated = { ...localData, [field]: value }
    setLocalData(updated)
    onDataChange(updated)
  }

  const handleThemeChange = (field: string, value: string) => {
    const updatedTheme = { ...localData.theme, [field]: value }
    const updated = { ...localData, theme: updatedTheme }
    setLocalData(updated)
    onDataChange(updated)
  }

  const handleFeatureFlagChange = (flag: string, value: any) => {
    const updatedFlags = { ...localData.feature_flags, [flag]: value }
    const updated = { ...localData, feature_flags: updatedFlags }
    setLocalData(updated)
    onDataChange(updated)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">⚙️ Quiz Meta-szerkesztő</h2>
      
      {/* Alapadatok */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Alapadatok</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Név (title)
              </label>
              <input
                type="text"
                value={localData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Quiz címe..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={localData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="quiz-url-slug"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leírás
            </label>
            <textarea
              value={localData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Quiz leírása..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Státusz
              </label>
              <select
                value={localData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft (piszkozat)</option>
                <option value="active">Active (aktív)</option>
                <option value="archived">Archived (archivált)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alapértelmezett nyelv
              </label>
              <select
                value={localData.default_lang}
                onChange={(e) => handleChange('default_lang', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hu">Magyar (HU)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Editor */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">🎨 Téma beállítások</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elsődleges szín
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={localData.theme?.primary_color || '#3B82F6'}
                  onChange={(e) => handleThemeChange('primary_color', e.target.value)}
                  className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={localData.theme?.primary_color || '#3B82F6'}
                  onChange={(e) => handleThemeChange('primary_color', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Másodlagos szín
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={localData.theme?.secondary_color || '#10B981'}
                  onChange={(e) => handleThemeChange('secondary_color', e.target.value)}
                  className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={localData.theme?.secondary_color || '#10B981'}
                  onChange={(e) => handleThemeChange('secondary_color', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#10B981"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={localData.theme?.logo_url || ''}
              onChange={(e) => handleThemeChange('logo_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/logo.svg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero kép URL
            </label>
            <input
              type="url"
              value={localData.theme?.hero_image_url || ''}
              onChange={(e) => handleThemeChange('hero_image_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/hero.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calendly URL
            </label>
            <input
              type="url"
              value={localData.theme?.calendly_url || ''}
              onChange={(e) => handleThemeChange('calendly_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://calendly.com/your-account"
            />
          </div>
        </div>
      </div>

      {/* Feature Flags Editor */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">🔧 Feature Flags</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email gate pozíció
              </label>
              <select
                value={localData.feature_flags?.email_gate_position || 'end'}
                onChange={(e) => handleFeatureFlagChange('email_gate_position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="start">Elején</option>
                <option value="end">Végén</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI eredmény engedélyezve
              </label>
              <select
                value={localData.feature_flags?.ai_result_enabled ? 'true' : 'false'}
                onChange={(e) => handleFeatureFlagChange('ai_result_enabled', e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Igen</option>
                <option value="false">Nem</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Layout verzió
              </label>
              <input
                type="number"
                value={localData.feature_flags?.layout_version || 1}
                onChange={(e) => handleFeatureFlagChange('layout_version', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mentési validáció */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💾 Audit log</h4>
        <p className="text-sm text-blue-700">
          Minden módosítás mentéskor audit logba kerül. A változások azonnal érvénybe lépnek a landing és quiz oldalakon.
        </p>
      </div>
    </div>
  )
}
