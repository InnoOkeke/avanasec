# 🔒 Avana Security Scan Report (Score: 0/100)

**Generated:** 1/18/2026, 12:32:24 AM  
**Status:** ⚠️ Issues Detected

## 📊 Scan Metadata

| Metric | Value |
|--------|-------|
| **Duration** | 14846ms |
| **Files Scanned** | 21 |
| **Total Issues** | 1221 |
| **Timestamp** | 2026-01-17T23:32:24.331Z |

## 📈 Issue Summary

| Severity | Count | Icon |
|----------|-------|------|
| **Critical** | 768 | 🔴 |
| **High** | 400 | 🟠 |
| **Medium** | 53 | 🟡 |
| **Low** | 0 | 🟢 |
| **Info** | 0 | ℹ️ |

### Severity Distribution

```
Critical: █████████████ 768
High:     ███████ 400
Medium:   █ 53
Low:       0
```

## 🚨 Detected Issues

### 🔴 Critical Severity (768 issues)

#### 1. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 20 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "echo \"const key = 'sk-proj-1234567890abcdef';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 2. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 102 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 3. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 114 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "echo \"const key = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret-temp.js",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 4. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 210 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 5. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 493 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const key = \"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\";",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 6. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 516 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const key = \"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\";",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 7. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 539 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const key = \"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\";",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 8. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 562 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const key = \"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\";",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 9. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 585 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const key = \"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\";",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 10. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 608 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const key = 'sk-proj-1234567890abcdef';\\\" > test-secret.js\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 11. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 620 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\\\" > test-secret.js\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 12. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 632 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const key = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\\\" > test-secret-temp.js\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 13. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 644 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\\\" > test-secret.js\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 14. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 656 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"const key = \\\"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\\\";\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 15. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 668 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"const key = \\\"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\\\";\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 16. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 680 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"const key = \\\"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\\\";\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 17. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 692 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"const key = \\\"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\\\";\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 18. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 704 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"const key = \\\"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\\\";\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 19. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1064 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\\\" > test-secret.js\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 20. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1076 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\\\" > test-secret.js\",",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 21. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1519 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "echo \"const key = 'sk-proj-1234567890abcdef';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 22. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1531 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 23. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1543 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "echo \"const key = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret-temp.js",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 24. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1555 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 25. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1735 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 26. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1747 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 27. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2343 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "createTempFile(testDir, 'secret.txt', 'const key = \"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\";');",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 28. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2484 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const content = 'const key = \"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\";\\n';",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 29. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2496 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const openaiKey = \"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\";",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 30. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2508 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const secret = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 31. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2520 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const content = 'a'.repeat(200) + 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop' + 'b'.repeat(200);",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 32. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2532 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const content = 'const key = \"sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop\";\\n';",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 33. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2568 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
"code": "const secret = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';",
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 34. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 126 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 35. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 222 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 36. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 716 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const secret = 'AKIAIOSFODNN7EXAMPLE';\\\" > test-aws.js\",",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 37. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 728 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const secret = 'AKIAIOSFODNN7EXAMPLE';\\\" > test-aws.js\",",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 38. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1088 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const secret = 'AKIAIOSFODNN7EXAMPLE';\\\" > test-aws.js\",",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 39. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1100 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const secret = 'AKIAIOSFODNN7EXAMPLE';\\\" > test-aws.js\",",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 40. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1567 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 41. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1579 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 42. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1759 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 43. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1771 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 44. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2366 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "fc.constant('const AWS_ACCESS_KEY = \"AKIA1234567890ABCDEF\";'),",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 45. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2378 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "'const secret = \"AKIA1234567890ABCDEF\";',",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 46. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2402 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "'const secret = \"AKIA1234567890ABCDEF\";',",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 47. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2544 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "const awsKey = \"AKIAIOSFODNN7EXAMPLE\";",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 48. 🔴 AWS Access Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2649 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS Access Key ID detected |

**Code Context:**

```
"code": "fs.writeFileSync(path.join(dir3, 'secret3.js'), 'const AWS_ACCESS_KEY = \"AKIAIOSFODNN7EXAMPLE\";');",
```

**💡 Recommendation:** Move to AWS credentials file or environment variable

---

#### 49. 🔴 GitHub Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2390 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | GitHub Personal Access Token detected |

**Code Context:**

```
"code": "fc.constant('const token = \"ghp_1234567890abcdefghijklmnopqrstuvwxyz12\";'),",
```

