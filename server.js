import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to Generate Invoice
app.post('/api/invoice', async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error('API key is missing. Please check your .env file.');
            return res.status(500).send('API key is not configured.');
        }

        const { date, from, to, items, logo, due_date, tax, amount_paid, locale } = req.body;

        // Construct API URL with query parameters
        let apiUrl = `https://anyapi.io/api/v1/invoice/generate?apiKey=${apiKey}` +
            `&date=${encodeURIComponent(date)}` +
            `&from=${encodeURIComponent(from)}` +
            `&to=${encodeURIComponent(to)}` +
            `&logo=${encodeURIComponent(logo)}` +
            `&due_date=${encodeURIComponent(due_date)}` +
            `&tax=${encodeURIComponent(tax)}` +
            `&amount_paid=${encodeURIComponent(amount_paid)}` +
            `&locale=${encodeURIComponent(locale)}`;

        // Append items to API URL
        items.forEach((item, index) => {
            apiUrl += `&items[${index}][name]=${encodeURIComponent(item.name)}` +
                      `&items[${index}][unit_cost]=${encodeURIComponent(item.unit_cost)}` +
                      `&items[${index}][quantity]=${encodeURIComponent(item.quantity)}`;
        });

        // Fetch from external API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorDetails = await response.text();
            console.error(`API responded with status ${response.status}: ${errorDetails}`);
            return res.status(500).send(`API error: ${response.statusText}`);
        }

        const pdfBuffer = await response.buffer();
        if (!pdfBuffer || pdfBuffer.length === 0) {
            console.error('Received an empty response from the API.');
            return res.status(500).send('Failed to generate invoice. Empty response from the API.');
        }

        res.contentType('application/pdf').send(pdfBuffer);
    } catch (error) {
        console.error('An error occurred while generating the invoice:', error.message);
        res.status(500).send('Internal Server Error: Failed to generate invoice.');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
