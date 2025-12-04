import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  BorderStyle,
  WidthType,
  VerticalAlign,
  ShadingType,
} from 'docx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type {
  Meeting,
  AgendaItem,
  MemberRole,
  Member,
  Decision,
  Mission,
  RoleType,
} from '../../types/odj-pv';
import { ROLE_LABELS } from '../../types/odj-pv';

const GOVERNANCE_TEXT = `GOUVERNANCE : concerne l'organisation du groupe, la manière de fonctionner ensemble, le cadre organisationnel.
STRATÉGIQUE : donne la direction au long terme, les grandes orientations, engage un état d'esprit.
OPÉRATIONNELLE : concerne les actions quotidiennes et mensuelles pour faire avancer les opérations de l'Habitat Beaver.`;

const PROCESS_TEXT = `Rappel de fonctionnement : tour de météo, valider ODJ, traiter les points, décisions, clôture, évaluation.`;

interface RoleAssignment {
  role: RoleType;
  memberNames: string[];
}

// Border configuration for tables
const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
};

function createHeaderParagraph(meeting: Meeting): Paragraph {
  const dateStr = format(new Date(meeting.date), "d MMMM yyyy", { locale: fr }).toUpperCase();
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: `RÉUNION HABITAT BEAVER PRÉSENTIELLE DU ${dateStr}`,
        size: 24,
      }),
    ],
  });
}

function createTitleParagraph(): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'ORDRE DU JOUR et P.V.',
        bold: true,
        size: 28,
      }),
    ],
    spacing: {
      before: 200,
      after: 200,
    },
  });
}

function createInfoTable(meeting: Meeting): Table {
  const rows = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'Horaires' })],
          width: { size: 30, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: meeting.start_time && meeting.end_time
                ? `${meeting.start_time} - ${meeting.end_time}`
                : 'À définir',
            }),
          ],
          width: { size: 70, type: WidthType.PERCENTAGE },
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'Lieu' })],
        }),
        new TableCell({
          children: [new Paragraph({ text: meeting.location || 'À définir' })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'Quoi apporter' })],
        }),
        new TableCell({
          children: [new Paragraph({ text: meeting.what_to_bring || '' })],
        }),
      ],
    }),
  ];

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
  });
}

function createRolesTable(roleAssignments: RoleAssignment[]): Table {
  const headerRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            text: 'Rôles tournants',
            alignment: AlignmentType.CENTER,
          }),
        ],
        columnSpan: 2,
        shading: {
          type: ShadingType.SOLID,
          color: 'D9D9D9',
        },
      }),
    ],
  });

  const contentRows = roleAssignments.map(
    ({ role, memberNames }) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: ROLE_LABELS[role] })],
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: memberNames.join(', ') })],
            width: { size: 60, type: WidthType.PERCENTAGE },
          }),
        ],
      })
  );

  return new Table({
    rows: [headerRow, ...contentRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
  });
}

function createGovernanceParagraph(): Paragraph[] {
  return [
    new Paragraph({
      text: '',
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: GOVERNANCE_TEXT,
          italics: true,
        }),
      ],
      spacing: { after: 100 },
    }),
  ];
}

function createProcessParagraph(): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: PROCESS_TEXT,
          italics: true,
        }),
      ],
      spacing: { after: 200 },
    }),
  ];
}

