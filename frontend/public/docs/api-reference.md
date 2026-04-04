# API Reference

This is a sample API reference demonstrating the platform's auto-generated documentation endpoints.

## `/api/generate`

Allows developers to submit source code for automated documentation generation.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `input_mode` | string | Yes | Must be "codegen". |
| `language` | string | Yes | The language of the code (e.g., `python`, `javascript`). |
| `raw_code` | string | Yes | The raw source code to analyze. |

### Example Response

```json
{
  "status": "success",
  "generated_docs": "---DOCGEN:DOCSTRINGS---..."
}
```
