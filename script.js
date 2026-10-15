/* Kulani's Dentistry – Part 3. See the numbered sources in README.md.
   [6] Fetch, [7] validation, [8] dialog and [9] Leaflet. */
'use strict';

// Return dates in South African time, including near midnight.
function clinicToday() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Africa/Johannesburg',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}
function textElement(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) {
        element.className = className;
    }
    return element;
}
function emailLink(subject, body) {
    const link = textElement('a', 'Open email app');
    link.href =
        'mailto:info@kulanisdentistry.co.za?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(body);
    link.className = 'action-link';
    return link;
}

// FAQ: buttons work with mouse, touch, Enter and Space.
document.querySelectorAll('.faq-toggle').forEach(function (button) {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', 'false');
    answer.hidden = true;
    button.querySelector('span').textContent = ' +';
    button.addEventListener('click', function () {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        if (expanded) {
            button.querySelector('span').textContent = ' +';
        } else {
            button.querySelector('span').textContent = ' −';
        }
        answer.hidden = expanded;
        if (!expanded && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
            answer.animate(
                [
                    {
                        opacity: 0
                    },
                    {
                        opacity: 1
                    }
                ],
                {
                    duration: 220
                }
            );
        }
    });
});

// Lightbox: native dialog traps focus; Escape and Close return focus to the trigger.
const lightbox = document.getElementById('lightbox');
if (lightbox) {
    const pictures = document.querySelectorAll('.gallery-open');
    let current = 0;
    function showPicture(index) {
        // Wrap around when moving past the first or last picture.
        current = index;
        if (current < 0) {
            current = pictures.length - 1;
        }
        if (current >= pictures.length) {
            current = 0;
        }
        const picture = pictures[current];
        const image = document.getElementById('lightbox-image');
        image.src = picture.dataset.image;
        image.alt = picture.dataset.caption;
        document.getElementById('lightbox-caption').textContent = picture.dataset.caption;
        document.getElementById('image-counter').textContent =
            `${current + 1} of ${pictures.length}`;
    }
    pictures.forEach(function (button, index) {
        return button.addEventListener('click', function () {
            showPicture(index);
            lightbox.showModal();
        });
    });
    document.getElementById('close-lightbox').addEventListener('click', function () {
        return lightbox.close();
    });
    document.getElementById('previous-image').addEventListener('click', function () {
        return showPicture(current - 1);
    });
    document.getElementById('next-image').addEventListener('click', function () {
        return showPicture(current + 1);
    });
    lightbox.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showPicture(current - 1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            showPicture(current + 1);
        }
    });
    lightbox.addEventListener('click', function (event) {
        const box = lightbox.getBoundingClientRect();
        if (
            event.target === lightbox &&
            (event.clientX < box.left ||
                event.clientX > box.right ||
                event.clientY < box.top ||
                event.clientY > box.bottom)
        ) {
            lightbox.close();
        }
    });
}

