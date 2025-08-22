import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { AgeRangeStat } from '../../types';

interface AgeRangePieChartProps {
    data: AgeRangeStat[];
    title?: string;
}

interface ChartDataItem {
    name: string;
    value: number;
}

const AgeRangePieChartComponent: React.FC<AgeRangePieChartProps> = ({
   data,
   title = "Distribución por Rango de Edad"
}) => {
// Colores para cada segmento
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    console.log("AgeRangePieChartComponent data:", data);

    // Transformar los datos para el gráfico
    const chartData: ChartDataItem[] = Object.entries(data).map(([range, count]) => ({
        name: range,
        value: count as unknown as number
    }));

    return (
        <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} personas`, 'Cantidad']} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AgeRangePieChartComponent;