const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Placeholder for testimonials data (in a real app, use a database)
let testimonials = [];

// Contact Form Endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`New Message from ${name} (${email}): ${message}`);

    // Simulate email sending or database save
    res.status(200).json({ success: true, message: 'Message received! We will get back to you soon.' });
});

// Testimonials Endpoint
app.post('/api/testimonials', (req, res) => {
    const { name, email, message } = req.body;
    const newTestimonial = { name, message, date: new Date() };
    testimonials.push(newTestimonial);

    console.log(`New Testimonial from ${name}: ${message}`);
    res.status(200).json({ success: true, message: 'Thank you for your feedback!' });
});

app.get('/api/testimonials', (req, res) => {
    res.status(200).json(testimonials);
});

// Fallback to index.html for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
