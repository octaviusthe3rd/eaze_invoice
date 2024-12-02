# Eazy Invoice

Eazy Invoice is a web-based invoice generator that allows users to create, preview, and download invoices with ease. It offers a responsive and user-friendly interface for managing business invoices.

## Features

- **Real-time Invoice Generation**: Create professional invoices instantly
- **Dynamic Item Management**: Add multiple items with unit costs and quantities to the invoice
- **Tax Calculation**: Automatic tax calculation based on specified rate
- **Preview Functionality**: Preview invoice before generation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **PDF Download**: Generate and download invoices as PDF files
- **Customization Options**: Add company logo and customize invoice details

## Technologies

- HTML5
- CSS3
- JavaScript
- AnyAPI.io Invoice Generator API
- Node
- Express.js
- Docker

## Installation

1. Clone the repository:

git clone https://github.com/octaviusthe3rd/eaze_invoice.git

2. Navigate to the project directory:

cd eaze_invoice

3. Create an API Key [here](https://anyapi.io/app/pdf-invoice-generator-api)

4. Create an .env file and add your API key

nano .env

5. Build a Docker image

docker build -t eazy-invoice .

6. Run Docker container

docker run -p 3000:3000 --env-file .env -d eazy-invoice


7. Reverse Proxy Configuration using HAProxy

sudo apt-get update
sudo apt-get install haproxy

8. Configure /etc/haproxy/haproxy.cfg

frontend http-in
    bind *:80
    default_backend invoice-app

backend invoice-app
    server invoice-container localhost:3000


## Usage

1. Open the application locally at http://localhost:3000

2. Enter all required information for a successful generation

3. Click the generate button to create an invoice and download it as a pdf

4. Click preview button to preview the invoice with your entered data


## License

Eazy Invoice is licensed under the MIT License


## NOTE: 

## Deployment on a production server:
## 1. Create a non-sudo user.
## 2. Switch to the new user.
## 3. Proceed to [Installation](#installation)