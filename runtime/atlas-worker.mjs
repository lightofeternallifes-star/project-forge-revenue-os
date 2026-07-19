import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const ignoredDirectories = new Set(['.git', 'node_modules', '.DS_Store']);

async function collectFiles(directory, root, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) await collectFiles(absolute, root, files);
    else if (entry.isFile()) files.push(relative(root, absolute));
  }
  return files;
}

export async function runAtlasRepositoryAnalysis(mission, employee, root) {
  const files = await collectFiles(root, root);
  const markdown = files.filter((file) => extname(file).toLowerCase() === '.md');
  const source = files.filter((file) => /^(src|runtime|public|credentials)\//.test(file));
  const tests = files.filter((file) => /(^|\/)(test|tests)\//.test(file) || /\.test\.[cm]?[jt]s$/.test(file));
  const architecture = files.filter((file) => /(^|\/)(docs\/architecture|docs\/execution|execution|portal\/types)\//.test(file));
  const packagePath = join(root, 'package.json');
  let packageData = {};
  try { packageData = JSON.parse(await readFile(packagePath, 'utf8')); } catch { packageData = { readError: true }; }
  const topLevel = [...new Set(files.map((file) => file.split('/')[0]))].sort();
  const findings = [
    `${files.length} repository files were inspected by the Atlas worker.`,
    `${markdown.length} Markdown records and ${source.length} runtime/source files were classified.`,
    `${tests.length} test files and ${architecture.length} architecture/execution records were located.`,
    `Package scripts available: ${Object.keys(packageData.scripts || {}).join(', ') || 'none'}.`
  ];
  return {
    workType: 'Repository Analysis',
    missionType: mission.type,
    objective: mission.objective,
    employee: employee.employeeName,
    completedWork: `Atlas analyzed the repository structure, runtime, documentation, tests, and package configuration for ${mission.title}.`,
    repository: { rootReference: '.', filesInspected: files.length, markdownFiles: markdown.length, sourceFiles: source.length, testFiles: tests.length, architectureFiles: architecture.length, topLevelDirectories: topLevel, package: { name: packageData.name || null, version: packageData.version || null, scripts: Object.keys(packageData.scripts || {}) } },
    findings,
    inspectedFiles: files.slice(0, 250),
    constraints: 'Read-only repository analysis. No source files or external systems were modified by the worker.',
    generatedAt: new Date().toISOString()
  };
}
