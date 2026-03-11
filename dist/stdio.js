#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
function fromPackageRoot(relative) {
    return path.resolve(__dirname, "..", relative);
}
// ---------------------------------------------------------------------------
// Course state management
// ---------------------------------------------------------------------------
const courseDir = fromPackageRoot(".docs/course");
const CACHE_DIR = path.join(os.homedir(), ".cache", "circle-nanopayments");
function ensureDir(dir) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
}
function getCourseStatePath() {
    ensureDir(path.join(CACHE_DIR, "course"));
    return path.join(CACHE_DIR, "course", "state.json");
}
function loadCourseState() {
    const p = getCourseStatePath();
    if (fs.existsSync(p))
        return JSON.parse(fs.readFileSync(p, "utf-8"));
    return null;
}
function saveCourseState(state) {
    fs.writeFileSync(getCourseStatePath(), JSON.stringify(state, null, 2), "utf-8");
}
function getDeviceIdPath() {
    ensureDir(CACHE_DIR);
    return path.join(CACHE_DIR, ".device_id");
}
function getDeviceId() {
    const p = getDeviceIdPath();
    if (!fs.existsSync(p))
        return null;
    try {
        const parsed = JSON.parse(fs.readFileSync(p, "utf-8"));
        return parsed.deviceId ?? null;
    }
    catch {
        return null;
    }
}
function saveDeviceId(deviceId) {
    fs.writeFileSync(getDeviceIdPath(), JSON.stringify({ deviceId }), "utf-8");
    fs.chmodSync(getDeviceIdPath(), 0o600);
}
// ---------------------------------------------------------------------------
// Course content scanning
// ---------------------------------------------------------------------------
function scanCourseContent() {
    const lessonDirs = fs
        .readdirSync(courseDir)
        .filter((d) => !d.startsWith(".") &&
        fs.statSync(path.join(courseDir, d)).isDirectory())
        .sort();
    const lessons = lessonDirs.map((dir) => {
        const lessonName = dir.replace(/^\d+-/, "");
        const lessonPath = path.join(courseDir, dir);
        const stepFiles = fs
            .readdirSync(lessonPath)
            .filter((f) => f.endsWith(".md"))
            .sort();
        const steps = stepFiles.map((f) => ({
            name: f.replace(/^\d+-/, "").replace(".md", ""),
            status: 0,
        }));
        return { name: lessonName, status: 0, steps };
    });
    return {
        currentLesson: lessons.length > 0 ? lessons[0].name : "",
        lessons,
    };
}
function mergeCourseStates(current, fresh) {
    const existing = new Map(current.lessons.map((l) => [l.name, l]));
    const merged = fresh.lessons.map((newL) => {
        const old = existing.get(newL.name);
        if (!old)
            return newL;
        const oldSteps = new Map(old.steps.map((s) => [s.name, s]));
        const steps = newL.steps.map((ns) => {
            const prev = oldSteps.get(ns.name);
            return prev ? { ...ns, status: prev.status } : ns;
        });
        let status = old.status;
        if (steps.every((s) => s.status === 2))
            status = 2;
        else if (steps.some((s) => s.status > 0))
            status = 1;
        return { ...newL, status, steps };
    });
    let currentLesson = current.currentLesson;
    if (!merged.some((l) => l.name === currentLesson) && merged.length > 0) {
        currentLesson = merged[0].name;
    }
    return { currentLesson, lessons: merged };
}
function readCourseStep(lessonName, stepName) {
    const lessonDirs = fs.readdirSync(courseDir);
    const lessonDir = lessonDirs.find((d) => d.replace(/^\d+-/, "") === lessonName);
    if (!lessonDir)
        throw new Error(`Lesson "${lessonName}" not found.`);
    const lessonPath = path.join(courseDir, lessonDir);
    const files = fs.readdirSync(lessonPath);
    const stepFile = files.find((f) => f.endsWith(".md") &&
        f.replace(/^\d+-/, "").replace(".md", "") === stepName);
    if (!stepFile)
        throw new Error(`Step "${stepName}" not found in lesson "${lessonName}".`);
    return fs.readFileSync(path.join(lessonPath, stepFile), "utf-8");
}
// ---------------------------------------------------------------------------
// Prompts used by course tools
// ---------------------------------------------------------------------------
const introductionPrompt = `
This is a course to help a developer learn how to build with Circle Nanopayments — a micropayment system using USDC and Circle Gateway.
The following is the introduction content, please provide this text to the user EXACTLY as written below. Do not provide any other text or instructions:

# Welcome to the Circle Nanopayments Course!

Thank you for starting the Circle Nanopayments course! This interactive guide will teach you how to build a nanopayment system using Circle's infrastructure — USDC stablecoins, the x402 protocol, and Circle Gateway.

## How This Course Works

- Each lesson is broken into multiple steps
- I'll guide you through code examples and explanations
- You can ask questions at any time
- If you leave and come back, use the \`startCircleCourse\` tool to pick up where you left off. Just ask to "start the Circle course".
- Use \`nextCircleCourseStep\` to move to the next step when you're ready. Just ask "next step".
- Use \`getCircleCourseStatus\` to check your progress. Just ask "show my progress".
- Use \`clearCircleCourseHistory\` to reset and start over. Just ask "reset my course".

Type "start circle course" and let's get started!
`;
const lessonPrompt = `
  This is a course to help a developer learn how to build with Circle Nanopayments.
  Please help the user through the steps by walking them through the content and writing code for them.
  Each lesson is broken into steps. Return the step content and ask the user to move to the next step when ready.
  If the step contains code instructions, write the code for the user. Briefly explain each step before writing code.
  Return any text in markdown blockquotes exactly as written.
`;
function wrapContent(content) {
    return `${lessonPrompt}\n\nHere is the content for this step: <StepContent>${content}</StepContent>\n\nWhen you're ready to continue, use the \`nextCircleCourseStep\` tool to move to the next step.`;
}
// ---------------------------------------------------------------------------
// Docs browsing
// ---------------------------------------------------------------------------
const docsBaseDir = fromPackageRoot(".docs/");
function listDir(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const dirs = entries
        .filter((e) => e.isDirectory())
        .map((e) => e.name + "/")
        .sort();
    const files = entries
        .filter((e) => e.isFile() && e.name.endsWith(".md"))
        .map((e) => e.name.replace(/\.md$/, ""))
        .sort();
    return { dirs, files };
}
function readDocsContent(docPath) {
    const fullPath = path.resolve(path.join(docsBaseDir, docPath));
    if (!fullPath.startsWith(path.resolve(docsBaseDir)))
        return { found: false };
    try {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            const indexPath = path.join(fullPath, "index.md");
            try {
                return { found: true, content: fs.readFileSync(indexPath, "utf-8") };
            }
            catch {
                /* no index.md */
            }
            const { dirs, files } = listDir(fullPath);
            const listing = [`Directory contents of ${docPath || "/"}:`, ""];
            if (dirs.length) {
                listing.push("Subdirectories:");
                listing.push(...dirs.map((d) => `- ${docPath ? `${docPath}/${d}` : d}`));
                listing.push("");
            }
            if (files.length) {
                listing.push("Available docs:");
                listing.push(...files.map((f) => `- ${docPath ? `${docPath}/${f}` : f}`));
                listing.push("");
            }
            return { found: true, content: listing.join("\n") };
        }
        return { found: true, content: fs.readFileSync(fullPath, "utf-8") };
    }
    catch (err) {
        if (err.code === "ENOENT") {
            try {
                return {
                    found: true,
                    content: fs.readFileSync(fullPath + ".md", "utf-8"),
                };
            }
            catch {
                /* not found with .md either */
            }
        }
        return { found: false };
    }
}
function searchDocs(query, baseDir) {
    const results = [];
    const q = query.toLowerCase();
    function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            }
            else if (entry.name.endsWith(".md")) {
                const content = fs.readFileSync(full, "utf-8");
                if (content.toLowerCase().includes(q)) {
                    const lines = content.split("\n");
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].toLowerCase().includes(q)) {
                            const start = Math.max(0, i - 1);
                            const end = Math.min(lines.length, i + 3);
                            results.push({
                                file: path.relative(baseDir, full),
                                excerpt: lines.slice(start, end).join("\n").slice(0, 400),
                                score: content.toLowerCase().split(q).length - 1,
                            });
                            break;
                        }
                    }
                }
            }
        }
    }
    walk(baseDir);
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 10);
}
// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------
const tools = [
    {
        name: "startCircleCourse",
        description: "[🎓 COURSE] Start or resume the Circle Nanopayments course. Begins at the first lesson or picks up where you left off.",
        inputSchema: {
            type: "object",
            properties: {
                email: {
                    type: "string",
                    description: "Optional email for registration.",
                },
            },
        },
    },
    {
        name: "getCircleCourseStatus",
        description: "[🎓 COURSE] Get current course progress including completed lessons and steps.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "startCircleCourseLesson",
        description: "[🎓 COURSE] Jump to a specific lesson by name.",
        inputSchema: {
            type: "object",
            properties: {
                lessonName: {
                    type: "string",
                    description: "Exact lesson name to start.",
                },
            },
            required: ["lessonName"],
        },
    },
    {
        name: "nextCircleCourseStep",
        description: "[🎓 COURSE] Advance to the next step in the current lesson.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "clearCircleCourseHistory",
        description: "[🎓 COURSE] Reset all course progress. This cannot be undone.",
        inputSchema: {
            type: "object",
            properties: {
                confirm: {
                    type: "boolean",
                    description: "Set to true to confirm reset.",
                },
            },
        },
    },
    {
        name: "circleDocs",
        description: "[📚 DOCS] Browse Circle Nanopayments documentation by path. Request paths to explore available docs.",
        inputSchema: {
            type: "object",
            properties: {
                paths: {
                    type: "array",
                    items: { type: "string" },
                    description: "One or more documentation paths to fetch.",
                },
            },
            required: ["paths"],
        },
    },
    {
        name: "searchCircleDocs",
        description: "[📚 DOCS] Search across all Circle Nanopayments documentation.",
        inputSchema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Search query." },
            },
            required: ["query"],
        },
    },
];
// ---------------------------------------------------------------------------
// Tool handlers
// ---------------------------------------------------------------------------
async function handleTool(name, args) {
    switch (name) {
        case "startCircleCourse": {
            let deviceId = getDeviceId();
            if (!deviceId) {
                const id = args.email || `user-${Date.now()}`;
                saveDeviceId(id);
                deviceId = id;
            }
            let state = loadCourseState();
            const fresh = scanCourseContent();
            if (!fresh.lessons.length)
                return "No course content found.";
            if (state) {
                state = mergeCourseStates(state, fresh);
                saveCourseState(state);
            }
            else {
                state = fresh;
                saveCourseState(state);
                return introductionPrompt;
            }
            const lesson = state.lessons.find((l) => l.name === state.currentLesson);
            if (!lesson)
                return "Error: current lesson not found.";
            const step = lesson.steps.find((s) => s.status !== 2);
            if (!step) {
                lesson.status = 2;
                const next = state.lessons.find((l) => l.status !== 2 && l.name !== state.currentLesson);
                if (next) {
                    state.currentLesson = next.name;
                    saveCourseState(state);
                    return `🎉 You completed "${lesson.name}"! Moving to "${next.name}". Use \`nextCircleCourseStep\` to start.`;
                }
                return "🎉 Congratulations! You completed all lessons!";
            }
            step.status = 1;
            if (lesson.status === 0)
                lesson.status = 1;
            saveCourseState(state);
            const content = readCourseStep(state.currentLesson, step.name);
            return `📘 Lesson: ${state.currentLesson}\n📝 Step: ${step.name}\n\n${wrapContent(content)}`;
        }
        case "getCircleCourseStatus": {
            const state = loadCourseState();
            if (!state)
                return "No course progress found. Start with `startCircleCourse`.";
            const total = state.lessons.length;
            const completed = state.lessons.filter((l) => l.status === 2).length;
            const totalSteps = state.lessons.reduce((s, l) => s + l.steps.length, 0);
            const doneSteps = state.lessons.reduce((s, l) => s + l.steps.filter((st) => st.status === 2).length, 0);
            let report = `# Circle Nanopayments Course Progress\n\n`;
            report += `- Current Lesson: **${state.currentLesson}**\n`;
            report += `- Lessons: ${completed}/${total} (${Math.round((completed / total) * 100)}%)\n`;
            report += `- Steps: ${doneSteps}/${totalSteps} (${Math.round((doneSteps / totalSteps) * 100)}%)\n\n`;
            state.lessons.forEach((l, i) => {
                const icon = l.status === 2 ? "✅" : l.status === 1 ? "🔶" : "⬜";
                const cur = l.name === state.currentLesson ? "👉 " : "";
                report += `### ${cur}${i + 1}. ${icon} ${l.name}\n\n`;
                l.steps.forEach((s, si) => {
                    const sIcon = s.status === 2 ? "✅" : s.status === 1 ? "🔶" : "⬜";
                    report += `- ${sIcon} Step ${si + 1}: ${s.name}\n`;
                });
                report += "\n";
            });
            return report;
        }
        case "startCircleCourseLesson": {
            const state = loadCourseState();
            if (!state)
                return "No progress found. Start with `startCircleCourse`.";
            const target = state.lessons.find((l) => l.name === args.lessonName);
            if (!target) {
                return `Lesson "${args.lessonName}" not found. Available:\n${state.lessons.map((l, i) => `${i + 1}. ${l.name}`).join("\n")}`;
            }
            state.currentLesson = target.name;
            const step = target.steps.find((s) => s.status !== 2) || target.steps[0];
            if (!step)
                return `Lesson "${target.name}" has no steps.`;
            step.status = 1;
            if (target.status === 0)
                target.status = 1;
            saveCourseState(state);
            const content = readCourseStep(target.name, step.name);
            return `📘 Starting: ${target.name}\n📝 Step: ${step.name}\n\n${wrapContent(content)}`;
        }
        case "nextCircleCourseStep": {
            const state = loadCourseState();
            if (!state)
                return "No progress found. Start with `startCircleCourse`.";
            const lesson = state.lessons.find((l) => l.name === state.currentLesson);
            if (!lesson)
                return "Current lesson not found.";
            const curIdx = lesson.steps.findIndex((s) => s.status === 1);
            if (curIdx === -1)
                return "No step in progress. Use `startCircleCourse`.";
            lesson.steps[curIdx].status = 2;
            const nextIdx = lesson.steps.findIndex((s, i) => i > curIdx && s.status !== 2);
            if (nextIdx !== -1) {
                lesson.steps[nextIdx].status = 1;
                saveCourseState(state);
                const content = readCourseStep(state.currentLesson, lesson.steps[nextIdx].name);
                return `🎉 Step "${lesson.steps[curIdx].name}" completed!\n\n📘 ${state.currentLesson}\n📝 Next: ${lesson.steps[nextIdx].name}\n\n${wrapContent(content)}`;
            }
            lesson.status = 2;
            const lessonIdx = state.lessons.findIndex((l) => l.name === state.currentLesson);
            const nextLesson = state.lessons.find((l, i) => i > lessonIdx && l.status !== 2);
            if (nextLesson) {
                state.currentLesson = nextLesson.name;
                if (nextLesson.steps[0])
                    nextLesson.steps[0].status = 1;
                nextLesson.status = 1;
                saveCourseState(state);
                const content = readCourseStep(nextLesson.name, nextLesson.steps[0]?.name ?? "");
                return `🎉 Completed "${lesson.name}"!\n\n📘 Starting: ${nextLesson.name}\n📝 Step: ${nextLesson.steps[0]?.name}\n\n${wrapContent(content)}`;
            }
            saveCourseState(state);
            return "🎉 Congratulations! You completed all lessons in the Circle Nanopayments course!";
        }
        case "clearCircleCourseHistory": {
            if (!args.confirm)
                return "⚠️ This deletes all progress. Run again with confirm: true.";
            const p = getCourseStatePath();
            if (fs.existsSync(p))
                fs.unlinkSync(p);
            return "🧹 Course progress cleared. Start fresh with `startCircleCourse`.";
        }
        case "circleDocs": {
            const paths = args.paths || [];
            if (!paths.length) {
                const { dirs, files } = listDir(docsBaseDir);
                return `Available documentation:\n\nDirectories:\n${dirs.map((d) => `- ${d}`).join("\n")}\n\nFiles:\n${files.map((f) => `- ${f}`).join("\n")}`;
            }
            return paths
                .map((p) => {
                const r = readDocsContent(p);
                if (r.found)
                    return `## ${p}\n\n${r.content}\n\n---`;
                return `## ${p}\n\nNot found.\n\n---`;
            })
                .join("\n\n");
        }
        case "searchCircleDocs": {
            const results = searchDocs(args.query, docsBaseDir);
            if (!results.length)
                return `No results for "${args.query}".`;
            return [
                `# Search: "${args.query}"`,
                "",
                `Found ${results.length} result(s):`,
                "",
                ...results.map((r, i) => `## ${i + 1}. ${r.file}\n\n\`\`\`\n${r.excerpt}\n\`\`\`\n`),
            ].join("\n");
        }
        default:
            return `Unknown tool: ${name}`;
    }
}
// ---------------------------------------------------------------------------
// MCP Server setup
// ---------------------------------------------------------------------------
const pkg = JSON.parse(fs.readFileSync(fromPackageRoot("package.json"), "utf-8"));
const server = new Server({ name: "Circle Nanopayments Documentation Server", version: pkg.version }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        const result = await handleTool(name, args || {});
        return { content: [{ type: "text", text: result }] };
    }
    catch (err) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${err instanceof Error ? err.message : String(err)}`,
                },
            ],
            isError: true,
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
//# sourceMappingURL=stdio.js.map