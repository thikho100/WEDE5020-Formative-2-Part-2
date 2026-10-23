# Understanding the Part 3 code

Start with `script.js`. Its sections follow the features on the website. The JavaScript is written out with ordinary functions, loops and `if` statements. More lines do not necessarily mean more complicated code: each step is now visible.

## Basic ideas used

- A variable stores a value. `const` is used when the variable is not reassigned; `let` is used when it changes.
- A function groups steps that do a job.
- `getElementById` finds one HTML element using its ID.
- `querySelectorAll` finds a group of elements, such as all gallery buttons.
- `addEventListener` tells the page what to do when someone clicks, types or submits a form.
- A `for` loop repeats steps for each item.
- An `if` statement chooses what to do when a condition is true.
- An object groups related values, such as a service name and duration.
- `textContent` adds plain text to an element. It does not treat a typed message as HTML code.

## The features in script.js

### Date and email helpers

`clinicToday()` gets the date in South African time. This matters because a visitor's computer may be in another time zone.

`textElement()` creates an HTML element and puts text inside it. Several features use it, so the same steps do not have to be repeated everywhere.

`emailLink()` creates an email link. `encodeURIComponent()` makes spaces and special characters safe to put in the link.

### FAQ

The code finds each question button and its matching answer. Clicking the button changes whether the answer is hidden. It also updates the plus/minus sign and the information used by screen readers.

### Gallery

`current` stores the picture number. `showPicture()` changes the large image, caption and counter. The `if` statements handle moving past the first or last picture. The browser's `dialog` element handles the popup and Escape key.

### Services

`startServiceSearch()` loads the service list from `data/services.json`. `fetch()` requests that file. `await` waits for the reply without freezing the page, and `try/catch` handles a failed request.

The `render()` function uses a loop to check every service against the search words and care type. Matching services are added to a results array. The sort function compares the names or durations. Another loop creates the visible cards.

The HTML cards also contain fallback information, so search can still work if loading the JSON file fails.

### Map

Leaflet is an existing mapping library. The code creates a map, adds map tiles and places two markers. The buttons move the map to the clinic area, the station or both locations.

Files in `vendor/leaflet` belong to Leaflet. They are not handwritten project code, and their licence and credit must stay. You do not need to rewrite the library to use it.

### Form checks

`prepareValidation()` adds error messages to the fields. The same function is used for both forms. Its `check()` function checks one field. The returned function checks every field and focuses the first error.

The enquiry section reads the fields one by one into an object. It sends that object to the server using `fetch()` and POST. The server checks it and returns a service response. The page shows the result without refreshing.

The contact section reads its fields and creates an email preview and email link. Preparing the email does not send it. The user sends it in their email app.

### Back to top

A scroll event checks how far down the page the visitor has moved. The button appears after 400 pixels. Clicking it scrolls to the top.

## The other files

- `style.css`: controls appearance. It has not been changed in this simplification.
- `data/services.json`: stores the six services and their details.
- `lib/enquiry.cjs`: checks the submitted enquiry on the server and returns the treatment duration. Server checks are needed because browser checks can be bypassed.
- `server.cjs`: serves the website on your laptop and passes enquiry requests to the handler. It keeps private source files out of the public pages.
- `netlify/functions/enquiry.js`: receives the enquiry on the published website and calls the same checking function.
- `build.cjs`: prepares the published files and adds the actual website address to the sitemap and page links.
- `netlify.toml`: tells the hosting service where the website and function files are.
- `_headers`: contains browser security settings for the published website.

The server and publishing files need some Node.js features. They are separate from the main page interactions. The map, asynchronous requests and form validation are kept because they support the assignment requirements; simplifying them must not remove their behaviour.

## Check your understanding

Before submitting, practise explaining:

1. What happens after someone types into the service search?
2. How does the gallery move from the last picture back to the first?
3. What makes a form field invalid, and where is its error shown?
4. How does the enquiry work directly, and when does it also use the server?
5. Which code runs in the visitor's browser and which code runs on the server?

Use the references in README.md when learning the browser features and map library.

## Opening without Node.js

Open index.html directly. enquiry-check.js holds the treatment details and validation rules. Both script.js and the optional server use these rules. With a direct file, the browser prepares the result itself. With HTTP hosting, it also tries AJAX and falls back to the browser result if the endpoint is unavailable. A result is an enquiry preview, not a sent message or confirmed booking. No launcher file is required.

Direct HTML viewing uses an OpenStreetMap embedded map with zoom/pan and the three location controls. The wider view covers both areas and has one selected-location pin. Hosted pages retain the two Leaflet markers and fall back to the embedded map if loading fails. Internet and permission to display embedded content are required.
