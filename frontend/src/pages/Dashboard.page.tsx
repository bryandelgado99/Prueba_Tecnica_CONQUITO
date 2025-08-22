import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import StatsCardComponent from "../components/Dashboard/StatsCard.component.tsx";
import ProfessionBarChartComponent from "../components/Dashboard/BarChart.component.tsx";
import AgeRangePieChartComponent from "../components/Dashboard/PieChart.component.tsx";
import MonthlyLineChartComponent from "../components/Dashboard/LineChart.component.tsx";


// Iconos simples usando emojis (puedes usar react-icons si prefieres)
const Icons = {
    Users: () => <span className="text-xl">👥</span>,
    Chart: () => <span className="text-xl">📊</span>,
    Calendar: () => <span className="text-xl">📅</span>,
    Refresh: () => <span className="text-xl">🔄</span>
};

const Dashboard: React.FC = () => {
    const { data, loading, error, refreshData } = useDashboard();

    // Calcular estadísticas totales
    const totalPersons: number = data.professionStats.reduce((sum, item) => sum + (item.count || 0), 0);
    const totalProfessions: number = data.professionStats.length;
    const currentMonth: number = new Date().getMonth() + 1;
    const currentMonthRegistrations: number = data.monthlyStats.find(item => item.month === currentMonth)?.count || 0;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-gray-600">Cargando dashboard...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <span className="text-red-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error al cargar el dashboard</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                        <button
                            onClick={refreshData}
                            className="mt-2 btn-primary text-sm"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard de Estadísticas</h1>
                    <p className="text-gray-600">Panel de control con estadísticas de personas registradas</p>
                </div>
                <button
                    onClick={refreshData}
                    className="btn-secondary flex items-center space-x-2"
                >
                    <Icons.Refresh />
                    <span>Actualizar</span>
                </button>
            </div>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCardComponent
                    title="Total de Personas"
                    value={totalPersons}
                    icon={<Icons.Users />}
                    color="blue"
                />
                <StatsCardComponent
                    title="Profesiones Diferentes"
                    value={totalProfessions}
                    icon={<Icons.Chart />}
                    color="green"
                />
                <StatsCardComponent
                    title="Registros Este Mes"
                    value={currentMonthRegistrations}
                    icon={<Icons.Calendar />}
                    color="purple"
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfessionBarChartComponent data={data.professionStats} />
                <AgeRangePieChartComponent data={data.ageRangeStats} />
            </div>

            <div className="grid grid-cols-1">
                <MonthlyLineChartComponent data={data.monthlyStats} />
            </div>
        </div>
    );
};

export default Dashboard;