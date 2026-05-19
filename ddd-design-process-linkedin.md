Most teams read about DDD, understand the concepts... and then open a class editor with no idea where to actually start.

This is the new edition of my newsletter — and it answers exactly that: the DDD design process, from a fuzzy problem to a working model, using an Open Finance consent management system as the end-to-end example.

**1. Event Storming before you model anything**
The biggest mistake teams make is jumping straight to entities and classes. Event Storming flips that — you get business, product, and compliance in the same room, mapping what *happens* in the domain before touching any code. In the Open Finance example, a two-hour session surfaces events like ConsentRequested, ConsentGranted, ConsentRevoked, and ConsentExpired — and more importantly, the questions nobody had documented yet (like: can a TPP request consent for future payments that haven't happened yet?).

**2. From sticky notes to a Context Map**
Once you have the event timeline, natural clusters emerge. In Open Finance, four Bounded Contexts appear: a Consent Context (Core — the real differentiator), Account Information and Payment Initiation (Supporting), and an Identity Context (Generic — buy it, don't build it). That Core/Supporting/Generic split isn't cosmetic. It tells you where your best engineers should spend their time.

**3. Tactical modeling inside the Consent Context**
This is where it gets concrete. The `Consent` aggregate enforces all business rules: you can't grant a consent that's already active, you can't revoke one that's expired, and every state change publishes a Domain Event. No database logic, no HTTP calls — just domain rules. The article walks through the full model: Aggregate, Entities, Value Objects, and Domain Events.

**4. Signals that your model needs revision**
DDD isn't a one-shot exercise. The edition closes with the warning signs that a context boundary is wrong — like when your aggregate starts loading data from three other contexts to make a single decision, or when the business team stops recognizing your class names in a conversation.

If the previous edition was the "what" of Strategic DDD, this one is the "how."

Read the full edition + diagrams on Substack 👇
🔗 https://felipepabon.substack.com

#SoftwareArchitecture #DDD #DomainDrivenDesign #OpenFinance #CleanArchitecture #TechLead #SoftwareDevelopment
