import React from 'react';
import AddressManager from './AddressManager';
import CheckoutAddressSelect from './CheckoutAddressSelect';

function App() {
  return (
    <div className="App" style={{ padding: '20px' }}>
      <AddressManager />
      
      <hr style={{ margin: '40px 0' }} />

      <CheckoutAddressSelect />
    </div>
  );
}

export default App;
