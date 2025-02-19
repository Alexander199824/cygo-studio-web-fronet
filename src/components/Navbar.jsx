import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">Cygo Studio</h1>
          <div className="flex gap-4">
            <button className="px-3 py-2 rounded hover:bg-gray-100">Inicio</button>
            <button className="px-3 py-2 rounded hover:bg-gray-100">Servicios</button>
            <button className="px-3 py-2 rounded hover:bg-gray-100">Mi Cuenta</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;