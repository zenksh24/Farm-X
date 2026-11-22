import { useState, useMemo } from 'react'

interface ProduceItem {
  id: string
  name: string
  tamilName: string
  category: 'vegetables' | 'fruits' | 'grains' | 'spices' | 'dairy'
  price: number
  unit: string
  district: string
  farmer: string
  rating: number
  isOrganic: boolean
  emoji: string
  stockKg: number
}

interface CartItem {
  produce: ProduceItem
  quantity: number
}

const INITIAL_PRODUCE: ProduceItem[] = [
  {
    id: 'p1',
    name: 'Ponni Boiled Rice',
    tamilName: 'பொன்னி புழுங்கல் அரிசி',
    category: 'grains',
    price: 62,
    unit: 'kg',
    district: 'Thanjavur',
    farmer: 'Murugan K.',
    rating: 4.9,
    isOrganic: true,
    emoji: '🌾',
    stockKg: 450,
  },
  {
    id: 'p2',
    name: 'Ooty Mountain Carrots',
    tamilName: 'ஊட்டி மலை கேரட்',
    category: 'vegetables',
    price: 48,
    unit: 'kg',
    district: 'The Nilgiris',
    farmer: 'Lakshmi R.',
    rating: 4.8,
    isOrganic: true,
    emoji: '🥕',
    stockKg: 120,
  },
  {
    id: 'p3',
    name: 'Salem Malgoa Mangoes',
    tamilName: 'சேலம் மல்கோவா மாம்பழம்',
    category: 'fruits',
    price: 130,
    unit: 'kg',
    district: 'Salem',
    farmer: 'Senthil Kumar',
    rating: 4.9,
    isOrganic: false,
    emoji: '🥭',
    stockKg: 85,
  },
  {
    id: 'p4',
    name: 'Erode Pure Turmeric Powder',
    tamilName: 'ஈரோடு விரலி மஞ்சள் தூள்',
    category: 'spices',
    price: 210,
    unit: 'kg',
    district: 'Erode',
    farmer: 'Palaniswamy G.',
    rating: 5.0,
    isOrganic: true,
    emoji: '✨',
    stockKg: 200,
  },
  {
    id: 'p5',
    name: 'Dindigul Shallots (Small Onion)',
    tamilName: 'திண்டுக்கல் சின்ன வெங்காயம்',
    category: 'vegetables',
    price: 75,
    unit: 'kg',
    district: 'Dindigul',
    farmer: 'Ramar M.',
    rating: 4.7,
    isOrganic: false,
    emoji: '🧅',
    stockKg: 300,
  },
  {
    id: 'p6',
    name: 'Pollachi Tender Coconut',
    tamilName: 'பொள்ளாச்சி இளநீர்',
    category: 'fruits',
    price: 45,
    unit: 'piece',
    district: 'Coimbatore',
    farmer: 'Anand Velu',
    rating: 4.9,
    isOrganic: true,
    emoji: '🥥',
    stockKg: 160,
  },
  {
    id: 'p7',
    name: 'Madurai Gundu Chillies',
    tamilName: 'மதுரை குண்டு மிளகாய்',
    category: 'spices',
    price: 180,
    unit: 'kg',
    district: 'Madurai',
    farmer: 'Meenakshi Sundaram',
    rating: 4.8,
    isOrganic: true,
    emoji: '🌶️',
    stockKg: 90,
  },
  {
    id: 'p8',
    name: 'Kuthiraivali (Barnyard Millet)',
    tamilName: 'குதிரைவாலி அரிசி',
    category: 'grains',
    price: 95,
    unit: 'kg',
    district: 'Tiruchirappalli',
    farmer: 'Kalaivani R.',
    rating: 4.9,
    isOrganic: true,
    emoji: '🥣',
    stockKg: 150,
  },
  {
    id: 'p9',
    name: 'Tirunelveli Nendran Banana',
    tamilName: 'திருநெல்வேலி நேந்திரன் பழம்',
    category: 'fruits',
    price: 65,
    unit: 'kg',
    district: 'Tirunelveli',
    farmer: 'Subbiah Thevar',
    rating: 4.8,
    isOrganic: false,
    emoji: '🍌',
    stockKg: 110,
  },
]

const TN_DISTRICTS = [
  'All Districts',
  'Thanjavur',
  'The Nilgiris',
  'Salem',
  'Erode',
  'Dindigul',
  'Coimbatore',
  'Madurai',
  'Tiruchirappalli',
  'Tirunelveli',
]

