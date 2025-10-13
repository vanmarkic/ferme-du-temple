#!/usr/bin/env python3
"""
Reorder guide sections from simple/general to complex, grouping similar topics
"""

import re

# Read the backup file
with open('src/content/habitat-beaver-guide.md.backup', 'r', encoding='utf-8') as f:
    content = f.read()

# Split by ## headers (level 2)
sections = re.split(r'\n## ', content)
header = sections[0]  # Everything before first ##

# Parse sections into dict
section_dict = {}
for section in sections[1:]:
    lines = section.split('\n', 1)
    title = lines[0].strip()
    body = lines[1] if len(lines) > 1 else ''

    # Skip duplicates, keep the longest version
    if title not in section_dict or len(body) > len(section_dict[title]):
        section_dict[title] = body

# Define the desired order (from simple to complex)
order = [
    '🏡 Notre projet en bref',
    '🌱 Valeurs fondamentales',
    '🏠 Programmation architecturale',
    '👶 Espace inclusif et protection des enfants',
    '⏰ Temps à investir dans le projet',
    '📜 Règlement d'Ordre Intérieur (ROI)',
    '🎨 Activités individuelles dans les espaces communs',
    '📋 Processus de prise de décision',
    '📅 Fréquence et durée des réunions',
    '📞 Contacts et prochaines étapes',
    '💰 Aspects financiers',
    '🏗️ Montage juridique',
    '🔄 Système de portage de lots d\'habitation',
    '🔀 Révélation progressive de lots "cachés"',
    '🏛️ Transfert futur vers une Fondation CLT (à moyen terme)',
    '🏕️ Période de transition (achat → fin des travaux)',
    '🚪 Processus de sortie du projet',
]

# Reconstruct the file
output = header

for title_pattern in order:
    found = False
    for title in section_dict.keys():
        if title_pattern in title:
            output += f'\n## {title}\n{section_dict[title]}'
            found = True
            break
    if not found:
        print(f'Warning: Section not found: {title_pattern}')

# Write the reordered content
with open('src/content/habitat-beaver-guide.md', 'w', encoding='utf-8') as f:
    f.write(output)

print('Guide reordered successfully!')
