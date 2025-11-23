import { Providers } from './Providers';
import { AdminDashboard } from './AdminDashboard';

export function AdminDashboardWrapper() {
  return (
    <Providers>
      <AdminDashboard />
    </Providers>
  );
}
