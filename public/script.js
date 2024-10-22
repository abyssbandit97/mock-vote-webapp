const stripe = Stripe('pk_live_51Q6hJXG2eqLRIwrWkYIZoLCjPtvCj18c0Vsd3yDc712AWa06lJuRGWgzONSxz9NxgA0vxS2ieP5KiUTouoz7jyMt00vKrU7vUX');
let card;

document.addEventListener('DOMContentLoaded', () => {
    // var stripe = Stripe('pk_live_51Q6hJXG2eqLRIwrWkYIZoLCjPtvCj18c0Vsd3yDc712AWa06lJuRGWgzONSxz9NxgA0vxS2ieP5KiUTouoz7jyMt00vKrU7vUX');
    
    const freeVoteButtons = document.querySelectorAll('.free-vote');
    const paidVoteButtons = document.querySelectorAll('.paid-vote');

    freeVoteButtons.forEach (button => {
        button.addEventListener('click', () => handleVote(button.dataset.candidate, false));
    });

    // Set up Stripe Elements
    const elements = stripe.elements();
    card = elements.create('card');
    card.mount('#card-element');
    paidVoteButtons.forEach(button => {
        button.addEventListener('click', () => handlePaidVote(button.dataset.candidate));
    });


    fetchResults();
});

async function handleVote(candidate, paid = false) {
    try {
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ candidate, paid })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, 'success');
            fetchResults();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function handlePaidVote(candidate) {
    
    console.log('Handling paid vote for', candidate);
  try {
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
    });

        if (error) {
            throw new Error(error.message);
        }

        const response = await fetch('/api/paid-vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                candidate, 
                paymentMethodId: paymentMethod.id, 
                amount: 1 // $1 per vote
            })
        });

        const result = await response.json();

    if (result.requiresAction) {
      // Use stripe.js to handle the action
      const { error, paymentIntent } = await stripe.handleCardAction(result.clientSecret);
      if (error) {
        throw new Error(error.message);
      } else if (paymentIntent.status === 'requires_confirmation') {
        // Send the payment_intent_id back to your server for confirmation
        const confirmResponse = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_intent_id: paymentIntent.id })
        });
        const confirmResult = await confirmResponse.json();
        if (confirmResult.error) {
          throw new Error(confirmResult.error);
        }
      }
    }

    // Payment successful
    showMessage('Payment successful', 'success');
    fetchResults();
  } catch (error) {
    console.error('Error in handlePaidVote:', error);
    showMessage(error.message, 'error');
  }
}

async function fetchResults() {
    try {
        const response = await fetch('/api/results');
        if (!response.ok) {
            throw new Error('Failed to fetch results');
        }
        const data = await response.json();

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '<h3>Current Results:</h3>';
        data.forEach(result => {
            resultsDiv.innerHTML += `<p>${result._id}: ${result.count} votes</p>`;
        });
    } catch (error) {
        console.error('Error fetching results:', error);
        showMessage('Failed to fetch results. Please try again later.', 'error');
    }
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}


// document.addEventListener('DOMContentLoaded', () => {
//     const voteButtons = document.querySelectorAll('.free-vote');

//     voteButtons.forEach(button => {
//         button.addEventListener('click', () => handleVote(button.dataset.candidate));
//     });

//     fetchResults();
// });

// async function handleVote(candidate) {
//     try {
//         const response = await fetch('/api/vote', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ candidate })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             showMessage(data.message, 'success');
//             fetchResults();
//         } else {
//             throw new Error(data.message);
//         }
//     } catch (error) {
//         showMessage(error.message, 'error');
//     }
// }

// async function fetchResults() {
//     try {
//         const response = await fetch('/api/results');
//         if (!response.ok) {
//             throw new Error('Failed to fetch results');
//         }
//         const data = await response.json();

//         const resultsDiv = document.getElementById('results');
//         resultsDiv.innerHTML = '<h3>Current Results:</h3>';
//         data.forEach(result => {
//             resultsDiv.innerHTML += `<p>${result._id}: ${result.count} votes</p>`;
//         });
//     } catch (error) {
//         console.error('Error fetching results:', error);
//         showMessage('Failed to fetch results. Please try again later.', 'error');
//     }
// }

// function showMessage(message, type) {
//     const messageDiv = document.createElement('div');
//     messageDiv.textContent = message;
//     messageDiv.className = `message ${type}`;
//     document.body.appendChild(messageDiv);

//     setTimeout(() => {
//         messageDiv.remove();
//     }, 5000);
// }