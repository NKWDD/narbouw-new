(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Show loading message
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      // Submit the form to Formspree
      fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json' // Ensure Formspree returns JSON
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json(); // Parse JSON response
          } else {
            throw new Error('Form submission failed. Please try again.');
          }
        })
        .then(data => {
          // Hide loading message
          thisForm.querySelector('.loading').classList.remove('d-block');

          if (data.ok || data.success) {
            // Show success message
            thisForm.querySelector('.sent-message').classList.add('d-block');
            thisForm.reset(); // Reset the form
          } else {
            // Show error message
            throw new Error(data.error || 'Form submission failed.');
          }
        })
        .catch((error) => {
          // Display error message
          displayError(thisForm, error);
        });
    });
  });

  function displayError(thisForm, error) {
    // Hide loading message
    thisForm.querySelector('.loading').classList.remove('d-block');

    // Show error message
    thisForm.querySelector('.error-message').innerHTML = error.message || error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }
})();