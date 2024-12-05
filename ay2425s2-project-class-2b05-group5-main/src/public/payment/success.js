document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const personId = urlParams.get('personId');


    // Display session ID on the page
    // document.getElementById('sessionId').textContent = sessionId;


    if (sessionId && personId) {
        // Call the backend to mark the cart as inactive
        fetch('/carts/makecartinactive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ personId: parseInt(personId, 10) }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Cart marked as inactive:', data);
            })
            .catch(err => {
                console.error('Error updating cart:', err);
            });
    } else {
        console.error('Missing session_id or personId in the URL.');
    }
});