# Kulani’s Dentistry

WEDE5020 – Part 3: Enhancing Functionality and SEO

Student: Thikho Nevhutalu  
Student number: ST10526854

## Project

This project continues the Part 2 dentistry website. The practice is based in Pretoria CBD and provides dental check-ups, cleaning, preventive care, fillings, extractions and emergency dental care. The blue and white design and external stylesheet from Part 2 are retained.

GitHub repository for Parts 2 and 3 (same repository, confirmed by the lecturer): https://github.com/thikho100/WEDE5020-Formative-2-Part-2

Live website: **https://kulanis-dentistry-thikho.netlify.app/**

Open this link in a browser without installing software or logging in. Local viewing through `index.html` is still supported. Submit the GitHub repository link through the LMS as required by the brief.

## Run the website

1. Extract the whole ZIP folder.
2. Double-click `index.html` in Edge or Chrome. No installation is needed.
No launcher, browser extension or Node.js installation is required for local viewing.

Search, gallery, FAQ and enquiry/contact validation work without Node.js. The enquiry uses the same checks in the browser and on the server and shows an email preview. Live map images require internet. Extensions that disable JavaScript must open the page in a normal browser tab.

For optional AJAX development testing only, run `node server.cjs` and open `http://localhost:3000`. The published Netlify site also supports AJAX; visitors need no software installation.

## Website pages

| File | Purpose |
| --- | --- |
| index.html | Home page and links to services and enquiries |
| about.html | Practice history and interactive gallery |
| services.html | Search, category filter and sorting of services |
| enquiry.html | Appointment enquiry, validation and asynchronous processing |
| faq.html | Expandable questions and answers |
| contact.html | Interactive map and contact email form |
| staff-login.html | Staff access notice; secure staff authentication is not connected |
| admin.html | Original Part 2 appointment layout with sample records |

Other files:

- `style.css`: original external CSS plus Part 3 styles and responsive rules.
- `script.js`: JavaScript interactions, form validation and Fetch requests.
- `CODE-GUIDE.md`: simple explanations of the code and what each file does.
- `data/services.json`: dental service catalogue loaded with Fetch [6].
- `images/`: renamed original images; source credits appear below.
- `vendor/leaflet/`: Leaflet 1.9.4 and its BSD 2-Clause licence [9].
- `enquiry-check.js`: shared browser/server input checks and treatment details.
- `lib/enquiry.cjs`: loads those checks for the server.
- `netlify/functions/enquiry.js`: POST handler for the enquiry form.
- `server.cjs`: local server that uses the same enquiry handler.
- `build.cjs`: creates a public `dist` folder, live canonical URLs, sitemap and robots file.
- `netlify.toml` and `_headers`: deployment and response-header configuration.
- `PART2-README.md`: unchanged copy of the previous README.
- `screenshots/`: supplied Part 2 evidence. New Part 3 evidence is still to be added after live testing.
- `SUBMISSION-CHECKLIST.md`: remaining checks and evidence required by the assignment.

## Part 3 functionality

### Interactive elements

- JavaScript FAQ accordion with buttons, `aria-expanded` and labelled answer panels.
- Native dialog lightbox with next/previous controls, arrow keys, Escape and focus return [8].
- Five gallery photographs from the existing image collection.
- CSS transitions and a JavaScript answer animation, respecting reduced-motion preferences.
- Back-to-top button shown after scrolling.
- Service cards created with DOM methods and `textContent` rather than inserting user input as HTML.

### Dynamic content and search

The services page loads `data/services.json` asynchronously [6]. Search matches service names and descriptions. Users can filter by care type and sort alphabetically or by expected treatment length. The result count updates as the user types. There is a clear no-results message and a reset button. Existing HTML cards remain available without JavaScript; a built-in catalogue supports search if the JSON request fails.

### Interactive map

The contact page uses Leaflet with OpenStreetMap tiles [9], [12]. Users can pan, zoom, open marker popups and move between the CBD area and Pretoria Station. Attribution remains visible. Direction links remain usable if map tiles fail.

The clinic marker is an approximate CBD area marker, not a verified street-level pin. Pretoria Station is a travel landmark, not a second clinic branch. This provides two locations without inventing another branch. Verify the clinic’s exact coordinates before presenting the map as a precise clinic location. The original address, 125 Pretorius Street, is kept for directions.

### Appointment enquiry

