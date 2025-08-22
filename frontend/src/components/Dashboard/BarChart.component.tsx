import React from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import type { ProfessionStat } from "../../types"
import {Card, CardContent, CardHeader, CardTitle} from "../UI/card.tsx";


interface ProfessionBarChartProps {
    data: ProfessionStat[]
    title?: string
}

interface ChartDataItem {
    profession: string
    count: number
}

const ProfessionBarChartComponent: React.FC<ProfessionBarChartProps> = ({
                                                                            data,
                                                                            title = "Personas por Profesión",
                                                                        }) => {
    // Transformar los datos para el gráfico
    const chartData: ChartDataItem[] = data.map((item) => ({
        profession: item.profession || "Sin especificar",
        count: item.count || 0,
    }))

    return (
        <Card className="w-full h-96 flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="profession"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="count"
                            fill="#3b82f6"
                            name="Cantidad de Personas"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default ProfessionBarChartComponent