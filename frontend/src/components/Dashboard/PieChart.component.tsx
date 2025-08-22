import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/card';
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
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const chartData: ChartDataItem[] = Object.entries(data).map(([range, count]) => ({
        name: range,
        value: count as unknown as number
    }));

    return (
        <Card className="w-full h-96 flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            {/* Hacemos que el contenido crezca para ocupar todo el espacio */}
            <CardContent className="flex-1">
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
            </CardContent>
        </Card>
    );
};

export default AgeRangePieChartComponent;