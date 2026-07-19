import { requiredDocuments } from './employee-domain.mjs';

export function generateFactoryDocumentReferences() {
  return requiredDocuments.map((name) => ({ name, status: 'Draft', version: '1.0', reference: `factory/templates/${name.replaceAll(' ', '-')}.md` }));
}
