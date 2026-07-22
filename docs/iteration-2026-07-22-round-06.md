# Iteration 06 - Resilient first-run configuration

1. [Function] Custom model URLs accepted unsupported schemes; setup now permits HTTP(S) only.
2. [Function] Provider errors could overrun the setup surface; asynchronous feedback is bounded.
3. [Function] Model fields remained editable during submission; the section now locks as one fieldset.
4. [Function] The setup form did not expose its busy state; it now reports submission activity semantically.
5. [Function] Asynchronous failures could be missed above the button; the alert now receives focus.
6. [Aesthetic] Progress did not show the two-stage sequence; each phase now carries a clear step number.
7. [Function] Switching model providers retained the previous secret; incompatible credentials are cleared.
8. [Function] Returning to local voice retained the cloud key; that secret is now cleared immediately.
9. [Function] Provider changes could leave secrets revealed; both credential fields are remasked.
10. [Function] Local storage failure could misreport a successful activation; preference persistence is now non-fatal.