**💡 Recommendation:** Revoke token and use GitHub Secrets for CI/CD

---

#### 50. 🔴 GitHub Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2426 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | GitHub Personal Access Token detected |

**Code Context:**

```
"code": "fc.constant('const token = \"ghp_1234567890abcdefghijklmnopqrstuvwxyz12\";'),",
```

**💡 Recommendation:** Revoke token and use GitHub Secrets for CI/CD

---


*... and 718 more critical severity issues*

### 🟠 High Severity (400 issues)

#### 1. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 3403 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'https://mainnet.infura.io/v3/1234567890abcdef1234567890abcdef',",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 2. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 3415 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'https://goerli.infura.io/v3/abcdef1234567890abcdef1234567890',",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 3. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 3427 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'const provider = \"https://polygon-mainnet.infura.io/v3/1234567890abcdef1234567890abcdef\";'",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 4. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 3439 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'https://mainnet.infura.io/v3/1234567890abcdef1234567890abcdef',",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 5. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 3451 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'https://goerli.infura.io/v3/abcdef1234567890abcdef1234567890',",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 6. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 3463 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'const provider = \"https://polygon-mainnet.infura.io/v3/1234567890abcdef1234567890abcdef\";'",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 7. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 3475 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "url: \"https://mainnet.infura.io/v3/1234567890abcdef1234567890abcdef\",",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 8. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 4039 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'https://mainnet.infura.io/v3/1234567890abcdef1234567890abcdef',",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 9. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 4051 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'https://goerli.infura.io/v3/abcdef1234567890abcdef1234567890',",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 10. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 4063 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'const provider = \"https://polygon-mainnet.infura.io/v3/1234567890abcdef1234567890abcdef\";'",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 11. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 4087 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'https://mainnet.infura.io/v3/1234567890abcdef1234567890abcdef',",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 12. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 4099 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'https://goerli.infura.io/v3/abcdef1234567890abcdef1234567890',",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 13. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 4111 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "'const provider = \"https://polygon-mainnet.infura.io/v3/1234567890abcdef1234567890abcdef\";'",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 14. 🟠 Web3 Provider URL with API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 4135 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Web3 provider URL with API key detected |

**Code Context:**

```
"code": "url: \"https://mainnet.infura.io/v3/1234567890abcdef1234567890abcdef\",",
```

**💡 Recommendation:** Move API key to environment variable

---

#### 15. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 102 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 16. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 210 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 17. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 620 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\\\" > test-secret.js\",",
```

**💡 Recommendation:** Move to environment variable

---

#### 18. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 644 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\\\" > test-secret.js\",",
```

**💡 Recommendation:** Move to environment variable

---

#### 19. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1064 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\\\" > test-secret.js\",",
```

**💡 Recommendation:** Move to environment variable

---

#### 20. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1076 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\\\" > test-secret.js\",",
```

**💡 Recommendation:** Move to environment variable

---

#### 21. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1531 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 22. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1555 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 23. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1735 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 24. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1747 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
"code": "echo \"const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';\" > test-secret.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 25. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 126 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 26. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 222 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 27. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 716 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const secret = 'AKIAIOSFODNN7EXAMPLE';\\\" > test-aws.js\",",
```

**💡 Recommendation:** Move to environment variable

---

#### 28. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 728 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const secret = 'AKIAIOSFODNN7EXAMPLE';\\\" > test-aws.js\",",
```

**💡 Recommendation:** Move to environment variable

---

#### 29. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1088 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const secret = 'AKIAIOSFODNN7EXAMPLE';\\\" > test-aws.js\",",
```

**💡 Recommendation:** Move to environment variable

---

#### 30. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1100 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "\"code\": \"echo \\\"const secret = 'AKIAIOSFODNN7EXAMPLE';\\\" > test-aws.js\",",
```

**💡 Recommendation:** Move to environment variable

---

#### 31. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1567 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 32. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1579 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 33. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1759 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 34. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1771 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "echo \"const secret = 'AKIAIOSFODNN7EXAMPLE';\" > test-aws.js",
```

**💡 Recommendation:** Move to environment variable

---

#### 35. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2508 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "const secret = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';",
```

**💡 Recommendation:** Move to environment variable

---

