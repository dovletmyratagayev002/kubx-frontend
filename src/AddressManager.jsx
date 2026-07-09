import React, { useState, useEffect } from 'react';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [editingId, setEditingId] = useState(null); // ID редактируемого адреса
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    const fetchAddresses = async () => {
        setLoading(true);
        try {
        const response = await fetch('/local/api/index.php?CLASS=UserAddresses&METHOD=get');
        const data = await response.json();
        
        if (data.result && data.result.error) {
            setError(data.result.error);
        } else if (data.status === 'ok' && Array.isArray(data.result)) {
            setAddresses(data.result);
        } else {
            setAddresses([]);
        }
        } catch (err) {
        setError('Ошибка при загрузке адресов');
        } finally {
        setLoading(false);
        }
    };

  useEffect(() => {
    fetchAddresses();
  }, []);

    const sendRequest = async (url, payload) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    return await response.json();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    setError('');
    try {
      if (editingId) {
        const data = await sendRequest('/local/api/index.php?CLASS=UserAddresses&METHOD=update', { id: editingId, name, address });
        if (data.error) return setError(data.error);
      } else {
        const data = await sendRequest('/local/api/index.php?CLASS=UserAddresses&METHOD=add', { name, address });
        if (data.error) return setError(data.error);
      }

      setName('');
      setAddress('');
      setEditingId(null);
      fetchAddresses();
    } catch (err) {
      setError('Не удалось сохранить изменения');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setAddress(item.address);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setAddress('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот адрес?')) return;

    setError('');
    try {
      const data = await sendRequest('/local/api/index.php?CLASS=UserAddresses&METHOD=delete', { id });
      if (data.error) {
        setError(data.error);
      } else {
        fetchAddresses();
      }
    } catch (err) {
      setError('Ошибка при удалении адреса');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '10px', fontFamily: 'sans-serif' }}>
      <h2>Управление адресами доставки</h2>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3>{editingId ? 'Редактировать адрес' : 'Добавить новый адрес'}</h3>
        <input
          type="text"
          placeholder="Название (например: Дом, Работа)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '8px' }}
          required
        />
        <input
          type="text"
          placeholder="Полный адрес доставки"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: '8px' }}
          required
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            {editingId ? 'Сохранить изменения' : 'Добавить адрес'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
              Отмена
            </button>
          )}
        </div>
      </form>

      <h3>Ваши сохраненные адреса</h3>
      {loading ? (
        <p>Загрузка...</p>
      ) : addresses.length === 0 ? (
        <p>Адресов пока нет.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {addresses.map((item) => (
            <li key={item.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{item.name}</strong>
                <p style={{ margin: '5px 0 0 0', color: '#555' }}>{item.address}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(item)} style={{ background: '#ffc107', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Изменить</button>
                <button onClick={() => handleDelete(item.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressManager;
