/**
 * Post Sync - Updates post metadata from registry
 *
 * Finds elements with data-post-slug and updates their content
 * based on the POST_REGISTRY data.
 */

(function() {
  'use strict';

  // Exit if no registry available
  if (!window.POST_REGISTRY) {
    console.warn('POST_REGISTRY not found - metadata sync skipped');
    return;
  }

  // Find all post containers
  var containers = document.querySelectorAll('[data-post-slug]');

  containers.forEach(function(container) {
    var slug = container.getAttribute('data-post-slug');
    var post = window.POST_REGISTRY[slug];

    if (!post) {
      console.warn('No registry entry found for post:', slug);
      return;
    }

    // Update all fields within this container
    var fields = container.querySelectorAll('[data-post-field]');

    fields.forEach(function(field) {
      var fieldName = field.getAttribute('data-post-field');

      switch(fieldName) {
        case 'date':
          // Update both datetime attribute and text content
          if (field.tagName === 'TIME') {
            field.setAttribute('datetime', post.dateISO);
          }
          field.textContent = post.dateFormatted;
          break;

        case 'status':
          // Update pill class and text
          field.className = 'status-pill status-' + post.status;
          field.textContent = post.statusLabel;
          break;

        case 'readTime':
          // Auto-calculate from word count if on post page
          if (field.getAttribute('data-post-auto') === 'true') {
            var content = document.querySelector('.post-content');
            if (content) {
              var text = content.textContent || content.innerText;
              var words = text.trim().split(/\s+/).length;
              var minutes = Math.ceil(words / 200);
              field.textContent = minutes + ' min read';
            }
          } else {
            field.textContent = post.readTime + ' min read';
          }
          break;

        default:
          console.warn('Unknown field type:', fieldName);
      }
    });
  });
})();
