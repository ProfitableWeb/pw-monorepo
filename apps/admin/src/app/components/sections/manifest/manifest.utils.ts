import type { ManifestData } from './manifest.types';
import { sections } from './manifest.constants';

export function generateMarkdown(manifest: ManifestData): string {
  let md = '# Манифест издания\n\n';

  sections.forEach(section => {
    md += `## ${section.title}\n\n`;
    section.fields.forEach(field => {
      const value = (manifest[section.id as keyof ManifestData] as any)[
        field.key
      ];
      if (value?.trim()) {
        md += `### ${field.label}\n\n${value}\n\n`;
      }
    });
  });

  return md;
}