HTML constraints and JavaScript validate the name, telephone, email, treatment, dentist, date, time, new-patient choice, consent and optional information [7]. Each field has a label and an associated error message. Date checks use South African time. Sunday and past dates are rejected; past times and Saturday afternoon options are unavailable. The server repeats important validation, rejects oversized/invalid requests and checks allowed values.

Direct HTML files use the shared browser checks. HTTP previews fall back to those checks if the endpoint is unavailable. On a server, `fetch()` sends JSON with POST to `/.netlify/functions/enquiry` without reloading the page. A relevant response gives the treatment duration and explains opening hours. Loading, success, invalid-input, timeout and unavailable-service states are handled. The response does not claim a real slot is available. The user can prepare an email request afterwards.

The server does not keep the submitted personal details, notify staff or reserve a booking. Dentist availability and public-holiday closures require receptionist confirmation. No prices are displayed, in line with the existing project.

### Contact email

The contact form collects a name, email address, message type, message and consent. JavaScript validates it and shows a preview. The email link encodes the subject/body for `info@kulanisdentistry.co.za`. The user reviews and sends it using their email app. A copy button supports webmail. The site does not claim that the message was sent automatically. The recipient address comes from the supplied project and mailbox delivery has not been verified. No test emails have been sent.

### Staff pages

The original staff login submitted a password using GET, which would put it in the URL. The unsafe form is removed. Staff sign-in requires a real authentication service. The original admin layout remains as a clearly labelled preview with disabled sample actions. Client-side code and robots.txt are not access controls.

## Search engine optimisation

The implementation follows relevant guidance in Google’s SEO Starter Guide [10].

| Page | Target phrases |
| --- | --- |
| Home | dentist Pretoria CBD; dental care Pretoria |
| About | Pretoria dental practice; family dental care |
| Services | dental services Pretoria; teeth cleaning Pretoria CBD |
| Enquiry | dental appointment Pretoria CBD |
| FAQ | dental appointment questions; dentist opening hours |
| Contact | dentist Pretorius Street; contact dentist Pretoria CBD |

These are chosen from the practice’s services and location. No search-volume study or ranking result is claimed. Each page has a unique title, description and relevant keywords meta tag. The keywords tag is included because it appears in the marking rubric; Google does not use that tag for ranking [10]. Content uses the phrases naturally, rather than repeating keywords excessively.

There is one H1 per page, descriptive image filenames and alt text, internal links and readable page filenames. Image dimensions and lazy loading reduce layout movement and unnecessary downloads. The original photographs are retained, with 300px and 600px variants provided through `srcset` and `sizes`. Static photos and dynamically generated service cards use these alternatives; the gallery lightbox uses the original 900px photographs. Local scripts are deferred. CSS supports desktop, tablet and mobile widths.

The source sitemap uses `example.invalid` as an explicit placeholder. `build.cjs` creates the live sitemap, robots.txt and canonical links from the deployment URL. Staff pages use `noindex, nofollow` and are omitted from the sitemap. They are not blocked in robots.txt, so a crawler can read the noindex instruction.

## Security and privacy

The local server only serves public files. The Netlify build publishes `dist` and deploys the function separately. It does not publish the source notes or server code as downloadable website pages. The enquiry endpoint restricts methods, checks input sizes and types, validates dates and choices, and uses a no-store response. Personal details are not written to browser storage or server files. No credentials, mail tokens or API keys are in the project.

The hosting header file sets a content security policy, clickjacking protection, content-type protection and limited browser permissions. HTTPS must be checked after deployment. Links opening a new tab include `noopener noreferrer`. Map tile requests go to OpenStreetMap and email is sent through the user’s own mail app. The consent boxes are project features, not a claim of a complete legal compliance review.

## Deployment and submission

This project is prepared for a Git-connected Netlify deployment [11]. Ordinary static hosting alone will not execute the enquiry POST endpoint.

1. Continue using https://github.com/thikho100/WEDE5020-Formative-2-Part-2 for Part 3, as confirmed by the lecturer. Preserve its history.
2. Commit the real changes with descriptive messages. Do not fabricate past commits or dates.
3. Import that repository into Netlify. The included `netlify.toml` specifies the build command, `dist` publish folder and functions directory.
4. Deploy, then confirm that all pages, map tiles and the AJAX POST work on the live HTTPS address.
5. Check the published `sitemap.xml`, `robots.txt` and canonical URLs. If the site name changes, deploy again so the build regenerates them.
6. Add the actual repository and live URL at the top of this README. Capture live evidence and submit the required links.

