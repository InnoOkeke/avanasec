# 🔒 Avana Security Scan Report (Score: 0/100)

**Generated:** 1/17/2026, 3:15:14 AM  
**Status:** ⚠️ Issues Detected

## 📊 Scan Metadata

| Metric | Value |
|--------|-------|
| **Duration** | 4041ms |
| **Files Scanned** | 233 |
| **Total Issues** | 233 |
| **Timestamp** | 2026-01-17T02:15:14.411Z |

## 📈 Issue Summary

| Severity | Count | Icon |
|----------|-------|------|
| **Critical** | 110 | 🔴 |
| **High** | 105 | 🟠 |
| **Medium** | 18 | 🟡 |
| **Low** | 0 | 🟢 |
| **Info** | 0 | ℹ️ |

### Severity Distribution

```
Critical: █████████ 110
High:     █████████ 105
Medium:   ██ 18
Low:       0
```

## 🚨 Detected Issues

### 🔴 Critical Severity (110 issues)

#### 1. 🔴 AWS SES API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\.kiro\DEVLOG.md` |
| **Line** | 210 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | AWS SES API key detected |

**Code Context:**

```
- **Direct Pattern Integration**: Uses getAllSecretPatterns() directly instead of SecretScanner wrapper
```

**💡 Recommendation:** Move to environment variable: AWS_SES_ACCESS_KEY

---

#### 2. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\GIT_HOOK_IMPLEMENTATION.md` |
| **Line** | 141 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdef';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 3. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 71 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdef';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 4. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 91 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 5. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 111 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret-temp.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 6. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 131 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 7. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 191 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdef';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 8. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 211 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdef';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 9. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 231 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 10. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 251 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret-temp.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 11. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 271 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 12. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 291 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdef';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 13. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 311 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdef';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 14. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 331 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 15. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 351 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret-temp.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 16. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 371 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 17. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 391 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdef';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 18. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 411 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 19. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 431 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret-temp.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 20. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 451 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 21. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 471 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 22. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 491 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 23. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 511 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 24. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 531 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const key = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret-temp.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 25. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 551 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 26. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 571 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 27. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 591 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 28. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 611 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 29. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 631 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 30. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 651 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 31. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 671 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 32. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 691 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 33. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 711 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 34. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1056 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 35. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1076 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 36. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1256 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 37. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1276 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 38. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1296 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 39. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1316 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 40. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1336 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 41. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1356 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 42. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1376 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 43. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1396 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 44. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1416 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 45. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1436 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 46. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1456 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 47. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1476 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 48. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1496 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 49. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1516 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---

#### 50. 🔴 OpenAI API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1536 |
| **Severity** | 🔴 CRITICAL |
| **Type** | secret |
| **Description** | OpenAI API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable: OPENAI_API_KEY

---


*... and 60 more critical severity issues*

### 🟠 High Severity (105 issues)

#### 1. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 91 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 2. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 131 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 3. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 231 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 4. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 271 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 5. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 331 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 6. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 371 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 7. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 411 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 8. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 451 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 9. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 471 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 10. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 491 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 11. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 511 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 12. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 551 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 13. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 571 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 14. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 591 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 15. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 611 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 16. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 631 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 17. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 651 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 18. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 671 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 19. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 691 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 20. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 711 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 21. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1056 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 22. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1076 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 23. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1256 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 24. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1276 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 25. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1296 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 26. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1316 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 27. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1336 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 28. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1356 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 29. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1376 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 30. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1396 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 31. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1416 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 32. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1436 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 33. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1456 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 34. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1476 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 35. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1496 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 36. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1516 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 37. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1536 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 38. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1556 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 39. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1576 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 40. 🟠 Generic API Key

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 1596 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential API key detected |

**Code Context:**

```
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js
```

**💡 Recommendation:** Move to environment variable

---

#### 41. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 151 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
```

**💡 Recommendation:** Move to environment variable

---

#### 42. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 171 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
```

**💡 Recommendation:** Move to environment variable

---

#### 43. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 731 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
```

**💡 Recommendation:** Move to environment variable

---

#### 44. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 751 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
```

**💡 Recommendation:** Move to environment variable

---

#### 45. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 771 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
```

**💡 Recommendation:** Move to environment variable

---

#### 46. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 791 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
```

**💡 Recommendation:** Move to environment variable

---

#### 47. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 811 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
```

**💡 Recommendation:** Move to environment variable

---

#### 48. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 831 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
```

**💡 Recommendation:** Move to environment variable

---

#### 49. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 851 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
```

**💡 Recommendation:** Move to environment variable

---

#### 50. 🟠 Generic Secret

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 871 |
| **Severity** | 🟠 HIGH |
| **Type** | secret |
| **Description** | Potential secret detected |

**Code Context:**

```
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
```

**💡 Recommendation:** Move to environment variable

---


*... and 55 more high severity issues*

### 🟡 Medium Severity (18 issues)

#### 1. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 2061 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
SEED_PHRASE=crew athlete post earn wide wealth liar typical radio delay seminar you
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 2. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 2081 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
SEED_PHRASE=crew athlete post earn wide wealth liar typical radio delay seminar you
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 3. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 2101 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
RED='\033[0;31m'
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 4. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 2121 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
GREEN='\033[0;32m'
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 5. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 2141 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
YELLOW='\033[1;33m'
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 6. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 2161 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
NC='\033[0m' # No Color
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 7. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 2181 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
TESTS_PASSED=0
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 8. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 2201 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
TESTS_FAILED=0
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 9. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 2221 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
SEED_PHRASE=crew athlete post earn wide wealth liar typical radio delay seminar you
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 10. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\scan-reports\avana-security-report-2026-01-17.md` |
| **Line** | 2241 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
PRIVATE_KEY=f89b5493d42642a06c4f46d0472fefa2d54068c0143ef0b5d4e3f480f52b2f35
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 11. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\TEST_GIT_HOOKS.md` |
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

#### 12. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\TEST_GIT_HOOKS.md` |
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

#### 13. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\TEST_GIT_HOOKS.md` |
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

#### 14. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\TEST_GIT_HOOKS.md` |
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

#### 15. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\TEST_GIT_HOOKS.md` |
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

#### 16. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\TEST_GIT_HOOKS.md` |
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

#### 17. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\TEST_GIT_HOOKS.md` |
| **Line** | 198 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
SEED_PHRASE=crew athlete post earn wide wealth liar typical radio delay seminar you
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---

#### 18. 🟡 .env File Content

| Detail | Value |
|--------|-------|
| **File** | `C:\Users\IMAOBONG\DevFlow\avana\TEST_GIT_HOOKS.md` |
| **Line** | 199 |
| **Severity** | 🟡 MEDIUM |
| **Type** | secret |
| **Description** | Environment variable assignment detected (possible .env file content) |

**Code Context:**

```
PRIVATE_KEY=f89b5493d42642a06c4f46d0472fefa2d54068c0143ef0b5d4e3f480f52b2f35
```

**💡 Recommendation:** Ensure .env files are in .gitignore and not committed

---



## 💡 Recommendations

### 🚨 **URGENT: Critical Issues Detected**

You have **110 critical** security issue(s) that require immediate attention:

- **Stop deployment** until these are resolved
- **Review all critical issues** listed above
- **Implement fixes** as suggested
- **Re-scan** to verify fixes

### ⚠️ **High Priority Issues**

You have **105 high** severity issue(s):

- **Address within 24-48 hours**
- **Review security implications** carefully
- **Test fixes thoroughly** before deployment

### 📋 **General Improvements**

You have **18 medium** and **0 low** severity issues:

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