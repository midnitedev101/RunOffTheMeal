const ALLOWED_TAGS = {
  title: { maxLength: 120, pattern: /^[\w\s\-',.!?()]+$/ },
  name: { maxLength: 80, pattern: /^[\w\s\-'.]+$/ },
  description: { maxLength: 2000 },
  instructions: { maxLength: 10000 },
  ingredient: { maxLength: 100, pattern: /^[\w\s\-',.\d()/]+$/ },
  imageUrl: { maxLength: 2048, pattern: /^https?:\/\/.+/ },
};

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '');
}

function trimAll(str) {
  return str.replace(/\s+/g, ' ').trim();
}

function sanitizeString(str, options = {}) {
  if (typeof str !== 'string') return '';
  let cleaned = stripHtml(str);
  cleaned = trimAll(cleaned);
  if (options.maxLength) {
    cleaned = cleaned.slice(0, options.maxLength);
  }
  if (options.pattern && !options.pattern.test(cleaned)) {
    return '';
  }
  return cleaned;
}

function sanitizeIngredients(ingredients) {
  if (!Array.isArray(ingredients)) return [];
  return ingredients
    .map((item) => {
      if (typeof item === 'string') {
        return sanitizeString(item, ALLOWED_TAGS.ingredient);
      }
      if (item && typeof item === 'object') {
        const name = sanitizeString(item.name || '', ALLOWED_TAGS.ingredient);
        const amount = sanitizeString(item.amount || '', {
          maxLength: 50,
        });
        if (!name) return null;
        return { name, amount };
      }
      return null;
    })
    .filter(Boolean);
}

function sanitizeRating(rating) {
  const num = Number(rating);
  if (Number.isNaN(num) || num < 1 || num > 5) return null;
  return Math.round(num);
}

function sanitizeRecipeInput(data) {
  const sanitized = {};

  sanitized.title = sanitizeString(data.title, ALLOWED_TAGS.title);
  if (!sanitized.title) throw new Error('Invalid or missing title');

  sanitized.description = sanitizeString(data.description, ALLOWED_TAGS.description);
  if (!sanitized.description) throw new Error('Invalid or missing description');

  sanitized.instructions = sanitizeString(data.instructions, ALLOWED_TAGS.instructions);
  if (!sanitized.instructions) throw new Error('Invalid or missing instructions');

  sanitized.ingredients = sanitizeIngredients(data.ingredients);
  if (sanitized.ingredients.length === 0) throw new Error('At least one valid ingredient is required');

  if (data.imageUrl) {
    sanitized.imageUrl = sanitizeString(data.imageUrl, ALLOWED_TAGS.imageUrl);
  }

  if (data.submittedBy) {
    sanitized.submittedBy = sanitizeString(data.submittedBy, ALLOWED_TAGS.name);
  }

  return sanitized;
}

export { sanitizeString, sanitizeIngredients, sanitizeRating, sanitizeRecipeInput, ALLOWED_TAGS };
