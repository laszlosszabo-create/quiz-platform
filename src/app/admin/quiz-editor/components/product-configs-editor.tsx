'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2, Plus, Save, Palette, Settings, Zap, MessageSquare } from 'lucide-react'

interface ProductConfig {
  id: string
  product_id: string
  key: string
  value: any
  created_at: string
  updated_at: string
}

interface ProductConfigsEditorProps {
  quizId: string
  products: any[]
}

export default function ProductConfigsEditor({ quizId, products }: ProductConfigsEditorProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [configs, setConfigs] = useState<ProductConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Config templates
  const configTemplates = {
    theme: {
      primary_color: '#3B82F6',
      secondary_color: '#F3F4F6',
      accent_color: '#10B981',
      background_gradient: 'from-blue-50 to-purple-50',
      hero_gradient: 'from-indigo-600 to-purple-600'
    },
    feature_flags: {
      result_analysis_type: 'both', // 'score', 'ai', 'both'
      show_booking: true,
      show_download: true,
      show_premium_access: true,
      enable_ai_analysis: true
    },
    ui_settings: {
      show_score_chart: true,
      animate_cards: true,
      glassmorphism: true,
      modern_design: true
    },
    content_settings: {
      success_message: 'Sikeres vásárlás! Köszönjük a bizalmat.',
      download_button_text: 'Anyagok Letöltése',
      booking_button_text: 'Időpont Foglalás',
      premium_button_text: 'Premium Hozzáférés'
    },
    result_content: {
      result_title: 'Az Ön Eredménye',
      result_description: 'Részletes elemzés a quiz eredményei alapján',
      result_text: '',
      custom_result_html: ''
    },
    ai_prompts: {
      system_prompt: 'Te egy szakértő vagy, aki segít elemezni a quiz eredményeket.',
      user_prompt: 'Elemezd az eredményeket és adj személyre szabott tanácsokat.',
      result_prompt: '',
      max_tokens: 1000
    }
  }

  // Load configs when product changes
  useEffect(() => {
    if (selectedProduct) {
      loadProductConfigs(selectedProduct)
    }
  }, [selectedProduct])

  const loadProductConfigs = async (productId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/product-configs?product_id=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setConfigs(data.configs || [])
      }
    } catch (error) {
      console.error('Failed to load product configs:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async (key: string, value: any) => {
    if (!selectedProduct) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/product-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct,
          key,
          value
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Konfiguráció sikeresen mentve!' })
        loadProductConfigs(selectedProduct)
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Save failed')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Mentés sikertelen!' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const deleteConfig = async (configId: string) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/product-configs/${configId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Konfiguráció törölve!' })
        loadProductConfigs(selectedProduct)
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Törlés sikertelen!' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const getConfigValue = (key: string) => {
    const config = configs.find(c => c.key === key)
    return config?.value || configTemplates[key as keyof typeof configTemplates] || {}
  }

  const ThemeEditor = () => {
    const [theme, setTheme] = useState(getConfigValue('theme'))

    useEffect(() => {
      setTheme(getConfigValue('theme'))
    }, [configs])

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Téma Beállítások
          </CardTitle>
          <CardDescription>
            Termék-specifikus design és színek
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Elsődleges szín</Label>
              <Input
                type="color"
                value={theme.primary_color || '#3B82F6'}
                onChange={(e) => setTheme({...theme, primary_color: e.target.value})}
              />
            </div>
            <div>
              <Label>Másodlagos szín</Label>
              <Input
                type="color"
                value={theme.secondary_color || '#F3F4F6'}
                onChange={(e) => setTheme({...theme, secondary_color: e.target.value})}
              />
            </div>
            <div>
              <Label>Kiemelés szín</Label>
              <Input
                type="color"
                value={theme.accent_color || '#10B981'}
                onChange={(e) => setTheme({...theme, accent_color: e.target.value})}
              />
            </div>
            <div>
              <Label>Háttér gradient</Label>
              <Input
                value={theme.background_gradient || 'from-blue-50 to-purple-50'}
                onChange={(e) => setTheme({...theme, background_gradient: e.target.value})}
                placeholder="from-blue-50 to-purple-50"
              />
            </div>
          </div>
          <Button 
            onClick={() => saveConfig('theme', theme)}
            disabled={saving}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Téma Mentése
          </Button>
        </CardContent>
      </Card>
    )
  }

  const FeatureFlagsEditor = () => {
    const [flags, setFlags] = useState(getConfigValue('feature_flags'))

    useEffect(() => {
      setFlags(getConfigValue('feature_flags'))
    }, [configs])

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Funkció Beállítások
          </CardTitle>
          <CardDescription>
            Termék-specifikus funkciók ki/bekapcsolása
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Elemzés típusa</Label>
            <Select
              value={flags.result_analysis_type || 'both'}
              onValueChange={(value) => setFlags({...flags, result_analysis_type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Csak pontszám</SelectItem>
                <SelectItem value="ai">Csak AI elemzés</SelectItem>
                <SelectItem value="both">Mindkettő</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show_booking"
                checked={flags.show_booking || false}
                onChange={(e) => setFlags({...flags, show_booking: e.target.checked})}
              />
              <Label htmlFor="show_booking">Időpont foglalás</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show_download"
                checked={flags.show_download || false}
                onChange={(e) => setFlags({...flags, show_download: e.target.checked})}
              />
              <Label htmlFor="show_download">Letöltés gomb</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show_premium"
                checked={flags.show_premium_access || false}
                onChange={(e) => setFlags({...flags, show_premium_access: e.target.checked})}
              />
              <Label htmlFor="show_premium">Premium hozzáférés</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enable_ai"
                checked={flags.enable_ai_analysis || false}
                onChange={(e) => setFlags({...flags, enable_ai_analysis: e.target.checked})}
              />
              <Label htmlFor="enable_ai">AI elemzés</Label>
            </div>
          </div>

          <Button 
            onClick={() => saveConfig('feature_flags', flags)}
            disabled={saving}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Funkciók Mentése
          </Button>
        </CardContent>
      </Card>
    )
  }

  const ContentEditor = () => {
    const [content, setContent] = useState(getConfigValue('content_settings'))

    useEffect(() => {
      setContent(getConfigValue('content_settings'))
    }, [configs])

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Tartalom Beállítások
          </CardTitle>
          <CardDescription>
            Termék-specifikus szövegek és üzenetek
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Sikeres vásárlás üzenet</Label>
            <Textarea
              value={content.success_message || ''}
              onChange={(e) => setContent({...content, success_message: e.target.value})}
              placeholder="Sikeres vásárlás! Köszönjük a bizalmat."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Letöltés gomb szöveg</Label>
              <Input
                value={content.download_button_text || ''}
                onChange={(e) => setContent({...content, download_button_text: e.target.value})}
                placeholder="Anyagok Letöltése"
              />
            </div>

            <div>
              <Label>Foglalás gomb szöveg</Label>
              <Input
                value={content.booking_button_text || ''}
                onChange={(e) => setContent({...content, booking_button_text: e.target.value})}
                placeholder="Időpont Foglalás"
              />
            </div>
          </div>

          <Button 
            onClick={() => saveConfig('content_settings', content)}
            disabled={saving}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Tartalom Mentése
          </Button>
        </CardContent>
      </Card>
    )
  }

  const ResultContentEditor = () => {
    const [resultContent, setResultContent] = useState(getConfigValue('result_content'))

    useEffect(() => {
      setResultContent(getConfigValue('result_content'))
    }, [configs])

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            📊 Eredmény Tartalom
          </CardTitle>
          <CardDescription>
            A termék eredmény oldalán megjelenő szövegek és tartalom
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Eredmény oldal címe</Label>
            <Input
              value={resultContent.result_title || ''}
              onChange={(e) => setResultContent({...resultContent, result_title: e.target.value})}
              placeholder="Az Ön Eredménye"
            />
          </div>

          <div>
            <Label>Eredmény leírása</Label>
            <Textarea
              value={resultContent.result_description || ''}
              onChange={(e) => setResultContent({...resultContent, result_description: e.target.value})}
              placeholder="Részletes elemzés a quiz eredményei alapján"
              rows={2}
            />
          </div>

          <div>
            <Label>🎯 Termék Eredmény Szöveg (főszöveg)</Label>
            <Textarea
              value={resultContent.result_text || ''}
              onChange={(e) => setResultContent({...resultContent, result_text: e.target.value})}
              placeholder="Itt adhatod meg a termék specifikus eredmény szöveget, ami minden felhasználónak megjelenik..."
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Ez a szöveg minden felhasználó számára megjelenik az eredmény oldalon
            </p>
          </div>

          <div>
            <Label>🎨 Egyedi HTML tartalom (haladó)</Label>
            <Textarea
              value={resultContent.custom_result_html || ''}
              onChange={(e) => setResultContent({...resultContent, custom_result_html: e.target.value})}
              placeholder="<div class='custom-result'>Egyedi HTML tartalom...</div>"
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ Csak HTML kód! Ez felülírja az alapértelmezett eredmény megjelenítést
            </p>
          </div>

          <Button 
            onClick={() => saveConfig('result_content', resultContent)}
            disabled={saving}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            📊 Eredmény Tartalom Mentése
          </Button>
        </CardContent>
      </Card>
    )
  }

  const AIPromptsEditor = () => {
    const [aiPrompts, setAiPrompts] = useState(getConfigValue('ai_prompts'))

    useEffect(() => {
      setAiPrompts(getConfigValue('ai_prompts'))
    }, [configs])

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            🤖 AI Prompt Beállítások
          </CardTitle>
          <CardDescription>
            Termék-specifikus AI promptok az eredmény generálásához
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>🧠 System Prompt (AI személyisége)</Label>
            <Textarea
              value={aiPrompts.system_prompt || ''}
              onChange={(e) => setAiPrompts({...aiPrompts, system_prompt: e.target.value})}
              placeholder="Te egy szakértő pszichológus vagy, aki segít elemezni ADHD teszteredményeket..."
              rows={3}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Meghatározza az AI szerepét és stílusát
            </p>
          </div>

          <div>
            <Label>🎯 Result Prompt (termék-specifikus eredmény generálás)</Label>
            <Textarea
              value={aiPrompts.result_prompt || ''}
              onChange={(e) => setAiPrompts({...aiPrompts, result_prompt: e.target.value})}
              placeholder="Elemezd az ADHD teszt eredményeit a következő kérdések és válaszok alapján: {{questions_and_answers}}. A felhasználó neve: {{name}}, összpontszáma: {{score}} pont. Adj személyre szabott tanácsokat..."
              rows={8}
              className="font-mono text-sm"
            />
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs space-y-1">
              <p className="font-semibold text-gray-700">📝 Használható változók a promptban:</p>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div><code className="bg-white px-1 rounded">{'{{score}}'}</code> - Összpontszám</div>
                <div><code className="bg-white px-1 rounded">{'{{percentage}}'}</code> - Százalékos eredmény</div>
                <div><code className="bg-white px-1 rounded">{'{{category}}'}</code> - Eredmény kategória</div>
                <div><code className="bg-white px-1 rounded">{'{{answers}}'}</code> - Válaszok listája</div>
                <div><code className="bg-white px-1 rounded">{'{{questions}}'}</code> - Kérdések listája</div>
                <div><code className="bg-white px-1 rounded">{'{{questions_and_answers}}'}</code> - Kérdés-válasz párok</div>
                <div><code className="bg-white px-1 rounded">{'{{name}}'}</code> - Felhasználó neve</div>
                <div><code className="bg-white px-1 rounded">{'{{email}}'}</code> - Email cím</div>
                <div><code className="bg-white px-1 rounded">{'{{product_name}}'}</code> - Termék neve</div>
                <div><code className="bg-white px-1 rounded">{'{{quiz_title}}'}</code> - Quiz címe</div>
              </div>
              <p className="text-gray-500 italic mt-2">
                🚀 Példa: &quot;Szia {'{{name}}'}, a kvíz kérdéseire adott válaszaid alapján {'{{questions_and_answers}}'} az eredményed {'{{score}}'} pont...&quot;
              </p>
              <div className="mt-3 p-2 bg-blue-50 border-l-4 border-blue-200 text-xs">
                <p className="font-semibold text-blue-800 mb-1">📋 Kérdés változók részletesen:</p>
                <ul className="text-blue-700 space-y-1">
                  <li><strong>{'{{questions}}'}</strong> - Csak a kérdések szövege listában</li>
                  <li><strong>{'{{answers}}'}</strong> - Csak a válaszok listában</li>
                  <li><strong>{'{{questions_and_answers}}'}</strong> - Kérdés-válasz párok strukturáltan</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <Label>💬 User Prompt (felhasználói utasítás)</Label>
            <Textarea
              value={aiPrompts.user_prompt || ''}
              onChange={(e) => setAiPrompts({...aiPrompts, user_prompt: e.target.value})}
              placeholder="Kérlek elemezd az eredményeimet és adj tanácsokat..."
              rows={3}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              🗣️ Amit a &quot;felhasználó&quot; mond az AI-nak (opcionális)
            </p>
          </div>

          <div>
            <Label>🔢 Maximum Token Limit</Label>
            <Input
              type="number"
              value={aiPrompts.max_tokens || 1000}
              onChange={(e) => setAiPrompts({...aiPrompts, max_tokens: parseInt(e.target.value) || 1000})}
              placeholder="1000"
              min={100}
              max={4000}
              className="font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              📏 Az AI válasz maximum hossza tokenekben (100-4000). Ajánlott: 1000-2000
            </p>
          </div>

          <Button 
            onClick={() => saveConfig('ai_prompts', aiPrompts)}
            disabled={saving}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            🤖 AI Promptok Mentése
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!products?.length) {
    return (
      <Alert>
        <AlertDescription>
          Nincsenek termékek ehhez a quiz-hez. Először hozz létre termékeket a Termékek tab-ban.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Product Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Termék Konfiguráció
          </CardTitle>
          <CardDescription>
            Válaszd ki a terméket, amelyhez beállításokat szeretnél módosítani
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Termék kiválasztása</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Válassz terméket..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {product.price} {product.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="mt-4 flex flex-wrap gap-2">
              {configs.map((config) => (
                <Badge key={config.id} variant="secondary" className="flex items-center gap-1">
                  {config.key}
                  <Trash2 
                    className="w-3 h-3 cursor-pointer hover:text-red-600"
                    onClick={() => deleteConfig(config.id)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      {selectedProduct && (
        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="theme">🎨 Téma</TabsTrigger>
            <TabsTrigger value="features">⚡ Funkciók</TabsTrigger>
            <TabsTrigger value="content">💬 Tartalom</TabsTrigger>
            <TabsTrigger value="result">📊 Eredmény</TabsTrigger>
            <TabsTrigger value="ai">🤖 AI Promptok</TabsTrigger>
          </TabsList>

          <TabsContent value="theme">
            <ThemeEditor />
          </TabsContent>

          <TabsContent value="features">
            <FeatureFlagsEditor />
          </TabsContent>

          <TabsContent value="content">
            <ContentEditor />
          </TabsContent>

          <TabsContent value="result">
            <ResultContentEditor />
          </TabsContent>

          <TabsContent value="ai">
            <AIPromptsEditor />
          </TabsContent>
        </Tabs>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Konfigurációk betöltése...</p>
        </div>
      )}
    </div>
  )
}
