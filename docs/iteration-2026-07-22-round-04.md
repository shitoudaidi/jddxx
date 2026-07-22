# Iteration 04 - Reliable settings workflow

1. [Function] AI HOT settings reads ignored HTTP failure; response status is now validated.
2. [Function] AI HOT settings reads could wait forever; they now use the shared request timeout.
3. [Function] Saving the news source had no timeout; it is now bounded.
4. [Function] Clearing the news key had no timeout; it is now bounded and confirmed.
5. [Function] News endpoint input was sent without validation; only valid HTTP(S) URLs are accepted.
6. [Function] Model settings could not submit with Enter; the section is now a semantic form.
7. [Function] Provider was a typo-prone free-text field; it now uses controlled compatible options.
8. [Function] Provider error text could overrun the drawer; feedback is normalized and capped.
9. [Function] AI HOT success feedback lacked live-region semantics; it is now announced politely.
10. [Aesthetic] The modal drawer lacked a backdrop and ignored reduced motion; both states are now implemented.
