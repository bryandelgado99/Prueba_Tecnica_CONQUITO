import React, { type ReactNode, useState } from 'react';
import AppBar from './appbar.component.tsx';
import { ScrollArea } from '../UI/scroll-area';
import { Button } from '../UI/button';
import { Home, User, Menu, X } from 'lucide-react';
import Dashboard from "../../pages/Dashboard.page.tsx";
import ListPersons from "../../pages/ListPersons.page.tsx";

interface LayoutProps {
    children?: ReactNode;
    defaultTitle?: string;
}

interface SidebarItem {
    title: string;
    icon: React.ReactNode;
    key: string;
}

const sidebarItems: SidebarItem[] = [
    { title: 'Dashboard', icon: <Home size={18} />, key: 'dashboard' },
    { title: 'Registros', icon: <User size={18} />, key: 'registros' }
];

const Layout: React.FC<LayoutProps> = ({ defaultTitle = 'Dashboard' }) => {
    const [activeItem, setActiveItem] = useState<string>('dashboard');
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const activeTitle = sidebarItems.find(item => item.key === activeItem)?.title || defaultTitle;

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar desktop */}
            <aside
                className={`hidden md:flex border-r border-border bg-card flex-col transition-all duration-300 ${
                    collapsed ? 'w-20' : 'w-64'
                }`}
            >
                <div className="flex items-center justify-between p-4 text-lg font-bold border-b border-border">
                    {!collapsed && <span>Tech Test</span>}
                    <Button
                        variant="ghost"
                        className="p-1"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <Menu size={20} />
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-2 py-4">
                    {sidebarItems.map(item => (
                        <Button
                            key={item.key}
                            variant={activeItem === item.key ? 'default' : 'ghost'}
                            className={`w-full justify-start mb-2 flex items-center gap-2 ${
                                collapsed ? 'justify-center' : ''
                            }`}
                            onClick={() => setActiveItem(item.key)}
                        >
                            {item.icon}
                            {!collapsed && item.title}
                        </Button>
                    ))}
                </ScrollArea>

                {!collapsed && (
                    <div className="text-[0.8em] py-4 inline-flex justify-center items-center">
                        © Desarrollado por Paul Delgado, 2025.
                    </div>
                )}
            </aside>

            {/* Sidebar mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="bg-black/50 absolute inset-0" onClick={() => setMobileOpen(false)} />
                    <aside className="relative w-64 bg-card flex flex-col">
                        <div className="flex items-center justify-between p-4 text-lg font-bold border-b border-border">
                            <span>Tech Test</span>
                            <Button variant="ghost" onClick={() => setMobileOpen(false)}>
                                <X size={20} />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 px-2 py-4">
                            {sidebarItems.map(item => (
                                <Button
                                    key={item.key}
                                    variant={activeItem === item.key ? 'default' : 'ghost'}
                                    className="w-full justify-start mb-2 flex items-center gap-2"
                                    onClick={() => {
                                        setActiveItem(item.key);
                                        setMobileOpen(false);
                                    }}
                                >
                                    {item.icon}
                                    {item.title}
                                </Button>
                            ))}
                        </ScrollArea>
                    </aside>
                </div>
            )}

            {/* Main content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <AppBar
                    title={activeTitle}
                    menuButton={
                        <Button
                            variant="ghost"
                            className="md:hidden p-1"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={20} />
                        </Button>
                    }
                />
                <div className="flex-1 overflow-auto p-6">
                    {activeItem === 'dashboard' && <Dashboard />}
                    {activeItem === 'registros' && <ListPersons />}
                </div>
            </main>
        </div>
    );
};

export default Layout;