import RecipeCard from './RecipeCard';

export default function RecipeList({ recipes, title }) {
  if (!recipes || recipes.length === 0) {
    return <p className="empty-state">No recipes found.</p>;
  }

  return (
    <section className="recipe-list-section">
      {title && <h2>{title}</h2>}
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
