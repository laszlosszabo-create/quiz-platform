'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
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
  name?: string // From database schema
  description?: string // From database schema
  active: boolean
  price: number
  currency: 'HUF' | 'EUR' | 'USD'
  stripe_product_id?: string
  stripe_price_id?: string
  delivery_type: 'static_pdf' | 'ai_generated' | 'link'
  asset_url?: string
  booking_url?: string
  metadata?: any
  translations?: {
    hu?: {
      name: string
      description?: string
    }
    en?: {
      name: string
      description?: string
    }
  }
  created_at: string
  updated_at: string
}

interface ProductsEditorProps {
  quizData: any
  onDataChange: (field: string, value: any) => void
}

export default function ProductsEditor({ quizData, onDataChange }: ProductsEditorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    quiz_id: quizData?.id || '',
    active: true,
    price: 0,
    currency: 'HUF' as 'HUF' | 'EUR' | 'USD',
    stripe_product_id: '',
    stripe_price_id: '',
    delivery_type: 'ai_generated' as 'static_pdf' | 'ai_generated' | 'link',
    asset_url: '',
    translations: {
      hu: {
        name: '',
        description: ''
      },
      en: {
        name: '',
        description: ''
      }
    }
  })

  // Load products for this quiz
  useEffect(() => {
    if (quizData?.id) {
      loadProducts()
    }
  }, [quizData?.id])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/products?quiz_id=${quizData.id}`)
      if (!response.ok) throw new Error('Failed to load products')
      const data = await response.json()
      setProducts(data.products || [])
      
      // Trigger data change to parent
      onDataChange('products', data.products || [])
    } catch (err) {
      console.error('Load products error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.translations.hu.name || formData.price <= 0) {
      setError('Name and price are required')
      return
    }

    try {
      setSaving(true)
      
      // Prepare clean data for API
      const productData = {
        quiz_id: quizData.id,
        name: formData.translations.hu.name.trim(),
        description: formData.translations.hu.description?.trim() || null,
        price: formData.price,
        currency: formData.currency,
        active: formData.active,
        stripe_product_id: formData.stripe_product_id?.trim() || null,
        stripe_price_id: formData.stripe_price_id?.trim() || null,
        booking_url: formData.asset_url?.trim() || null,
        metadata: {
          delivery_type: formData.delivery_type,
          translations: {
            hu: {
              name: formData.translations.hu.name.trim(),
              description: formData.translations.hu.description?.trim() || null
            },
            en: {
              name: formData.translations.en.name?.trim() || null,
              description: formData.translations.en.description?.trim() || null
            }
          }
        }
      }
      
      console.log('Creating product with data:', productData)
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Product creation failed:', errorData)
        throw new Error(errorData.error || 'Failed to create product')
      }

      const newProduct = await response.json()
      console.log('Product created successfully:', newProduct)
      
      const updatedProducts = [newProduct, ...products]
      setProducts(updatedProducts)
      onDataChange('products', updatedProducts)
      resetForm()
      setIsCreateDialogOpen(false)
      setError('')
      
    } catch (err) {
      console.error('Create product error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingProduct || !formData.translations.hu.name || formData.price <= 0) {
      setError('Name and price are required')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.translations.hu.name,
          description: formData.translations.hu.description,
          price: formData.price,
          currency: formData.currency,
          active: formData.active,
          stripe_product_id: formData.stripe_product_id,
          stripe_price_id: formData.stripe_price_id,
          booking_url: formData.asset_url
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      const updatedProduct = await response.json()
      const updatedProducts = products.map(p => p.id === editingProduct.id ? updatedProduct : p)
      setProducts(updatedProducts)
      onDataChange('products', updatedProducts)
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

      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
      onDataChange('products', updatedProducts)
    } catch (err) {
      console.error('Delete product error:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  const resetForm = () => {
    setFormData({
      quiz_id: quizData?.id || '',
      active: true,
      price: 0,
      currency: 'HUF',
      stripe_product_id: '',
      stripe_price_id: '',
      delivery_type: 'ai_generated',
      asset_url: '',
      translations: {
        hu: {
          name: '',
          description: ''
        },
        en: {
          name: '',
          description: ''
        }
      }
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
      delivery_type: product.delivery_type,
      asset_url: product.asset_url || '',
      translations: {
        hu: {
          name: product.translations?.hu?.name || product.name || '',
          description: product.translations?.hu?.description || product.description || ''
        },
        en: {
          name: product.translations?.en?.name || '',
          description: product.translations?.en?.description || ''
        }
      }
    })
    setEditingProduct(product)
    setError(null)
  }

  const closeEditDialog = () => {
    setEditingProduct(null)
    resetForm()
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Termékek</h3>
          <p className="text-gray-600 text-sm mt-1">Quiz termékek és árazás kezelése</p>
        </div>
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
                Adja meg az új termék adatait ehhez a kvízhez
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              formData={formData}
              setFormData={setFormData}
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

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {product.translations?.hu?.name || product.name || 'Névtelen termék'}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {product.delivery_type === 'ai_generated' && 'AI Generált'}
                      {product.delivery_type === 'static_pdf' && 'Statikus PDF'}
                      {product.delivery_type === 'link' && 'Külső Link'}
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
                  {(product.translations?.hu?.description || product.description) && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.translations?.hu?.description || product.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-green-600">
                      {formatPrice(product.price, product.currency)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(product.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {product.stripe_product_id && (
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        Stripe Integration
                      </Badge>
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
                {editingProduct.translations?.hu?.name || editingProduct.name || 'Termék'} adatainak módosítása
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              formData={formData}
              setFormData={setFormData}
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
  onSave: () => void
  onCancel: () => void
  saving: boolean
  error: string | null
}

function ProductForm({ formData, setFormData, onSave, onCancel, saving, error }: ProductFormProps) {
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Termék neve (Magyar) *</Label>
              <Input
                id="name"
                value={formData.translations.hu.name}
                onChange={(e) => setFormData({...formData, translations: {...formData.translations, hu: {...formData.translations.hu, name: e.target.value}}})}
                placeholder="pl. Premium elemzés"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Leírás (Magyar)</Label>
              <Textarea
                id="description"
                value={formData.translations.hu.description}
                onChange={(e) => setFormData({...formData, translations: {...formData.translations, hu: {...formData.translations.hu, description: e.target.value}}})}
                placeholder="Termék részletes leírása..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_en">Termék neve (Angol)</Label>
              <Input
                id="name_en"
                value={formData.translations.en.name}
                onChange={(e) => setFormData({...formData, translations: {...formData.translations, en: {...formData.translations.en, name: e.target.value}}})}
                placeholder="e.g. Premium Analysis"
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
            <Label htmlFor="delivery_type">Szállítási mód</Label>
            <Select value={formData.delivery_type} onValueChange={(value: 'static_pdf' | 'ai_generated' | 'link') => setFormData({...formData, delivery_type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai_generated">AI Generált jelentés</SelectItem>
                <SelectItem value="static_pdf">Statikus PDF</SelectItem>
                <SelectItem value="link">Külső link</SelectItem>
              </SelectContent>
            </Select>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_price_id">Stripe Price ID</Label>
              <Input
                id="stripe_price_id"
                value={formData.stripe_price_id}
                onChange={(e) => setFormData({...formData, stripe_price_id: e.target.value})}
                placeholder="price_..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset_url">Asset URL</Label>
              <Input
                id="asset_url"
                type="url"
                value={formData.asset_url}
                onChange={(e) => setFormData({...formData, asset_url: e.target.value})}
                placeholder="https://..."
              />
            </div>
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
