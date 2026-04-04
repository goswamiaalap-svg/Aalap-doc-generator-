export const DOCS: Record<string, { title: string; content: string }> = {
  quickstart: {
    title: "Quickstart",
    content: `# Quickstart Guide

Welcome to HGM-06 — Smart Documentation System.

## What is HGM-06?
HGM-06 is an AI-powered documentation platform that automatically
converts your Markdown files into a beautiful, searchable documentation
website. It includes an embedded AI agent that answers developer
questions directly from your docs.

## Getting Started in 3 Steps

### Step 1: Connect Your Repository
Point HGM-06 at any GitHub repository containing Markdown files.
The platform automatically detects and indexes all .md files.

### Step 2: Watch It Build
Your documentation site is generated instantly. Every file becomes
a page. Every heading becomes a sidebar link.

### Step 3: Ask Questions
Use the AI Search bar to ask anything about your documentation.
The AI agent reads your docs and answers with source citations.

## Supported Markdown Flavours
- CommonMark (standard)
- GitHub Flavoured Markdown (GFM)
- Obsidian (wikilinks, callouts)
- Typst
- MDX

## Next Steps
- Read the Authentication guide
- Explore the API Reference
- Try the DocGen AI code documentation generator`
  },
  authentication: {
    title: "Authentication",
    content: `# Authentication

HGM-06 uses API key based authentication for all AI-powered features.

## Getting Your API Key
The platform uses the Anthropic Claude API under the hood.
You need an Anthropic API key to enable AI features.

### Step 1: Get an Anthropic API Key
Visit https://console.anthropic.com and create an account.
Generate an API key from the dashboard.

### Step 2: Add the Key to Your Environment
\`\`\`bash
# Create a .env file in your backend directory
ANTHROPIC_API_KEY=your_key_here
PORT=5000
\`\`\`

### Step 3: Verify Authentication
\`\`\`bash
curl http://localhost:5000/api/health
# Returns: { "status": "ok" }
\`\`\`

## Security Rules
- Never commit your API key to version control
- Always use environment variables
- The key is never sent to the frontend
- All AI calls are proxied through the backend

## GitHub Webhook Authentication
When using the GitHub webhook for auto-reindex, add a webhook
secret to verify the payload signature:
\`\`\`bash
WEBHOOK_SECRET=your_webhook_secret_here
\`\`\``
  },
  "api-reference": {
    title: "API Reference",
    content: `# API Reference

Complete reference for all HGM-06 backend API endpoints.

## Base URL
\`\`\`
https://your-backend.vercel.app/api
\`\`\`

---

### POST /api/generate
Generate documentation from source code.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| input_mode | string | Yes | Must be "codegen" |
| language | string | Yes | python, javascript, java |
| raw_code | string | Yes | The source code to document |
| feature_flags | object | Yes | Controls which outputs to generate |

**Example Request:**
\`\`\`json
{
  "input_mode": "codegen",
  "language": "python",
  "raw_code": "def add(a, b):\\n    return a + b",
  "feature_flags": {
    "generate_docstrings": true,
    "generate_readme": true,
    "generate_diagram": true,
    "quality_score": true
  }
}
\`\`\`

---

### POST /api/qa
Ask a question answered from documentation context.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| input_mode | string | Yes | Must be "qa" |
| question | string | Yes | The developer question |
| docs_context | array | Yes | Array of doc file objects |

---

### GET /api/health
Returns server status.

**Response:** \`{ "status": "ok", "message": "HGM-06 Backend running." }\``
  },
  features: {
    title: "Platform Features",
    content: `# Platform Features

## Core Features

### Styled Documentation Viewer
Convert any Markdown repository into a beautiful documentation site
with auto-generated sidebar, inter-topic links, and full navigation.
No manual editor. No manual deployment.

### AI Search Agent
An intelligent search agent embedded in every page. Ask questions
in plain English. Get answers grounded in your documentation with
source citations and follow-up suggestions.

### Code Documentation Generator
Paste any source code and get back:
- **Docstrings** — function and class level documentation
- **README** — complete project README.md
- **API Reference** — structured parameter tables
- **Mermaid Diagram** — visual code flow chart
- **Quality Score** — honest 1–10 rating with improvement tips
- **Before/After** — original vs documented comparison

### Multi-Language Support
- Python — Google, NumPy style docstrings
- JavaScript — JSDoc comments
- Java — Javadoc comments

### Auto Reindex
Connect a GitHub webhook and HGM-06 automatically re-indexes
your documentation every time you push a change to the repo.

### File Upload
Upload .py, .js, .java files directly or drag and drop them
onto the input panel. Also supports ZIP archives for batch
processing entire projects at once.

## Advanced Features
- Streaming output — see documentation appear word by word
- Intelligent chunking for large files
- Prompt customisation — style, verbosity, audience, context
- Download any output as .md file
- Copy to clipboard on every section
- Dark mode and light mode
- Mobile responsive layout`
  }
};
