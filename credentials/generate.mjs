import { generateCredentials } from './engine.mjs';

const employeeNumber = process.argv[2] || 'DE-012A';
const result = await generateCredentials(employeeNumber);
console.log(JSON.stringify({ employee: result.employeeNumber, brandStatus: result.brandStatus, artifactCount: result.artifacts.length, outputDir: result.outputDir }, null, 2));
