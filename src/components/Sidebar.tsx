import { 
  LayoutDashboard, 
  PieChart, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Store,
  ChevronLeft,
  Menu,
  Building2
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const consultantMenuItems = [
  { icon: LayoutDashboard, label: 'Portfolio Overview', href: '/dashboard' },
  { icon: Building2, label: 'Setores', href: '/sectors' },
  { icon: Users, label: 'Meus Clientes', href: '/clients' },
  { icon: FileText, label: 'Relatórios', href: '/relatorios' },
  { icon: Settings, label: 'Configurações', href: '/configuracoes' },
];

const restaurantMenuItems = [
  { icon: LayoutDashboard, label: 'Meu Dashboard', href: '/client-portal' },
  { icon: PieChart, label: 'Performance', href: '/client-portal/performance' },
  { icon: FileText, label: 'Relatórios', href: '/client-portal/relatorios' },
  { icon: Settings, label: 'Configurações', href: '/client-portal/configuracoes' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = user?.role === 'consultant' ? consultantMenuItems : restaurantMenuItems;

  return (
    <div className={cn(
      'bg-card border-r border-border h-screen flex flex-col transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">Delivery que Vende AI</h2>
                <p className="text-xs text-muted-foreground">
                  {user?.role === 'consultant' ? 'Consultant Dashboard' : 'Restaurant Portal'}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="font-semibold text-primary">
              {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                    collapsed && 'justify-center'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            'w-full justify-start gap-3 text-muted-foreground hover:text-foreground',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
}