# Strategic DDD: An Overview

*Software architecture • ~10 min read*

---

Hey 👋

This week I want to walk you through **Strategic Domain-Driven Design** — one of the most misunderstood topics in software architecture.

Most teams hear "DDD" and think about tactical patterns: Aggregates, Value Objects, Repositories. Those matter, but they're useless without the strategic layer underneath. Strategic DDD is what helps you design systems that actually reflect the business — and teams that can move fast without stepping on each other.

Let's dig in.

---

## The Problem DDD Solves

One of the biggest challenges in software development is the gap between business language and technical language.

Business talks about *customers*, *orders*, and *approvals*. Developers build `CustomerEntityImpl`, `OrderProcessorFactory`, and `ApprovalWorkflowSingleton`.

This disconnect isn't just annoying — it's dangerous. When two people use the same word to mean different things, you end up building the wrong system while both sides think they're aligned.

DDD proposes that **language** be the bridge. Not that developers learn business vocabulary, but that both sides build a shared, precise language together — the *Ubiquitous Language* — that eliminates ambiguity at the source.

---

## Problem Space vs. Solution Space

DDD separates two things that organizations constantly conflate:

- **Problem Space** — the business architecture. Domains and subdomains. *What we want to solve.*
- **Solution Space** — the software architecture. Bounded Contexts. *How we solve it.*

The bigger the alignment between these two spaces, the better your design will be. You'll never achieve perfect alignment — but maximizing it iteratively is the goal.

---

## Subdomains: Where Strategy Meets Architecture

A domain breaks down into subdomains — lower-level business capabilities. How you classify them directly determines how you invest, staff, and build.

| Type | What it is | Strategy |
|---|---|---|
| **Core Subdomain** | Your competitive edge. Where the business wins or loses. | Top in-house teams. No offshore. No off-the-shelf software. |
| **Supporting Subdomain** | Vital for core to work, but not your differentiator. | In-house with possible external support. Minor COTS customizations OK. |
| **Generic Subdomain** | Necessary but commoditized. "We need email sending." | SaaS or COTS. Outsource. Focus on vendor management. |

> *"Not all parts of a system will be well designed."*
> — Eric Evans

That quote changed how I think about architecture. It's not about designing everything perfectly — it's about knowing **where** to invest your best effort.

---

## Bounded Contexts: The Core of Strategic DDD

A **Bounded Context** is a linguistic boundary around a domain model. Inside that boundary, every term has one precise meaning.

The classic example: "Customer" means something different in Sales, Credit Scoring, and Contracts. If you force one shared model for "Customer" across all three, every change cascades everywhere — and teams start blocking each other.

Decentralizing models into Bounded Contexts gives you:

- Higher cohesion within each context
- Lower coupling between teams
- Teams that can work in parallel
- Freedom to make different technical choices per context

**How to identify them?** Don't rely on a single criterion. Evaluate capabilities, ubiquitous language, business policies, quality attributes (scalability, change frequency), and how many teams you actually have available.

---

## Ubiquitous Language: The Bridge

The ubiquitous language is the shared vocabulary between developers and domain experts *inside* a Bounded Context. It's built together, refined continuously.

Practical techniques to build it:

- **Event Storming** — collaborative mapping of domain events
- **Domain Storytelling** — narrating business processes with pictograms
- **Example Mapping** — defining rules through concrete examples
- **User Story Mapping** — organizing features from the user's perspective

The point of all these techniques is the same: eliminate divergent interpretations *before* they turn into bugs or technical debt.

---

## Context Maps: Making the Implicit Explicit

Context Maps are the most underused artifact in DDD. They show the coupling between Bounded Contexts — not just technically, but organizationally and politically.

Key patterns to know:

- **Open Host Service / Published Language** — one provider, many consumers, stable API contract
- **Anticorruption Layer (ACL)** — translation layer that protects your model from an external one
- **Shared Kernel** — shared code/database between contexts (high coordination cost)
- **Customer/Supplier** — downstream can demand, upstream must deliver
- **Conformist** — downstream adopts upstream's model as-is (simple, but coupling++)

A good Context Map makes governance issues visible, shows where bad models are spreading, and becomes your starting point for any architectural transformation.

---

## Teams Follow Architecture (or Should)

One of Strategic DDD's most powerful ideas: architecture and org structure must be aligned.

> *"Team assignments are the first draft of the architecture."*
> — Michael Nygard, author of Release It!

When you define Bounded Contexts, you're implicitly defining how teams should be organized. Some heuristics:

- 5–9 people per team (Conway's Law)
- Mind cognitive load — don't give a team too many contexts to own
- *"You design it, you build it, you run it"* — end-to-end ownership
- Align subdomains with team boundaries

**Team Topologies** (stream-aligned, enabling, platform, complicated-subsystem) is the natural complement to Context Maps — it defines not just how systems relate, but how the humans behind them should interact.

---

## Where to Start

Strategic DDD isn't an all-or-nothing adoption. Start where it hurts:

1. **Map your subdomains** — identify what's truly core to your business vs. what's generic
2. **Draw a rough Context Map** — even informal, it reveals hidden coupling and team friction
3. **Pick one domain and run an Event Storming** — build the ubiquitous language with actual domain experts

The result is an architecture that evolves with your business, reduces inter-team coupling, and makes explicit what was previously just assumed.

---

**Read the full article** (with subdomain comparison table and diagrams) on my site:
👉 [felipepabon.github.io/felipepabon/blog/ddd-strategic-overview.html](https://felipepabon.github.io/felipepabon/blog/ddd-strategic-overview.html)

---

*Thanks for reading. If you found this useful, forward it to someone building distributed systems.*

*— Felipe*

---

*References: Domain-Driven Design by Eric Evans · Implementing Domain-Driven Design by Vaughn Vernon · Team Topologies by Skelton & Pais*
