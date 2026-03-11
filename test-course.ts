#!/usr/bin/env npx tsx

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const courseDir = path.join(__dirname, ".docs", "course");

let passed = 0;
let failed = 0;
const errors: string[] = [];

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    errors.push(message);
    console.log(`  ❌ ${message}`);
  }
}

// ---------------------------------------------------------------------------
// Test 1: Course structure — 8 modules with expected lesson counts
// ---------------------------------------------------------------------------
console.log("\n🔍 Test 1: Course Structure\n");

const expectedModules = [
  { dir: "01-introduction", name: "introduction", minLessons: 3 },
  { dir: "02-gateway", name: "gateway", minLessons: 3 },
  { dir: "03-x402-sdk", name: "x402-sdk", minLessons: 3 },
  { dir: "04-seller-server", name: "seller-server", minLessons: 4 },
  { dir: "05-creating-wallet", name: "creating-wallet", minLessons: 3 },
  { dir: "06-funding-gateway", name: "funding-gateway", minLessons: 4 },
  { dir: "07-paying-the-paywall", name: "paying-the-paywall", minLessons: 3 },
  { dir: "08-batch-settlement", name: "batch-settlement", minLessons: 4 },
];

assert(fs.existsSync(courseDir), "Course directory exists");

const actualModules = fs
  .readdirSync(courseDir)
  .filter((d) => fs.statSync(path.join(courseDir, d)).isDirectory())
  .sort();

assert(
  actualModules.length === expectedModules.length,
  `Expected ${expectedModules.length} modules, found ${actualModules.length}`
);

for (const mod of expectedModules) {
  const modPath = path.join(courseDir, mod.dir);
  const exists = fs.existsSync(modPath);
  assert(exists, `Module "${mod.dir}" exists`);

  if (exists) {
    const lessons = fs
      .readdirSync(modPath)
      .filter((f) => f.endsWith(".md"))
      .sort();
    assert(
      lessons.length >= mod.minLessons,
      `Module "${mod.dir}" has ${lessons.length} lessons (min: ${mod.minLessons})`
    );
  }
}

// ---------------------------------------------------------------------------
// Test 2: Course content quality — required topics appear in the curriculum
// ---------------------------------------------------------------------------
console.log("\n🔍 Test 2: Course Content Quality\n");

const requiredTopics = [
  { keyword: "USDC", description: "USDC stablecoin references" },
  { keyword: "Gateway", description: "Circle Gateway references" },
  { keyword: "x402", description: "x402 protocol references" },
  { keyword: "nanopayment", description: "Nanopayment concept", caseInsensitive: true },
  { keyword: "deposit", description: "Gateway deposit instructions" },
  { keyword: "withdraw", description: "Withdrawal instructions" },
  { keyword: "signature", description: "Signature-based payment verification" },
  { keyword: "settlement", description: "Batch settlement process" },
  { keyword: "EIP-3009", description: "EIP-3009 TransferWithAuthorization" },
  { keyword: "Faucet", description: "Testnet faucet usage", caseInsensitive: true },
  { keyword: "Express", description: "Express server framework" },
  { keyword: "viem", description: "viem library usage" },
  { keyword: "GatewayClient", description: "GatewayClient SDK usage" },
  { keyword: "createGatewayMiddleware", description: "Seller middleware SDK usage" },
  { keyword: "privateKeyToAccount", description: "Wallet generation with viem" },
];

function getAllCourseContent(): string {
  let allContent = "";
  for (const mod of actualModules) {
    const modPath = path.join(courseDir, mod);
    const lessons = fs.readdirSync(modPath).filter((f) => f.endsWith(".md"));
    for (const lesson of lessons) {
      allContent += fs.readFileSync(path.join(modPath, lesson), "utf-8") + "\n";
    }
  }
  return allContent;
}

const allContent = getAllCourseContent();

for (const topic of requiredTopics) {
  const found = topic.caseInsensitive
    ? allContent.toLowerCase().includes(topic.keyword.toLowerCase())
    : allContent.includes(topic.keyword);
  assert(found, `Course covers: ${topic.description}`);
}

// ---------------------------------------------------------------------------
// Test 3: Code examples — TypeScript blocks and SDK imports
// ---------------------------------------------------------------------------
console.log("\n🔍 Test 3: Code Examples\n");

