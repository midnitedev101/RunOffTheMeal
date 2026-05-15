import { useState } from 'react';
import { searchByIngredients } from '../../services/recipeService';
import RecipeList from '../Recipes/RecipeList';

export default function SearchByIngredients() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    const terms = input.split(',').map((s) => s.trim()).filter(Boolean);
    if (terms.length === 0) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const data = await searchByIngredients(terms);
      setResults(data);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="search-page">
      <h1>Search Recipes by Ingredients</h1>
      <form onSubmit={handleSearch} className="search-form">
        <label htmlFor="ingredients">
          Enter ingredients (comma-separated):
        </label>
        <div className="search-row">
          <input
            id="ingredients"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. chicken, garlic, lemon"
            className="search-input"
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      {searched && !loading && (
        <RecipeList recipes={results} title={`Found ${results.length} recipe(s)`} />
      )}
    </section>
  );
}