export default function App() {
  const [produce, setProduce] = useState<ProduceItem[]>(INITIAL_PRODUCE)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSellOpen, setIsSellOpen] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  // New Listing Form State
  const [newCrop, setNewCrop] = useState({
    name: '',
    tamilName: '',
    category: 'vegetables' as const,
    price: '',
    unit: 'kg',
    district: 'Thanjavur',
    farmer: '',
    isOrganic: true,
    emoji: '🌱',
    stockKg: '',
  })

  // Filters
  const filteredProduce = useMemo(() => {
    return produce.filter((item) => {
      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory
      const matchDistrict =
        selectedDistrict === 'All Districts' || item.district === selectedDistrict
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tamilName.includes(searchQuery) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.farmer.toLowerCase().includes(searchQuery.toLowerCase())

      return matchCategory && matchDistrict && matchQuery
    })
  }, [produce, selectedCategory, selectedDistrict, searchQuery])

  // Cart Handlers
  const addToCart = (item: ProduceItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.produce.id === item.id)
      if (existing) {
        return prev.map((c) =>
          c.produce.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        )
      }
      return [...prev, { produce: item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.produce.id === id) {
            const nextQty = c.quantity + delta
            return nextQty > 0 ? { ...c, quantity: nextQty } : null
          }
          return c
        })
        .filter(Boolean) as CartItem[],
    )
  }

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.produce.price * item.quantity, 0)
  }, [cart])

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  // Add Produce handler
  const handleAddProduce = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCrop.name || !newCrop.price || !newCrop.farmer) {
      alert('Please fill in required fields')
      return
    }

    const newItem: ProduceItem = {
      id: `p-${Date.now()}`,
      name: newCrop.name,
      tamilName: newCrop.tamilName || newCrop.name,
      category: newCrop.category,
      price: Number(newCrop.price),
      unit: newCrop.unit,
      district: newCrop.district,
      farmer: newCrop.farmer,
      rating: 5.0,
      isOrganic: newCrop.isOrganic,
      emoji: newCrop.emoji || '🥬',
      stockKg: Number(newCrop.stockKg) || 50,
    }

    setProduce([newItem, ...produce])
    setIsSellOpen(false)
    setNewCrop({
      name: '',
      tamilName: '',
      category: 'vegetables',
      price: '',
      unit: 'kg',
      district: 'Thanjavur',
      farmer: '',
      isOrganic: true,
      emoji: '🌱',
      stockKg: '',
    })
  }

  return (
    <>
      {/* Navigation */}
      <header className="navbar">
        <div className="brand" onClick={() => { setSelectedCategory('all'); setSelectedDistrict('All Districts'); setSearchQuery(''); }}>
          <span>🌿 FarmX</span>
          <span className="brand-badge">TAMIL NADU</span>
        </div>

        <div className="nav-actions">
          <button className="btn-sell" onClick={() => setIsSellOpen(true)}>
            <span>+</span>
            <span>Farmer Sell</span>
          </button>
          <button className="btn-cart" onClick={() => setIsCartOpen(true)}>
            <span>🛒 Cart</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <span className="hero-tag">🌱 Direct Farmer-to-Buyer Marketplace</span>
        <h1>Fresh Harvest Straight From Tamil Nadu Farms</h1>
        <p>
          Support local farmers with 100% direct pricing. Zero intermediaries, fair value,
          and harvest-fresh quality delivered straight to your home.
        </p>

        <div className="search-box-wrap">
          <input
            type="text"
            className="search-input"
            placeholder="Search produce (e.g. Ponni Rice, Ooty Carrots, Shallots, மல்லிகை)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="district-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            {TN_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Category Filter */}
      <div className="category-bar">
        {[
          { key: 'all', label: 'All Produce (அனைத்தும்)' },
          { key: 'vegetables', label: 'Vegetables (காய்கறிகள்)' },
          { key: 'fruits', label: 'Fruits (பழங்கள்)' },
          { key: 'grains', label: 'Grains & Millets (தானியங்கள்)' },
          { key: 'spices', label: 'Spices & Herbs (மசாலாக்கள்)' },
        ].map((cat) => (
          <button
            key={cat.key}
            className={`cat-btn ${selectedCategory === cat.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <main className="main-content">
        <div className="section-head">
          <h2>
            Available Harvest ({filteredProduce.length} Items)
          </h2>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Showing produce from {selectedDistrict}
          </span>
        </div>

        {filteredProduce.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
            <h3>No produce found matching your search.</h3>
            <p>Try clearing your filter or searching for another crop.</p>
          </div>
        ) : (
          <div className="produce-grid">
            {filteredProduce.map((item) => (
              <div key={item.id} className="produce-card">
                <div className="card-image-wrap">
                  {item.emoji}
                  {item.isOrganic && (
                    <span className="organic-badge">✓ Organic Certified</span>
                  )}
                  <span className="district-badge">📍 {item.district}</span>
                </div>

                <div className="card-body">
                  <h3 className="crop-name">{item.name}</h3>
                  <p className="crop-tamil">{item.tamilName}</p>

                  <div className="farmer-info">
                    <div className="farmer-name">
                      <span>🧑‍🌾 {item.farmer}</span>
                      <span className="farmer-rating">★ {item.rating}</span>
                    </div>
                    <div style={{ marginTop: '0.2rem', color: '#64748b', fontSize: '0.78rem' }}>
                      Available Stock: {item.stockKg} {item.unit}
                    </div>
                  </div>

                  <div className="card-footer">
                    <div>
                      <span className="price-tag">₹{item.price}</span>
                      <span className="unit-label"> / {item.unit}</span>
                    </div>
                    <button className="btn-add" onClick={() => addToCart(item)}>
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Shopping Cart ({cartCount} items)</h3>
              <button className="modal-close" onClick={() => setIsCartOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {orderSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '0.8rem' }}>🎉</div>
                  <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>
                    Order Placed Successfully!
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.95rem' }}>
                    The farmers have received your direct order. Produce will be packed fresh
                    from the farms and dispatched within 24 hours.
                  </p>
                  <button
                    className="btn-add"
                    style={{ marginTop: '1.5rem', width: '100%' }}
                    onClick={() => {
                      setCart([])
                      setOrderSuccess(false)
                      setIsCartOpen(false)
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
                  Your cart is empty. Pick some fresh produce!
                </p>
              ) : (
                <div className="cart-list">
                  {cart.map(({ produce: p, quantity }) => (
                    <div key={p.id} className="cart-item">
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {p.emoji} {p.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          ₹{p.price} / {p.unit} • {p.farmer} ({p.district})
                        </div>
                      </div>

                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(p.id, -1)}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                          {quantity}
                        </span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(p.id, 1)}
                        >
                          +
                        </button>
                        <span style={{ fontWeight: 700, marginLeft: '0.5rem', minWidth: '60px', textAlign: 'right' }}>
                          ₹{p.price * quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!orderSuccess && cart.length > 0 && (
              <div className="modal-footer" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '1.1rem', fontWeight: 800 }}>
                  <span>Total Amount (Direct to Farmers):</span>
                  <span style={{ color: '#15803d' }}>₹{cartTotal}</span>
                </div>
                <button
                  className="btn-add"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                  onClick={() => setOrderSuccess(true)}
                >
                  Confirm Direct Order (Cash / UPI on Delivery)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Farmer Listing Modal */}
      {isSellOpen && (
        <div className="modal-overlay" onClick={() => setIsSellOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🧑‍🌾 List Your Farm Produce</h3>
              <button className="modal-close" onClick={() => setIsSellOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduce}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Produce Name (English) *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sona Masoori Rice, Fresh Brinjal"
                    value={newCrop.name}
                    onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Produce Name (Tamil / தமிழ்)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="எ.கா. கத்தரிக்காய், சாம்பார் வெங்காயம்"
                    value={newCrop.tamilName}
                    onChange={(e) => setNewCrop({ ...newCrop, tamilName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      className="form-select"
                      value={newCrop.category}
                      onChange={(e) =>
                        setNewCrop({
                          ...newCrop,
                          category: e.target.value as any,
                        })
                      }
                    >
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="grains">Grains & Millets</option>
                      <option value="spices">Spices & Herbs</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>District *</label>
                    <select
                      className="form-select"
                      value={newCrop.district}
                      onChange={(e) => setNewCrop({ ...newCrop, district: e.target.value })}
                    >
                      {TN_DISTRICTS.filter((d) => d !== 'All Districts').map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 50"
                      value={newCrop.price}
                      onChange={(e) => setNewCrop({ ...newCrop, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Unit</label>
                    <select
                      className="form-select"
                      value={newCrop.unit}
                      onChange={(e) => setNewCrop({ ...newCrop, unit: e.target.value })}
                    >
                      <option value="kg">kg</option>
                      <option value="piece">piece</option>
                      <option value="bunch">bunch</option>
                      <option value="dozen">dozen</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Farmer Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your Name (e.g. Ramanathan K.)"
                    value={newCrop.farmer}
                    onChange={(e) => setNewCrop({ ...newCrop, farmer: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="organicCheck"
                    checked={newCrop.isOrganic}
                    onChange={(e) => setNewCrop({ ...newCrop, isOrganic: e.target.checked })}
                  />
                  <label htmlFor="organicCheck" style={{ margin: 0, cursor: 'pointer', fontSize: '0.9rem' }}>
                    Naturally Grown / Organic Certified (இயற்கை விவசாயம்)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cat-btn"
                  onClick={() => setIsSellOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-add">
                  Publish Produce Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <p>
          <strong>FarmX</strong> — Direct Farmer-to-Buyer Marketplace (Tamil Nadu).
        </p>
        <p style={{ marginTop: '0.5rem', opacity: 0.75 }}>
          Built with React, TypeScript & Vite. Empowering local farmers with fair transparent trade.
        </p>
      </footer>
    </>
  )
}
