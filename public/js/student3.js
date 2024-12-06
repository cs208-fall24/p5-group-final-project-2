document.addEventListener("DOMContentLoaded", function () {
    const editButtons = document.querySelectorAll('.edit-button');
    
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        const commentId = this.getAttribute('data-id');
        const form = document.querySelector(`form[data-id='${commentId}']`);
        const commentText = document.querySelector(`span.comment-text[data-id='${commentId}']`);
        
        // Toggle form visibility
        form.style.display = (form.style.display === 'none') ? 'block' : 'none';
        
        // Fill the textarea with the current comment
        if (form.style.display === 'block') {
          const textarea = form.querySelector('textarea[name="comment"]');
          textarea.value = commentText.innerText;
        }
      });
    });
  });
  

