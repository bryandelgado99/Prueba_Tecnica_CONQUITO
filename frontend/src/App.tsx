import React from 'react';
import './App.css';
import Layout from "./components/Layout/layout.component";

function App() {
    return (
        <Layout defaultTitle="Dashboard">
            {/* Contenido dinámico */}
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h2>
                <p>Aquí puedes mostrar tus tarjetas, gráficos y estadísticas.</p>
            </div>
        </Layout>
    );
}

export default App;
