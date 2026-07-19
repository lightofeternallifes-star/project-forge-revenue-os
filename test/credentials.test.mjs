import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { artifactSpecs, credentialLinks, loadDefinition } from '../credentials/engine.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

test('credential engine exposes the complete reusable artifact catalog', async () => {
  const { definition, brand } = await loadDefinition('DE-012A');
  assert.equal(artifactSpecs.length, 24);
  assert.equal(definition.employee_number, 'DE-012A');
  assert.equal(brand.status, 'provisional');
  assert.equal(credentialLinks('DE-012A').length, 24);
});

test('generated Atlas package contains Markdown, HTML, and manifest for every artifact', async () => {
  const output = join(root, 'credentials/generated/DE-012A');
  const manifest = JSON.parse(await readFile(join(output, 'package-manifest.json'), 'utf8'));
  assert.equal(manifest.artifacts.length, artifactSpecs.length);
  for (const artifact of artifactSpecs) {
    const markdown = await readFile(join(output, `${artifact.slug}.md`), 'utf8');
    const html = await readFile(join(output, `${artifact.slug}.html`), 'utf8');
    assert.match(markdown, /Document ID:/);
    assert.match(markdown, /Brand status: provisional/);
    assert.match(html, /@page\{size:A4/);
    assert.match(html, /branding\/canonical\/logo\.svg/);
    assert.match(html, /Page 1 of 1/);
  }
});
