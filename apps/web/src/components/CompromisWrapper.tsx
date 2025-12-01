import { AdminSidebar } from './AdminSidebar';
import { Providers } from './Providers';
import { CompromisContent } from './CompromisContent';

export function CompromisWrapper() {
  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-magenta/5 to-butter-yellow/5 flex flex-col md:flex-row">
        <AdminSidebar currentPage="compromis" />
        <div className="flex-1 pt-14 md:pt-0 overflow-auto">
          <CompromisContent />
        </div>
      </div>
    </Providers>
  );
}
