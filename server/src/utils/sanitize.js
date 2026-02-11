import sanitizeHtml from 'sanitize-html';

export const sanitizeRichText = (dirty) =>
  sanitizeHtml(dirty || '', {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'span', 'a'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      span: ['style'],
      p: ['style'],
    },
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-fA-F]{3,6}$/],
        'font-size': [/^\d+(px|em|rem|%)$/],
      },
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  });
