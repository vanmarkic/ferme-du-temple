import { useState } from 'react';
import { Users, FolderOpen, UserCog, LogOut, Menu, X, Calculator, FileText, Building2, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminSidebarProps {
  currentPage: 'inscriptions' | 'guide' | 'users' | 'credit' | 'compromis' | 'architect-fees';
}

const navItems = [
  {
    id: 'inscriptions' as const,
    label: 'Inscriptions',
    href: '/admin/dashboard',
    icon: Users,
  },
  {
    id: 'credit' as const,
    label: 'Credit Castor',
    href: '/admin/credit',
    icon: Calculator,
  },
  {
    id: 'compromis' as const,
    label: 'Compromis',
    href: '/admin/compromis',
    icon: FileText,
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
  {
    id: 'architect-fees' as const,
    label: 'Honoraires Archi',
    href: '/architect-fees',
    icon: Building2,
    external: true,
  },
];

export function AdminSidebar({ currentPage }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/admin/login';
    }
  };

  const NavContent = () => (
    <>
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === currentPage;

          const isExternal = 'external' in item && item.external;

          return (
            <a
              key={item.id}
              href={item.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                isActive
                  ? 'bg-magenta text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              )}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isExternal && <ExternalLink className="w-3 h-3 ml-auto opacity-50" />}
            </a>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-400 hover:bg-red-500/20 hover:text-red-400 mt-4 border-t border-white/10 pt-4"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Deconnexion</span>
      </button>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-rich-black text-white px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/10 rounded-md transition-colors"
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-bold text-lg">Admin</span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'md:hidden fixed top-14 left-0 bottom-0 w-64 bg-rich-black text-white p-4 flex flex-col z-50 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-48 shrink-0 bg-rich-black text-white h-screen sticky top-0 p-4 flex-col">
        <NavContent />
      </aside>
    </>
  );
}
