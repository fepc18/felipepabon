# ATAM in Practice: A Banking Movements API

Most teams know they *should* evaluate their architecture before committing to it. Few actually do it — because the process feels abstract. "How do I know if this is good?" is a hard question to answer without a structured method.

In the [previous article](https://felipepabon.github.io/felipepabon/blog/sei-architecture-methods.html) I covered the SEI's architecture methods: ADD, Views & Beyond, ATAM. This time, we're going hands-on. We'll apply ATAM to a concrete system: a **REST API for querying banking account movements**.

It looks simple. It isn't.

---

## The System

The API exposes a single endpoint: query account movements for a given account ID. It's consumed by the mobile app and web portal, and it talks to a legacy core banking system on the backend.

**Business drivers:**
- 24/7 availability — customers in multiple timezones
- PCI-DSS compliance and local banking regulation
- Response SLA: p95 < 500ms
- Legacy core with nightly maintenance windows (2–4 AM)
- 90-day mandatory audit log retention

**The four architectural approaches we'll evaluate:**

| # | Approach | Purpose |
|---|----------|---------|
| EA-1 | OAuth2 + JWT auth | Customer identity, account-level authorization |
| EA-2 | Redis cache (30s TTL) | Performance, resilience during core maintenance |
| EA-3 | Circuit breaker to core | Availability protection against cascade failures |
| EA-4 | Append-only audit log | Regulatory compliance, immutable access records |

---

## Utility Tree

Before the analysis, we need to know what we're optimizing for. The utility tree prioritizes quality attributes as concrete, measurable scenarios.

Priority format: **(Business importance, Technical difficulty)** — H/M/L.

| # | Attribute | Scenario | Priority |
|---|-----------|----------|----------|
| Sec-1 | Security | Authenticated customer tries to access another account's movements → rejected with 403, no account existence revealed → 100% blocked | **(H, H)** |
| Sec-2 | Security | Auditor requests full access history for an account → immutable log with user, timestamp, IP → available in < 5 min | **(H, M)** |
| Av-1 | Availability | Core enters maintenance (2–4 AM) → API returns cached movements without error → 0 visible errors | **(H, H)** |
| Av-2 | Availability | End-of-month peak: 10x normal load → 99.9% uptime, no degradation to other endpoints | **(H, H)** |
| Perf-1 | Performance | 1,000 concurrent users query movements → p95 < 500ms, p99 < 1,200ms | **(H, M)** |
| Mod-1 | Modifiability | Regulator adds new mandatory response field → deployed in < 1 week, no impact on other endpoints | **(M, M)** |

Three (H, H) scenarios. That tells you where to focus: security, availability under core failure, and end-of-month peaks.

---

## ATAM Analysis

### Sensitivity Points

**PS-1 — Cache TTL (EA-2)**
The 30-second TTL is a fulcrum: lower it and you get fresher data at the cost of more core load; raise it and you get better performance and resilience at the cost of consistency. Every decision about this value has a direct tradeoff consequence.

**PS-2 — JWT lifetime (EA-1)**
Short-lived tokens (5 min) shrink the compromise window but require frequent refresh — adding latency and complexity. Long-lived tokens (1 hour) are smoother but extend the attack surface.

### Tradeoffs

**TR-1 — Cache vs. Consistency (EA-2)**
Redis cache satisfies Perf-1 and Av-1 at the same time. But a customer might not see a movement that happened 25 seconds ago. In banking, that's not a UX issue — it's a trust issue. Worth acknowledging explicitly.

**TR-2 — Circuit Breaker vs. Data Integrity (EA-3)**
When the core is down, the circuit breaker opens and serves cached data. The customer sees movements. But the customer also assumes those movements are current. In open state, there's no indication the data is stale. A chargeback in progress, a fraud reversal — the customer sees nothing until the cache expires.

**TR-3 — Audit Log vs. Latency (EA-4)**
Synchronous audit writes guarantee no record is lost, even under failure. But they add 15–30ms to every operation. Under peak load (Av-2), this could be the difference between meeting the 500ms SLA and missing it.

### Risks

**R-1 — No cache invalidation (EA-2)** ← *High priority*
If a movement is reversed in the core (chargeback, fraud reversal), the customer sees the wrong state for up to 30 seconds. In banking, this has regulatory implications, not just UX ones.

**R-2 — No JWT revocation (EA-1)** ← *High priority*
If a token is stolen, it's valid until expiration. For 1-hour tokens, that's a 60-minute attack window with no way to shut it down.

**R-3 — Fixed circuit breaker threshold (EA-3)** ← *Medium priority*
Planned maintenance events are predictable, but the circuit breaker doesn't know that. It will trip uncontrolled, stay open until the core recovers, and there's no way to pre-configure the event.

### Non-Risks

**NR-1** — TLS 1.3 on all communications + account ID in JWT claim covers the in-transit interception scenario and lateral account access. Confirmed safe.

**NR-2** — API Gateway rate limiting provides baseline protection against extreme spikes and basic DDoS. Av-2 is partially covered.

---

## Recommendations

🔴 **Critical**
- Implement **event-driven cache invalidation**: when the core emits a reversal event, invalidate the cache entry. An event bus or core webhook can do this.
- Implement **JWT revocation via Redis blacklist**: on logout or anomaly detection, add the JTI to a TTL-backed blacklist.

🟡 **Important**
- Add a **maintenance mode to the circuit breaker**: let operations pre-configure planned windows so the breaker doesn't trip uncontrolled.
- Add a **stale data indicator in the response**: when the circuit breaker is open, include a header or response field that tells the client the data may not be current.

🟢 **Consider**
- Evaluate **async audit writes with a durable broker** (Kafka): if the 500ms SLA becomes a problem under peak load, move audit writes to async with delivery guarantees.

---

## The Takeaway

Three (H, H) scenarios. Five decisions that create real tensions between them. Three risks that weren't visible before the analysis.

> Tradeoffs are not design mistakes. They are conscious decisions. ATAM's job is to document them so the team knows exactly what they're betting on.

---

## Run This on Your Own System

I built **[atam-facilitator](https://github.com/fepc18/claude-skills/blob/main/atam-facilitator.plugin)** — a Claude skill that acts as a co-facilitator and walks you through each ATAM stage: utility tree, architectural approaches, analysis, final report. Works with any system.

One important note: the skill structures the conversation and keeps you on track, but **the quality of the analysis depends entirely on your judgment**. The architect decides which scenarios matter, what counts as a real risk, and whether a tradeoff is acceptable given the business context. No tool can substitute for that — and ATAM was never designed to. It's a method for making your thinking explicit, not for replacing it. The skill just makes that process faster and less likely to skip a step.

---

*Originally published at [felipepabon.github.io/felipepabon/blog/atam-ejemplo-api-bancaria.html](https://felipepabon.github.io/felipepabon/blog/atam-ejemplo-api-bancaria.html)*
