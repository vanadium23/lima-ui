# Some Principles of Features Description

1. Feature description covers the successful path of the interaction with Lima.
2. Feature description should cover all the expectations from API work. Not all of them are apparent. E.g., JSON's fields sorting.
3. "And" for positive cases, "But" for erroneous (empty | incorrect data) ones.
4. Lima is permissive for input and strict for data in it.
5. However, Lima prefers to fail when data is obviously incorrect.
6. Feature description covers the vast range of erroneous attempts.
7. The range of erroneous attempts comes from the definition area of the data mean. In Lima's infant state, the data transferring mean is JSON, so the following data types exist here:
   1. `<object>`,
   2. `<array>`,
   3. `<string>`,
   4. `<number>`,
   5. `<boolean>`,
   6. `null`.
8. Erroneous attempts can also be incoming syntactically incorrect data.
9. Extra fields are fine and ignored.
10. Parts of features description telling about the same ideas should be represented using a common pattern. E.g., for the note field:
    1. _I see present or empty list's note_;
    2. _I see present or empty item's note_.
11. When describing something single, it's singular, e.g. item. When describing multiple elements, it's "several" + plural, e.g., several items. The reason for the approach is the lack of visibility for single "s".
12. essence = list | item.
13. Use "keys" for keywords and "fields" for strings in a map.
14. Use "fields" instead of "properties".
15. Abbreviations in the names are respected.
16. Lima API doesn't return 500 (seems a question to reach this when having database).
17. Steps definitions do not export from each other. Shared parts go to utilities.
18. There are dependent errors and independent ones.
19. "I expect to" for positive and "I expect not to" for negative.
20. Functions using `is` should be named starting with `is-` or some other method signaling about `is` inside.
21. "I expect to <verb>" seems wordy, use "I <verb>".
22. For `(:keyword some-map)` or `(get some-map field)` combined with `not=` nil canary is required to ensure that keyword or field is not missing: `(:keyword some-map nil-canary)` or `(get some-map field nil-canary)`.

## Wishes

1. Automatic check for features description consistency.
2. Shared specification between server and UI.
