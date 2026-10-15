'use strict';

// Built-in treatment details also work when opening an HTML file directly.
const enquiryServices = [
    {
        "id": "check-up",
        "name": "Dental Check-ups",
        "description": "Examinations of the teeth and gums to identify problems early.",
        "duration": "30 minutes",
        "minutes": 30,
        "category": "Routine care",
        "image": "dental-check-up.jpg",
        "alt": "Dentist showing a dental tool to a patient"
    },
    {
        "id": "teeth-cleaning",
        "name": "Teeth Cleaning",
        "description": "Removal of plaque, tartar and surface stains from the teeth.",
        "duration": "30\u201345 minutes",
        "minutes": 45,
        "category": "Routine care",
        "image": "teeth-cleaning.jpg",
        "alt": "Dental professional wearing a face mask"
    },
    {
        "id": "preventive-care",
        "name": "Preventive Care",
        "description": "Oral hygiene advice and treatment that helps prevent tooth decay.",
        "duration": "30 minutes",
        "minutes": 30,
        "category": "Routine care",
        "image": "tooth-brushing-advice.jpg",
        "alt": "Dentist demonstrating how to brush teeth"
    },
    {
        "id": "dental-fillings",
        "name": "Dental Fillings",
        "description": "Treatment for cavities that restores damaged teeth.",
        "duration": "45\u201360 minutes",
        "minutes": 60,
        "category": "Treatment",
        "image": "dental-filling-treatment.jpg",
        "alt": "Dentist treating a patient\u2019s teeth"
    },
    {
        "id": "tooth-extractions",
        "name": "Tooth Extractions",
        "description": "Removal of teeth that cannot be repaired or are causing pain.",
        "duration": "45\u201360 minutes",
        "minutes": 60,
        "category": "Treatment",
        "image": "dentist-at-work.jpg",
        "alt": "Dentist working beside a treatment chair"
    },
    {
        "id": "emergency-care",
        "name": "Emergency Dental Care",
        "description": "Attention for toothache, broken teeth and dental injuries during opening hours.",
        "duration": "30\u201345 minutes",
        "minutes": 45,
        "category": "Urgent care",
        "image": "dental-patient-chair.jpg",
        "alt": "Patient sitting in a dental chair"
    }
];

// The endpoint returns service information. It does not store patient data or reserve appointments.
function processEnquiry(data, now = new Date()) {
    const fail = function (error) {
        return {
            status: 400,
            data: {
                error
            }
        };
    };
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return fail('Invalid form data.');
    }
    const limits = {
        'full-name': 80,
        telephone: 12,
        email: 120,
        information: 1000,
        date: 10,
        time: 5,
        service: 40,
        dentist: 20,
        'new-patient': 3,
        consent: 3
    };
    for (const [key, limit] of Object.entries(limits)) {
        if (typeof data[key] !== 'string' || data[key].length > limit) {
            return fail('Please check the form fields and their lengths.');
        }
    }
    if (data['full-name'].trim().length < 2) {
        return fail('Enter your full name.');
    }
    if (!/^(0\d{9}|\+27\d{9})$/.test(data.telephone)) {
        return fail('Enter a valid South African telephone number.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return fail('Enter a valid email address.');
    }
    if (data.consent !== 'yes') {
        return fail('Consent is required to process this enquiry.');
    }
    if (!['yes', 'no'].includes(data['new-patient'])) {
        return fail('Please indicate whether you are a new patient.');
    }
    if (!['dentist-1', 'dentist-2', 'dentist-3', 'any'].includes(data.dentist)) {
        return fail('Select a dentist.');
    }
    const service = enquiryServices.find(function (service) {
        return service.id === data.service;
    });
    if (!service) {
        return fail('Select a treatment.');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        return fail('Choose a valid date.');
    }
    const date = new Date(data.date + 'T12:00:00Z');
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== data.date) {
        return fail('Choose a valid date.');
    }
    const today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Africa/Johannesburg',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(now);
    if (data.date < today) {
        return fail('Choose today or a future date.');
    }
    if (date.getUTCDay() === 0) {
        return fail('We are closed on Sundays. Choose another day.');
    }
    if (
        !['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].includes(
            data.time
        )
    ) {
        return fail('Choose one of the listed times.');
    }
    if (date.getUTCDay() === 6 && data.time >= '13:00') {
        return fail('Saturday appointments must finish by 13:00.');
    }
    const currentTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Johannesburg',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).format(now);
    if (data.date === today && data.time <= currentTime) {
        return fail('That time has already passed. Choose a later time.');
    }
    const hours = date.getUTCDay() === 6 ? '08:00–13:00' : '08:00–17:00';
    return {
        status: 200,
        data: {
            message: `${service.name} usually takes ${service.duration}. Your requested time, ${data.time} on ${data.date}, is within our usual ${hours} opening hours. Dentist availability and public-holiday closures must be confirmed by the receptionist. Please email your request or call 081 86042 35.`,
            service: service.name,
            duration: service.duration
        }
    };
}
// Node uses the same checks as the browser.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { processEnquiry };
}