const codeBlockPattern = /```(?:typescript|ts|bash|shell)/g;
const codeBlocks = allContent.match(codeBlockPattern) || [];
assert(codeBlocks.length >= 15, `Course has ${codeBlocks.length} code blocks (min: 15)`);

const circleImports = allContent.match(/import\s+.*from\s+['"]@circle-fin/g) || [];
assert(circleImports.length >= 3, `Course has ${circleImports.length} Circle SDK imports (min: 3)`);

const viemImports = allContent.match(/import\s+.*from\s+['"]viem/g) || [];
assert(viemImports.length >= 3, `Course has ${viemImports.length} viem imports (min: 3)`);

const noJsBlocks = !/```(?:javascript|js)\n/.test(allContent);
assert(noJsBlocks, "No JavaScript code blocks (course uses TypeScript)");

// ---------------------------------------------------------------------------
// Test 4: No mastra references
// ---------------------------------------------------------------------------
console.log("\n🔍 Test 4: No Mastra References\n");

const mastraRefs = allContent.match(/mastra/gi) || [];
assert(mastraRefs.length === 0, `No "mastra" in course content (found: ${mastraRefs.length})`);

const serverCode = fs.readFileSync(path.join(__dirname, "dist", "stdio.js"), "utf-8");
const serverMastraRefs = serverCode.match(/mastra/gi) || [];
assert(serverMastraRefs.length === 0, `No "mastra" in server code (found: ${serverMastraRefs.length})`);

const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));
const pkgStr = JSON.stringify(pkgJson);
const pkgMastraRefs = pkgStr.match(/mastra/gi) || [];
assert(pkgMastraRefs.length === 0, `No "mastra" in package.json (found: ${pkgMastraRefs.length})`);

const readme = fs.readFileSync(path.join(__dirname, "README.md"), "utf-8");
const readmeMastraRefs = readme.match(/mastra/gi) || [];
assert(readmeMastraRefs.length === 0, `No "mastra" in README.md (found: ${readmeMastraRefs.length})`);

// ---------------------------------------------------------------------------
// Test 5: Server tool simulation — course state management
// ---------------------------------------------------------------------------
console.log("\n🔍 Test 5: Server Tools (Simulated)\n");

interface Step {
  name: string;
  status: number;
}

interface Lesson {
  name: string;
  status: number;
  steps: Step[];
}

interface CourseState {
  currentLesson: string;
  lessons: Lesson[];
}

function testScanCourseContent(): CourseState {
  const lessonDirs = fs
    .readdirSync(courseDir)
    .filter((d) => !d.startsWith(".") && fs.statSync(path.join(courseDir, d)).isDirectory())
    .sort();

  const lessons: Lesson[] = lessonDirs.map((dir) => {
    const lessonName = dir.replace(/^\d+-/, "");
    const lessonPath = path.join(courseDir, dir);
    const stepFiles = fs
      .readdirSync(lessonPath)
      .filter((f) => f.endsWith(".md"))
      .sort();
    const steps: Step[] = stepFiles.map((f) => ({
      name: f.replace(/^\d+-/, "").replace(".md", ""),
      status: 0,
    }));
    return { name: lessonName, status: 0, steps };
  });

  return { currentLesson: lessons[0]?.name || "", lessons };
}

const courseState = testScanCourseContent();
assert(
  courseState.lessons.length === 8,
  `Scan found ${courseState.lessons.length} lessons (expected 8)`
);
assert(
  courseState.currentLesson === "introduction",
  `First lesson is "introduction" (got: "${courseState.currentLesson}")`
);

const totalSteps = courseState.lessons.reduce((s, l) => s + l.steps.length, 0);
assert(totalSteps >= 30, `Total steps: ${totalSteps} (min: 30)`);

function testReadStep(lessonName: string, stepName: string): string | null {
  const lessonDirs = fs.readdirSync(courseDir);
  const lessonDir = lessonDirs.find((d) => d.replace(/^\d+-/, "") === lessonName);
  if (!lessonDir) return null;
  const files = fs.readdirSync(path.join(courseDir, lessonDir));
  const stepFile = files.find(
    (f) => f.endsWith(".md") && f.replace(/^\d+-/, "").replace(".md", "") === stepName
  );
  if (!stepFile) return null;
  return fs.readFileSync(path.join(courseDir, lessonDir, stepFile), "utf-8");
}

