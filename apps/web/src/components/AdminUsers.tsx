import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminSidebar } from './AdminSidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { UserPlus, Trash2, Shield, ShieldCheck, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  active: boolean;
  created_at: string;
}

export function AdminUsers() {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery<AdminUser[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async ({ email, name, password }: { email: string; name: string; password: string }) => {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setNewEmail('');
      setNewName('');
      setNewPassword('');
      toast({
        title: 'Utilisateur cree',
        description: 'Le nouvel administrateur a ete ajoute',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Utilisateur supprime',
        description: 'L\'administrateur a ete retire',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName || !newPassword) {
      toast({
        title: 'Erreur',
        description: 'Email, nom et mot de passe requis',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 6 caracteres',
        variant: 'destructive',
      });
      return;
    }
    createUserMutation.mutate({ email: newEmail, name: newName, password: newPassword });
  };

  const handleDeleteUser = (userId: string, email: string) => {
    if (confirm(`Supprimer l'administrateur ${email} ?`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-magenta/5 to-butter-yellow/5 flex flex-col md:flex-row">
      <AdminSidebar currentPage="users" />
      <div className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-rich-black p-4 md:p-6 mb-4 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-rich-black mb-2">
              Gestion des utilisateurs
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {users?.length || 0} administrateur(s)
            </p>
          </div>

          {/* Add new user form */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-rich-black p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-rich-black mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Ajouter un administrateur
            </h2>
            <form onSubmit={handleCreateUser} className="flex flex-col gap-3 md:gap-4">
              <Input
                type="email"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full text-sm md:text-base"
              />
              <Input
                type="text"
                placeholder="Nom"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-sm md:text-base"
              />
              <Input
                type="password"
                placeholder="Mot de passe (min 6 car.)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-sm md:text-base"
              />
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="bg-magenta hover:bg-magenta-dark text-white w-full md:w-auto md:self-start"
              >
                {createUserMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Ajouter'
                )}
              </Button>
            </form>
          </div>

          {/* Users list */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-rich-black overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                Chargement...
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                Erreur: {(error as Error).message}
              </div>
            ) : users?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucun administrateur
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-200">
                  {users?.map((user) => (
                    <div key={user.id} className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          disabled={deleteUserMutation.isPending}
                          className="text-red-500 border-red-500 hover:bg-red-50 ml-2 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          user.role === 'super_admin'
                            ? 'bg-magenta/10 text-magenta'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role === 'super_admin' ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <Shield className="w-3 h-3" />
                          )}
                          {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          user.active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {user.active ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {user.active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="hidden md:table w-full">
                  <thead>
                    <tr className="bg-rich-black text-white">
                      <th className="px-4 py-3 text-left font-semibold">Nom</th>
                      <th className="px-4 py-3 text-left font-semibold">Email</th>
                      <th className="px-4 py-3 text-left font-semibold">Role</th>
                      <th className="px-4 py-3 text-left font-semibold">Statut</th>
                      <th className="px-4 py-3 text-left font-semibold">Cree le</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user, i) => (
                      <tr
                        key={user.id}
                        className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-4 py-3 font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                            user.role === 'super_admin'
                              ? 'bg-magenta/10 text-magenta'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {user.role === 'super_admin' ? (
                              <ShieldCheck className="w-4 h-4" />
                            ) : (
                              <Shield className="w-4 h-4" />
                            )}
                            {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                            user.active
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {user.active ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            {user.active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            disabled={deleteUserMutation.isPending}
                            className="text-red-500 border-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
