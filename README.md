# mock-vote-webapp

A simple voting application that allows users to vote for candidates, with the option to vote once for free or multiple times via a paid vote using Stripe for payment processing.

## Features

- **Free Voting**: Each user can cast one free vote per IP address.
- **Paid Voting**: Users can vote multiple times by paying $1 per vote.
- **Real-time Results**: Displays the current voting results.
- **Stripe Integration**: Secure payment processing for paid votes.
- **User-friendly Interface**: Simple, clean design with easy navigation.

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MongoDB
- **Payment Processing**: Stripe
- **Environment Variables**: Dotenv

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/)
- [Stripe Account](https://stripe.com/)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/abyssbandit97/mock-vote-webapp.git
    cd mock-vote-webapp
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following:
    ```env
    STRIPE_SECRET=your_stripe_secret_key
    MONGODB_URI=your_mongodb_connection_string
    PORT=5500
    ```

4. **Run the application:**
    ```bash
    npm start
    ```

5. **Access the app:**
    Open your browser and go to `http://127.0.0.1:5500/`.

### Usage

1. **Voting:**
   - Each user can cast one free vote by clicking the "Free Vote" button for their preferred candidate.
   - Users can cast multiple votes by clicking the "Paid Vote ($1)" button and completing the payment process.

2. **Payment:**
   - The app integrates with Stripe for secure payments. Users will be prompted to enter their card details to pay for additional votes.

3. **View Results:**
   - Current vote counts for each candidate will be displayed on the main page.

## Folder Structure
├── public │ ├── images │ │ ├── plump.png │ │ └── parris.png │ ├── css │ │ └── styles.css │ └── js │ └── script.js ├── models │ └── Vote.js ├── routes │ └── voteRoute.js ├── .env ├── app.js ├── package.json └── README.md


## Configuration

### Setting Up Stripe

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/).
2. Obtain your **Publishable Key** and **Secret Key**.
3. Add your **Secret Key** to the `.env` file:
    ```env
    STRIPE_SECRET=your_stripe_secret_key
    ```

### Environment Variables

| Variable       | Description                                 |
|----------------|---------------------------------------------|
| `STRIPE_SECRET`| Your Stripe Secret Key for payment handling |
| `MONGODB_URI`  | Connection string for your MongoDB database |
| `PORT`         | Port on which the server will run           |

## Troubleshooting

- **Stripe Not Defined Error**: Ensure your `.env` file is properly set up and the `dotenv` package is correctly loaded at the top of your server file.
- **Payment Issues**: Make sure you're running over HTTPS for live environments, as Stripe requires secure connections for payments.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

Developed by [Your Name](https://github.com/yourusername)

## Acknowledgments

- [Stripe](https://stripe.com/) for easy and secure payment processing.
- [Express](https://expressjs.com/) for providing a minimalist web framework.
- [MongoDB](https://www.mongodb.com/) for reliable and scalable data storage.

