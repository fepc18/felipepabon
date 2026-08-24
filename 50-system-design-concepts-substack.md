# 50 System Design Concepts Every Architect Should Know (With Their Trade-offs)

Most "system design guides" give you a list of buzzwords. This one gives you something more useful: the reason each concept exists, and the trade-off you're accepting when you use it.

Fifty concepts, five categories. Let's go.

---

## 1. Core Infrastructure

**1. Scalability** — The system's ability to handle growth while keeping acceptable performance. A system is only as scalable as its least scalable component. Scaling your app servers while ignoring the database just moves the bottleneck.

**2. Vertical Scaling** — Adding more CPU, RAM, or storage to a single machine. Simple, but there's a physical ceiling — and the cost curve is brutal. A machine 8x more powerful than your current one doesn't cost 8x more; it costs much, much more.

**3. Horizontal Scaling** — Adding more machines and distributing load across them. Theoretically unlimited, but your servers need to be stateless. If a server holds session data in memory, you can't route the next request to a different instance.

**4. Load Balancer** — Routes incoming traffic across your fleet, skipping unhealthy servers. The trade-off: the load balancer itself is now a critical component. If it goes down without redundancy, everything goes down with it.

**5. Latency** — Time from request to response for one user. The trap: optimizing the average latency while ignoring p99 (the 99th percentile). That "average" hides users who regularly wait 10x longer.

**6. Throughput** — Total requests per second the system handles. Fast individual requests don't guarantee high throughput if they block each other. Parallelism helps, but introduces race conditions.

**7. CDN** — Globally distributed cache for static assets. Your users in São Paulo shouldn't be hitting a server in Virginia for every image. The risk: stale content if cache invalidation isn't carefully set up.

**8. DNS** — The internet's phone book, but also a traffic routing tool. GeoDNS can route users to the nearest datacenter. The catch: DNS caches propagate slowly. A change takes minutes to hours to fully propagate.

**9. API Gateway** — The front door for your backend services: handles auth, rate limiting, SSL termination, and routing. Centralizes cross-cutting concerns. Risk: it's now the single path for all external traffic — protect it accordingly.

**10. Reverse Proxy** — Sits between clients and servers, handling caching, SSL, and load balancing. Load balancers are a specialized subset of reverse proxies. Both add a network hop; both need to be high-availability.

---

## 2. Data & Storage

**11. Database** — Persistent storage beyond one request's lifetime. There is no universal database — each type optimizes for specific access patterns and sacrifices others.

**12. SQL Database** — Structured tables, ACID transactions, mature tooling. Great default choice. The bottleneck: write scaling. Beyond a single server, you need sharding — and that's a different beast entirely.

**13. NoSQL Database** — Key-value, document, wide-column, graph. Each solves a specific problem better than SQL at a cost of fewer consistency guarantees. The flexibility is a double-edged sword: it's easy to ship fast and hard to maintain long-term.

**14. ACID** — Atomicity, Consistency, Isolation, Durability. The guarantees that make transactions reliable. The cost: locks and coordination reduce write throughput. Not appropriate for every use case.

**15. Index** — A data structure that speeds up reads at the cost of writes. Every write must update the index. More indexes = slower writes. Index everything and you'll wonder why inserts are slow.

**16. Sharding** — Splitting data across databases by a shard key. The distribution is only as good as your key choice. A user ID that creates hot shards (most users active in the same shard) defeats the purpose.

**17. Replication** — Multiple copies of data, typically leader + followers. Followers handle reads; the leader handles writes. The gap between when the leader writes and followers sync is replication lag — reads from followers can be stale.

**18. Cache** — Fast in-memory storage (Redis, Memcached) for frequently accessed data. The fundamental tension: how fresh does cached data need to be? Stale reads are usually fine for product cards; never fine for account balances.

**19. Cache-Aside** — Application checks cache, on miss goes to DB, stores result. The lazy pattern. Degrades gracefully if cache is down. First requests (cold start) are always slow.

**20. Write-Through** — Every write hits cache and DB simultaneously. Always consistent. The cost: write latency doubles because you're waiting for both to acknowledge.

**21. Write-Behind** — Write hits cache immediately, DB gets synced later asynchronously. Fastest for the client, highest risk. If the cache crashes before sync, those writes are gone.

**22. Consistent Hashing** — Distributes data across nodes so that adding or removing one node only requires moving ~1/N of the data. Traditional modulo hashing requires remapping nearly everything when the cluster changes.

**23. Object Storage** — S3-style: infinitely scalable, cheap, durable, but not a database. No transactions, no low-latency random access. Right for files, wrong for structured data that changes frequently.

**24. Data Partitioning** — Dividing data into logical units: by time (monthly partitions), by ID range, by region. The right partition key can make queries 100x faster by scanning only the relevant slice.

**25. Event Sourcing** — Instead of storing current state, you store the history of events that produced it. Perfect audit trail. Time-travel queries. The cost: you need to replay events to get current state — slow without snapshots.

---

## 3. Distributed Systems

**26. Distributed System** — Multiple machines coordinating over a network. Introduces a whole class of problems that don't exist on one machine: partial failures, clock drift, network partitions, split-brain. Don't distribute before you have to.

**27. CAP Theorem** — A distributed system can be at most two of: Consistent, Available, Partition-tolerant. Since partitions *will* happen in production, the real decision is what your system does during one — stays consistent (blocks) or stays available (serves stale data).

**28. Strong Consistency** — Every read reflects the latest write, regardless of which node responds. Required for financial systems, inventory with hard limits. The overhead: coordination slows everything down.

**29. Eventual Consistency** — Replicas converge over time but may briefly disagree. Perfect for like counts, search indexes, recommendation feeds. Unacceptable for account balances or inventory that can go negative.