// Load a JSON catalogue, then filter and sort without reloading the page.
async function startServiceSearch() {
    const grid = document.getElementById('service-grid');
    if (!grid) {
        return;
    }
    const status = document.getElementById('search-status');
    const search = document.getElementById('service-search');
    const category = document.getElementById('service-category');
    const sort = document.getElementById('service-sort');
    // Keep usable HTML content if a local file or network blocks Fetch.
    let services = [];
    const cards = grid.querySelectorAll('[data-service]');
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const paragraphs = card.querySelectorAll('p');
        const picture = card.querySelector('img');
        const service = {
            id: card.dataset.service,
            name: card.querySelector('h2').textContent.trim(),
            description: paragraphs[0].textContent.trim(),
            duration: paragraphs[1].textContent.replace('Expected time:', '').trim(),
            minutes: Number(card.dataset.minutes),
            category: card.dataset.category,
            image: picture.getAttribute('src').replace('images/', ''),
            alt: picture.alt
        };
        services.push(service);
    }
    let localFallback = false;
    try {
        if (location.protocol === 'file:') {
            throw new Error('Use the built-in catalogue');
        }
        const response = await fetch('data/services.json', {
            signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) {
            throw new Error('Catalogue unavailable');
        }
        services = await response.json();
    } catch (error) {
        localFallback = true;
    }
    function render() {
        const query = search.value.trim().toLowerCase();
        const results = [];
        for (let i = 0; i < services.length; i++) {
            const service = services[i];
            const words = (service.name + ' ' + service.description).toLowerCase();
            const matchesSearch = words.includes(query);
            const matchesCategory =
                category.value === 'all' || category.value === service.category;
            if (matchesSearch && matchesCategory) {
                results.push(service);
            }
        }
        if (sort.value === 'az') {
            results.sort(function (first, second) {
                return first.name.localeCompare(second.name);
            });
        }
        if (sort.value === 'time') {
            results.sort(function (first, second) {
                if (first.minutes === second.minutes) {
                    return first.name.localeCompare(second.name);
                }
                return first.minutes - second.minutes;
            });
        }
        const body = document.createElement('tbody');
        results.forEach(function (service, index) {
            if (index % 3 === 0) {
                body.append(document.createElement('tr'));
            }
            const card = document.createElement('td');
            card.dataset.service = service.id;
            const image = document.createElement('img');
            image.src = 'images/' + service.image;
            image.alt = service.alt;
            image.width = 250;
            image.height = 180;
            image.loading = 'lazy';
            card.append(
                image,
                textElement('h2', service.name),
                textElement('p', service.description),
                textElement('p', 'Expected time: ' + service.duration)
            );
            const link = textElement('a', 'Enquire about this service');
            link.href = 'enquiry.html?service=' + encodeURIComponent(service.id);
            card.append(link);
            body.lastElementChild.append(card);
        });
        grid.replaceChildren(body);
        if (results.length === 0) {
            status.textContent =
                'No services found. Try a different search or reset the filters.';
        } else if (results.length === 1) {
            status.textContent = '1 service found.';
        } else {
            status.textContent = results.length + ' services found.';
        }
        if (localFallback) {
            status.textContent += ' Showing the built-in catalogue.';
        }
    }
    search.addEventListener('input', render);
    category.addEventListener('change', render);
    sort.addEventListener('change', render);
    document.getElementById('reset-services').addEventListener('click', function () {
        search.value = '';
        category.value = 'all';
        sort.value = 'default';
        render();
        search.focus();
    });
    render();
}
startServiceSearch();

// Direct files use an embedded map. Hosted pages can also use local Leaflet.
const mapContainer = document.getElementById('clinic-map');
if (mapContainer) {
    const embeddedMap = document.getElementById('map-fallback');
    const status = document.getElementById('map-status');
    const clinic = [-25.7464, 28.1878];
    const station = [-25.7576, 28.1897];
    let map = null;
    let clinicMarker;
    let stationMarker;
    let useEmbeddedMap = true;
    function showEmbeddedMap(place) {
        let box = '28.175,-25.764,28.202,-25.739';
        let marker = '-25.7464,28.1878';
        if (place === 'clinic') {
            box = '28.181,-25.751,28.195,-25.742';
        }
        if (place === 'station') {
            box = '28.183,-25.762,28.197,-25.753';
            marker = '-25.7576,28.1897';
        }
        embeddedMap.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' +
            encodeURIComponent(box) + '&layer=mapnik&marker=' + encodeURIComponent(marker);
        embeddedMap.hidden = false;
        mapContainer.hidden = true;
        useEmbeddedMap = true;
        status.textContent = 'Use + and − on the map to zoom. The pin marks the selected place; the wider view includes both areas. Internet is required.';
    }
    if (location.protocol !== 'file:' && typeof L !== 'undefined') {
        try {
            mapContainer.hidden = false;
            embeddedMap.hidden = true;
            map = L.map('clinic-map', { scrollWheelZoom: false }).setView(clinic, 14);
            useEmbeddedMap = false;
            const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            tiles.on('tileerror', function () {
                if (!useEmbeddedMap) {
                    showEmbeddedMap('all');
                }
            });
            clinicMarker = L.marker(clinic).addTo(map).bindPopup('Pretoria CBD – approximate clinic area.');
            stationMarker = L.marker(station).addTo(map).bindPopup('Pretoria Station – travel landmark, not a clinic branch.');
            map.fitBounds([clinic, station], { padding: [35, 35] });
        } catch (error) {
            showEmbeddedMap('all');
        }
    } else {
        showEmbeddedMap('all');
    }
    document.getElementById('show-clinic').addEventListener('click', function () {
        if (useEmbeddedMap) {
            showEmbeddedMap('clinic');
        } else {
            map.setView(clinic, 16);
            clinicMarker.openPopup();
        }
    });
    document.getElementById('show-station').addEventListener('click', function () {
        if (useEmbeddedMap) {
            showEmbeddedMap('station');
        } else {
            map.setView(station, 16);
            stationMarker.openPopup();
        }
    });
    document.getElementById('show-all').addEventListener('click', function () {
        if (useEmbeddedMap) {
            showEmbeddedMap('all');
        } else {
            map.fitBounds([clinic, station], { padding: [35, 35] });
        }
    });
}

