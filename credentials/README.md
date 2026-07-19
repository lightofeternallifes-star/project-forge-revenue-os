# PROJECT FORGE Digital Credentials Engine™

The engine generates reusable corporate credential packages from an approved Employee Definition. Historical DE-012A records remain unchanged and are the source evidence for `credentials/definitions/DE-012A.json`.

```bash
npm run credentials:generate -- DE-012A
```

The generator produces Markdown source, print-ready HTML, and a package manifest under `credentials/generated/<employee-number>/`.

Branding is provisional until synchronized with the Corporate Brand Repository. The logo SVG files are reference wrappers only; they do not redraw or replace official Carriersfy AI artwork.
