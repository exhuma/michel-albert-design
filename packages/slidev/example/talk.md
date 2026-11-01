---
theme: ../
title: Overview of HTTP
colorSchema: dark
themeConfig:
  mode: talk
  backdrop: circuit
layout: cover
---

# Overview of HTTP

Michel Albert

<!--
Welcome. This deck is the theme's talk demo: dark, assertion and evidence, progress rail.
Notes like this one only show in presenter view.
-->

---
layout: section
---

# Requests

---

# A request is just text you could type by hand

```http
GET /shelf/ HTTP/1.1
Host: michel.albert.lu
Accept: text/html
```

<!--
Open a raw socket and type this. That is the whole trick.
-->

---

# The first line says what you want and from where

```http {1|2|3|all}
GET /shelf/ HTTP/1.1
Host: michel.albert.lu
Accept: text/html
```

<!--
Step through: method and target, then the host header, then content negotiation.
-->

---

# A request travels to the server and an answer comes back

<v-clicks>

<div class="flow">client</div>
<div class="flow">request →</div>
<div class="flow">server</div>
<div class="flow">← response</div>

</v-clicks>

<style>
.flow { font-size: 40px; line-height: 64px; }
</style>

<!--
Each click adds one part; earlier parts fade so the newest stays in focus.
-->

---
layout: section
---

# Responses

---

# Timeouts belong on every call

```python {2|3|4|all}
def fetch(url):
    resp = get(url, timeout=5)
    resp.raise_for_status()
    return resp.json()
```

<!--
Without the timeout this call can hang forever. Point at line 2 first.
-->

---

# Status codes group into five families

<v-clicks>

- 1xx: keep going
- 2xx: it worked
- 3xx: look elsewhere
- 4xx: your mistake
- 5xx: our mistake

</v-clicks>

<!--
A list is allowed when the list itself is the evidence.
-->