// Accessible validation messages appear next to each field.
function prepareValidation(form) {
    form.noValidate = true;
    const fields = form.querySelectorAll('input:not([type="submit"]), select, textarea');
    fields.forEach(function (field) {
        const error = textElement('span', '', 'field-error');
        error.id = field.id + '-error';
        error.setAttribute('aria-live', 'polite');
        field.setAttribute('aria-describedby', error.id);
        field.insertAdjacentElement('afterend', error);
        field.addEventListener('blur', function () {
            return check(field);
        });
        field.addEventListener('input', function () {
            if (field.getAttribute('aria-invalid') === 'true') {
                check(field);
            }
        });
        field.addEventListener('change', function () {
            return check(field);
        });
    });
    function check(field) {
        field.setCustomValidity('');
        if (field.required && field.type !== 'checkbox' && !field.value.trim()) {
            field.setCustomValidity('Please complete this field.');
        }
        if (field.type === 'text' && field.required && field.value.trim().length < 2) {
            field.setCustomValidity('Please enter at least 2 characters.');
        }
        if (field.id === 'message' && field.value.trim().length < 10) {
            field.setCustomValidity('Please enter a message of at least 10 characters.');
        }
        if (field.id === 'date' && field.value) {
            const date = new Date(field.value + 'T12:00:00+02:00');
            if (field.value < clinicToday()) {
                field.setCustomValidity('Choose today or a future date.');
            } else if (date.getUTCDay() === 0) {
                field.setCustomValidity('We are closed on Sundays. Choose another day.');
            }
        }
        let message = '';
        if (!field.validity.valid) {
            if (field.validity.customError) {
                message = field.validationMessage;
            } else if (field.validity.valueMissing) {
                if (field.type === 'checkbox') {
                    message = 'Please tick the consent box.';
                } else {
                    message = 'Please complete this field.';
                }
            } else if (field.validity.typeMismatch) {
                message = 'Enter a valid email address, for example name@example.com.';
            } else if (field.validity.patternMismatch) {
                message = 'Use 10 digits starting with 0, or +27 followed by 9 digits.';
            } else if (field.validity.tooShort) {
                message = `Enter at least ${field.minLength} characters.`;
            } else {
                message = 'Please check this value.';
            }
        }
        document.getElementById(field.id + '-error').textContent = message;
        field.setAttribute('aria-invalid', String(Boolean(message)));
        return !message;
    }
    return function () {
        let firstInvalidField = null;
        for (let i = 0; i < fields.length; i++) {
            const valid = check(fields[i]);
            if (!valid && firstInvalidField === null) {
                firstInvalidField = fields[i];
            }
        }
        if (firstInvalidField !== null) {
            firstInvalidField.focus();
            return false;
        }
        return true;
    };
}
const enquiry = document.getElementById('enquiry-form');
if (enquiry) {
    const validate = prepareValidation(enquiry);
    const date = document.getElementById('date');
    const time = document.getElementById('time');
    const service = document.getElementById('service');
    const result = document.getElementById('enquiry-result');
    date.min = clinicToday();
    const chosen = new URLSearchParams(location.search).get('service');
    for (let i = 0; i < service.options.length; i++) {
        if (service.options[i].value === chosen) {
            service.value = chosen;
            break;
        }
    }
    function updateTimes() {
        const saturday =
            date.value && new Date(date.value + 'T12:00:00+02:00').getUTCDay() === 6;
        const sunday =
            date.value && new Date(date.value + 'T12:00:00+02:00').getUTCDay() === 0;
        const now = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Johannesburg',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
        }).format(new Date());
        for (let i = 0; i < time.options.length; i++) {
            const option = time.options[i];
            option.disabled = false;
            if (option.value === '' || sunday) {
                option.disabled = true;
            }
            if (saturday && option.value >= '13:00') {
                option.disabled = true;
            }
            if (date.value === clinicToday() && option.value <= now) {
                option.disabled = true;
            }
        }
        if (time.selectedIndex >= 0 && time.options[time.selectedIndex].disabled) {
            time.value = '';
        }
    }
    date.addEventListener('change', updateTimes);
    updateTimes();
    enquiry.addEventListener('input', function () {
        return result.replaceChildren();
    });
    enquiry.addEventListener('submit', async function (event) {
        event.preventDefault();
        result.replaceChildren();
        if (!validate()) {
            result.textContent = 'Please correct the highlighted fields.';
            return;
        }
        updateTimes();
        if (!time.value) {
            result.textContent =
                'Choose a time within opening hours that has not already passed.';
            time.focus();
            return;
        }
        const button = enquiry.querySelector('[type="submit"]');
        button.disabled = true;
        result.textContent = 'Checking your enquiry…';
        try {
            // Read each field by its name so the submitted data is easy to follow.
            const data = {
                'full-name': enquiry.elements['full-name'].value,
                telephone: enquiry.elements.telephone.value,
                email: enquiry.elements.email.value,
                service: enquiry.elements.service.value,
                dentist: enquiry.elements.dentist.value,
                date: enquiry.elements.date.value,
                time: enquiry.elements.time.value,
                'new-patient': enquiry.elements['new-patient'].value,
                information: enquiry.elements.information.value,
                consent: enquiry.elements.consent.value
            };
            // Check in the browser first, with the same rules used by the server.
            let checked = processEnquiry(data);
            if (checked.status !== 200) {
                throw new Error(checked.data.error);
            }
            // Direct files need no server. On a hosted page, also try AJAX.
            // A preview server may serve pages without supporting this endpoint.
            if (location.protocol === 'http:' || location.protocol === 'https:') {
                try {
                    const response = await fetch(enquiry.action, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                        signal: AbortSignal.timeout(2500)
                    });
                    const serverOutput = await response.json();
                    if (response.ok && typeof serverOutput.message === 'string') {
                        checked = { status: 200, data: serverOutput };
                    } else if (response.status === 400 && serverOutput.error) {
                        checked = { status: 400, data: serverOutput };
                    }
                } catch (error) {
                    // Keep the browser check if no enquiry server is available.
                }
            }
            if (checked.status !== 200) {
                throw new Error(checked.data.error);
            }
            const output = checked.data;
            result.replaceChildren(
                textElement('h3', 'Your enquiry details'),
                textElement('p', output.message)
            );
            const body = `Name: ${data['full-name']}\nTelephone: ${data.telephone}\nEmail: ${data.email}\nTreatment: ${service.selectedOptions[0].textContent.trim()}\nDentist: ${document.getElementById('dentist').selectedOptions[0].textContent.trim()}\nPreferred date: ${data.date}\nPreferred time: ${data.time}\nNew patient: ${data['new-patient']}\nAdditional information: ${data.information}\nConsent to reply: Yes`;
            result.append(textElement('pre', body, 'email-preview'));
            result.append(emailLink('Appointment enquiry', body));
            result.append(
                textElement(
                    'p',
                    'Review and send the email in your email app. This check does not send a booking or reserve a time.'
                )
            );
        } catch (error) {
            if (
                error instanceof TypeError ||
                error instanceof SyntaxError ||
                error.name === 'TimeoutError'
            ) {
                result.textContent =
                    'The enquiry service is unavailable. Please call 081 86042 35 or try again later.';
            } else {
                result.textContent = error.message;
            }
        } finally {
            button.disabled = false;
            result.scrollIntoView({ block: 'nearest' });
        }
    });
}
const contact = document.getElementById('contact-form');
if (contact) {
    const validate = prepareValidation(contact);
    const result = document.getElementById('contact-result');
    contact.addEventListener('input', function () {
        return result.replaceChildren();
    });
    contact.addEventListener('submit', function (event) {
        event.preventDefault();
        result.replaceChildren();
        if (!validate()) {
            result.textContent = 'Please correct the highlighted fields.';
            return;
        }
        const data = {
            'full-name': contact.elements['full-name'].value,
            email: contact.elements.email.value,
            'message-type': contact.elements['message-type'].value,
            message: contact.elements.message.value
        };
        const body = `Name: ${data['full-name'].trim()}\nEmail: ${data.email.trim()}\nMessage type: ${data['message-type']}\n\n${data.message.trim()}\n\nConsent to reply: Yes`;
        result.append(textElement('h3', 'Your email is ready to review'));
        result.append(textElement('p', 'To: info@kulanisdentistry.co.za'));
        result.append(textElement('pre', body, 'email-preview'));
        result.append(emailLink(data['message-type'] + ' – website message', body));
        const copy = textElement('button', 'Copy email text');
        copy.type = 'button';
        copy.addEventListener('click', async function () {
            try {
                await navigator.clipboard.writeText(body);
                copy.textContent = 'Copied';
            } catch (error) {
                copy.textContent = 'Select and copy the preview above';
            }
        });
        result.append(
            copy,
            textElement(
                'p',
                'Nothing has been sent yet. Open your email app to send it, or copy the text into your webmail.'
            )
        );
    });
}

// Show a scroll control only once it is useful.
const topButton = document.getElementById('back-to-top');
if (topButton) {
    window.addEventListener(
        'scroll',
        function () {
            topButton.hidden = window.scrollY < 400;
        },
        {
            passive: true
        }
    );
    topButton.addEventListener('click', function () {
        let movement = 'smooth';
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            movement = 'instant';
        }
        window.scrollTo({
            top: 0,
            behavior: movement
        });
    });
}
