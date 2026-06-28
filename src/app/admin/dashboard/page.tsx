'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MenuItem, Order, AdminSettings, dbService } from '@/lib/db';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Menu, 
  Trash2, 
  Plus, 
  Sliders, 
  Check, 
  X, 
  Save, 
  LogOut, 
  Sparkles, 
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Auth state
  const [authorized, setAuthorized] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'settings'>('orders');

  // DB States
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({
    isAcceptingOrders: true,
    announcementText: '',
    deliveryCharge: 30,
    freeDeliveryAbove: 299,
    taxPercent: 5
  });
  const [metrics, setMetrics] = useState<any>({
    totalOrders: 0,
    todayOrdersCount: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    topSelling: [],
    pendingOrdersCount: 0
  });

  // Modal controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // New item form state
  const [newDish, setNewDish] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    nameDevnagari: '',
    description: '',
    descriptionDevnagari: '',
    price: 150,
    category: 'everyday',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviewsCount: 20,
    timeToPrepare: 20,
    isPreorder: false,
    isFastFood: true
  });

  // Auth gate check with session token validation
  useEffect(() => {
    const sessionToken = localStorage.getItem('tirth_admin_session');
    const sessionExpiry = localStorage.getItem('tirth_admin_session_expiry');
    const isLogged = localStorage.getItem('tirth_admin_logged');

    if (!isLogged || !sessionToken || !sessionExpiry) {
      router.push('/admin');
    } else {
      const expiry = parseInt(sessionExpiry);
      if (Date.now() >= expiry) {
        // Session expired
        localStorage.removeItem('tirth_admin_session');
        localStorage.removeItem('tirth_admin_session_expiry');
        localStorage.removeItem('tirth_admin_logged');
        router.push('/admin');
      } else {
        setAuthorized(true);
        loadDBData();
      }
    }
  }, [router]);

  const loadDBData = async () => {
    setOrders(await dbService.getOrders());
    setMenu(await dbService.getMenu());
    setSettings(await dbService.getSettings());
    setMetrics(await dbService.getMetrics());
  };

  const handleLogout = () => {
    localStorage.removeItem('tirth_admin_logged');
    localStorage.removeItem('tirth_admin_session');
    localStorage.removeItem('tirth_admin_session_expiry');
    router.push('/admin');
  };

  // ORDER ACTION STATUS CHANGERS
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    await dbService.updateOrderStatus(orderId, status);
    loadDBData();
  };

  // MENU DYNAMIC STOCK TOGGLERS
  const handleToggleAvailable = async (item: MenuItem) => {
    const updated = { ...item, isAvailable: !item.isAvailable };
    await dbService.updateMenuItem(updated);
    loadDBData();
  };

  const handleToggleSpecial = async (item: MenuItem) => {
    const updated = { ...item, isSpecial: !item.isSpecial };
    await dbService.updateMenuItem(updated);
    loadDBData();
  };

  // MENU CRUD TRIGGERS
  const handleAddDishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSpecial = newDish.category === 'special';
    await dbService.addMenuItem({
      ...newDish,
      isPreorder: isSpecial,
      isFastFood: !isSpecial
    });
    setIsAddModalOpen(false);
    // Reset form
    setNewDish({
      name: '',
      nameDevnagari: '',
      description: '',
      descriptionDevnagari: '',
      price: 150,
      category: 'everyday',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=60',
      isAvailable: true,
      isVeg: true,
      isSpecial: false,
      rating: 4.8,
      reviewsCount: 15,
      timeToPrepare: 20,
      isPreorder: false,
      isFastFood: true
    });
    loadDBData();
  };

  const handleEditDishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const isSpecial = editingItem.category === 'special';
      await dbService.updateMenuItem({
        ...editingItem,
        isPreorder: isSpecial,
        isFastFood: !isSpecial
      });
      setIsEditModalOpen(false);
      setEditingItem(null);
      loadDBData();
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (confirm('Are you sure you want to delete this homely delicacy from the menu?')) {
      await dbService.deleteMenuItem(id);
      loadDBData();
    }
  };

  // KITCHEN GLOBAL SETTINGS SAVERS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await dbService.saveSettings(settings);
    alert('Kitchen Settings successfully saved and updated across user channels!');
    loadDBData();
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-cream-dark flex flex-col font-sans select-none">
      
      {/* HEADER BAR */}
      <header className="bg-white border-b border-leaf-light/10 p-4 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center font-bold text-sm border-2 border-brass">ती</div>
            <span className="font-outfit font-black text-lg text-charcoal">तीर्थ <span className="text-xs font-normal text-saffron p-0.5 px-1 bg-saffron/10 rounded">Studio Controls</span></span>
          </div>
          
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-leaf hover:underline"
          >
            Live Site <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Action button */}
        <button
          onClick={handleLogout}
          className="p-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-100"
        >
          <LogOut className="w-4 h-4" /> Exit Portal
        </button>
      </header>

      {/* METRICS & ANALYSIS PANEL */}
      <section className="p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        {/* Metric 1: Pending preparation */}
        <div className="bg-white satvik-card p-4 flex items-center gap-3 border border-leaf-light/5">
          <div className="p-3 bg-saffron/10 text-saffron rounded-2xl">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-charcoal/40 font-bold uppercase block leading-none">Active Pipeline</span>
            <span className="font-outfit font-black text-xl text-charcoal">{metrics.pendingOrdersCount} Dabbas</span>
          </div>
        </div>

        {/* Metric 2: Today orders */}
        <div className="bg-white satvik-card p-4 flex items-center gap-3 border border-leaf-light/5">
          <div className="p-3 bg-leaf-light/10 text-leaf rounded-2xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-charcoal/40 font-bold uppercase block leading-none">Today Orders</span>
            <span className="font-outfit font-black text-xl text-charcoal">{metrics.todayOrdersCount} Placed</span>
          </div>
        </div>

        {/* Metric 3: Today Revenue */}
        <div className="bg-white satvik-card p-4 flex items-center gap-3 border border-leaf-light/5">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl">
            <DollarSign className="w-5 h-5 text-saffron" />
          </div>
          <div>
            <span className="text-[10px] text-charcoal/40 font-bold uppercase block leading-none">Today Revenue</span>
            <span className="font-outfit font-black text-xl text-charcoal">₹{metrics.todayRevenue}</span>
          </div>
        </div>

        {/* Metric 4: All-time revenue */}
        <div className="bg-white satvik-card p-4 flex items-center gap-3 border border-leaf-light/5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <TrendingUp className="w-5 h-5 text-leaf" />
          </div>
          <div>
            <span className="text-[10px] text-charcoal/40 font-bold uppercase block leading-none">Total Revenue</span>
            <span className="font-outfit font-black text-xl text-charcoal">₹{metrics.totalRevenue}</span>
          </div>
        </div>
      </section>

      {/* TABS SELECTOR */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto w-full shrink-0">
        <div className="flex gap-2 border-b border-leaf-light/10 pb-1.5">
          {([
            { id: 'orders', label: 'Orders Pipeline' },
            { id: 'menu', label: 'Menu CRUD Store' },
            { id: 'settings', label: 'Global Configurations' }
          ] as const).map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2.5 px-4 font-outfit font-bold text-xs rounded-t-2xl border-t border-x transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-white text-leaf border-leaf-light/10 font-black shadow-sm'
                    : 'bg-transparent text-charcoal/50 border-transparent hover:text-charcoal/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* CORE WORKSPACE WINDOW */}
      <main className="flex-grow p-4 sm:p-6 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="bg-white satvik-card border border-leaf-light/10 p-5 w-full h-full overflow-y-auto shadow-sm">
          
          {/* TAB A: ORDERS PIPELINE PROCESSOR */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-outfit font-bold text-base text-charcoal">Live Delivery Pipeline</h3>
                <span className="text-[10px] bg-leaf-light/10 text-leaf p-1 px-3 rounded-full font-bold">
                  Total Orders: {orders.length}
                </span>
              </div>

              {orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className={`p-4 border rounded-2xl relative overflow-hidden transition-all ${
                        order.status === 'Delivered' 
                          ? 'bg-slate-50/60 border-slate-100 opacity-70' 
                          : order.status === 'Cancelled'
                          ? 'bg-rose-50/30 border-rose-100 opacity-60'
                          : 'bg-cream-light border-saffron/10 shadow-sm shadow-saffron/5'
                      }`}
                    >
                      {/* Visual left status block */}
                      <div className={`absolute left-0 inset-y-0 w-1.5 ${
                        order.status === 'Pending' ? 'bg-amber-500' :
                        order.status === 'Preparing' ? 'bg-saffron' :
                        order.status === 'Delivered' ? 'bg-leaf' : 'bg-charcoal'
                      }`}></div>

                      {/* Header */}
                      <div className="flex justify-between items-start pl-2 mb-2">
                        <div>
                          <span className="font-outfit font-black text-xs text-charcoal">{order.id}</span>
                          <p className="text-[10px] text-charcoal/40 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        
                        {/* Status Selectors */}
                        <div className="flex items-center gap-1.5">
                          <span className={`p-0.5 px-2 text-[9px] font-bold uppercase rounded-md tracking-wider ${
                            order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'Preparing' ? 'bg-saffron/10 text-saffron-dark' :
                            order.status === 'Delivered' ? 'bg-leaf/10 text-leaf' : 'bg-charcoal/10 text-charcoal'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="pl-2 border-l border-dashed border-leaf-light/10 mb-3 space-y-1">
                        {order.items.map((i) => (
                          <p key={i.menuItem.id} className="text-xs font-semibold text-charcoal/70">
                            • {i.menuItem.name} (x{i.quantity})
                          </p>
                        ))}
                      </div>

                      {/* Notes / Details */}
                      <div className="pl-2 text-[10px] font-semibold text-charcoal/60 space-y-1 border-t pt-2.5">
                        <p><span className="text-charcoal/40 font-bold uppercase text-[9px]">Deliver to:</span> {order.customerName} ({order.customerPhone})</p>
                        <p><span className="text-charcoal/40 font-bold uppercase text-[9px]">Address:</span> {order.customerAddress}</p>
                        {order.customerNotes && (
                          <p className="text-saffron-dark"><span className="text-charcoal/40 font-bold uppercase text-[9px]">Instruction:</span> {order.customerNotes}</p>
                        )}
                        <p className="text-leaf"><span className="text-charcoal/40 font-bold uppercase text-[9px]">Delivery Slot:</span> {order.timeSlot}</p>
                      </div>

                      {/* State status actions */}
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <div className="mt-4 pt-3 border-t border-leaf-light/5 flex gap-2">
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'Preparing')}
                              className="p-1.5 flex-grow bg-saffron hover:bg-saffron-dark text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1"
                            >
                              ✓ Start Preparing
                            </button>
                          )}
                          {order.status === 'Preparing' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                              className="p-1.5 flex-grow bg-leaf hover:bg-leaf-dark text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1"
                            >
                              ✓ Confirm Delivered
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-lg text-[10px] px-3.5"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-charcoal/50 text-xs">
                  No active/completed orders received in this session pipeline.
                </div>
              )}
            </div>
          )}

          {/* TAB B: MENU MANAGER CRUD */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-outfit font-bold text-base text-charcoal">Dish Library CRUD Manager</h3>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="p-2 px-4 bg-leaf hover:bg-leaf-dark text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-leaf/10"
                >
                  <Plus className="w-4 h-4 text-brass" /> Add New Delicacy
                </button>
              </div>

              {/* SECTION: रोजचा डबा / Everyday Tiffin */}
              {(() => {
                const everydayItems = menu.filter(item => item.category === 'everyday');
                const customizeItems = menu.filter(item => item.category === 'customize');
                const specialItems = menu.filter(item => item.category === 'special');

                const renderMenuTable = (items: MenuItem[], sectionTitle: string, sectionTag: string) => (
                  items.length > 0 ? (
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-sm font-black text-leaf-dark uppercase tracking-wide">{sectionTitle}</h4>
                        <div className="flex-1 h-px bg-leaf-light/15"></div>
                        <span className="text-[9px] text-saffron font-black uppercase bg-saffron/10 p-1 px-2.5 rounded-full tracking-wider">{sectionTag}</span>
                      </div>
                      <div className="overflow-x-auto rounded-2xl border border-leaf-light/10">
                        <table className="w-full text-left text-xs font-semibold">
                          <thead className="bg-cream-dark text-charcoal/60 uppercase text-[9px] font-extrabold border-b border-leaf-light/10">
                            <tr>
                              <th className="p-3">Dish / Marathi</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Price</th>
                              <th className="p-3">Stocks Availability</th>
                              <th className="p-3">Daily Special</th>
                              <th className="p-3 text-right">Settings</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-leaf-light/5 text-charcoal/80">
                            {items.map((item) => (
                              <tr key={item.id} className="hover:bg-cream-light/30 transition-colors">
                                <td className="p-3 flex items-center gap-3">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-lg border shadow-sm" />
                                  <div>
                                    <span className="text-saffron-dark text-[10px] block leading-none">{item.nameDevnagari}</span>
                                    <span className="font-bold text-charcoal">{item.name}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-[10px] font-extrabold uppercase text-leaf">{item.category}</td>
                                <td className="p-3 font-outfit font-bold text-charcoal">₹{item.price}</td>
                                <td className="p-3">
                                  <button
                                    onClick={() => handleToggleAvailable(item)}
                                    className={`p-1.5 px-3 rounded-full text-[9px] font-bold uppercase transition-all cursor-pointer ${
                                      item.isAvailable 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {item.isAvailable ? 'In Stock ✓' : 'Sold Out ✗'}
                                  </button>
                                </td>
                                <td className="p-3">
                                  <button
                                    onClick={() => handleToggleSpecial(item)}
                                    className={`p-1.5 px-3 rounded-full text-[9px] font-bold uppercase transition-all cursor-pointer ${
                                      item.isSpecial 
                                        ? 'bg-saffron text-white shadow-sm' 
                                        : 'bg-cream text-charcoal/50 border'
                                    }`}
                                  >
                                    {item.isSpecial ? 'Special ★' : 'Standard'}
                                  </button>
                                </td>
                                <td className="p-3 text-right space-x-2">
                                  <button
                                    onClick={() => { setEditingItem(item); setIsEditModalOpen(true); }}
                                    className="p-1 px-2.5 bg-cream hover:bg-cream-dark text-charcoal font-bold rounded-lg border text-[10px] cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDish(item.id)}
                                    className="p-1 px-2 text-rose-500 hover:bg-rose-50 rounded-lg hover:text-rose-700 cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null
                );

                return (
                  <>
                    {/* रोजचा डबा Section Header */}
                    <div className="bg-[#E6EED5] border border-leaf/15 p-4 rounded-2xl mb-2">
                      <h3 className="font-yatra text-xl text-leaf-dark">रोजचा डबा / <span className="font-outfit font-bold text-base">Everyday Tiffin</span></h3>
                      <p className="text-[10px] text-charcoal/50 font-semibold mt-0.5">Daily tiffin and poli bhaji combo meals</p>
                    </div>

                    {renderMenuTable(everydayItems, 'Everyday Tiffin / रोजचा डबा', 'Everyday')}

                    {/* Customize Menu Section Header */}
                    <div className="bg-[#E6EED5]/20 border border-leaf/10 p-4 rounded-2xl mb-2 mt-6">
                      <h3 className="font-yatra text-xl text-leaf-dark">Customized Menu / <span className="font-outfit font-bold text-base">इतर पदार्थ</span></h3>
                      <p className="text-[10px] text-charcoal/50 font-semibold mt-0.5">Individual polis, bhakris, bhaji and sides</p>
                    </div>

                    {renderMenuTable(customizeItems, 'Customize Menu / इतर पदार्थ', 'Customize')}

                    {/* Special Order Section */}
                    {specialItems.length > 0 && (
                      <>
                        <div className="bg-amber-50 border border-amber-200/30 p-4 rounded-2xl mb-2 mt-6">
                          <h3 className="font-yatra text-xl text-saffron-dark">विशेष ऑर्डर / <span className="font-outfit font-bold text-base">Special Order</span></h3>
                          <p className="text-[10px] text-charcoal/50 font-semibold mt-0.5">Special order items — Special festive meals, sweets & celebrations</p>
                        </div>
                        {renderMenuTable(specialItems, 'Special Order / विशेष ऑर्डर', 'Special Order')}
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* TAB C: KITCHEN CONFIGS & TICKERS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="font-outfit font-bold text-base text-charcoal mb-4">Kitchen Configurations</h3>

              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                {/* Active ordering toggle switch */}
                <div className="bg-cream p-4 rounded-2xl border flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">Online Ordering Status</h4>
                    <p className="text-[10px] text-charcoal/50 leading-relaxed">Toggle to lock checkout brandwide during peak kitchen preparation hours.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, isAcceptingOrders: !settings.isAcceptingOrders })}
                    className={`p-2 px-5 font-bold text-[10px] rounded-xl uppercase transition-all cursor-pointer ${
                      settings.isAcceptingOrders
                        ? 'bg-leaf text-white shadow-sm'
                        : 'bg-rose-600 text-white shadow-sm'
                    }`}
                  >
                    {settings.isAcceptingOrders ? 'Accepting Orders ✓' : 'Closed ✗'}
                  </button>
                </div>

                {/* Announcement text field */}
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1">Announcement Ticker Text</label>
                  <textarea
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    placeholder="Enter marquee ticker promo message..."
                    className="w-full p-2.5 bg-cream border focus:border-leaf rounded-xl text-xs font-semibold min-h-[60px] shadow-inner"
                  />
                </div>

                {/* Number grids setup */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Delivery charge */}
                  <div>
                    <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1">Delivery Charge (₹)</label>
                    <input
                      type="number"
                      required
                      value={settings.deliveryCharge}
                      onChange={(e) => setSettings({ ...settings, deliveryCharge: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-cream border focus:border-leaf rounded-xl text-xs font-bold"
                    />
                  </div>

                  {/* Free delivery threshold */}
                  <div>
                    <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1">Free Delivery Above (₹)</label>
                    <input
                      type="number"
                      required
                      value={settings.freeDeliveryAbove}
                      onChange={(e) => setSettings({ ...settings, freeDeliveryAbove: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-cream border focus:border-leaf rounded-xl text-xs font-bold"
                    />
                  </div>

                  {/* SGST/CGST percent */}
                  <div>
                    <label className="text-[10px] text-charcoal/40 uppercase font-semibold block mb-1">Taxes Percent (%)</label>
                    <input
                      type="number"
                      required
                      value={settings.taxPercent}
                      onChange={(e) => setSettings({ ...settings, taxPercent: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-cream border focus:border-leaf rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Save CTA */}
                <button
                  type="submit"
                  className="p-3 px-6 bg-leaf hover:bg-leaf-dark text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-leaf/10 cursor-pointer w-fit"
                >
                  <Save className="w-4 h-4 text-brass" /> Save System Settings
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* CRUD MODAL 1: ADD DISH */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream-light satvik-card border-2 border-brass/20 max-w-lg w-full overflow-hidden shadow-2xl relative animate-fade-in p-5 text-left max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-full bg-cream text-charcoal/40 hover:text-charcoal">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-outfit font-black text-lg text-charcoal border-b pb-2 mb-4">Add a Homely Dish</h3>
            <form onSubmit={handleAddDishSubmit} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Dish Name (English)</label>
                  <input type="text" required value={newDish.name} onChange={(e) => setNewDish({ ...newDish, name: e.target.value })} placeholder="Purandar Puran Poli" className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Dish Name (Marathi/Devnagari)</label>
                  <input type="text" required value={newDish.nameDevnagari} onChange={(e) => setNewDish({ ...newDish, nameDevnagari: e.target.value })} placeholder="पुरंदर पुरणपोळी" className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Category</label>
                  <select value={newDish.category} onChange={(e: any) => setNewDish({ ...newDish, category: e.target.value })} className="w-full p-2.5 bg-white border rounded-xl font-bold">
                    <option value="everyday">Everyday Tiffin (Everyday Dabba & Combo)</option>
                    <option value="customize">Customize Menu (Sides & Individual items)</option>
                    <option value="special">Special Order (Festive meals & sweets)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Price (₹)</label>
                  <input type="number" required value={newDish.price} onChange={(e) => setNewDish({ ...newDish, price: parseInt(e.target.value) || 0 })} className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Description (English)</label>
                <textarea required value={newDish.description} onChange={(e) => setNewDish({ ...newDish, description: e.target.value })} placeholder="Prepared with organic jaggery..." className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold min-h-[60px]" />
              </div>
              <div>
                <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Description (Marathi)</label>
                <textarea required value={newDish.descriptionDevnagari} onChange={(e) => setNewDish({ ...newDish, descriptionDevnagari: e.target.value })} placeholder="सेंद्रिय गुळ घालून बनवलेली पुरणपोळी..." className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold min-h-[60px]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Image URL</label>
                  <input type="text" required value={newDish.imageUrl} onChange={(e) => setNewDish({ ...newDish, imageUrl: e.target.value })} className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Prep Time (Mins)</label>
                  <input type="number" required value={newDish.timeToPrepare} onChange={(e) => setNewDish({ ...newDish, timeToPrepare: parseInt(e.target.value) || 0 })} className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold" />
                </div>
              </div>

              <div className="pt-2 flex gap-4">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" checked={newDish.isSpecial} onChange={(e) => setNewDish({ ...newDish, isSpecial: e.target.checked })} className="accent-saffron w-4.5 h-4.5" /> Highlight as Special
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" checked={newDish.isVeg} onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.checked })} className="accent-leaf w-4.5 h-4.5" disabled /> Pure Veg Dot
                </label>
              </div>

              <button type="submit" className="w-full p-3.5 bg-leaf hover:bg-leaf-dark text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-leaf/10 mt-6 cursor-pointer">
                <Check className="w-4 h-4 text-brass" /> Save Delicacy to Menu
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CRUD MODAL 2: EDIT DISH */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream-light satvik-card border-2 border-brass/20 max-w-lg w-full overflow-hidden shadow-2xl relative animate-fade-in p-5 text-left max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setIsEditModalOpen(false); setEditingItem(null); }} className="absolute top-4 right-4 p-1 rounded-full bg-cream text-charcoal/40 hover:text-charcoal">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-outfit font-black text-lg text-charcoal border-b pb-2 mb-4">Edit Delicacy</h3>
            <form onSubmit={handleEditDishSubmit} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Dish Name (English)</label>
                  <input type="text" required value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Dish Name (Marathi)</label>
                  <input type="text" required value={editingItem.nameDevnagari} onChange={(e) => setEditingItem({ ...editingItem, nameDevnagari: e.target.value })} className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Category</label>
                  <select value={editingItem.category} onChange={(e: any) => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full p-2.5 bg-white border rounded-xl font-bold">
                    <option value="everyday">Everyday Tiffin (Everyday Dabba & Combo)</option>
                    <option value="customize">Customize Menu (Sides & Individual items)</option>
                    <option value="special">Special Order (Festive meals & sweets)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Price (₹)</label>
                  <input type="number" required value={editingItem.price} onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })} className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Description (English)</label>
                <textarea required value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold min-h-[60px]" />
              </div>
              <div>
                <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Description (Marathi)</label>
                <textarea required value={editingItem.descriptionDevnagari} onChange={(e) => setEditingItem({ ...editingItem, descriptionDevnagari: e.target.value })} className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold min-h-[60px]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Image URL</label>
                  <input type="text" required value={editingItem.imageUrl} onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })} className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] text-charcoal/40 uppercase font-bold block mb-1">Prep Time (Mins)</label>
                  <input type="number" required value={editingItem.timeToPrepare} onChange={(e) => setEditingItem({ ...editingItem, timeToPrepare: parseInt(e.target.value) || 0 })} className="w-full p-2.5 bg-white border focus:border-leaf rounded-xl font-semibold" />
                </div>
              </div>

              <div className="pt-2 flex gap-4">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" checked={editingItem.isSpecial} onChange={(e) => setEditingItem({ ...editingItem, isSpecial: e.target.checked })} className="accent-saffron w-4.5 h-4.5" /> Highlight as Special
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" checked={editingItem.isAvailable} onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.checked })} className="accent-leaf w-4.5 h-4.5" /> Toggle In Stock
                </label>
              </div>

              <button type="submit" className="w-full p-3.5 bg-leaf hover:bg-leaf-dark text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-leaf/10 mt-6 cursor-pointer">
                <Check className="w-4 h-4 text-brass" /> Save Changes to Menu
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
