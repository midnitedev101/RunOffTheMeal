import { Link } from 'react-router-dom';

const PLACEHOLDER = 'https://placehold.co/400x300?text=No+Image';

export default function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <img
        src={recipe.imageUrl || PLACEHOLDER}
        alt={recipe.title}
        className="recipe-card-img"
        onError={(e) => { e.target.src = PLACEHOLDER; }}
      />
      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>
        <p className="recipe-card-desc">{recipe.description}</p>
        <div className="recipe-card-meta">
          <span>by {recipe.submittedBy}</span>
          <span>★ {recipe.rating.toFixed(1)} ({recipe.ratingCount})</span>
        </div>
        <Link to={`/recipes/${recipe.id}`} className="btn">
          View Recipe
        </Link>
      </div>
    </article>
  );
}
