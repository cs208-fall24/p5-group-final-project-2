# Retrospective

- name: Pearl Bless Afegenui
- email: pendypearlbless@u.boisestate.edu

## Experience
- Working on this project was both tough and gratifying. Initially, setting up the server and ensuring that all components worked seamlessly was a huge challenge. Debugging pug files to ensure appropriate rendering taught me a lot about dynamic template management. Implementing the comment functionality also helped me grasp how data flows between the client and server, which strengthened my Express and Node.js skills.

- The experience allowed me to apply classroom principles to real-world situations, such as leveraging middleware, processing form submissions, and working with databases. Working on a cooperative project also taught me important skills in time management and communication.

## Known issues or Bugs

1. Comment Handling Edge Cases:
- Submitting an empty remark will still result in an item with blank text.
- Special characters in comments can create display issues.
2. Image Loading:
- On some systems, images may fail to load owing to improper file locations or permissions.
3. Form Validation:
- There is no client-side validation for inputs, which can result in server errors for improper data.
4. Performance:
- Due to inefficient rendering logic, the page may load slowly while displaying a big number of comments.

## Sources used
- Express.js Documentation
- Pug Template Engine
- MDN Web Docs on HTML Forms
- W3Schools CSS Guide
- Peer feedback and collaboration on debugging issues.
- Zy Books