#### 36. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 2568 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
"code": "const secret = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';",
```

**💡 Recommendation:** Move to environment variable

---

#### 37. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 240 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"title": "Bearer Token",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 38. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 241 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"description": "Bearer token detected",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 39. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 245 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"code": "name: 'Twitter Bearer Token',",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 40. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 246 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"suggestion": "Do not hardcode bearer tokens"
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 41. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 252 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"title": "Bearer Token",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 42. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 253 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"description": "Bearer token detected",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 43. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 257 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"code": "description: 'Twitter Bearer token detected',",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 44. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 258 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"suggestion": "Do not hardcode bearer tokens"
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 45. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 347 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"title": "Bearer Token",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 46. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 348 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"description": "Bearer token detected",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 47. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 352 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"code": "name: 'Twitter Bearer Token',",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 48. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 353 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"suggestion": "Do not hardcode bearer tokens"
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 49. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 359 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"title": "Bearer Token",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---

#### 50. 🟠 Bearer Token

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 360 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Bearer token detected |

**Code Context:**

```
"description": "Bearer token detected",
```

**💡 Recommendation:** Do not hardcode bearer tokens

---


*... and 350 more high severity issues*

### 🟡 Medium Severity (53 issues)

#### 1. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 6 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"C:/Users/IMAOBONG/avana/.kiro/documenting/GIT_HOOK_IMPLEMENTATION.md",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 2. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 12 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"id": "openai-api-key-C:\\Users\\IMAOBONG\\avana\\.kiro\\documenting\\GIT_HOOK_IMPLEMENTATION.md-140",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 3. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 17 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"file": "C:\\Users\\IMAOBONG\\avana\\.kiro\\documenting\\GIT_HOOK_IMPLEMENTATION.md",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 4. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 24 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"id": "apple-app-id-C:\\Users\\IMAOBONG\\avana\\.kiro\\documenting\\GIT_HOOK_IMPLEMENTATION.md-198",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 5. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 29 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"file": "C:\\Users\\IMAOBONG\\avana\\.kiro\\documenting\\GIT_HOOK_IMPLEMENTATION.md",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 6. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 32 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "- This file (`GIT_HOOK_IMPLEMENTATION.md`)",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 7. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 55 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "│   ├── GIT_HOOK_IMPLEMENTATION.md      # Technical details",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 8. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 67 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "- ✅ `GIT_HOOK_IMPLEMENTATION.md` - Technical implementation details",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 9. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 79 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "- Create CONTRIBUTING.md",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 10. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 423 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "if (BINARY_EXTENSIONS.has(ext)) {",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 11. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 944 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "\"C:/Users/IMAOBONG/avana/.kiro/documenting/GIT_HOOK_IMPLEMENTATION.md\",",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 12. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 956 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "\"id\": \"openai-api-key-.kiro\\\\documenting\\\\GIT_HOOK_IMPLEMENTATION.md-140\",",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 13. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 968 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "\"file\": \".kiro\\\\documenting\\\\GIT_HOOK_IMPLEMENTATION.md\",",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 14. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 980 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "\"id\": \"apple-app-id-.kiro\\\\documenting\\\\GIT_HOOK_IMPLEMENTATION.md-198\",",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 15. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 992 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "\"file\": \".kiro\\\\documenting\\\\GIT_HOOK_IMPLEMENTATION.md\",",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 16. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1004 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "\"code\": \"- This file (`GIT_HOOK_IMPLEMENTATION.md`)\",",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 17. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1016 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "\"code\": \"│   ├── GIT_HOOK_IMPLEMENTATION.md      # Technical details\",",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 18. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1028 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "\"code\": \"- ✅ `GIT_HOOK_IMPLEMENTATION.md` - Technical implementation details\",",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 19. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1040 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "\"code\": \"- Create CONTRIBUTING.md\",",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 20. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1052 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "\"code\": \"if (BINARY_EXTENSIONS.has(ext)) {\",",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 21. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1591 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "| **File** | `.kiro\\documenting\\GIT_HOOK_IMPLEMENTATION.md` |",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 22. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1603 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "| **File** | `.kiro\\documenting\\GIT_HOOK_IMPLEMENTATION.md` |",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 23. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1615 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "- This file (`GIT_HOOK_IMPLEMENTATION.md`)",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 24. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1627 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "│   ├── GIT_HOOK_IMPLEMENTATION.md      # Technical details",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 25. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1639 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "- ✅ `GIT_HOOK_IMPLEMENTATION.md` - Technical implementation details",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 26. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1651 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "- Create CONTRIBUTING.md",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 27. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1794 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 28. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.avana-cache\scan-results.json` |
| **Line** | 1877 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
"code": "if (BINARY_EXTENSIONS.has(ext)) {",
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 29. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\documenting\GIT_HOOK_IMPLEMENTATION.md` |
| **Line** | 199 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
- This file (`GIT_HOOK_IMPLEMENTATION.md`)
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 30. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\documenting\IMPLEMENTATION_SUMMARY.md` |
| **Line** | 52 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
│   ├── GIT_HOOK_IMPLEMENTATION.md      # Technical details
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 31. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\documenting\IMPLEMENTATION_SUMMARY.md` |
| **Line** | 360 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
- ✅ `GIT_HOOK_IMPLEMENTATION.md` - Technical implementation details
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 32. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\documenting\IMPLEMENTATION_SUMMARY.md` |
| **Line** | 457 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
- Create CONTRIBUTING.md
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 33. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\documenting\TEST_GIT_HOOKS.md` |
| **Line** | 152 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
RED='\033[0;31m'
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 34. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\documenting\TEST_GIT_HOOKS.md` |
| **Line** | 153 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
GREEN='\033[0;32m'
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 35. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\documenting\TEST_GIT_HOOKS.md` |
| **Line** | 154 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
YELLOW='\033[1;33m'
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 36. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\documenting\TEST_GIT_HOOKS.md` |
| **Line** | 155 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
NC='\033[0m' # No Color
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 37. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\documenting\TEST_GIT_HOOKS.md` |
| **Line** | 158 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
TESTS_PASSED=0
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 38. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\documenting\TEST_GIT_HOOKS.md` |
| **Line** | 159 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
TESTS_FAILED=0
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 39. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 42 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
| **File** | `.kiro\documenting\GIT_HOOK_IMPLEMENTATION.md` |
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 40. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 182 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
| **File** | `.kiro\documenting\GIT_HOOK_IMPLEMENTATION.md` |
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 41. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 191 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
- This file (`GIT_HOOK_IMPLEMENTATION.md`)
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 42. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 211 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
│   ├── GIT_HOOK_IMPLEMENTATION.md      # Technical details
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 43. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 231 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
- ✅ `GIT_HOOK_IMPLEMENTATION.md` - Technical implementation details
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 44. 🟡 Apple App ID

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 251 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Apple App ID detected |

