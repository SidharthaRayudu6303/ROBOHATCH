import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { allProducts } from '../data/products'
import { defaultCategories } from '../data/categories'

export default function Admin() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [removedProducts, setRemovedProducts] = useState([])
  const [removedCategories, setRemovedCategories] = useState([])
  const [showRemoved, setShowRemoved] = useState(false)
  const [showRemovedCategories, setShowRemovedCategories] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [productEdits, setProductEdits] = useState({})
  const [categoryEdits, setCategoryEdits] = useState({})
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '' })
  const [categoryEditForm, setCategoryEditForm] = useState({ name: '', icon: '', link: '', items: [] })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [customProducts, setCustomProducts] = useState([])
  const [customCategories, setCustomCategories] = useState([])
  const [addForm, setAddForm] = useState({
    name: '',
    price: '',
    description: '',
    category: 'keychains',
    icon: 'fa-cube'
  })
  const [addCategoryForm, setAddCategoryForm] = useState({
    name: '',
    icon: 'fa-cube',
    link: '',
    items: ['']
  })
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [siteUpdates, setSiteUpdates] = useState([])
  const [editingUpdate, setEditingUpdate] = useState(null)
  const [updateForm, setUpdateForm] = useState({ message: '', active: true })

  // Load removed products, edits, and custom products from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('removedProducts')
    if (stored) {
      setRemovedProducts(JSON.parse(stored))
    }
    const edits = localStorage.getItem('productEdits')
    if (edits) {
      setProductEdits(JSON.parse(edits))
    }
    const custom = localStorage.getItem('customProducts')
    if (custom) {
      setCustomProducts(JSON.parse(custom))
    }
    
    // Load category data
    const removedCats = localStorage.getItem('removedCategories')
    if (removedCats) {
      setRemovedCategories(JSON.parse(removedCats))
    }
    const catEdits = localStorage.getItem('categoryEdits')
    if (catEdits) {
      setCategoryEdits(JSON.parse(catEdits))
    }
    const customCats = localStorage.getItem('customCategories')
    if (customCats) {
      setCustomCategories(JSON.parse(customCats))
    }
    
    // Load orders
    loadOrders()
    
    // Load updates
    loadUpdates()
  }, [])

  const loadOrders = () => {
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
  }

  const loadUpdates = () => {
    const storedUpdates = localStorage.getItem('siteUpdates')
    if (storedUpdates) {
      setSiteUpdates(JSON.parse(storedUpdates))
    }
  }

  const handleAddUpdate = () => {
    const newUpdate = {
      id: Date.now(),
      message: updateForm.message,
      active: updateForm.active,
      createdAt: new Date().toISOString()
    }
    const updatedUpdates = [...siteUpdates, newUpdate]
    setSiteUpdates(updatedUpdates)
    localStorage.setItem('siteUpdates', JSON.stringify(updatedUpdates))
    setUpdateForm({ message: '', active: true })
    window.dispatchEvent(new Event('updatesChanged'))
  }

  const handleEditUpdate = (update) => {
    setEditingUpdate(update)
    setUpdateForm({ message: update.message, active: update.active })
  }

  const handleSaveUpdateEdit = () => {
    const updatedUpdates = siteUpdates.map(update =>
      update.id === editingUpdate.id
        ? { ...update, message: updateForm.message, active: updateForm.active }
        : update
    )
    setSiteUpdates(updatedUpdates)
    localStorage.setItem('siteUpdates', JSON.stringify(updatedUpdates))
    setEditingUpdate(null)
    setUpdateForm({ message: '', active: true })
    window.dispatchEvent(new Event('updatesChanged'))
  }

  const handleDeleteUpdate = (updateId) => {
    if (confirm('Are you sure you want to delete this update?')) {
      const updatedUpdates = siteUpdates.filter(update => update.id !== updateId)
      setSiteUpdates(updatedUpdates)
      localStorage.setItem('siteUpdates', JSON.stringify(updatedUpdates))
      window.dispatchEvent(new Event('updatesChanged'))
    }
  }

  const handleToggleUpdateStatus = (updateId) => {
    const updatedUpdates = siteUpdates.map(update =>
      update.id === updateId ? { ...update, active: !update.active } : update
    )
    setSiteUpdates(updatedUpdates)
    localStorage.setItem('siteUpdates', JSON.stringify(updatedUpdates))
    window.dispatchEvent(new Event('updatesChanged'))
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  const handleDeleteOrder = (orderId) => {
    if (confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId)
      setOrders(updatedOrders)
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
      if (showOrderDetails) {
        setShowOrderDetails(false)
        setSelectedOrder(null)
      }
    }
  }

  const handleLogout = () => {
    router.push('/login')
  }

  const handleRemoveProduct = (productId) => {
    const newRemovedProducts = [...removedProducts, productId]
    setRemovedProducts(newRemovedProducts)
    localStorage.setItem('removedProducts', JSON.stringify(newRemovedProducts))
    // Dispatch event to update other pages
    window.dispatchEvent(new Event('productsUpdated'))
  }

  const handleRestoreProduct = (productId) => {
    const newRemovedProducts = removedProducts.filter(id => id !== productId)
    setRemovedProducts(newRemovedProducts)
    localStorage.setItem('removedProducts', JSON.stringify(newRemovedProducts))
    // Dispatch event to update other pages
    window.dispatchEvent(new Event('productsUpdated'))
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setEditForm({
      name: productEdits[product.id]?.name || product.name,
      price: productEdits[product.id]?.price || product.price,
      description: productEdits[product.id]?.description || product.description
    })
  }

  const handleSaveEdit = () => {
    if (!editingProduct) return
    
    const newEdits = {
      ...productEdits,
      [editingProduct.id]: {
        name: editForm.name,
        price: parseFloat(editForm.price),
        description: editForm.description
      }
    }
    
    setProductEdits(newEdits)
    localStorage.setItem('productEdits', JSON.stringify(newEdits))
    setEditingProduct(null)
    // Dispatch event to update other pages
    window.dispatchEvent(new Event('productsUpdated'))
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setEditForm({ name: '', price: '', description: '' })
  }

  const handleAddProduct = () => {
    setShowAddModal(true)
    setAddForm({
      name: '',
      price: '',
      description: '',
      category: 'keychains',
      icon: 'fa-cube'
    })
  }

  const handleSaveNewProduct = () => {
    if (!addForm.name || !addForm.price) {
      alert('Please fill in product name and price')
      return
    }

    const newProduct = {
      id: 'custom_' + Date.now(),
      name: addForm.name,
      price: parseFloat(addForm.price),
      description: addForm.description,
      icon: addForm.icon,
      category: addForm.category,
      image: '/products/custom.jpg'
    }

    const updatedCustomProducts = [...customProducts, newProduct]
    setCustomProducts(updatedCustomProducts)
    localStorage.setItem('customProducts', JSON.stringify(updatedCustomProducts))
    setShowAddModal(false)
    // Dispatch event to update other pages
    window.dispatchEvent(new Event('productsUpdated'))
  }

  const handleCancelAdd = () => {
    setShowAddModal(false)
    setAddForm({
      name: '',
      price: '',
      description: '',
      category: 'keychains',
      icon: 'fa-cube'
    })
  }

  // Category Management Functions
  const handleRemoveCategory = (categoryId) => {
    const newRemovedCategories = [...removedCategories, categoryId]
    setRemovedCategories(newRemovedCategories)
    localStorage.setItem('removedCategories', JSON.stringify(newRemovedCategories))
    window.dispatchEvent(new Event('categoriesUpdated'))
  }

  const handleRestoreCategory = (categoryId) => {
    const newRemovedCategories = removedCategories.filter(id => id !== categoryId)
    setRemovedCategories(newRemovedCategories)
    localStorage.setItem('removedCategories', JSON.stringify(newRemovedCategories))
    window.dispatchEvent(new Event('categoriesUpdated'))
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setCategoryEditForm({
      name: categoryEdits[category.id]?.name || category.name,
      icon: categoryEdits[category.id]?.icon || category.icon,
      link: categoryEdits[category.id]?.link || category.link,
      items: categoryEdits[category.id]?.items || category.items
    })
  }

  const handleSaveCategoryEdit = () => {
    if (!editingCategory) return
    
    const newEdits = {
      ...categoryEdits,
      [editingCategory.id]: {
        name: categoryEditForm.name,
        icon: categoryEditForm.icon,
        link: categoryEditForm.link,
        items: categoryEditForm.items
      }
    }
    
    setCategoryEdits(newEdits)
    localStorage.setItem('categoryEdits', JSON.stringify(newEdits))
    setEditingCategory(null)
    window.dispatchEvent(new Event('categoriesUpdated'))
  }

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null)
    setCategoryEditForm({ name: '', icon: '', link: '', items: [] })
  }

  const handleAddCategory = () => {
    setShowAddCategoryModal(true)
    setAddCategoryForm({
      name: '',
      icon: 'fa-cube',
      link: '',
      items: ['']
    })
  }

  const handleSaveNewCategory = () => {
    if (!addCategoryForm.name || !addCategoryForm.icon) {
      alert('Please fill in category name and icon')
      return
    }

    const newCategory = {
      id: 'custom_cat_' + Date.now(),
      name: addCategoryForm.name,
      icon: addCategoryForm.icon,
      link: addCategoryForm.link || '/' + addCategoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      items: addCategoryForm.items.filter(item => item.trim() !== '')
    }

    const updatedCustomCategories = [...customCategories, newCategory]
    setCustomCategories(updatedCustomCategories)
    localStorage.setItem('customCategories', JSON.stringify(updatedCustomCategories))
    setShowAddCategoryModal(false)
    window.dispatchEvent(new Event('categoriesUpdated'))
  }

  const handleCancelAddCategory = () => {
    setShowAddCategoryModal(false)
    setAddCategoryForm({
      name: '',
      icon: 'fa-cube',
      link: '',
      items: ['']
    })
  }

  const handleAddCategoryItem = () => {
    setAddCategoryForm({
      ...addCategoryForm,
      items: [...addCategoryForm.items, '']
    })
  }

  const handleRemoveCategoryItem = (index) => {
    const newItems = addCategoryForm.items.filter((_, i) => i !== index)
    setAddCategoryForm({
      ...addCategoryForm,
      items: newItems.length > 0 ? newItems : ['']
    })
  }

  const handleCategoryItemChange = (index, value) => {
    const newItems = [...addCategoryForm.items]
    newItems[index] = value
    setAddCategoryForm({
      ...addCategoryForm,
      items: newItems
    })
  }

  const getAllCategoriesList = () => {
    const categoriesList = []
    defaultCategories.forEach(category => {
      const editedCategory = categoryEdits[category.id] || {}
      categoriesList.push({
        ...category,
        ...editedCategory
      })
    })
    
    customCategories.forEach(category => {
      const editedCategory = categoryEdits[category.id] || {}
      categoriesList.push({
        ...category,
        ...editedCategory
      })
    })
    
    return categoriesList
  }

  const getActiveCategoriesList = () => {
    return getAllCategoriesList().filter(c => !removedCategories.includes(c.id))
  }

  const getRemovedCategoriesList = () => {
    return getAllCategoriesList().filter(c => removedCategories.includes(c.id))
  }

  // Get all products for display with edits applied and custom products
  const getAllProductsList = () => {
    const productsList = []
    Object.keys(allProducts).forEach(category => {
      allProducts[category].forEach(product => {
        const editedProduct = productEdits[product.id] || {}
        productsList.push({
          ...product,
          ...editedProduct,
          category: category.charAt(0).toUpperCase() + category.slice(1)
        })
      })
    })
    
    // Add custom products
    customProducts.forEach(product => {
      const editedProduct = productEdits[product.id] || {}
      productsList.push({
        ...product,
        ...editedProduct,
        category: product.category.charAt(0).toUpperCase() + product.category.slice(1)
      })
    })
    
    return productsList
  }

  const getFilteredProducts = () => {
    const allProductsList = getAllProductsList()
    const activeProducts = allProductsList.filter(p => !removedProducts.includes(p.id))
    if (selectedCategory === 'all') {
      return activeProducts
    }
    return activeProducts.filter(p => p.category.toLowerCase() === selectedCategory)
  }

  const getRemovedProductsList = () => {
    const allProductsList = getAllProductsList()
    return allProductsList.filter(p => removedProducts.includes(p.id))
  }

  return (
    <>
      <Navbar />
      <div className="flex bg-gradient-to-br from-orange-50/30 via-white to-amber-50/20 min-h-screen">
        <div className="w-[260px] bg-dark-brown text-white p-0 py-8 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="text-center px-6 mb-10">
            <i className="fas fa-user-shield text-4xl mb-3 text-primary-orange"></i>
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="flex flex-col gap-1">
            <button 
              className={`flex items-center gap-3 px-6 py-3.5 text-left transition-all border-none bg-transparent cursor-pointer w-full text-sm font-medium ${activeTab === 'overview' ? 'bg-primary-orange/10 text-primary-orange border-l-4 border-primary-orange' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-line text-lg"></i>
              Overview
            </button>
            <button 
              className={`flex items-center gap-3 px-6 py-3.5 text-left transition-all border-none bg-transparent cursor-pointer w-full text-sm font-medium ${activeTab === 'orders' ? 'bg-primary-orange/10 text-primary-orange border-l-4 border-primary-orange' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="fas fa-shopping-bag text-lg"></i>
              Orders
            </button>
            <button 
              className={`flex items-center gap-3 px-6 py-3.5 text-left transition-all border-none bg-transparent cursor-pointer w-full text-sm font-medium ${activeTab === 'products' ? 'bg-primary-orange/10 text-primary-orange border-l-4 border-primary-orange' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
              onClick={() => setActiveTab('products')}
            >
              <i className="fas fa-box text-lg"></i>
              Products
            </button>
            <button 
              className={`flex items-center gap-3 px-6 py-3.5 text-left transition-all border-none bg-transparent cursor-pointer w-full text-sm font-medium ${activeTab === 'categories' ? 'bg-primary-orange/10 text-primary-orange border-l-4 border-primary-orange' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
              onClick={() => setActiveTab('categories')}
            >
              <i className="fas fa-th-large text-lg"></i>
              Categories
            </button>
            <button 
              className={`flex items-center gap-3 px-6 py-3.5 text-left transition-all border-none bg-transparent cursor-pointer w-full text-sm font-medium ${activeTab === 'customers' ? 'bg-primary-orange/10 text-primary-orange border-l-4 border-primary-orange' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
              onClick={() => setActiveTab('customers')}
            >
              <i className="fas fa-users text-lg"></i>
              Customers
            </button>
            <button 
              className={`flex items-center gap-3 px-6 py-3.5 text-left transition-all border-none bg-transparent cursor-pointer w-full text-sm font-medium ${activeTab === 'updates' ? 'bg-primary-orange/10 text-primary-orange border-l-4 border-primary-orange' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
              onClick={() => setActiveTab('updates')}
            >
              <i className="fas fa-bullhorn text-lg"></i>
              Updates
            </button>
            <button 
              className={`flex items-center gap-3 px-6 py-3.5 text-left transition-all border-none bg-transparent cursor-pointer w-full text-sm font-medium ${activeTab === 'settings' ? 'bg-primary-orange/10 text-primary-orange border-l-4 border-primary-orange' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog text-lg"></i>
              Settings
            </button>
          </nav>
          <button className="mt-auto mx-6 flex items-center justify-center gap-3 bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-red-700 border-none cursor-pointer w-[calc(100%-3rem)]" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">Welcome to Admin Dashboard</h1>
            <p className="text-[#666]">Manage your ROBOHATCH store</p>
            </div>

            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white p-6 rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1.5 flex items-start gap-5">
                    <div className="w-[60px] h-[60px] rounded-xl flex items-center justify-center text-2xl text-white bg-gradient-to-br from-[#667eea] to-[#764ba2]">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-[#666] font-medium mb-1">Total Orders</h3>
                      <p className="text-[1.8rem] font-bold text-dark-brown mb-1">156</p>
                      <span className="text-sm text-[#4caf50]">+12% from last month</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1.5 flex items-start gap-5">
                    <div className="w-[60px] h-[60px] rounded-xl flex items-center justify-center text-2xl text-white bg-gradient-to-br from-[#f093fb] to-[#f5576c]">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-[#666] font-medium mb-1">Revenue</h3>
                      <p className="text-[1.8rem] font-bold text-dark-brown mb-1">₹45,890</p>
                      <span className="text-sm text-[#4caf50]">+8% from last month</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1.5 flex items-start gap-5">
                    <div className="w-[60px] h-[60px] rounded-xl flex items-center justify-center text-2xl text-white bg-gradient-to-br from-[#fa709a] to-[#fee140]">
                      <i className="fas fa-box"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-[#666] font-medium mb-1">Products</h3>
                      <p className="text-[1.8rem] font-bold text-dark-brown mb-1">32</p>
                      <span className="text-sm text-[#666]">4 categories</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1.5 flex items-start gap-5">
                    <div className="w-[60px] h-[60px] rounded-xl flex items-center justify-center text-2xl text-white bg-gradient-to-br from-[#30cfd0] to-[#330867]">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-[#666] font-medium mb-1">Customers</h3>
                      <p className="text-[1.8rem] font-bold text-dark-brown mb-1">89</p>
                      <span className="text-sm text-[#4caf50]">+15 this week</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <h2 className="text-xl font-semibold text-dark-brown mb-6">Recent Orders</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-[#f8f9fa]">
                        <tr>
                          <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Order ID</th>
                          <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Customer</th>
                          <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Product</th>
                          <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Status</th>
                          <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Total</th>
                          <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">#{order.id}</td>
                            <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">{order.customer}</td>
                            <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">{order.product}</td>
                            <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">
                              <span className={`py-1.5 px-3 rounded-full text-xs font-semibold inline-block ${order.status.toLowerCase() === 'pending' ? 'bg-[#fff3cd] text-[#856404]' : order.status.toLowerCase() === 'completed' ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#d1ecf1] text-[#0c5460]'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">{order.total}</td>
                            <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-dark-brown mb-6">All Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#f8f9fa]">
                      <tr>
                        <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Order ID</th>
                        <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Customer</th>
                        <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Email</th>
                        <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Product</th>
                        <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Status</th>
                        <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Total</th>
                        <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Date</th>
                        <th className="p-4 text-left font-semibold text-dark-brown text-sm border-b-2 border-[#e9ecef]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm font-medium">#{order.id}</td>
                          <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">{order.customer}</td>
                          <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">{order.email}</td>
                          <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">{order.product}</td>
                          <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">
                            <span className={`py-1.5 px-3 rounded-full text-xs font-semibold inline-block ${
                              order.status.toLowerCase() === 'pending' ? 'bg-[#fff3cd] text-[#856404]' : 
                              order.status.toLowerCase() === 'completed' ? 'bg-[#d4edda] text-[#155724]' : 
                              'bg-[#d1ecf1] text-[#0c5460]'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm font-semibold">{order.total}</td>
                          <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">{order.date}</td>
                          <td className="p-4 border-b border-[#e9ecef] text-[#666] text-sm">
                            <button 
                              onClick={() => handleViewOrder(order)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 mr-2"
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteOrder(order.id)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                              title="Delete Order"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-semibold text-dark-brown">Products Management</h2>
                  <div className="flex gap-4 items-center">
                    <button 
                      className={`px-6 py-3 rounded-lg font-medium transition-all border-none cursor-pointer flex items-center gap-2 ${
                        showRemoved 
                          ? 'bg-gray-600 text-white hover:bg-gray-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setShowRemoved(!showRemoved)}
                    >
                      <i className="fas fa-eye"></i>
                      {showRemoved ? 'Hide' : 'Show'} Removed ({getRemovedProductsList().length})
                    </button>
                    <button 
                      className="bg-primary-orange text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-hover-orange border-none cursor-pointer flex items-center gap-2"
                      onClick={handleAddProduct}
                    >
                      <i className="fas fa-plus"></i>
                      Add Product
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mb-8 flex-wrap">
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'all' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Products ({getFilteredProducts().length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'keychains' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('keychains')}
                  >
                    Keychains ({allProducts.keychains.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'superhero' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('superhero')}
                  >
                    Superhero ({allProducts.superhero.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'devotional' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('devotional')}
                  >
                    Devotional ({allProducts.devotional.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'toys' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('toys')}
                  >
                    Toys ({allProducts.toys.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'lamps' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('lamps')}
                  >
                    Lamps ({allProducts.lamps.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'idols' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('idols')}
                  >
                    Idols ({allProducts.idols.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'flowerpots' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('flowerpots')}
                  >
                    Flower Pots ({allProducts.flowerpots.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'office' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('office')}
                  >
                    Office Supplies ({allProducts.office.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'phoneaccessories' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('phoneaccessories')}
                  >
                    Phone Accessories ({allProducts.phoneaccessories.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'homedecor' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('homedecor')}
                  >
                    Home Decor ({allProducts.homedecor.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                  <button 
                    className={`px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedCategory === 'jewelry' ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white border-2 border-[#e9ecef] text-[#666] hover:border-primary-orange hover:text-primary-orange'}`}
                    onClick={() => setSelectedCategory('jewelry')}
                  >
                    Jewelry ({allProducts.jewelry.filter(p => !removedProducts.includes(p.id)).length})
                  </button>
                </div>

                {!showRemoved && (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                    {getFilteredProducts().map(product => (
                      <div key={product.id} className="bg-white rounded-[15px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex gap-4 transition-all hover:-translate-y-1.5 hover:shadow-[0_5px_20px_rgba(0,0,0,0.12)] relative">
                        <div className="w-[60px] h-[60px] min-w-[60px] bg-gradient-to-br from-primary-orange to-hover-orange rounded-xl flex items-center justify-center text-[1.8rem] text-white">
                          <i className={`fas ${product.icon}`}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg text-dark-brown mb-2 font-bold">{product.name}</h3>
                          <p className="text-sm text-[#666] mb-3 leading-snug">{product.description}</p>
                          <div className="flex justify-between items-center gap-3">
                            <span className="text-xs py-1.5 px-3 bg-[#e3f2fd] text-[#1976d2] rounded-full font-semibold">{product.category}</span>
                            <span className="text-lg font-bold text-primary-orange">₹{product.price}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button 
                            className="bg-transparent border-none p-2.5 cursor-pointer text-[#666] transition-colors text-[0.95rem] hover:text-primary-orange" 
                            title="Edit Product"
                            onClick={() => handleEditProduct(product)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="bg-transparent border-none p-2.5 cursor-pointer text-[#666] transition-colors text-[0.95rem] hover:text-[#f44336]" 
                            title="Remove Product"
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showRemoved && (
                  <div className="mt-8 p-6 bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                    <h3 className="text-xl text-[#666] mb-6 flex items-center gap-3">
                      <i className="fas fa-archive text-primary-orange"></i>
                      Removed Products ({getRemovedProductsList().length})
                    </h3>
                    {getRemovedProductsList().length === 0 ? (
                      <p className="text-center py-12 text-[#999] text-lg bg-white rounded-[15px]">No removed products</p>
                    ) : (
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                        {getRemovedProductsList().map(product => (
                          <div key={product.id} className="bg-white rounded-[15px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex gap-4 transition-all hover:-translate-y-1.5 hover:shadow-[0_5px_20px_rgba(0,0,0,0.12)] relative opacity-70 border-2 border-dashed border-[#ddd] hover:opacity-100 hover:border-primary-orange">
                            <div className="w-[60px] h-[60px] min-w-[60px] bg-gradient-to-br from-primary-orange to-hover-orange rounded-xl flex items-center justify-center text-[1.8rem] text-white">
                              <i className={`fas ${product.icon}`}></i>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg text-dark-brown mb-2 font-bold">{product.name}</h3>
                              <p className="text-sm text-[#666] mb-3 leading-snug">{product.description}</p>
                              <div className="flex justify-between items-center gap-3">
                                <span className="text-xs py-1.5 px-3 bg-[#e3f2fd] text-[#1976d2] rounded-full font-semibold">{product.category}</span>
                                <span className="text-lg font-bold text-primary-orange">₹{product.price}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button 
                                className="bg-primary-orange text-white rounded-full w-[35px] h-[35px] flex items-center justify-center border-none p-2.5 cursor-pointer transition-colors text-[0.95rem] hover:bg-hover-orange hover:scale-110" 
                                title="Restore Product"
                                onClick={() => handleRestoreProduct(product.id)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-semibold text-dark-brown">Categories Management</h2>
                  <div className="flex gap-4 items-center">
                    <button 
                      className={`px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-semibold cursor-pointer transition-all ${showRemovedCategories ? 'bg-primary-orange border-primary-orange text-white border-2' : 'bg-white text-[#666] border-2 border-[#e9ecef] hover:border-primary-orange hover:text-primary-orange'}`}
                      onClick={() => setShowRemovedCategories(!showRemovedCategories)}
                    >
                      <i className="fas fa-eye"></i>
                      {showRemovedCategories ? 'Hide' : 'Show'} Removed ({getRemovedCategoriesList().length})
                    </button>
                    <button 
                      className="bg-primary-orange text-white border-none px-6 py-3 rounded-lg flex items-center gap-2 text-[0.95rem] font-semibold cursor-pointer transition-all hover:bg-hover-orange hover:-translate-y-0.5"
                      onClick={handleAddCategory}
                    >
                      <i className="fas fa-plus"></i>
                      Add Category
                    </button>
                  </div>
                </div>

                {!showRemovedCategories && (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                    {getActiveCategoriesList().map(category => (
                      <div key={category.id} className="bg-white rounded-[15px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex gap-4 transition-all hover:-translate-y-1.5 hover:shadow-[0_5px_20px_rgba(0,0,0,0.12)] relative">
                        <div className="w-[60px] h-[60px] min-w-[60px] bg-gradient-to-br from-[#2196f3] to-[#1976d2] rounded-xl flex items-center justify-center text-[1.8rem] text-white">
                          <i className={`fas ${category.icon}`}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg text-dark-brown mb-2 font-bold">{category.name}</h3>
                          <p className="text-sm text-[#666] mb-2 font-mono">Link: {category.link}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs py-1.5 px-3 bg-[#e8f5e9] text-[#388e3c] rounded-full font-semibold flex items-center gap-1">
                              <i className="fas fa-list"></i>
                              {category.items.length} items
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button 
                            className="bg-transparent border-none p-2.5 cursor-pointer text-[#666] transition-colors text-[0.95rem] hover:text-primary-orange" 
                            title="Edit Category"
                            onClick={() => handleEditCategory(category)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="action-btn delete" 
                            title="Remove Category"
                            onClick={() => handleRemoveCategory(category.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showRemovedCategories && (
                  <div className="mt-8 p-6 bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                    <h3 className="text-xl text-[#666] mb-6 flex items-center gap-3">
                      <i className="fas fa-archive text-primary-orange"></i>
                      Removed Categories ({getRemovedCategoriesList().length})
                    </h3>
                    {getRemovedCategoriesList().length === 0 ? (
                      <p className="text-center py-12 text-[#999] text-lg bg-white rounded-[15px]">No removed categories</p>
                    ) : (
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                        {getRemovedCategoriesList().map(category => (
                          <div key={category.id} className="bg-white rounded-[15px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex gap-4 transition-all hover:-translate-y-1.5 hover:shadow-[0_5px_20px_rgba(0,0,0,0.12)] relative opacity-70 border-2 border-dashed border-[#ddd] hover:opacity-100 hover:border-[#2196f3]">
                            <div className="w-[60px] h-[60px] min-w-[60px] bg-gradient-to-br from-[#2196f3] to-[#1976d2] rounded-xl flex items-center justify-center text-[1.8rem] text-white">
                              <i className={`fas ${category.icon}`}></i>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg text-dark-brown mb-2 font-bold">{category.name}</h3>
                              <p className="text-sm text-[#666] mb-2 font-mono">Link: {category.link}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs py-1.5 px-3 bg-[#e8f5e9] text-[#388e3c] rounded-full font-semibold flex items-center gap-1">
                                  <i className="fas fa-list"></i>
                                  {category.items.length} items
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button 
                                className="bg-primary-orange text-white rounded-full w-[35px] h-[35px] flex items-center justify-center border-none p-2.5 cursor-pointer transition-colors text-[0.95rem] hover:bg-hover-orange hover:scale-110" 
                                title="Restore Category"
                                onClick={() => handleRestoreCategory(category.id)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'customers' && (
              <div>
                <h2 className="text-xl font-semibold text-dark-brown mb-6">Customer Management</h2>
                <p className="text-center py-12 text-[#999] text-lg">Customer management interface coming soon...</p>
              </div>
            )}

            {activeTab === 'updates' && (
              <div>
                <h2 className="text-xl font-semibold text-dark-brown mb-6 flex items-center justify-between">
                  <span>Site Updates</span>
                </h2>
                
                {/* Add New Update Form */}
                <div className="bg-white p-8 rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] mb-8">
                  <h3 className="text-xl font-bold text-dark-brown mb-4">Add New Update</h3>
                  <div className="mb-4">
                    <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Update Message</label>
                    <textarea
                      value={updateForm.message}
                      onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })}
                      placeholder="Enter update message (e.g., 'New products available!', 'Free shipping on orders above ₹1000')"
                      rows="3"
                      className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10 resize-none"
                    />
                  </div>
                  <div className="mb-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="activeStatus"
                      checked={updateForm.active}
                      onChange={(e) => setUpdateForm({ ...updateForm, active: e.target.checked })}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="activeStatus" className="text-sm text-gray-700 cursor-pointer">Show on website</label>
                  </div>
                  <button
                    onClick={handleAddUpdate}
                    disabled={!updateForm.message.trim()}
                    className="bg-primary-orange text-white px-6 py-3 rounded-lg font-semibold transition-all hover:bg-hover-orange border-none cursor-pointer shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Update
                  </button>
                </div>

                {/* Updates List */}
                <div className="bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-dark-brown">All Updates ({siteUpdates.length})</h3>
                  </div>
                  {siteUpdates.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <i className="fas fa-bullhorn text-5xl mb-4 text-gray-300"></i>
                      <p className="text-lg">No updates yet. Add your first update above!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {siteUpdates.map((update) => (
                        <div key={update.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  update.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {update.active ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(update.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-dark-brown font-medium mb-2">{update.message}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleUpdateStatus(update.id)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                  update.active
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                                title={update.active ? 'Deactivate' : 'Activate'}
                              >
                                <i className={`fas ${update.active ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </button>
                              <button
                                onClick={() => handleEditUpdate(update)}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-200 transition-all"
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteUpdate(update.id)}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition-all"
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold text-dark-brown mb-6">Settings</h2>
                <div className="bg-white p-8 rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] max-w-[600px]">
                  <h3 className="text-2xl font-bold text-dark-brown mb-6">Store Information</h3>
                  <div className="mb-6">
                    <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Store Name</label>
                    <input type="text" defaultValue="ROBOHATCH" className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10" />
                  </div>
                  <div className="mb-6">
                    <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Contact Email</label>
                    <input type="email" defaultValue="info@robohatch.com" className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10" />
                  </div>
                  <div className="mb-6">
                    <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Phone Number</label>
                    <input type="tel" defaultValue="+91 1234567890" className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10" />
                  </div>
                  <button className="bg-primary-orange text-white px-8 py-3 rounded-lg font-semibold transition-all hover:bg-hover-orange border-none cursor-pointer shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)]">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Update Modal */}
        {editingUpdate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]" onClick={() => setEditingUpdate(null)}>
            <div className="bg-white rounded-[20px] w-[90%] max-w-[500px] shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-modal-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center px-8 py-6 border-b-2 border-[#f0f0f0]">
                <h2 className="text-2xl text-dark-brown m-0">Edit Update</h2>
                <button className="bg-transparent border-none text-2xl text-[#999] cursor-pointer transition-colors w-[35px] h-[35px] flex items-center justify-center rounded-full hover:text-[#f44336] hover:bg-[#fee]" onClick={() => setEditingUpdate(null)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Update Message</label>
                  <textarea
                    value={updateForm.message}
                    onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })}
                    placeholder="Enter update message"
                    rows="4"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10 resize-none"
                  />
                </div>
                <div className="mb-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editActiveStatus"
                    checked={updateForm.active}
                    onChange={(e) => setUpdateForm({ ...updateForm, active: e.target.checked })}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="editActiveStatus" className="text-sm text-gray-700 cursor-pointer">Show on website</label>
                </div>
              </div>
              <div className="flex justify-end gap-4 px-8 py-6 border-t-2 border-[#f0f0f0]">
                <button className="bg-[#f5f5f5] text-[#666] border-none px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-[#e0e0e0]" onClick={() => setEditingUpdate(null)}>
                  Cancel
                </button>
                <button className="bg-gradient-to-br from-primary-orange to-hover-orange text-white border-none px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)]" onClick={handleSaveUpdateEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]" onClick={handleCancelEdit}>
            <div className="bg-white rounded-[20px] w-[90%] max-w-[500px] shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-modal-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center px-8 py-6 border-b-2 border-[#f0f0f0]">
                <h2 className="text-2xl text-dark-brown m-0">Edit Product</h2>
                <button className="bg-transparent border-none text-2xl text-[#999] cursor-pointer transition-colors w-[35px] h-[35px] flex items-center justify-center rounded-full hover:text-[#f44336] hover:bg-[#fee]" onClick={handleCancelEdit}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Product Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                </div>
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Price (₹)</label>
                  <input 
                    type="number" 
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    placeholder="Enter price"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                </div>
                <div className="mb-6 last:mb-0">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Description</label>
                  <textarea 
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    placeholder="Enter product description"
                    rows="4"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10 resize-y min-h-[100px]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 px-8 py-6 border-t-2 border-[#f0f0f0]">
                <button className="bg-[#f5f5f5] text-[#666] border-none px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-[#e0e0e0]" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button className="bg-gradient-to-br from-primary-orange to-hover-orange text-white border-none px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)]" onClick={handleSaveEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]" onClick={handleCancelAdd}>
            <div className="bg-white rounded-[20px] w-[90%] max-w-[500px] shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-modal-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center px-8 py-6 border-b-2 border-[#f0f0f0]">
                <h2 className="text-2xl text-dark-brown m-0">Add New Product</h2>
                <button className="bg-transparent border-none text-2xl text-[#999] cursor-pointer transition-colors w-[35px] h-[35px] flex items-center justify-center rounded-full hover:text-[#f44336] hover:bg-[#fee]" onClick={handleCancelAdd}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Product Name *</label>
                  <input 
                    type="text" 
                    value={addForm.name}
                    onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                </div>
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Price (₹) *</label>
                  <input 
                    type="number" 
                    value={addForm.price}
                    onChange={(e) => setAddForm({...addForm, price: e.target.value})}
                    placeholder="Enter price"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                </div>
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Description</label>
                  <textarea 
                    value={addForm.description}
                    onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                    placeholder="Enter product description"
                    rows="4"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10 resize-y min-h-[100px]"
                  />
                </div>
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Category *</label>
                  <select 
                    value={addForm.category}
                    onChange={(e) => setAddForm({...addForm, category: e.target.value})}
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  >
                    <option value="keychains">Keychains</option>
                    <option value="superhero">Superhero Models</option>
                    <option value="devotional">Devotional Items</option>
                    <option value="toys">Toys & Games</option>
                    <option value="lamps">Lamps</option>
                    <option value="idols">Idols</option>
                    <option value="flowerpots">Flower Pots</option>
                    <option value="office">Office Supplies</option>
                    <option value="phoneaccessories">Phone Accessories</option>
                    <option value="homedecor">Home Decor</option>
                    <option value="jewelry">Jewelry & Accessories</option>
                  </select>
                </div>
                <div className="mb-6 last:mb-0">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Icon Class</label>
                  <input 
                    type="text" 
                    value={addForm.icon}
                    onChange={(e) => setAddForm({...addForm, icon: e.target.value})}
                    placeholder="e.g., fa-cube, fa-star, fa-heart"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                  <small className="block mt-1 text-[#666] text-sm">FontAwesome icon class (e.g., fa-cube, fa-star)</small>
                </div>
              </div>
              <div className="flex justify-end gap-4 px-8 py-6 border-t-2 border-[#f0f0f0]">
                <button className="bg-[#f5f5f5] text-[#666] border-none px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-[#e0e0e0]" onClick={handleCancelAdd}>
                  Cancel
                </button>
                <button className="bg-gradient-to-br from-primary-orange to-hover-orange text-white border-none px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)]" onClick={handleSaveNewProduct}>
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]" onClick={handleCancelCategoryEdit}>
            <div className="bg-white rounded-[20px] w-[90%] max-w-[500px] shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-modal-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center px-8 py-6 border-b-2 border-[#f0f0f0]">
                <h2 className="text-2xl text-dark-brown m-0">Edit Category</h2>
                <button className="bg-transparent border-none text-2xl text-[#999] cursor-pointer transition-colors w-[35px] h-[35px] flex items-center justify-center rounded-full hover:text-[#f44336] hover:bg-[#fee]" onClick={handleCancelCategoryEdit}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Category Name</label>
                  <input 
                    type="text" 
                    value={categoryEditForm.name}
                    onChange={(e) => setCategoryEditForm({...categoryEditForm, name: e.target.value})}
                    placeholder="Enter category name"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                </div>
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Icon Class</label>
                  <input 
                    type="text" 
                    value={categoryEditForm.icon}
                    onChange={(e) => setCategoryEditForm({...categoryEditForm, icon: e.target.value})}
                    placeholder="e.g., fa-cube, fa-star"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                </div>
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Link URL</label>
                  <input 
                    type="text" 
                    value={categoryEditForm.link}
                    onChange={(e) => setCategoryEditForm({...categoryEditForm, link: e.target.value})}
                    placeholder="/category-name"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                </div>
                <div className="mb-6 last:mb-0">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Items (comma separated)</label>
                  <textarea 
                    value={categoryEditForm.items.join(', ')}
                    onChange={(e) => setCategoryEditForm({
                      ...categoryEditForm, 
                      items: e.target.value.split(',').map(item => item.trim())
                    })}
                    placeholder="Item 1, Item 2, Item 3"
                    rows="4"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10 resize-y min-h-[100px]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 px-8 py-6 border-t-2 border-[#f0f0f0]">
                <button className="bg-[#f5f5f5] text-[#666] border-none px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-[#e0e0e0]" onClick={handleCancelCategoryEdit}>
                  Cancel
                </button>
                <button className="bg-gradient-to-br from-primary-orange to-hover-orange text-white border-none px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)]" onClick={handleSaveCategoryEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000]" onClick={handleCancelAddCategory}>
            <div className="bg-white rounded-[20px] w-[90%] max-w-[600px] shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-modal-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center px-8 py-6 border-b-2 border-[#f0f0f0]">
                <h2 className="text-2xl text-dark-brown m-0">Add New Category</h2>
                <button className="bg-transparent border-none text-2xl text-[#999] cursor-pointer transition-colors w-[35px] h-[35px] flex items-center justify-center rounded-full hover:text-[#f44336] hover:bg-[#fee]" onClick={handleCancelAddCategory}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Category Name *</label>
                  <input 
                    type="text" 
                    value={addCategoryForm.name}
                    onChange={(e) => setAddCategoryForm({...addCategoryForm, name: e.target.value})}
                    placeholder="Enter category name"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                </div>
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Icon Class *</label>
                  <input 
                    type="text" 
                    value={addCategoryForm.icon}
                    onChange={(e) => setAddCategoryForm({...addCategoryForm, icon: e.target.value})}
                    placeholder="e.g., fa-cube, fa-star, fa-heart"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                  <small className="block mt-1 text-[#666] text-sm">FontAwesome icon class</small>
                </div>
                <div className="mb-6">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Link URL</label>
                  <input 
                    type="text" 
                    value={addCategoryForm.link}
                    onChange={(e) => setAddCategoryForm({...addCategoryForm, link: e.target.value})}
                    placeholder="/category-name (leave empty for auto-generate)"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                  />
                </div>
                <div className="mb-6 last:mb-0">
                  <label className="block font-semibold text-dark-brown mb-2 text-[0.95rem]">Category Items</label>
                  <div className="flex flex-col gap-3">
                    {addCategoryForm.items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={item}
                          onChange={(e) => handleCategoryItemChange(index, e.target.value)}
                          placeholder={`Item ${index + 1}`}
                          className="flex-1 px-4 py-3.5 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10"
                        />
                        <button 
                          type="button"
                          className="w-[36px] h-[36px] min-w-[36px] bg-[#ffebee] text-[#f44336] border-none rounded-lg cursor-pointer transition-all flex items-center justify-center hover:bg-[#f44336] hover:text-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => handleRemoveCategoryItem(index)}
                          disabled={addCategoryForm.items.length === 1}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      className="w-full py-3 bg-[#e3f2fd] text-[#1976d2] border-2 border-dashed border-[#1976d2] rounded-lg cursor-pointer transition-all font-semibold flex items-center justify-center gap-2 hover:bg-[#1976d2] hover:text-white hover:border-[#1976d2]"
                      onClick={handleAddCategoryItem}
                    >
                      <i className="fas fa-plus"></i>
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 px-8 py-6 border-t-2 border-[#f0f0f0]">
                <button className="bg-[#f5f5f5] text-[#666] border-none px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-[#e0e0e0]" onClick={handleCancelAddCategory}>
                  Cancel
                </button>
                <button className="bg-gradient-to-br from-primary-orange to-hover-orange text-white border-none px-8 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)]" onClick={handleSaveNewCategory}>
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowOrderDetails(false)}>
            <div className="bg-white rounded-[20px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_10px_50px_rgba(0,0,0,0.3)]" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-gradient-to-r from-primary-orange to-hover-orange px-8 py-6 flex items-center justify-between rounded-t-[20px] z-10">
                <h2 className="text-2xl font-bold text-white">Order Details #{selectedOrder.id}</h2>
                <button className="text-white hover:text-gray-200 transition-colors text-2xl" onClick={() => setShowOrderDetails(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="p-8">
                {/* Customer Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-dark-brown mb-4 flex items-center gap-2">
                    <i className="fas fa-user text-primary-orange"></i>
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Name</p>
                      <p className="font-semibold text-dark-brown">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-dark-brown">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <p className="font-semibold text-dark-brown">{selectedOrder.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-semibold text-dark-brown">{selectedOrder.date}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-dark-brown mb-4 flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-primary-orange"></i>
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-dark-brown">{selectedOrder.address}</p>
                    <p className="text-dark-brown">{selectedOrder.city}, {selectedOrder.state} {selectedOrder.zipCode}</p>
                    <p className="text-dark-brown">{selectedOrder.country || 'India'}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-dark-brown mb-4 flex items-center gap-2">
                    <i className="fas fa-shopping-bag text-primary-orange"></i>
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-hover-orange rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <i className={`fas ${item.icon || 'fa-box'} text-xl`}></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark-brown">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-orange">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-gray-600">₹{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Total */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-dark-brown mb-4 flex items-center gap-2">
                    <i className="fas fa-credit-card text-primary-orange"></i>
                    Payment Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-700">Payment Method</span>
                      <span className="font-semibold text-dark-brown capitalize">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-semibold text-dark-brown">₹{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-700">Shipping</span>
                      <span className="font-semibold text-dark-brown">₹{selectedOrder.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-700">Tax</span>
                      <span className="font-semibold text-dark-brown">₹{selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-dark-brown">Total</span>
                        <span className="text-xl font-bold text-primary-orange">{selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Status Update */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-dark-brown mb-4 flex items-center gap-2">
                    <i className="fas fa-tasks text-primary-orange"></i>
                    Update Status
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Pending')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedOrder.status === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Processing')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedOrder.status === 'Processing' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                      Processing
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Shipped')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedOrder.status === 'Shipped' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                    >
                      Shipped
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Delivered')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedOrder.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      Delivered
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Cancelled')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedOrder.status === 'Cancelled' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>

                {/* Order Notes */}
                {selectedOrder.orderNotes && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-dark-brown mb-4 flex items-center gap-2">
                      <i className="fas fa-sticky-note text-primary-orange"></i>
                      Order Notes
                    </h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-dark-brown">{selectedOrder.orderNotes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="flex-1 bg-gray-200 text-dark-brown px-6 py-4 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className="flex-1 bg-red-500 text-white px-6 py-4 rounded-lg font-bold hover:bg-red-600 transition-colors"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  )
}
