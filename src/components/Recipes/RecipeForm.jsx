import { useState } from 'react';
import { addRecipe } from '../../services/recipeService';

export default function RecipeForm({ onSuccess, status = 'user' }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: '',
    imageUrl: '',
    submittedBy: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleIngredientChange(index, value) {
    const updated = [...form.ingredients];
    updated[index] = value;
    setForm((prev) => ({ ...prev, ingredients: updated }));
  }

  function addIngredientField() {
    setForm((prev) => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  }

  function removeIngredientField(index) {
    if (form.ingredients.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const filtered = form.ingredients.map((s) => s.trim()).filter(Boolean);
    if (filtered.length === 0) {
      setError('Please add at least one ingredient.');
      setSubmitting(false);
      return;
    }

    try {
      await addRecipe({ ...form, ingredients: filtered, status });
      const msg = status === 'admin'
        ? 'Recipe submitted for admin review.'
        : 'Your recipe has been submitted! It will appear after review.';
      setSuccess(msg);
      setForm({
        title: '',
        description: '',
        ingredients: [''],
        instructions: '',
        imageUrl: '',
        submittedBy: '',
      });
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to submit recipe.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <div className="form-group">
        <label htmlFor="title">Recipe Title *</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          maxLength={120}
        />
      </div>

      {status === 'user' && (
        <div className="form-group">
          <label htmlFor="submittedBy">Your Name *</label>
          <input
            id="submittedBy"
            name="submittedBy"
            value={form.submittedBy}
            onChange={handleChange}
            required
            maxLength={80}
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          maxLength={2000}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Ingredients *</label>
        {form.ingredients.map((ing, i) => (
          <div key={i} className="ingredient-row">
            <input
              value={ing}
              onChange={(e) => handleIngredientChange(i, e.target.value)}
              placeholder={`Ingredient ${i + 1}`}
              maxLength={100}
            />
            <button type="button" className="btn-sm" onClick={() => removeIngredientField(i)} disabled={form.ingredients.length <= 1}>
              -
            </button>
          </div>
        ))}
        <button type="button" className="btn-sm" onClick={addIngredientField}>
          + Add Ingredient
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="instructions">Instructions *</label>
        <textarea
          id="instructions"
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          required
          maxLength={10000}
          rows={6}
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL (optional)</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={form.imageUrl}
          onChange={handleChange}
          maxLength={2048}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <button type="submit" className="btn" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Recipe'}
      </button>
    </form>
  );
}
