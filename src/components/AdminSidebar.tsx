import { Users, FolderOpen, UserCog } from 'lucide-react';
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
  return (
    <aside className="w-48 shrink-0 bg-rich-black text-white min-h-screen p-4">
      <nav className="space-y-2">
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
    </aside>
  );
}
