# SEI Software Architecture Methods: An Overview

Most teams make architectural decisions by gut feel, team consensus, or whatever worked at the last company. The Software Engineering Institute (SEI) at Carnegie Mellon took a different approach: they spent decades building *methods* — structured, repeatable processes for designing, documenting, and evaluating software architectures. This is an overview of the most important ones.

---

## What is the SEI?

The SEI is a federally funded research center at Carnegie Mellon University, founded in 1984. You might know them from CMMI or their cybersecurity work. But their software architecture methods are arguably their most practical contribution to the field — forged through real-world work on mission-critical systems, not academic speculation.

---

## The Three Pillars of Architecture Work

The SEI frames architecture work around three activities:

1. **Design** — creating the architecture
2. **Documentation** — capturing it so others can understand and use it
3. **Evaluation** — assessing it against quality requirements

Each pillar has one or more methods. They're not strictly sequential — good architecture work cycles through all three — but the distinction helps you understand what kind of problem you're trying to solve at any given moment.

---

## The Main Methods

| Method | Phase | Purpose | Key Output |
|---|---|---|---|
| **QAW** | Pre-design | Elicit and prioritize quality attributes with stakeholders | Prioritized quality attribute scenarios |
| **ADD** | Design | Design architecture driven by quality attributes | Architectural decisions with rationale |
| **Views & Beyond** | Documentation | Document architecture from multiple perspectives | Architecture document with views |
| **SAAM** | Evaluation | Lightweight scenario-based evaluation | Scenario analysis and risk points |
| **ATAM** | Evaluation | Rigorous tradeoff analysis against quality attributes | Utility tree, sensitivity points, tradeoffs |

### ADD — Attribute-Driven Design

ADD starts with quality attributes — performance, availability, security, modifiability — and uses them as the driving force for every design decision. The process is iterative: pick an element to decompose, choose a pattern that satisfies the most important attributes, document why you chose it, repeat.

The result isn't just an architecture. It's an architecture with *rationale*. That matters six months later when someone asks "why did we build it this way?"

### Views & Beyond

An architecture nobody understands is worthless. Views & Beyond proposes documenting from multiple angles:

- **Module views** — static structure (who depends on what)
- **Component-and-connector views** — runtime behavior (what's running and how it communicates)
- **Allocation views** — mapping to hardware, teams, and deployment environments

Each view answers questions for a different audience. Developers care about module structure. Operations cares about runtime behavior. Management cares about team ownership. One monolithic document serves nobody well.

### QAW — Quality Attribute Workshop

Before designing, you need to know what the business actually cares about. The QAW is a facilitated workshop where stakeholders express needs as concrete quality attribute scenarios:

*"The system must respond in under 200ms under a load of 1,000 concurrent users during peak shopping hours."*

That's a scenario. Not "the system should be fast." These scenarios then drive ADD and become the evaluation criteria in ATAM. Run a QAW and you'll almost always surface contradictory assumptions — performance vs. security, availability vs. cost — that nobody had articulated before.

### SAAM and ATAM

SAAM (Software Architecture Analysis Method) was the SEI's first evaluation method. Scenario-based and relatively lightweight, it helps identify where an architecture falls short of requirements. Good for a one-day review.

ATAM is SAAM's evolution and the method most people mean when they say "SEI architecture evaluation." It adds a utility tree for prioritizing quality attributes, explicit sensitivity point analysis, and documented tradeoffs. It's more rigorous, typically takes two days with multiple stakeholders, but the output — a clear picture of what you're betting on and what you're giving up — is invaluable before a major architectural commitment.

---

## When to Use Each Method

The choice depends on where you are:

- **New project, no architecture yet** → QAW first to align on quality attributes, then ADD to design
- **Architecture exists but nobody can explain it** → Views & Beyond before the knowledge walks out the door
- **Quick gut-check on an existing system** → SAAM, can be run in a day
- **Critical architectural decision or formal audit** → ATAM, worth the time investment

You don't need all five. You need to know which one fits the moment.

---

## Where to Start

The canonical reference is **["Software Architecture in Practice" by Bass, Clements, and Kazman](https://www.amazon.com/Software-Architecture-Practice-SEI-Engineering/dp/0136886094)** — now in its fourth edition. It covers ADD, Views & Beyond, and ATAM in depth. If you want a faster entry point, the SEI publishes technical reports on each method (freely available at sei.cmu.edu).

---

## An ATAM Facilitation Skill

ATAM is the most powerful method in this collection, but it's also the hardest to run. Preparing scenarios, building the utility tree, facilitating stakeholder discussions, documenting tradeoffs in real time — it's a lot to hold in your head.

So I built **[atam-facilitator](https://github.com/fepc18/claude-skills/blob/main/atam-facilitator.plugin)** — a Claude skill that acts as a co-facilitator and walks you through each stage of the method, without needing SEI's formal training. Download it, install it in Claude, and say "let's run an ATAM on this system."

---

*Originally published at [felipepabon.github.io/felipepabon/blog/sei-architecture-methods.html](https://felipepabon.github.io/felipepabon/blog/sei-architecture-methods.html)*
