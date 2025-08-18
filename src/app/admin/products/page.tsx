'use client'

import { useState, useEffect } from 'react'
import { Edit, Trash2, Eye, EyeOff, Search, Filter, Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Product {
  id: string
  quiz_id: string
  name: string
  description?: string
  active: boolean
  price: number
  currency: 'HUF' | 'EUR' | 'USD'
  stripe_product_id?: string
  stripe_price_id?: string
  booking_url?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  quizzes?: {
    id: string
    slug: string
    status: string
  }
}

interface Quiz {
  id: string
  slug: string
  status: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedQuiz, setSelectedQuiz] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    quiz_id: '',
    name: '',
    description: '',
    active: true,
    price: 0,
    currency: 'HUF' as 'HUF' | 'EUR' | 'USD',
    stripe_product_id: '',
    stripe_price_id: '',
    booking_url: '',
    metadata: {} as Record<string, any>
  })

  // Load data
  useEffect(() => {
    loadProducts()
    loadQuizzes()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/products')
      if (!response.ok) throw new Error('Failed to load products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error('Load products error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadQuizzes = async () => {
    try {
      const response = await fetch('/api/admin/quizzes')
      if (!response.ok) throw new Error('Failed to load quizzes')
      const data = await response.json()
      setQuizzes(data.quizzes || [])
    } catch (err) {
      console.error('Load quizzes error:', err)
    }
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.quiz_id || formData.price <= 0) {
      setError('Name, quiz, and price are required')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      const newProduct = await response.json()
      setProducts(prev => [newProduct, ...prev])
      resetForm()
      setIsCreateDialogOpen(false)
    } catch (err) {
      console.error('Create product error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingProduct || !formData.name || !formData.quiz_id || formData.price <= 0) {
      setError('Name, quiz, and price are required')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      const updatedProduct = await response.json()
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p))
      resetForm()
      setEditingProduct(null)
    } catch (err) {
      console.error('Update product error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }

      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (err) {
      console.error('Delete product error:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  const resetForm = () => {
    setFormData({
      quiz_id: '',
      name: '',
      description: '',
      active: true,
      price: 0,
      currency: 'HUF',
      stripe_product_id: '',
      stripe_price_id: '',
      booking_url: '',
      metadata: {}
    })
    setError(null)
  }

  const openEditDialog = (product: Product) => {
    setFormData({
      quiz_id: product.quiz_id,
      active: product.active,
      price: product.price,
      currency: product.currency,
      stripe_product_id: product.stripe_product_id || '',
      stripe_price_id: product.stripe_price_id || '',
      booking_url: product.booking_url || '',
      metadata: product.metadata || {},
      name: product.name,
      description: product.description || ''
    })
    setEditingProduct(product)
    setError(null)
  }

  const closeEditDialog = () => {
    setEditingProduct(null)
    resetForm()
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const productName = product.name || ''
    const productDescription = product.description || ''
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productDescription.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesActiveFilter = activeFilter === 'all' || 
                               (activeFilter === 'active' && product.active) ||
                               (activeFilter === 'inactive' && !product.active)
    
    const matchesQuizFilter = selectedQuiz === 'all' || product.quiz_id === selectedQuiz

    return matchesSearch && matchesActiveFilter && matchesQuizFilter
  })

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  const exportProducts = () => {
    const csvHeaders = ['Quiz', 'Name', 'Description', 'Price', 'Currency', 'Active', 'Stripe Product', 'Stripe Price', 'Booking URL', 'Created']
    const csvData = filteredProducts.map(product => [
      product.quizzes?.slug || '',
      product.name,
      product.description || '',
      product.price,
      product.currency,
      product.active ? 'Yes' : 'No',
      product.stripe_product_id || '',
      product.stripe_price_id || '',
      product.booking_url || '',
      new Date(product.created_at).toLocaleDateString()
    ])

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Termékek</h1>
          <p className="text-gray-600 mt-1">Termékek és árazás kezelése</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportProducts}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Új termék
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Új termék létrehozása</DialogTitle>
                <DialogDescription>
                  Adja meg az új termék adatait
                </DialogDescription>
              </DialogHeader>
              <ProductForm 
                formData={formData}
                setFormData={setFormData}
                quizzes={quizzes}
                onSave={handleCreate}
                onCancel={() => {
                  setIsCreateDialogOpen(false)
                  resetForm()
                }}
                saving={saving}
                error={error}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Keresés termékek között..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
              <SelectTrigger>
                <SelectValue placeholder="Kvíz szűrése" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden kvíz</SelectItem>
                {quizzes.map(quiz => (
                  <SelectItem key={quiz.id} value={quiz.id}>
                    {quiz.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={activeFilter} onValueChange={(value: any) => setActiveFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Státusz szűrése" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minden státusz</SelectItem>
                <SelectItem value="active">Aktív</SelectItem>
                <SelectItem value="inactive">Inaktív</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredProducts.length} termék találat
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nincsenek termékek</h3>
            <p className="text-gray-600 mb-6">Kezdje el az első termék létrehozásával</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Új termék
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {product.quizzes?.slug}
                    </CardDescription>
                  </div>
                  <Badge variant={product.active ? "default" : "secondary"}>
                    {product.active ? (
                      <><Eye className="w-3 h-3 mr-1" /> Aktív</>
                    ) : (
                      <><EyeOff className="w-3 h-3 mr-1" /> Inaktív</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                                    {product.description && (
                    <div className="text-sm text-gray-600 mb-3">
                      {product.description}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-green-600">
                      {formatPrice(product.price, product.currency)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(product.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {(product.stripe_product_id || product.booking_url) && (
                    <div className="flex flex-wrap gap-1">
                      {product.stripe_product_id && (
                        <Badge variant="outline" className="text-xs">
                          Stripe
                        </Badge>
                      )}
                      {product.booking_url && (
                        <Badge variant="outline" className="text-xs">
                          Booking URL
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => closeEditDialog()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Termék szerkesztése</DialogTitle>
              <DialogDescription>
                {editingProduct.name} adatainak módosítása
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              formData={formData}
              setFormData={setFormData}
              quizzes={quizzes}
              onSave={handleUpdate}
              onCancel={closeEditDialog}
              saving={saving}
              error={error}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Product Form Component
interface ProductFormProps {
  formData: any
  setFormData: (data: any) => void
  quizzes: Quiz[]
  onSave: () => void
  onCancel: () => void
  saving: boolean
  error: string | null
}

function ProductForm({ formData, setFormData, quizzes, onSave, onCancel, saving, error }: ProductFormProps) {
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Alapadatok</TabsTrigger>
          <TabsTrigger value="pricing">Árazás</TabsTrigger>
          <TabsTrigger value="integration">Integráció</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiz_id">Kvíz *</Label>
              <Select value={formData.quiz_id} onValueChange={(value) => setFormData({...formData, quiz_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Válasszon kvízt" />
                </SelectTrigger>
                <SelectContent>
                  {quizzes.map(quiz => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      {quiz.slug}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Termék neve *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="pl. Premium elemzés"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Leírás</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Termék részletes leírása..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked: boolean) => setFormData({...formData, active: checked})}
            />
            <Label htmlFor="active">Aktív termék</Label>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Ár *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                placeholder="0"
              />
              <div className="text-xs text-gray-500">
                Ár normál formátumban (pl. 5990.00)
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Pénznem</Label>
              <Select value={formData.currency} onValueChange={(value: 'HUF' | 'EUR' | 'USD') => setFormData({...formData, currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HUF">HUF (Forint)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="USD">USD (Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking_url">Foglalás URL</Label>
            <Input
              id="booking_url"
              type="url"
              value={formData.booking_url}
              onChange={(e) => setFormData({...formData, booking_url: e.target.value})}
              placeholder="https://..."
            />
            <div className="text-xs text-gray-500">
              Külső foglalási oldal vagy szolgáltatás linkje
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Árazási információk</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• HUF esetén egész számot adjon meg (pl. 5990)</li>
              <li>• EUR/USD esetén tizedesjegyek is használhatók (pl. 29.99)</li>
              <li>• A Stripe integráció automatikusan szinkronizálja az árakat</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe_product_id">Stripe Product ID</Label>
              <Input
                id="stripe_product_id"
                value={formData.stripe_product_id}
                onChange={(e) => setFormData({...formData, stripe_product_id: e.target.value})}
                placeholder="prod_..."
              />
              <div className="text-xs text-gray-500">
                Stripe termék azonosító a fizetési integrációhoz
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_price_id">Stripe Price ID</Label>
              <Input
                id="stripe_price_id"
                value={formData.stripe_price_id}
                onChange={(e) => setFormData({...formData, stripe_price_id: e.target.value})}
                placeholder="price_..."
              />
              <div className="text-xs text-gray-500">
                Stripe ár azonosító - automatikusan validálódik
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata">Metadata (JSON)</Label>
              <Textarea
                id="metadata"
                value={JSON.stringify(formData.metadata, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setFormData({...formData, metadata: parsed})
                  } catch {
                    // Handle invalid JSON gracefully
                  }
                }}
                placeholder='{"key": "value"}'
                rows={4}
              />
              <div className="text-xs text-gray-500">
                További termék metaadatok JSON formátumban
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-green-900 mb-2">Szállítási módok</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>AI Generált:</strong> Automatikus jelentés készítés</li>
              <li>• <strong>Statikus PDF:</strong> Előre elkészített fájl</li>
              <li>• <strong>Külső link:</strong> URL átirányítás külső szolgáltatáshoz</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Mégse
        </Button>
        <Button onClick={onSave} disabled={saving}>
          {saving ? 'Mentés...' : 'Mentés'}
        </Button>
      </div>
    </div>
  )
}
