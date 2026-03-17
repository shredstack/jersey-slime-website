---
name: Cookie namespacing requirement
description: All cookies must be namespaced per-project so multiple apps can run on localhost without collisions
type: feedback
---

Namespace all cookies per-project to avoid collisions when developing multiple apps on the same machine.

**Why:** User develops multiple apps locally and cookies from different projects would collide on localhost.

**How to apply:** When configuring Supabase auth or any cookie-based features, use a project-specific prefix (e.g., `jersey-slime-` for this project) instead of defaults.
