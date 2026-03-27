import React, { useState } from 'react';
import Scene from '../components/Scene';
import useStore, { WRAPPINGS, CATALOG_ITEMS } from '../store/useStore';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Customizer = () => {
  const { flowers, wrapping, totalPrice, setWrapping, fillWithFoliage, clearBouquet, removeFlower } = useStore();
  const [loading, setLoading] = useState(false);

  const handleWhatsAppCheckout = () => {
    if (flowers.length === 0) {
      alert("Añade algunas flores a tu ramo primero.");
      return;
    }

    let message = "¡Hola FLORA Boutique! 👋 Acabo de diseñar mi ramo 3D:\n\n";
    const counts = flowers.reduce((acc, f) => {
      acc[f.item.name] = (acc[f.item.name] || 0) + 1;
      return acc;
    }, {});

    Object.entries(counts).forEach(([name, count]) => {
      message += `• ${count}x ${name}\n`;
    });
    
    message += `\n🎁 Envoltorio: ${wrapping.name}`;
    message += `\n✨ Total Estimado: $${totalPrice.toLocaleString()} MXN`;
    message += `\n\n¿Me podrían confirmar el diseño y tiempo de entrega?`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5210000000000?text=${encoded}`, '_blank');
  };

  const handleCheckout = async () => {
    if (flowers.length === 0) {
      alert("Añade algunas flores a tu ramo primero.");
      return;
    }

    setLoading(true);
    try {
      const recipe = {
        flowers: flowers.map(f => f.item.name),
        flowerCount: flowers.length,
        wrapping: wrapping.name,
        total: totalPrice,
        status: 'Nuevas Compras',
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), recipe);
      alert("¡Pedido registrado! También te redirigiremos a WhatsApp para seguimiento.");
      handleWhatsAppCheckout();
      clearBouquet();
    } catch (error) {
      console.error(error);
      handleWhatsAppCheckout();
    }
    setLoading(false);
  };

  return (
    <div className="customizer-container">
      {/* 3D View Area */}
      <div className="canvas-area">
        <Scene />
        <div className="canvas-ui">
          <h1>Arma tu Ramo</h1>
          <p>Toca las flores flotantes del catálogo para añadirlas al ramo.</p>
          {flowers.length > 0 && (
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
              💡 Toca una flor <strong>dentro del ramo</strong> o usa el <strong>×</strong> para quitarla
            </p>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="sidebar-right">
        <div className="sidebar-header">
          <h2 className="serif">Tu Diseño</h2>
          <span className="gold-text">Resumen en Tiempo Real</span>
        </div>
        
        <div className="sidebar-body">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Envoltorio</h3>
          <div className="catalog-grid" style={{ marginBottom: '2rem' }}>
            {Object.keys(WRAPPINGS).map(key => (
              <div 
                key={key} 
                className={`catalog-item ${wrapping.id === key ? 'active' : ''}`}
                style={{ borderColor: wrapping.id === key ? 'var(--gold)' : '#eee' }}
                onClick={() => setWrapping(key)}
              >
                <div className="color-swatch" style={{ background: WRAPPINGS[key].color }}></div>
                <span>{WRAPPINGS[key].name}</span>
                <small>${WRAPPINGS[key].price}</small>
              </div>
            ))}
          </div>

          <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Receta ({flowers.length}/15)</h3>
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: '230px', overflowY: 'auto' }}>
            {flowers.map(f => (
              <li key={f.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '0.35rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.35rem'
              }}>
                <span style={{ fontSize: '0.88rem' }}>{f.item.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.82rem' }}>${f.item.price}</span>
                  <button
                    onClick={() => removeFlower(f.id)}
                    title="Quitar del ramo"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#cc3333', fontSize: '1.15rem', lineHeight: 1,
                      padding: '0 2px', fontWeight: 700, opacity: 0.8
                    }}
                  >×</button>
                </div>
              </li>
            ))}
            {flowers.length === 0 && (
              <li style={{ color: '#aaa', fontSize: '0.88rem', textAlign: 'center', padding: '1rem 0' }}>
                Sin flores aún — toca el catálogo
              </li>
            )}
          </ul>
        </div>
        
        <div className="sidebar-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 600 }}>
            <span>Total:</span>
            <span>${totalPrice.toLocaleString()} MXN</span>
          </div>
          
          <button 
            className="btn-primary" 
            style={{ width: '100%', marginBottom: '1rem', background: 'transparent', color: 'var(--text-main)' }}
            onClick={fillWithFoliage}
          >
            Rellenar con Follaje (Upsell)
          </button>

          <button 
            className="btn-primary" 
            style={{ width: '100%' }}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Finalizar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
