import { useState, useEffect } from 'react';
import { addRecipe, setDailyRecipe, getAllRecipes, getDailyRecipe } from '../../services/recipeService';
import RecipeForm from '../Recipes/RecipeForm';

export default function AdminDashboard() {
  const [dailyRecipe, setDaily] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [publishError, setPublishError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    getDailyRecipe().then(setDaily);
    getAllRecipes().then(setRecipes);
  }, []);

  async function handlePublishExisting(e) {
    e.preventDefault();
    if (!selectedId) return;
    setPublishError('');
    setPublishSuccess('');
    setPublishing(true);
    try {
      await setDailyRecipe(selectedId);
      setPublishSuccess('Recipe published as today\'s daily recipe!');
      const updated = await getDailyRecipe();
      setDaily(updated);
    } catch (err) {
      setPublishError(err.message);
    } finally {
      setPublishing(false);
    }
  }

  async function handleCreateAndPublish() {
    setPublishSuccess('');
    setPublishError('');
    const updated = await getDailyRecipe();
    setDaily(updated);
    const all = await getAllRecipes();
    setRecipes(all);
    setShowNewForm(false);
  }

  const notAdminRecipes = recipes.filter((r) => r.status === 'user');

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <section className="admin-section">
        <h2>Today&apos;s Daily Recipe</h2>
        {dailyRecipe ? (
          <div className="daily-recipe-info">
            <p><strong>{dailyRecipe.title}</strong> by {dailyRecipe.submittedBy}</p>
          </div>
        ) : (
          <p className="empty-state">No recipe published today.</p>
        )}
      </section>

      <section className="admin-section">
        <h2>Publish a Recipe for Today</h2>
        {publishSuccess && <p className="success">{publishSuccess}</p>}
        {publishError && <p className="error">{publishError}</p>}

        <h3>From existing recipes:</h3>
        <form onSubmit={handlePublishExisting} className="publish-form">
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="">-- Select a recipe --</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.submittedBy})
              </option>
            ))}
          </select>
          <button type="submit" className="btn" disabled={publishing || !selectedId}>
            {publishing ? 'Publishing...' : 'Publish as Today\'s Recipe'}
          </button>
        </form>

        <button className="btn btn-secondary" onClick={() => setShowNewForm(!showNewForm)}>
          {showNewForm ? 'Cancel' : 'Create New Recipe & Publish'}
        </button>

        {showNewForm && (
          <RecipeForm status="admin" onSuccess={handleCreateAndPublish} />
        )}
      </section>

      {notAdminRecipes.length > 0 && (
        <section className="admin-section">
          <h2>User-Submitted Recipes ({notAdminRecipes.length})</h2>
          <ul className="user-recipe-list">
            {notAdminRecipes.map((r) => (
              <li key={r.id}>
                <strong>{r.title}</strong> by {r.submittedBy}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
