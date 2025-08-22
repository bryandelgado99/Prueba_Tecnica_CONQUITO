import React from 'react';
import type { StatsCardProps } from '../../types';

const StatsCardComponent: React.FC<StatsCardProps> = ({
     title,
     value,
     icon,
     color = "blue"
 }) => {
    const colorClasses = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        purple: "bg-purple-500",
        orange: "bg-orange-500",
        red: "bg-red-500"
    };

    return (
        <div className="dashboard-card">
            <div className="flex items-center">
                <div className={`${colorClasses[color]} p-3 rounded-full text-white`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default StatsCardComponent;