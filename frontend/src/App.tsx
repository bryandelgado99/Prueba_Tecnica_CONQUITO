import React from 'react';
import Dashboard from './pages/Dashboard.page';
import './App.css';

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <Dashboard />
            </div>
        </div>
    );
}

export default App;