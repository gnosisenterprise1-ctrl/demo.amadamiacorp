import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const Login = ({ setError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Credenciales inválidas o autorizaciones faltantes.");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--main-bg)' }}>
      <form onSubmit={handleLogin} style={{ padding: '3rem', background: '#fff', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '350px' }}>
        <h2 className="serif" style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--text-main)' }}>FLORA Admin</h2>
        <input 
          type="email" 
          placeholder="Correo Electrónico" 
          value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #eee', borderRadius: '4px' }}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '2rem', border: '1px solid #eee', borderRadius: '4px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '1rem', background: 'var(--gold)', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>
          INGRESAR
        </button>
      </form>
    </div>
  );
};

const AdminDashboard = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (!db) return;
      const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(data);
      }, (err) => {
        console.error("Firestore error:", err);
        setError("Firebase no configurado o Reglas de Seguridad bloqueando el acceso. Por favor, revisa tus reglas de Firestore.");
      });

      return () => unsubscribe();
    } catch (e) {
      setError("Firebase no inicializado correctamente.");
    }
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const newOrders = orders.filter(o => o.status === 'Nuevas Compras');
  const inProduction = orders.filter(o => o.status === 'En Producción');
  const finished = orders.filter(o => o.status === 'Finalizados');

  return (
    <div className="layout">
      {/* Sidebar Admin */}
      <div className="sidebar">
        <h2 className="serif">FLORA Admin</h2>
        <p style={{color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2rem'}}>{user.email}</p>
        <nav>
          <ul>
            <li><a href="#dashboard" style={{color: 'var(--gold)'}}>Dashboard</a></li>
            <li><a href="#nuevos">Nuevas Compras ({newOrders.length})</a></li>
            <li><a href="#produccion">En Producción ({inProduction.length})</a></li>
            <li><a href="#finalizados">Finalizados ({finished.length})</a></li>
            <li style={{marginTop: '2rem'}}><a href="#" onClick={() => signOut(auth)}>Cerrar Sesión</a></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 className="serif">Panel de Control</h1>
          <span className="btn-primary" style={{ padding: '0.8rem 1.5rem', background: 'var(--gold)', borderColor: 'var(--gold)', color: '#fff', borderRadius: '4px' }}>
            $ {totalRevenue.toLocaleString()} MXN (Ingresos)
          </span>
        </div>

        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
            <strong>Aviso de Seguridad:</strong> {error}
          </div>
        )}

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--secondary-bg)', padding: '2rem', borderRadius: '8px' }}>
            <span style={{color: 'var(--gold)', fontWeight: 'bold'}}>Nuevas Compras</span>
            <h2 className="serif" style={{ margin: '1rem 0', fontSize: '2rem' }}>{newOrders.length} ped.</h2>
          </div>
          <div style={{ background: 'var(--secondary-bg)', padding: '2rem', borderRadius: '8px' }}>
            <span style={{color: 'var(--gold)', fontWeight: 'bold'}}>En Producción</span>
            <h2 className="serif" style={{ margin: '1rem 0', fontSize: '2rem' }}>{inProduction.length} ped.</h2>
          </div>
          <div style={{ background: 'var(--secondary-bg)', padding: '2rem', borderRadius: '8px' }}>
            <span style={{color: 'var(--gold)', fontWeight: 'bold'}}>Finalizados</span>
            <h2 className="serif" style={{ margin: '1rem 0', fontSize: '2rem' }}>{finished.length} ped.</h2>
          </div>
        </div>

        <h3 className="serif" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Pedidos Entrantes Recientes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '1rem 0' }}>ID / Fecha</th>
              <th style={{ padding: '1rem 0' }}>Flores (Cant.)</th>
              <th style={{ padding: '1rem 0' }}>Envoltorio</th>
              <th style={{ padding: '1rem 0' }}>Total</th>
              <th style={{ padding: '1rem 0' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={{ padding: '1rem 0' }}>
                  <strong style={{ display: 'block' }}>#{order.id.slice(0,6).toUpperCase()}</strong>
                  <small style={{ color: 'var(--text-muted)' }}>{order.timestamp?.toDate ? order.timestamp.toDate().toLocaleDateString() : 'Desconocido'}</small>
                </td>
                <td style={{ padding: '1rem 0' }}>{order.flowerCount} ud.</td>
                <td style={{ padding: '1rem 0' }}>{order.wrapping}</td>
                <td style={{ padding: '1rem 0', color: 'var(--gold)', fontWeight: 600 }}>${order.total?.toLocaleString()} MXN</td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    background: order.status === 'Nuevas Compras' ? '#fff3e0' : 'var(--secondary-bg)',
                    color: order.status === 'Nuevas Compras' ? 'var(--gold)' : 'var(--text-main)',
                    fontWeight: 'bold'
                  }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No hay pedidos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
      setError("Firebase no configurado. Cambia TU_API_KEY en firebase.js");
    }
  }, []);

  if (loading) return <div style={{padding: '2rem'}}>Cargando Admin...</div>;

  return (
    <>
      {error && <div style={{position: 'fixed', top: 0, width: '100%', background: 'red', color: 'white', padding: '1rem', textAlign: 'center', zIndex: 999}}>{error}</div>}
      {user ? <AdminDashboard user={user} /> : <Login setError={setError} />}
    </>
  );
}
