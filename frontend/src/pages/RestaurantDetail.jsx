import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Clock, Plus, Minus, ShoppingCart, ArrowLeft, Info } from 'lucide-react';

const RestaurantDetail = ({ cart, setCart }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const { data } = await getRestaurantById(id);
      if (data.success) {
        setRestaurant(data.restaurant);
        setMenuItems(data.menuItems || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addToCart = (item) => {
    setCart(prev => {
      if (prev.restaurantId && prev.restaurantId !== restaurant._id) {
        if (!confirm('Your cart has items from another restaurant. Clear cart and add this item?')) return prev;
        return { restaurantId: restaurant._id, restaurantName: restaurant.name, items: [{ ...item, quantity: 1 }] };
      }

      const existing = prev.items?.find(i => i._id === item._id);
      if (existing) {
        return {
          ...prev, restaurantId: restaurant._id, restaurantName: restaurant.name,
          items: prev.items.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
        };
      }
      return {
        ...prev, restaurantId: restaurant._id, restaurantName: restaurant.name,
        items: [...(prev.items || []), { ...item, quantity: 1 }]
      };
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.items?.find(i => i._id === itemId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        const newItems = prev.items.filter(i => i._id !== itemId);
        return { ...prev, items: newItems, restaurantId: newItems.length ? prev.restaurantId : null };
      }
      return { ...prev, items: prev.items.map(i => i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i) };
    });
  };

  const getItemQuantity = (itemId) => {
    return cart.items?.find(i => i._id === itemId)?.quantity || 0;
  };

  const categories = [...new Set(menuItems.map(i => i.category))];

  if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-orange-100 border-t-orange-600 rounded-full" /></div>;
  if (!restaurant) return <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-500 text-xl font-bold">Restaurant not found</div>;

  const cartTotal = cart.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
  const cartCount = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-40 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button onClick={() => navigate('/restaurants')} className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-600 mb-8 font-semibold transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100">
          <ArrowLeft size={18} /> Back to restaurants
        </button>

        {/* Restaurant Header */}
        <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -z-10 -mr-20 -mt-20 opacity-60" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
            <div className="w-32 h-32 rounded-3xl bg-orange-100 flex items-center justify-center text-6xl shrink-0 shadow-inner">
              🍽️
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight">{restaurant.name}</h1>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {restaurant.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
              
              <p className="text-stone-500 text-lg mb-6 font-medium">{restaurant.description || restaurant.cuisine?.join(', ') || 'Multi-cuisine restaurant'}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-semibold">
                <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-100">
                  <Star size={18} className="text-yellow-500" fill="currentColor" />
                  <span className="text-stone-900 text-base">{restaurant.rating || '4.0'}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <Clock size={18} className="text-orange-500" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <Info size={18} className="text-orange-500" />
                  <span>{restaurant.deliveryFee ? `₹${restaurant.deliveryFee} delivery fee` : 'Free delivery'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        {menuItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-stone-100">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🍽️</div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">Menu building in progress</h3>
            <p className="text-stone-500 text-lg">Check back later for delicious items!</p>
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat} className="mb-12">
              <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 rounded-full bg-orange-600 shadow-sm shadow-orange-600/50" />
                {cat}
              </h2>
              
              <div className="grid gap-4">
                {menuItems.filter(i => i.category === cat).map(item => (
                  <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-stone-100 flex items-center gap-6 transition-all group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {item.isVeg
                          ? <span className="w-5 h-5 rounded border-[2px] border-green-600 flex items-center justify-center shrink-0"><span className="w-2.5 h-2.5 rounded-full bg-green-600" /></span>
                          : <span className="w-5 h-5 rounded border-[2px] border-red-600 flex items-center justify-center shrink-0"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /></span>
                        }
                        <h4 className="font-bold text-stone-900 text-lg">{item.name}</h4>
                      </div>
                      <p className="text-stone-500 text-sm mb-4 line-clamp-2 leading-relaxed max-w-xl">{item.description}</p>
                      <span className="text-xl font-bold text-stone-900">₹{item.price}</span>
                    </div>

                    {/* Add to cart Controls */}
                    <div className="shrink-0">
                      {getItemQuantity(item._id) === 0 ? (
                        <button onClick={() => addToCart(item)}
                          className="px-8 py-3 rounded-xl font-bold bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm border border-orange-200 hover:border-orange-600">
                          ADD
                        </button>
                      ) : (
                        <div className="flex items-center gap-4 bg-white border border-stone-200 p-1.5 rounded-xl shadow-sm">
                          <button onClick={() => removeFromCart(item._id)}
                            className="w-10 h-10 rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors flex items-center justify-center font-bold">
                            <Minus size={18} />
                          </button>
                          <span className="text-lg font-bold text-stone-900 w-4 text-center">{getItemQuantity(item._id)}</span>
                          <button onClick={() => addToCart(item)}
                            className="w-10 h-10 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors flex items-center justify-center font-bold shadow-sm shadow-orange-600/30">
                            <Plus size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Bar / Cart Summary */}
      {cartCount > 0 && cart.restaurantId === restaurant._id && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 pb-8 animate-fade-in-up">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/cart')}
              className="w-full p-5 rounded-2xl flex items-center justify-between text-white font-bold bg-stone-900 hover:bg-stone-800 transition-all shadow-2xl shadow-stone-900/30 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <ShoppingCart size={24} />
                </div>
                <div className="text-left">
                  <div className="text-orange-400 text-sm uppercase tracking-wider mb-1 mt-0.5">{cartCount} ITEM{cartCount > 1 ? 'S' : ''}</div>
                  <div className="text-xl">₹{cartTotal} <span className="text-sm font-medium text-stone-400 line-through ml-2">₹{cartTotal + 50}</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors">
                View Cart <ArrowLeft size={18} className="rotate-180" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
