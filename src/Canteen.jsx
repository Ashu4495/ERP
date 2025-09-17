import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "./Canteen.css";

// ---------- HELPER HOOK ----------
function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLocked]);
}

// ---------- COMPONENT ----------
export default function CanteenPage() {
  // Simple helper: every image resides in /public/canteen so it is served at /canteen/<file>.
  const getImageUrl = (fileName) => `/canteen/${fileName || 'default.jpg'}`;
  const [menuData, setMenuData] = useState([
    {
      category: "South Indian",
      items: [
        { id: 1, name: "Idli Sambar", price: 40, img: "idli_sambar.jpg" },
        { id: 2, name: "Masala Dosa", price: 60, img: "masala_dosa.jpg" },
        { id: 3, name: "Plain Dosa", price: 50, img: "plain_dosa.jpeg" },
      ],
    },
    {
      category: "Snacks",
      items: [
        { id: 4, name: "Samosa", price: 15, img: "samosa.jpeg" },
        { id: 5, name: "Veg Puff", price: 20, img: "veg_puff.jpg" },
        { id: 6, name: "Paneer Roll", price: 45, img: "paneer_role.jpg" },
      ],
    },
    {
      category: "Rice & Biryani",
      items: [
        { id: 7, name: "Veg Fried Rice", price: 80, img: "veg_fried_rice.jpeg" },
        { id: 8, name: "Veg Biryani", price: 90, img: "veg_biryani.jpg" },
      ],
    },
    {
      category: "Beverages",
      items: [
        { id: 9, name: "Tea", price: 15, img: "tea.webp" },
        { id: 10, name: "Coffee", price: 20, img: "coffee.jpg" }
      ],
    },
  ]);

  useEffect(() => {
    fetch("/canteen/items.json")
      .then((res) => res.json())
      .then((data) => {
        setMenuData((prev) => [...prev, ...data]);
      })
      .catch(() => {});
  }, []);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [cart, setCart] = useState([]);
  const [upiId, setUpiId] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [toast, setToast] = useState({ text: '', open: false });
  const addDebounceRef = useRef(new Map());
  const toastTimerRef = useRef(null);

  

  // Lock scroll when modal open (nav removed)
  useBodyScrollLock(cartOpen || paymentOpen || successOpen);

  // Save & load cart state
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Save receipts
  useEffect(() => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts")) || [];
    setReceipts(savedReceipts);
  }, []);

  const persistReceipt = (receipt) => {
    const updatedReceipts = [receipt, ...receipts];
    setReceipts(updatedReceipts);
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
  };

  const navigate = useNavigate();

  // Download PDF receipt
  const downloadReceipt = (receipt) => {
    const doc = new jsPDF();
    doc.text("Cafeteria Receipt", 10, 10);
    doc.text(`Token: ${receipt.token}`, 10, 20);
    doc.text(`Paid At: ${receipt.paidAt}`, 10, 30);
    doc.text(`UPI ID: ${receipt.upiId}`, 10, 40);

    let y = 55;
    receipt.items.forEach((i) => {
      doc.text(`${i.name} x ${i.qty} = ₹${i.price * i.qty}`, 10, y);
      y += 10;
    });

    doc.text(`Item Total: ₹${receipt.itemTotal}`, 10, y + 10);
    doc.text(`Service Fee: ₹${receipt.serviceFee}`, 10, y + 20);
    doc.text(`GST: ₹${receipt.gst}`, 10, y + 30);
    doc.text(`Total Paid: ₹${receipt.toPay}`, 10, y + 40);

    doc.save(`Receipt-${receipt.token}.pdf`);
  };

  // Cart functions
  const addToCart = (item, qty = 1) => {
    // prevent accidental double-click adds: ignore rapid repeats per item (400ms)
    const last = addDebounceRef.current.get(item.id) || 0;
    const now = Date.now();
    if (now - last < 400) return;
    addDebounceRef.current.set(item.id, now);

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const copy = prev.slice();
        copy[idx] = { ...copy[idx], qty: (copy[idx].qty || 0) + qty };
        return copy;
      }
      return [...prev, { ...item, qty }];
    });

    // show small toast notification
    setToast({ text: `${item.name} added to cart`, open: true });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast({ text: '', open: false }), 1400);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  // Totals
  const itemTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const serviceFee = itemTotal * 0.05;
  const gst = (itemTotal + serviceFee) * 0.05;
  const toPay = itemTotal + serviceFee + gst;

  // Payment
  const handlePayment = () => {
    if (!upiId) {
      alert("Please enter UPI ID");
      return;
    }

    const receipt = {
      token: Math.floor(Math.random() * 100000),
      items: cart,
      itemTotal,
      serviceFee,
      gst,
      toPay,
      upiId,
      paidAt: new Date().toLocaleString(),
    };

    persistReceipt(receipt);
    downloadReceipt(receipt);

    setPaymentOpen(false);
    setCart([]);
    localStorage.removeItem("cart");

    setTimeout(() => {
      setSuccessOpen(true);
    }, 500);
  };

  // UI
  return (
    <div className="canteen-page">
      <header className="header">
        <h1>Cafeteria</h1>
        <div className="header-actions">
          <button className="home-btn" onClick={() => navigate('/')}>🏠 Home</button>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>🛒 Cart ({cart.length})</button>
        </div>
      </header>
      
      <main className="menu">
        {menuData.map((section) => (
          <div className="menu-section" key={section.category}>
            <h2>{section.category}</h2>
            <div className="menu-grid">
              {section.items.map((item) => (
                <div className="menu-item-card" key={item.id}>
                  <img
                    src={getImageUrl(item.img)}
                    loading="lazy"
                    alt={item.name}
                    className="item-img"
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.dataset.fallback = '1';
                        e.target.src = getImageUrl('default.jpg');
                      }
                    }}
                  />
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                  <button className="add-btn" onClick={() => addToCart(item)}>
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Cart Modal */}
      {cartOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🛒 Your Cart</h2>
            {cart.length === 0 ? (
              <p className="cart-empty">Cart is empty</p>
            ) : (
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <a href="#" onClick={(e) => e.preventDefault()}>{item.name} x {item.qty} = ₹{item.price * item.qty}</a>
                    <div className="cart-controls">
                      <button className="qty-small" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                      <button className="qty-small" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      <button className="remove-small" onClick={() => removeFromCart(item.id)}>x</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="totals">Item Total: <span style={{ color: '#43cea2' }}>₹{itemTotal}</span></div>
            <div className="totals">Service Fee: <span style={{ color: '#43cea2' }}>₹{serviceFee.toFixed(2)}</span></div>
            <div className="totals">GST: <span style={{ color: '#43cea2' }}>₹{gst.toFixed(2)}</span></div>
            <div className="total-amount">Total: <span style={{ color: '#2563eb' }}>₹{toPay.toFixed(2)}</span></div>
            <div className="actions-row">
              <button className="primary-action" onClick={() => cart.length > 0 && setPaymentOpen(true)} disabled={cart.length === 0}>
                <span style={{ marginRight: 8 }}>💳</span> Proceed to Pay
              </button>
              <button className="secondary-action" onClick={() => setCartOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Payment</h2>
            <p>Total to Pay: ₹{toPay.toFixed(2)}</p>
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <button className="pay-btn" onClick={handlePayment}>
              ✅ Pay Now
            </button>
            <button className="close-btn" onClick={() => setPaymentOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 Payment Successful!</h2>
            <p>Your order has been placed.</p>
            <button className="close-btn" onClick={() => setSuccessOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.open && (
        <div className="canteen-toast">{toast.text}</div>
      )}
    </div>
  );
}
