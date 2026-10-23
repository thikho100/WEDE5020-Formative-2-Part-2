# Part 3 submission checklist

Reviewed against the supplied WEDE5020 instructions (Part 3, pages 15–18) and Part 3 rubric on 23 October 2026.

## Present in source

- FAQ accordion, gallery lightbox, animations/transitions and DOM updates.
- Leaflet map with direct-file embedded-map fallback.
- JSON catalogue, search, category filtering and sorting.
- Enquiry validation and treatment-duration/opening-hours response.
- AJAX enquiry POST endpoint. Local fallback is not proof that hosted AJAX works.
- Contact validation and encoded email the user can send through their mail app, matching the detailed contact-form instructions.
- Titles, descriptions, keywords, heading structure, image alt text, internal links, robots/sitemap and hosting security headers.
- README changelog includes Part 2 feedback changes.

## Before submission

- [ ] Publish the current repository. The assignment permits a free platform of choice; this implementation includes a Netlify function.
- [ ] Add the actual live URL to README.
- [ ] On the live site, confirm the enquiry POST returns HTTP 200 with JSON in browser Network tools. A browser fallback response alone is insufficient evidence of AJAX submission.
- [ ] Test all pages, search/filter/sort/reset, FAQ, gallery keyboard controls, map controls and both forms on desktop and mobile.
- [ ] Confirm the contact email opens with the correct recipient, subject and body; sending still requires the user's email app. Do not claim automatic delivery.
- [ ] Check live sitemap, robots, canonical URLs, HTTPS and response headers.
- [ ] Add current screenshots and an accurate test record. Existing screenshots are Part 2 evidence.
- [ ] Complete and record genuine off-page SEO work (backlinks/social promotion) appropriate to this student project. Do not invent links or represent an unverified clinic account as official.
- [x] Format the README references consistently as numbered IEEE-style online sources, including image sources and AI assistance. Older source access dates were not recorded; add the actual dates if available.
- [ ] Complete the IIE AI disclosure annex with actual conversation screenshots and the student's review of how the assistance was used. README disclosure alone is insufficient.
- [ ] Include the required assessment-sheet/student details in the submission and follow the cover-sheet/LMS instructions.
- [ ] Commit actual changes with descriptive messages and submit the GitHub link to the LMS.

## Carry-over items to review

- The Part 2 responsive-image gap is fixed: HTML photos and dynamic service images now use srcset/sizes with 300px, 600px and original 900px sources. Browser layout checks are still required.
- The map labels the clinic pin as an approximate CBD location. Exact coordinates have not been verified.
- No live URL, social posts, backlinks, email delivery or AI annex completion is claimed by this review.
