# Part 3 test results

Date: 5 October 2026

## Completed checks

- JavaScript syntax checks passed for the main script and local server.
- All eight website pages returned HTTP 200 from the included local server.
- Local HTML image, stylesheet and internal-page references were checked against existing files. No missing local references were found in the eight pages.
- Each of the eight pages contains one H1 and page-specific metadata.
- A real HTTP POST to the enquiry endpoint returned a relevant treatment-duration response.
- Endpoint tests rejected GET, malformed JSON and oversized request bodies.
- Server-side checks accepted a valid enquiry and rejected an invalid email, invalid telephone, missing consent, invalid service, Sunday date, past date, impossible calendar date, past time and Saturday afternoon time.
- The local server refused access to server.cjs as a public download.
- The build command completed with an explicit test URL. It generated the six-page sitemap, robots.txt and canonical URLs. The test build was removed before packaging to avoid shipping a false live address.
- DOM simulation checks passed for FAQ expansion, catalogue loading, searching, no results, reset, alphabetical sorting and category filtering.
- DOM simulation checks passed for contact validation, encoded email content and rendering HTML-like input as plain text.
- DOM simulation checks passed for enquiry submission and a treatment-duration response using the same server handler.

DOM checks used jsdom in a separate test environment. It is not a project dependency and is not needed to run the website.

## Not verified here

Browser downloads were unavailable and the cloud browser blocked the local preview address. Therefore no visual desktop/mobile inspection, native dialog keyboard/focus check, live map rendering check or browser screenshots are claimed. Use SUBMISSION-CHECKLIST.md to carry out the outstanding checks.

The following also remain unverified: public Netlify deployment and function bundling, live response headers/HTTPS, real mailbox ownership and email delivery, exact clinic coordinates, GitHub push history and off-page promotion. No email or social message was sent.

The three existing responsive screenshots are Part 2 evidence. They are not new Part 3 screenshots.

## After code simplification – 5 October 2026

The DOM and local HTTP checks were repeated after simplifying the JavaScript. Search, reset, sorting, category filtering, FAQ expansion, contact validation, safe email previews and enquiry processing passed. Additional checks covered gallery wraparound and the fallback catalogue. The stylesheet and image bytes are unchanged; seven website HTML files are unchanged. Only invisible service-card data attributes were added to services.html.

The user has separately confirmed local service search/reset, gallery navigation and Escape closing the gallery in the earlier version. The simplified version still needs a brief check in the user's browser. No new browser screenshots are claimed.

## 7 October 2026 – Opening without installation

- Syntax checks passed for script.js and enquiry-check.js.
- Shared checker matches the previous server responses for valid data, invalid email/phone, missing consent, past/Sunday dates, Saturday afternoon and invalid treatment.
- Node VM with small DOM stubs exercised the actual enquiry submit handler in direct-file mode (no Fetch), failed HTTP endpoint, HTML 404 response and successful HTTPS endpoint. Each produced a treatment response and email preview and restored the submit button. These are logic checks, not a real browser test.
- The publishing build completed and includes enquiry-check.js. The test build was removed.
- No installed browser executable was available, so this update still needs a direct-file/Edge preview check on the user's laptop. Live map tiles and extension-specific restrictions were not verified here.
- Earlier user checks confirmed search/reset, gallery, FAQ, map, forms and mobile/tablet layouts before this change.

Map fallback: Node VM DOM-stub checks passed for direct files and missing Leaflet on HTTP, including all three location controls. Embedded map network rendering has not been visually verified here.

## 23 October 2026 – Latest GitHub ZIP review

- Syntax checks passed for script.js, enquiry-check.js and the function handler.
- Eight HTML pages passed local link/asset, single-H1, description and keywords checks. Static images have alt text; the lightbox image receives its alt text in JavaScript.
- Shared enquiry checks passed a valid request and rejected invalid email, phone, consent, Sunday, impossible/past date, Saturday afternoon and unknown service.
- Direct handler tests passed success, wrong method (405), unsupported content type (415), malformed JSON (400) and oversized body (413). These were direct function calls, not live hosted AJAX tests.
- Build succeeded with a reserved test domain; the generated test dist folder was removed before packaging.
- No browser executable was available for fresh visual testing. The user previously confirmed local functionality, including the map.
- No live deployment, mailbox delivery, social promotion or backlink evidence was verified.

## 23 October 2026 – Responsive-image update

- JavaScript syntax and deployment build passed after updating dynamic service image attributes.
- All 16 static JPEG image elements have srcset/sizes. Every candidate exists and its measured width matches its descriptor (300w, 600w or 900w).
- All image candidates are included in the deployment build. The seven 300px files are smaller than their originals.
- CSS and original photos were preserved. Actual browser source selection and visual layout still need a browser check; no visual pass is claimed.
