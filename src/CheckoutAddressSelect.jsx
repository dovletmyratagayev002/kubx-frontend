import React, { useState, useEffect } from 'react';

const CheckoutAddressSelect = () => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrderOptions = async () => {
      try {

        const response = await fetch('/local/api/index.php?CLASS=Order&METHOD=getOrderOptions');
        const data = await response.json();

        if (data.status === 'ok' && data.result && data.result.addresses) {
          if (data.result.addresses.error) {
            setError(data.result.addresses.error);
          } else {
            setSavedAddresses(data.result.addresses);
          }
        }
      } catch (err) {
        setError('Не удалось загрузить параметры заказа');
      } finally {
        setLoading(false);
      }
    };

    loadOrderOptions();
  }, []);

  if (loading) return <p>Загрузка опций доставки...</p>;

  return (
    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
      <h3 style={{ marginTop: 0 }}>Выбор адреса доставки (Интеграция с getOrderOptions)</h3>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {savedAddresses.length > 0 ? (
        <div>
          <label htmlFor="address-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Выберите адрес для оформления заказа:
          </label>
          <select
            id="address-select"
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">-- Выберите адрес доставки --</option>
            {savedAddresses.map(addr => (
              <option key={addr.id} value={addr.id}>
                {addr.name}: {addr.address}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p style={{ color: '#666' }}>У вас нет сохранённых адресов в профиле.</p>
      )}
    </div>
  );
};

export default CheckoutAddressSelect;
