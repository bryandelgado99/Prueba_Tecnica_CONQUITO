import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/card.tsx';
import type { MonthlyStat } from '../../types';

interface MonthlyLineChartProps {
    data: MonthlyStat[];
    title?: string;
}

interface ChartDataItem {
    month: string;
    count: number;
    monthNumber: number;
}

const MonthlyLineChartComponent: React.FC<MonthlyLineChartProps> = ({
                                                                        data,
                                                                        title = "Registros por Mes"
                                                                    }) => {
    const monthNames: string[] = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const chartData: ChartDataItem[] = data.map(item => ({
        month: monthNames[item.month - 1] || 'Sin especificar',
        count: item.count || 0,
        monthNumber: item.month || 0
    })).sort((a, b) => a.monthNumber - b.monthNumber);

    return (
        <Card className="w-full h-96 flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                            name="Registros"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default MonthlyLineChartComponent;