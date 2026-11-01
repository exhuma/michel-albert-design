---
theme: ../
title: HTTP for developers
colorSchema: light
themeConfig:
  mode: course
  backdrop: circuit
  course: HTTP for developers
layout: cover
---

# HTTP for developers

Two-day course · Michel Albert

---
layout: section
day: 1
---

# Requests

---
layout: reference
---

# Anatomy of a request

::left::

```http {1|2-3|all}
GET /shelf/ HTTP/1.1
Host: michel.albert.lu
Accept: text/html
```

::right::

Line 1: method, target and protocol version.

Headers follow, one per line.

A blank line ends the headers.

<!--
Ask the room which header is mandatory in HTTP/1.1. Answer: Host.
-->

---
layout: reference
---

# Methods say what you intend

::left::

```python {1|2|3|all}
requests.get(url)
requests.post(url, json=data)
requests.delete(url)
```

::right::

GET reads and is safe to repeat.

POST creates; repeating may create twice.

DELETE removes and is idempotent.

---
layout: section
day: 2
---

# Responses

---

# A response mirrors the request

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1834
```

---
layout: reference
---

# Retry only what is safe to repeat

::left::

```python {2|4-5|all}
for attempt in range(3):
    resp = session.get(url, timeout=5)
    if resp.ok:
        return resp.json()
    sleep(2 ** attempt)
```

::right::

GET is idempotent, so a retry is harmless.

Back off between attempts.

Never blind-retry a POST.
