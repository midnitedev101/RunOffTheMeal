import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getRecipeById, rateRecipe } from '../../services/recipeService';
import StarRating from '../Rating/StarRating';

const PLACEHOLDER = 'https://placehold.co/800x500?text=No+Image';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rated, setRated] = useState(false);

  useEffect(() => {
    getRecipeById(id)
      .then((data) => {
        if (!data) setError('Recipe not found');
        else setRecipe(data);
      })
      .catch(() => setError('Failed to load recipe'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleRate(rating) {
    try {
      await rateRecipe(id, rating);
      setRecipe((prev) => {
        const newCount = prev.ratingCount + 1;
        const newRating = ((prev.rating * prev.ratingCount) + rating) / newCount;
        return { ...prev, rating: Math.round(newRating * 10) / 10, ratingCount: newCount };
      });
      setRated(true);
    } catch {
      setError('Failed to submit rating');
    }
  }

  if (loading) return <p className="loading">Loading recipe...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p className="error">Recipe not found.</p>;

  return (
    <article className="recipe-detail">
      <img
        src={recipe.imageUrl || PLACEHOLDER}
        alt={recipe.title}
        className="recipe-detail-img"
        onError={(e) => { e.target.src = PLACEHOLDER; }}
      />
      <div className="recipe-detail-body">
        <h1>{recipe.title}</h1>
        <p className="recipe-meta">
          Submitted by {recipe.submittedBy} &middot; ★ {recipe.rating.toFixed(1)} ({recipe.ratingCount} ratings)
        </p>
        <p className="recipe-description">{recipe.description}</p>

        <h2>Ingredients</h2>
        <ul className="ingredient-list">
          {recipe.ingredients.map((item, i) => {
            const name = typeof item === 'string' ? item : item.name;
            const amount = typeof item === 'object' && item.amount ? item.amount : '';
            return (
              <li key={i}>
                {amount && <span className="amount">{amount}</span>}
                {name}
              </li>
            );
          })}
        </ul>

        <h2>Instructions</h2>
        <div className="instructions">{recipe.instructions}</div>

        <h2>Rate this Recipe</h2>
        {rated ? (
          <p className="thanks">Thanks for rating!</p>
        ) : (
          <StarRating value={0} onChange={handleRate} />
        )}
      </div>
    </article>
  );
}
