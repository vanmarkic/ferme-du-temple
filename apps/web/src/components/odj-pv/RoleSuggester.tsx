import { useState } from 'react';
import type { Member, MemberRole, RoleType, RoleSuggestion } from '../../types/odj-pv';
import { ROLE_LABELS } from '../../types/odj-pv';
import { suggestRoles, calculateGap } from '../../lib/odj-pv/roles';

interface RoleSuggesterProps {
  meetingId: string;
  members: Member[];
  roleHistory: MemberRole[];
  currentRoles: Record<RoleType, string[]>; // role -> member ids
  onRolesChange: (roles: Record<RoleType, string[]>) => void;
}

interface GapIndicator {
  icon: string;
  text: string;
  className: string;
}

export function RoleSuggester({
  meetingId,
  members,
  roleHistory,
  currentRoles,
  onRolesChange
}: RoleSuggesterProps) {

  const handleAutoSuggest = () => {
    const activeMembers = members.filter(m => m.active);
    const suggestions = suggestRoles(activeMembers, roleHistory);

    // Convert suggestions to currentRoles format
    const newRoles: Record<RoleType, string[]> = {
      president: [],
      secretaire: [],
      parole: [],
      temps: [],
      serpent: [],
      plage: []
    };

    suggestions.forEach(suggestion => {
      newRoles[suggestion.role] = [suggestion.member_id];
    });

    onRolesChange(newRoles);
  };

  const handleRoleChange = (role: RoleType, memberIds: string[]) => {
    onRolesChange({ ...currentRoles, [role]: memberIds });
  };

  const handleAddMember = (role: RoleType) => {
    // Add an empty slot for another member
    const currentMembers = currentRoles[role] || [];
    onRolesChange({ ...currentRoles, [role]: [...currentMembers, ''] });
  };

  const handleRemoveMember = (role: RoleType, index: number) => {
    const currentMembers = currentRoles[role] || [];
    const newMembers = currentMembers.filter((_, i) => i !== index);
    onRolesChange({ ...currentRoles, [role]: newMembers });
  };

  const getGapIndicator = (memberId: string, role: RoleType): GapIndicator => {
    if (!memberId) {
      return { icon: '', text: '', className: '' };
    }

    const gap = calculateGap(memberId, role, roleHistory);

    if (gap === Infinity) {
      return { icon: '★', text: 'jamais eu', className: 'text-green-600' };
    }
    if (gap >= 3) {
      return { icon: '✓', text: `écart ${gap}`, className: 'text-green-600' };
    }
    if (gap >= 2) {
      return { icon: '✓', text: `écart ${gap}`, className: 'text-yellow-600' };
    }
    return { icon: '⚠️', text: `écart ${gap}`, className: 'text-red-600' };
  };

  const roleOrder: RoleType[] = ['president', 'secretaire', 'parole', 'temps', 'serpent', 'plage'];

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">RÔLES TOURNANTS</h3>
        <button
          onClick={handleAutoSuggest}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>🎲</span>
          <span>Suggestion auto</span>
        </button>
      </div>

      <div className="space-y-4">
        {roleOrder.map((role) => {
          const assignments = currentRoles[role] || [''];
          const canHaveMultiple = role === 'president' || role === 'plage';

          return (
            <div key={role} className="space-y-2">
              <div className="flex items-start gap-3">
                <label className="w-48 pt-2 font-medium text-gray-700">
                  {ROLE_LABELS[role]}
                </label>

                <div className="flex-1 space-y-2">
                  {assignments.map((memberId, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <select
                        value={memberId || ''}
                        onChange={(e) => {
                          const newMembers = [...assignments];
                          newMembers[index] = e.target.value;
                          handleRoleChange(role, newMembers);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Sélectionner --</option>
                        {members.filter(m => m.active).map(member => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>

                      {memberId && (
                        <span className={`flex items-center gap-1 text-sm font-medium min-w-[120px] ${getGapIndicator(memberId, role).className}`}>
                          <span>{getGapIndicator(memberId, role).icon}</span>
                          <span>{getGapIndicator(memberId, role).text}</span>
                        </span>
                      )}

                      {canHaveMultiple && assignments.length > 1 && (
                        <button
                          onClick={() => handleRemoveMember(role, index)}
                          className="px-2 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  {canHaveMultiple && (
                    <button
                      onClick={() => handleAddMember(role)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    >
                      + ajouter
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-green-600">★</span>
            <span>Jamais eu</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600">✓</span>
            <span>Optimal (écart ≥ 3)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-600">✓</span>
            <span>Bien (écart 2)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-600">⚠️</span>
            <span>Récent (écart 0-1)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
