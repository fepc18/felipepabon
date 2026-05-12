# How to Apply DDD Without Getting Lost in Theory: Consent Management in Open Finance

Theory is easy. Someone hands you a book on Domain-Driven Design, you read about Bounded Contexts and Ubiquitous Language, and you think — great, I get it. Then Monday comes, you sit in front of a blank diagram, and the question hits: *where do I actually start?*

This post answers that. We'll walk the DDD design process from fuzzy problem to concrete model, using Open Finance as our domain — specifically, consent management for sharing financial data with third parties. It's a domain rich with business rules, regulatory constraints, and multiple actors. Perfect for DDD.

> This post is part of a series. If you haven't read [Strategic DDD: An Overview](https://felipepabon.github.io/felipepabon/blog/ddd-strategic-overview.html) yet, start there — it covers Bounded Contexts, subdomains and Context Maps, which we build on here.

---

## The process in four steps

Before diving in: DDD is not a waterfall. The four steps below are a rough sequence, not a strict pipeline. You'll loop back constantly.

| Step | What you do | Output |
|------|-------------|--------|
| 1. Event Storming | Explore the domain collaboratively | Timeline of events, commands, actors |
| 2. Context Map | Identify Bounded Contexts and classify subdomains | Context Map + integration sketch |
| 3. Tactical Modeling | Model the internals of your Core context | Aggregates, Entities, Value Objects, Events |
| 4. Iterate | Validate with the business, refine | Refined model |

---

## Step 1 — Event Storming: listen before you model

Event Storming, invented by Alberto Brandolini, is deceptively simple: get everyone in a room (product, compliance, devs), grab a roll of paper and sticky notes, and map out what *happens* in the domain.

The rules:
- **Orange stickies** = Domain events (past tense: *ConsentGranted*, *PaymentInitiated*)
- **Blue stickies** = Commands that caused the event (*Grant Consent*, *Initiate Payment*)
- **Yellow stickies** = Actors who issue commands (*User*, *TPP App*, *Scheduler*)
- **Purple stickies** = Policies — when event X happens, command Y fires automatically

For our Open Finance domain, a two-hour session surfaces something like this:

**Actor: User/TPP App** → *Request Consent* → **ConsentRequested**  
**Policy: If authenticated, show scopes** → *Grant Consent* → **ConsentGranted**  
**ConsentGranted** → *Share Account Data* → **AccountDataShared**  
**Actor: User (later)** → *Revoke Consent* → **ConsentRevoked**  
**Policy: Check expiry periodically** → **ConsentExpired**

The real value isn't the diagram. It's what surfaces in the room — the compliance person says "wait, can a TPP request consent for future payments that haven't happened yet?" That question didn't exist in any Jira ticket. Now it does.

---

## Step 2 — From event map to Context Map

After Event Storming, you'll notice natural clusters of events. Everything about requesting and granting consents groups together. Authentication lives separately. Account data access has its own logic. These clusters are your Bounded Context candidates.

For Open Finance, four contexts emerge:

| Context | Subdomain type | Reason |
|---------|---------------|--------|
| **Consent Context** | **Core** | This is the differentiating capability. No other bank does exactly this. |
| Account Information Context | Supporting | Important but not differentiating — exposes accounts data. |
| Payment Initiation Context | Supporting | Orchestrates third-party payments; depends on Consent. |
| Identity Context | Generic | Auth/authz — buy it, don't build it. |

The Core/Supporting/Generic split tells you where to invest. Your best engineers work on the Consent Context. Identity goes to Keycloak or Auth0.

---

## Step 3 — Tactical modeling: inside the Consent Context

Now we go deep into one context — the Core. We define its building blocks:

**The `Consent` Aggregate** is the root. Everything that changes together lives inside it.

```typescript
class Consent {
  private status: ConsentStatus;
  private period: ConsentPeriod;
  private events: DomainEvent[] = [];

  grant(): void {
    if (this.status !== ConsentStatus.PENDING) {
      throw new DomainError('Can only grant a pending consent');
    }
    if (this.period.isExpired()) {
      throw new DomainError('The consent period has already expired');
    }
    this.status = ConsentStatus.ACTIVE;
    this.events.push(new ConsentGranted(this.id, new Date()));
  }

  revoke(reason: string): void {
    if (this.status !== ConsentStatus.ACTIVE) {
      throw new DomainError('Can only revoke an active consent');
    }
    this.status = ConsentStatus.REVOKED;
    this.events.push(new ConsentRevoked(this.id, reason, new Date()));
  }
}
```

Notice what's *not* here: no database calls, no HTTP, no message queues. The Aggregate knows the *rules*, not the *infrastructure*. That's the whole point.

The rest of the model:

- **`ConsentItem` (Entity)** — each specific resource the user grants access to, with its own identity and state
- **`ConsentPeriod` (Value Object)** — immutable start/end dates with an `isExpired()` method baked in
- **`ConsentScope` (Value Object)** — enum-like values: `ACCOUNTS_READ`, `BALANCES_READ`, `PAYMENTS_WRITE`
- **Domain Events** — `ConsentGranted`, `ConsentRevoked`, `ConsentExpired`, `ConsentRequested` — published so other contexts can react

---

## Step 4 — Signals that your model needs revision

DDD is a continuous discovery process. Here are the warning signs that a Bounded Context or Aggregate needs rethinking:

**The Aggregate knows too much.** If `Consent` needs to load account balances, user profiles, and payment history to make a decision — the context boundary is wrong.

**Two teams constantly wait on the same model.** One Bounded Context serving two distinct domains. Split it.

**Ubiquitous Language breaks down.** If business people don't recognize your class names in a conversation, the model has drifted from the domain.

**Domain Events mean nothing to the business.** `ConsentGranted` — good. `RecordUpdated` — that's a technical event with zero semantic value.

---

## The payoff

The result in Open Finance isn't just a system that works. It's a codebase that speaks the language of the regulator, the product team, and the developer at the same time. When a compliance requirement changes, you know exactly which Aggregate to touch. When a new TPP integration arrives, the Context Map tells you which seam to open.

That's what DDD buys you: not elegance for its own sake, but a model that stays aligned with the business as both evolve.

Next up: integration patterns between Bounded Contexts — ACL, Shared Kernel, Open Host Service — and how to apply them when your Open Finance contexts need to talk to each other.

---

*Originally published at [felipepabon.github.io/felipepabon/blog/ddd-design-process.html](https://felipepabon.github.io/felipepabon/blog/ddd-design-process.html)*
