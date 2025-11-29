import { Users, FolderOpen, UserCog, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminSidebarProps {
  currentPage: 'inscriptions' | 'guide' | 'users';
}

const navItems = [
  {
    id: 'inscriptions' as const,
    label: 'Inscriptions',
    href: '/admin/dashboard',
    icon: Users,
  },
  {
    id: 'guide' as const,
    label: 'Guide Drive',
    href: '/admin/guide',
    icon: FolderOpen,
  },
  {
    id: 'users' as const,
    label: 'Utilisateurs',
    href: '/admin/users',
    icon: UserCog,
  },
];

export function AdminSidebar({ currentPage }: AdminSidebarProps) {
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/admin/login';
    }
  };

  return (
    <aside className="w-48 shrink-0 bg-rich-black text-white min-h-screen p-4 flex flex-col">
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === currentPage;

          return (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                isActive
                  ? 'bg-magenta text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-400 hover:bg-red-500/20 hover:text-red-400 mt-4 border-t border-white/10 pt-4"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Deconnexion</span>
      </button>
    </aside>
  );
}