function createAgendaTable(
  agendaItems: AgendaItem[],
  decisions: Decision[],
  missions: Mission[],
  members: Member[],
  includeNotes: boolean
): Table {
  const headerCells = [
    new TableCell({
      children: [new Paragraph({ text: 'Points', alignment: AlignmentType.CENTER })],
      verticalAlign: VerticalAlign.CENTER,
      shading: { type: ShadingType.SOLID, color: 'D9D9D9' },
    }),
    new TableCell({
      children: [new Paragraph({ text: 'Qui?', alignment: AlignmentType.CENTER })],
      verticalAlign: VerticalAlign.CENTER,
      shading: { type: ShadingType.SOLID, color: 'D9D9D9' },
    }),
    new TableCell({
      children: [new Paragraph({ text: 'Temps?', alignment: AlignmentType.CENTER })],
      verticalAlign: VerticalAlign.CENTER,
      shading: { type: ShadingType.SOLID, color: 'D9D9D9' },
    }),
    new TableCell({
      children: [new Paragraph({ text: 'Méthodologie', alignment: AlignmentType.CENTER })],
      verticalAlign: VerticalAlign.CENTER,
      shading: { type: ShadingType.SOLID, color: 'D9D9D9' },
    }),
  ];

  if (includeNotes) {
    headerCells.push(
      new TableCell({
        children: [new Paragraph({ text: 'P.V.', alignment: AlignmentType.CENTER })],
        verticalAlign: VerticalAlign.CENTER,
        shading: { type: ShadingType.SOLID, color: 'D9D9D9' },
      })
    );
  }

  headerCells.push(
    new TableCell({
      children: [new Paragraph({ text: 'MISSIONS et DÉCISIONS', alignment: AlignmentType.CENTER })],
      verticalAlign: VerticalAlign.CENTER,
      shading: { type: ShadingType.SOLID, color: 'D9D9D9' },
    })
  );

  const headerRow = new TableRow({
    children: headerCells,
    tableHeader: true,
  });

  const contentRows = agendaItems
    .sort((a, b) => a.position - b.position)
    .map((item, index) => {
      const itemDecisions = decisions.filter((d) => d.agenda_item_id === item.id);
      const itemMissions = missions.filter((m) => m.agenda_item_id === item.id);

      const decisionsAndMissions: Paragraph[] = [];

      if (itemMissions.length > 0) {
        itemMissions.forEach((mission) => {
          const memberName = members.find((m) => m.id === mission.member_id)?.name || 'Non assigné';
          decisionsAndMissions.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `MISSION (${memberName}): ${mission.description}`,
                  highlight: 'yellow',
                }),
              ],
              spacing: { after: 100 },
            })
          );
        });
      }

      if (itemDecisions.length > 0) {
        itemDecisions.forEach((decision) => {
          decisionsAndMissions.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `DÉCISION: ${decision.content}`,
                  highlight: 'red',
                }),
              ],
              spacing: { after: 100 },
            })
          );
        });
      }

      if (decisionsAndMissions.length === 0) {
        decisionsAndMissions.push(new Paragraph({ text: '' }));
      }

      const cells = [
        new TableCell({
          children: [
            new Paragraph({
              text: `${index + 1}. ${item.title}`,
            }),
          ],
        }),
        new TableCell({
          children: [new Paragraph({ text: item.responsible || '' })],
        }),
        new TableCell({
          children: [new Paragraph({ text: `${item.duration_minutes} min` })],
        }),
        new TableCell({
          children: [new Paragraph({ text: item.methodology || '' })],
        }),
      ];

      if (includeNotes) {
        cells.push(
          new TableCell({
            children: [new Paragraph({ text: item.notes || '' })],
          })
        );
      }

      cells.push(
        new TableCell({
          children: decisionsAndMissions,
        })
      );

      return new TableRow({ children: cells });
    });

  return new Table({
    rows: [headerRow, ...contentRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
  });
}

function getRoleAssignments(roles: MemberRole[], members: Member[]): RoleAssignment[] {
  const roleMap = new Map<RoleType, string[]>();

  roles.forEach((role) => {
    const member = members.find((m) => m.id === role.member_id);
    if (member) {
      const existing = roleMap.get(role.role) || [];
      existing.push(member.name);
      roleMap.set(role.role, existing);
    }
  });

  const roleOrder: RoleType[] = ['president', 'secretaire', 'parole', 'temps', 'serpent', 'plage'];

  return roleOrder
    .filter((role) => roleMap.has(role))
    .map((role) => ({
      role,
      memberNames: roleMap.get(role) || [],
    }));
}

async function generateDocx(
  meeting: Meeting,
  agendaItems: AgendaItem[],
  roles: MemberRole[],
  members: Member[],
  decisions: Decision[],
  missions: Mission[],
  includeNotes: boolean
): Promise<Blob> {
  const roleAssignments = getRoleAssignments(roles, members);

  const doc = new Document({
    sections: [
      {
        children: [
          createHeaderParagraph(meeting),
          createTitleParagraph(),
          createInfoTable(meeting),
          new Paragraph({ text: '', spacing: { after: 200 } }),
          createRolesTable(roleAssignments),
          ...createGovernanceParagraph(),
          ...createProcessParagraph(),
          createAgendaTable(agendaItems, decisions, missions, members, includeNotes),
        ],
      },
    ],
  });

  const { Packer } = await import('docx');
  const blob = await Packer.toBlob(doc);
  return blob;
}

export async function generateODJDocx(
  meeting: Meeting,
  agendaItems: AgendaItem[],
  roles: MemberRole[],
  members: Member[]
): Promise<Blob> {
  return generateDocx(meeting, agendaItems, roles, members, [], [], false);
}

export async function generatePVDraftDocx(
  meeting: Meeting,
  agendaItems: AgendaItem[],
  roles: MemberRole[],
  members: Member[],
  decisions: Decision[],
  missions: Mission[]
): Promise<Blob> {
  return generateDocx(meeting, agendaItems, roles, members, decisions, missions, true);
}

export async function generatePVFinalDocx(
  meeting: Meeting,
  agendaItems: AgendaItem[],
  roles: MemberRole[],
  members: Member[],
  decisions: Decision[],
  missions: Mission[]
): Promise<Blob> {
  return generateDocx(meeting, agendaItems, roles, members, decisions, missions, true);
}
