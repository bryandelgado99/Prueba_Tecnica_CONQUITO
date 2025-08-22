import React from 'react';

interface AppBarProps {
    title: string;
    menuButton?: React.ReactNode;
    
}

const AppBar: React.FC<AppBarProps> = ({ title, menuButton }) => {
    return (
        <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-card">
            <div className="flex items-center gap-2">
                {menuButton}
                <h1 className="text-lg font-bold">{title}</h1>
            </div>
        </div>
    );
};

export default AppBar;