**Code Context:**

```
- Create CONTRIBUTING.md
```

**💡 Recommendation:** Move to environment variable: APPLE_APP_ID

---

#### 45. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 271 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
RED='\033[0;31m'
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 46. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 291 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
GREEN='\033[0;32m'
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 47. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 311 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
YELLOW='\033[1;33m'
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 48. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 331 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
NC='\033[0m' # No Color
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 49. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 351 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
TESTS_PASSED=0
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 50. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\avana\.kiro\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 371 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
TESTS_FAILED=0
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---


*... and 3 more medium severity issues*


## 💡 Recommendations

### 🚨 **URGENT: Critical Issues Detected**

You have **768 critical** security issue(s) that require immediate attention:

- **Stop deployment** until these are resolved
- **Review all critical issues** listed above
- **Implement fixes** as suggested
- **Re-scan** to verify fixes

### ⚠️ **High Priority Issues**

You have **400 high** severity issue(s):

- **Address within 24-48 hours**
- **Review security implications** carefully
- **Test fixes thoroughly** before deployment

### 📋 **General Improvements**

You have **53 medium** and **0 low** severity issues:

- **Plan fixes** in upcoming development cycles
- **Consider security impact** during code reviews
- **Document any accepted risks**

### 🔴 **Security Score: 0/100 - Critical**

Your security score is critically low. Immediate action required:

1. **Address all critical and high issues** immediately
2. **Implement security training** for the development team
3. **Establish security review process** for all code changes
4. **Consider security audit** by external experts

### 🛡️ **Security Best Practices**

- **Never commit secrets** to version control
- **Use environment variables** for sensitive configuration
- **Implement proper access controls** for production systems
- **Regular security training** for all developers
- **Automated security scanning** in CI/CD pipelines
- **Keep dependencies updated** and monitor for vulnerabilities

### 🔧 **Using Avana Effectively**

- **Pre-commit hooks**: Run `avana install` to catch issues before commits
- **CI/CD integration**: Add Avana to your build pipeline
- **Regular scans**: Schedule periodic security scans
- **Team adoption**: Ensure all team members use Avana consistently