**30. Consensus** — Multiple nodes agree on a value despite failures. Raft and Paxos require majority (quorum) agreement. It's expensive. Use it sparingly — for leader election, configuration, critical state — not for every operation.

**31. Leader Election** — Picking one node to coordinate work. Requires consensus to prevent two leaders simultaneously writing (split-brain). The gap while a new leader is elected reduces system capacity temporarily.

**32. Idempotency** — An operation that produces the same result whether called once or ten times. Distributed systems can't guarantee exactly-once delivery. If your retry logic can trigger an operation twice, that operation must be idempotent.

**33. Idempotency Key** — A unique ID the client sends with a request. The server stores it; on duplicate request, it returns the stored result instead of processing again. Standard practice in payment APIs. The storage for keys needs cleanup — don't let it grow forever.

**34. Two-Phase Commit (2PC)** — Makes transactions atomic across multiple databases. Phase 1: "Can you commit?" Phase 2: "Commit." The problem: participants hold locks during both phases. A crashed coordinator means locked resources and a stuck system.

**35. Saga Pattern** — Breaks a distributed operation into local transactions, each with a compensating action if something goes wrong later. No global lock. Reaches eventual consistency through compensation. The downside: intermediate states are visible. Your downstream services may see a half-finished state.

**36. Consistent Hashing Ring** — Nodes arranged in a circle, each responsible for a range. Adding a node only shifts one segment of the ring. Virtual nodes (each physical node holds multiple positions) smooth out the distribution.

**37. Clock Skew** — Machines disagree on what time it is, even with NTP. Causes bugs when you use timestamps to determine event order. The fix: logical clocks or vector clocks, not wall-clock time.

**38. Vector Clock** — Each node keeps a counter; messages carry the full vector. Lets you determine causality ("A happened before B") without a synchronized clock. Gets expensive as node count grows.

---

## 4. Messaging & Communication

**39. Message Queue** — Producers write messages; consumers process them later. The queue decouples them in time — your email service doesn't care if the notification service is slow. The cost: results aren't immediately available. Wrong tool for synchronous workflows.

**40. Pub/Sub** — One publisher, many subscribers get a copy. Unlike queues where one consumer gets each message. Use it when multiple services need to react to the same event. If no subscribers are listening when the message is published (without retention), it's lost.

**41. Dead-Letter Queue (DLQ)** — Where messages go when they've failed too many times. Prevents bad messages from blocking the main queue in an infinite retry loop. If you're not monitoring your DLQ, you're silently losing data.

**42. Backpressure** — Consumer tells producer "slow down" when it's overwhelmed. Without it, queues grow unbounded until the system OOMs. With it, the pressure is visible and manageable — you can alert on it, scale on it, or shed load.

**43. WebSocket** — Persistent, bidirectional connection. Lower overhead than repeatedly opening HTTP connections. The horizontal scaling problem: connections are stateful, so you can't route the next message to a different server without a shared backplane (usually pub/sub like Redis).

**44. Server-Sent Events (SSE)** — Server pushes events to the client over a persistent HTTP connection. One-directional, simpler than WebSockets, built-in reconnect. Ideal for LLM streaming responses, stock tickers, notification feeds. If you need the client to send data back, you need WebSockets.

---

## 5. Reliability & Modern Concepts

**45. Circuit Breaker** — When a dependency fails repeatedly, stop calling it. Three states: Closed (normal), Open (fast-fail), Half-Open (probe to see if it recovered). Prevents cascading failures where one slow service takes down everything that calls it. You need a fallback — a degraded response, a cached result, an error message — for when the breaker is open.

**46. Rate Limiting** — Cap requests per client per time window. Token bucket fills at a fixed rate and empties with each request. Bursts are allowed up to bucket capacity. Protects from abuse and from a single client accidentally DDoS-ing your service. Communicate limits with HTTP headers or clients will retry blindly and make it worse.

**47. Load Shedding** — When you're overloaded, start rejecting the least important requests. Better to serve 80% well than attempt 100% and fail all of them. The hard part: deciding priority. Shed the wrong requests and you break the wrong SLAs.

**48. Bloom Filter** — Space-efficient probabilistic set membership. "Is this username taken?" can be checked in memory before hitting the database. It will never say "no" when the answer is "yes" (no false negatives). It may say "yes" when the answer is "no" (false positives) — which is fine if you verify those positives with a real DB lookup.

**49. Embedding** — A dense vector that represents the semantic meaning of text or an image. Two sentences meaning the same thing will have vectors close together. The foundation of semantic search — searching by meaning rather than keyword matching. Storing and querying millions of high-dimensional vectors requires a specialized vector database.

**50. RAG (Retrieval-Augmented Generation)** — Give an LLM relevant context at query time instead of baking all knowledge into training. Ingestion phase: chunk documents, generate embeddings, store in a vector DB. Query phase: embed the question, find nearest neighbors, inject as context. The quality of your chunking strategy and retrieval logic matters as much as the LLM you choose.

---

## The Meta-Point

These 50 concepts are not a checklist. They're a vocabulary.

The real skill is knowing which tool to reach for and — equally important — which to leave alone. A system that deploys Saga patterns, consistent hashing, and vector clocks for 100 users is over-engineered. A system that doesn't cache, doesn't replicate, and has no circuit breakers for 10 million users is a liability.

Every architectural decision is a trade-off. The question to ask isn't "should I use sharding?" — it's "what am I gaining from sharding, and what am I willing to give up for it?"

That question is what separates architects who know the concepts from those who know how to design real systems.

---

*Originally published at [felipepabon.github.io/felipepabon/blog/50-system-design-concepts.html](https://felipepabon.github.io/felipepabon/blog/50-system-design-concepts.html)*