Netlify supplies `URL` during a normal build. For a manual build, run `node build.cjs https://your-actual-site-address`. Do not deploy a test build containing `example.invalid`. Drag-and-dropping only the static files will not deploy the serverless function.

Published on Netlify on 26 October 2026 from GitHub commit `999fd79`. All six public pages, script.js, robots.txt and sitemap.xml returned HTTP 200 without authentication. A direct HTTP POST to the deployed enquiry endpoint returned HTTP 200 with a treatment response. The student confirmed the live search/filter/sort/reset, gallery, FAQ, map, contact email preparation and enquiry response worked in their browser. Email delivery and a separate live mobile test are not claimed.

## AI assistance disclosure

OpenAI ChatGPT/Codex assisted with JavaScript implementation, validation, map fallbacks, deployment configuration, documentation and code review during this project [13].

## Changelog

### 26 October 2026 – Publishing and live checks

- Published https://kulanis-dentistry-thikho.netlify.app/ from the existing GitHub repository.
- Verified public page access, generated SEO files and a successful POST to the enquiry endpoint.
- Student confirmed the live browser features worked.
- Added the live link for the lecturer.

### 23 October 2026 – Responsive images and references

- Added 300px/600px photo variants with srcset and sizes in HTML and dynamic service cards.
- Retained original photos for the lightbox and preserved CSS layout rules.
- Formatted CSS and image references as numbered online sources. Original access dates are retained where recorded; none were invented for older source credits.

### 23 October 2026 – Assignment review

- Confirmed the existing repository is used for Part 3.
- Removed current opening instructions for absent launcher files.
- Added an explicit submission checklist and AI assistance disclosure.
- Rechecked source links, metadata, enquiry validation, endpoint responses and deployment build. Live browser and deployment checks remain outstanding.

### 7 October 2026 – Open without installation

- Added shared browser/server enquiry checks and a visible email preview.
- Direct files and static previews work without Node.js; hosted AJAX is retained.
- The launcher now opens index.html directly.
- Kept the existing design and map controls; live map tiles still need internet.


### 17 September 2026 – Part 2 (retained history)

- Added external CSS linked to all eight HTML pages.
- Added responsive layouts, animation, hover/focus effects, transforms and image backgrounds.
- Added the README and desktop/tablet/mobile evidence.

### 5 October 2026 – Part 3

- Added `script.js` and deferred script links to the pages.
- Converted FAQ content to keyboard-operable accordion panels.
- Added the About page gallery and native dialog lightbox.
- Added a JSON service catalogue, live search, category filter, sorting and empty-state handling.
- Added Leaflet, two map locations, marker popups and direction links.
- Added labelled form controls, message type, consent and accessible validation errors.
- Added an asynchronous enquiry endpoint with matching local and Netlify processing.
- Added the treatment-duration response and email request link, without claiming a confirmed booking.
- Added contact email preview, encoded mail link and copy option.
- Renamed image files and updated HTML, CSS and source credits.
- Added page-specific SEO metadata, corrected heading hierarchy and added deployment-generated sitemap/canonical files.
- Restricted the old decorative FAQ plus signs and added responsive styles for new controls.
- Removed the unsafe GET password form and marked the retained staff appointment page as a preview.
- Added deployment configuration, response headers, opening instructions and test evidence.
- Preserved the original README as `PART2-README.md`.

### 5 October 2026 – Code simplification

- Replaced compact arrow functions with ordinary functions in the project JavaScript.
- Wrote out conditional branches and loop bodies on separate lines.
- Replaced chained service filtering and fallback conversion with clear loops.
- Added category and duration data to the existing service cards for the fallback search.
- Replaced automatic form-data conversion with explicitly named fields.
- Wrote out gallery wraparound and appointment-time checks using if statements.
- Kept the existing appearance, feature controls, server checks and publishing setup.
- Added CODE-GUIDE.md to explain the code.
- Removed the pending lecturer-feedback section because no feedback was provided.

### 15 October 2026 – Part 2 feedback updates

- Added one shared, wrapping navigation style across the home page and inner pages.
- Improved the CSS base reset and small-screen text wrapping.
- Added tablet and phone rules so content images stay within their cells and keep their proportions; service and gallery images use consistent crops.
- Improved visible focus and current-page styling for navigation links.

## Testing