const firstStep = testReadStep("introduction", "introduction");
assert(firstStep !== null, "Can read first lesson step");
assert(firstStep !== null && firstStep.includes("Nanopayment"), "First step mentions Nanopayments");

const gatewayStep = testReadStep("gateway", "what-is-gateway");
assert(gatewayStep !== null, "Can read Gateway lesson");
assert(gatewayStep !== null && gatewayStep.includes("Gateway"), "Gateway lesson explains Gateway");

const settlementStep = testReadStep("batch-settlement", "conclusion");
assert(settlementStep !== null, "Can read settlement conclusion");

const x402Step = testReadStep("x402-sdk", "what-is-x402");
assert(x402Step !== null, "Can read x402 SDK lesson");

// Search functionality
function testSearch(query: string) {
  const results: { module: string; lesson: string }[] = [];
  const q = query.toLowerCase();
  for (const mod of actualModules) {
    const modPath = path.join(courseDir, mod);
    const lessons = fs.readdirSync(modPath).filter((f) => f.endsWith(".md"));
    for (const lesson of lessons) {
      const content = fs.readFileSync(path.join(modPath, lesson), "utf-8");
      if (content.toLowerCase().includes(q)) {
        results.push({ module: mod, lesson });
      }
    }
  }
  return results;
}

const gatewayResults = testSearch("Gateway Wallet");
assert(gatewayResults.length >= 2, `Search "Gateway Wallet" finds ${gatewayResults.length} results (min: 2)`);

const settlementResults = testSearch("batch settlement");
assert(settlementResults.length >= 1, `Search "batch settlement" finds ${settlementResults.length} results (min: 1)`);

const x402Results = testSearch("x402");
assert(x402Results.length >= 3, `Search "x402" finds ${x402Results.length} results (min: 3)`);

// ---------------------------------------------------------------------------
// Test 6: Server file validity — expected tools and transport
// ---------------------------------------------------------------------------
console.log("\n🔍 Test 6: Server File Validity\n");

assert(serverCode.includes("@modelcontextprotocol/sdk"), "Server uses @modelcontextprotocol/sdk");
assert(serverCode.includes("startCircleCourse"), "Server has startCircleCourse tool");
assert(serverCode.includes("getCircleCourseStatus"), "Server has getCircleCourseStatus tool");
assert(serverCode.includes("startCircleCourseLesson"), "Server has startCircleCourseLesson tool");
assert(serverCode.includes("nextCircleCourseStep"), "Server has nextCircleCourseStep tool");
assert(serverCode.includes("clearCircleCourseHistory"), "Server has clearCircleCourseHistory tool");
assert(serverCode.includes("circleDocs"), "Server has circleDocs tool");
assert(serverCode.includes("searchCircleDocs"), "Server has searchCircleDocs tool");
assert(serverCode.includes("StdioServerTransport"), "Server uses StdioServerTransport");
assert(serverCode.includes("Circle Nanopayments"), "Server name references Circle Nanopayments");

// ---------------------------------------------------------------------------
// Test 7: Package.json validity
// ---------------------------------------------------------------------------
console.log("\n🔍 Test 7: Package Configuration\n");

assert(
  pkgJson.name.includes("circle") || pkgJson.name.includes("nanopayments"),
  `Package name includes circle/nanopayments: "${pkgJson.name}"`
);
assert(
  pkgJson.dependencies["@modelcontextprotocol/sdk"] !== undefined,
  "Has @modelcontextprotocol/sdk dependency"
);
assert(pkgJson.dependencies["@mastra/mcp"] === undefined, "Does NOT have @mastra/mcp dependency");
assert(pkgJson.dependencies["@mastra/core"] === undefined, "Does NOT have @mastra/core dependency");
assert(pkgJson.type === "module", 'Package type is "module"');
assert(pkgJson.scripts?.test !== undefined, "Has test script");

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(60));
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

if (errors.length > 0) {
  console.log("❌ Failed tests:");
  errors.forEach((e) => console.log(`   - ${e}`));
  console.log("");
}

if (failed === 0) {
  console.log("✅ All tests passed! The Circle Nanopayments course is ready.\n");
} else {
  console.log("⚠️  Some tests failed. Please review the errors above.\n");
  process.exit(1);
}
