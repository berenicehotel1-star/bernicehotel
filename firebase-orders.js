// ═══════════════════════════════════════════════
//  فندق برنيتشي - ربط Firebase للطلبات
//  أضف هذا الملف في GitHub وأضف سطر واحد في index.html
// ═══════════════════════════════════════════════

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

// ── إعدادات Firebase ──────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyD4fpGqYvLWj8NDfay7u7bwrG5ittgnAkI",
  authDomain: "berenice-hotel-17036.firebaseapp.com",
  databaseURL: "https://berenice-hotel-17036-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "berenice-hotel-17036",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ── دالة إرسال الطلب لـ Firebase ──────────────
window.sendOrderToFirebase = function(roomNumber, cartItems) {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const order = {
    roomNumber: roomNumber || 'غير محدد',
    items: cartItems.map(item => ({
      name: item.name,
      price: item.price,
      qty: item.qty || 1
    })),
    total: total,
    status: 'pending',
    timestamp: Date.now()
  };

  push(ref(db, 'orders'), order)
    .then(() => {
      console.log('✅ تم إرسال الطلب بنجاح');
    })
    .catch((error) => {
      console.error('❌ خطأ في إرسال الطلب:', error);
    });
};

// ── مراقبة المنيو من Firebase (الأصناف المغلقة) ──
window.watchMenuAvailability = function() {
  onValue(ref(db, 'menu'), (snapshot) => {
    const menu = snapshot.val();
    if (!menu) return;

    Object.entries(menu).forEach(([catKey, cat]) => {
      // إخفاء صنف كامل إذا كان معطلاً
      if (cat.enabled === false) {
        const section = document.querySelector(`#${catKey}, [data-category="${catKey}"]`);
        if (section) section.style.display = 'none';
      }

      // إخفاء أصناف غير متوفرة
      Object.entries(cat.items || {}).forEach(([itemKey, item]) => {
        if (item.available === false) {
          // ابحث عن الصنف بالاسم وأخفيه أو أضف علامة "غير متوفر"
          const allItems = document.querySelectorAll('.menu-item, .item-card, li');
          allItems.forEach(el => {
            if (el.textContent.includes(item.name)) {
              el.style.opacity = '0.4';
              el.style.pointerEvents = 'none';
              // أضف علامة غير متوفر
              if (!el.querySelector('.unavailable-badge')) {
                const badge = document.createElement('span');
                badge.className = 'unavailable-badge';
                badge.textContent = ' 🔴 غير متوفر';
                badge.style.cssText = 'color:#e74c3c;font-size:12px;font-weight:bold;';
                el.appendChild(badge);
              }
            }
          });
        }
      });
    });
  });
};

// ── تشغيل المراقبة تلقائياً ──────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.watchMenuAvailability();
});