See `TEST-RESULTS.md` for the checks actually performed and any limits. Deployment and the student browser checks are recorded above. Mailbox delivery has not been verified.

## Image source credits


| Website file | Source |
| --- | --- |
| `images/dental-check-up.jpg` | [14] |
| `images/teeth-cleaning.jpg` | [15] |
| `images/dental-treatment-room.jpg` | [16] |
| `images/dental-patient-chair.jpg` | [17] |
| `images/dentist-at-work.jpg` | [18] |
| `images/dental-filling-treatment.jpg` | [19] |
| `images/tooth-brushing-advice.jpg` | [20] |
| `images/tooth-logo.png` | [21] |

## References

The CSS layout uses media queries [1], interaction states [2], transforms [3] and animations [4]. The retained Part 2 design reference is the Orlando Pirates website [5].

[1] MDN Web Docs, "Using media queries." [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using.

[2] MDN Web Docs, "Pseudo-classes." [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-classes.

[3] MDN Web Docs, "transform." [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform.

[4] MDN Web Docs, "Using CSS animations." [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations/Using.

[5] Orlando Pirates Football Club, official website. [Online]. Available: https://www.orlandopiratesfc.com/.

[6] MDN Web Docs, “Using the Fetch API.” [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch. [Accessed: 5 Oct. 2026].

[7] MDN Web Docs, “Client-side form validation.” [Online]. Available: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation. [Accessed: 5 Oct. 2026].

[8] MDN Web Docs, “<dialog>: The Dialog element.” [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog. [Accessed: 5 Oct. 2026].

[9] Leaflet, “Quick Start Guide.” [Online]. Available: https://leafletjs.com/examples/quick-start/. [Accessed: 5 Oct. 2026].

[10] Google Search Central, “Search Engine Optimization (SEO) Starter Guide.” [Online]. Available: https://developers.google.com/search/docs/fundamentals/seo-starter-guide. [Accessed: 5 Oct. 2026].

[11] Netlify, “Get started with functions.” [Online]. Available: https://docs.netlify.com/build/functions/get-started/. [Accessed: 5 Oct. 2026].

[12] OpenStreetMap Foundation, “Tile Usage Policy.” [Online]. Available: https://operations.osmfoundation.org/policies/tiles/. [Accessed: 5 Oct. 2026].

Direct HTML viewing uses an OpenStreetMap embedded map with zoom/pan and the three location controls. The wider view covers both areas and has one selected-location pin. Hosted pages retain the two Leaflet markers and fall back to the embedded map if loading fails. Internet and permission to display embedded content are required.

[13] OpenAI, “ChatGPT,” AI assistance with website development and review, Oct. 2026. [Online]. Available: https://chatgpt.com/. [Accessed: 23 Oct. 2026].

[14] Nadezhda Moryak / Pexels - *Dentist Showing a Dental Tool to Patient*. [Online]. Available: https://www.pexels.com/photo/dentist-showing-a-dental-tool-to-patient-7800560.

[15] Nadezhda Moryak / Pexels - *A Woman in White Coat Wearing Blue Face Mask*. [Online]. Available: https://www.pexels.com/photo/a-woman-in-white-coat-wearing-blue-face-mask-7803054.

[16] Pavel Danilyuk / Pexels - *Screen and Dental Instruments in Doctors Office*. [Online]. Available: https://www.pexels.com/photo/screen-and-dental-instruments-in-doctors-office-6809639.

[17] Nadezhda Moryak / Pexels - *A Woman Sitting on a Dental Chair*. [Online]. Available: https://www.pexels.com/photo/a-woman-sitting-on-a-dental-chair-7803058.

[18] Arda Kaykısız / Pexels - *Redhead Dentist Working*. [Online]. Available: https://www.pexels.com/photo/redhead-dentist-working-19976581.

[19] Andrea Piacquadio / Pexels - *Dentist Working on Woman's Teeth*. [Online]. Available: https://www.pexels.com/photo/dentist-working-working-on-woman-s-teeth-3779713.

[20] Polina Zimmerman / Pexels - *Crop Female Dentist Showing Right Way of Teeth Cleaning*. [Online]. Available: https://www.pexels.com/photo/crop-female-dentist-showing-right-way-of-teeth-cleaning-3958092.

[21] Rawpixel - black tooth silhouette PNG. [Online]. Available: https://www.rawpixel.com/image/12832085/png-black-white-logo-silhouette-generated-image-rawpixel.
