import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';
import { sanitizeRecipeInput, sanitizeRating } from '../utils/sanitize';
import { startOfDay, format } from 'date-fns';

const RECIPES_COL = 'recipes';
const DAILY_COL = 'dailyRecipes';

function todayDocId() {
  return format(new Date(), 'yyyy-MM-dd');
}

function serializeRecipe(data, id) {
  return {
    id,
    title: data.title,
    description: data.description,
    instructions: data.instructions,
    ingredients: data.ingredients,
    imageUrl: data.imageUrl || '',
    submittedBy: data.submittedBy || 'Admin',
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    rating: data.rating ?? 0,
    ratingCount: data.ratingCount ?? 0,
    status: data.status || 'admin',
  };
}

export async function getDailyRecipe() {
  const dateStr = todayDocId();
  const dailyRef = doc(db, DAILY_COL, dateStr);
  const dailySnap = await getDoc(dailyRef);

  if (!dailySnap.exists()) return null;

  const recipeId = dailySnap.data().recipeId;
  const recipeRef = doc(db, RECIPES_COL, recipeId);
  const recipeSnap = await getDoc(recipeRef);

  if (!recipeSnap.exists()) return null;

  return serializeRecipe({ id: recipeSnap.id, ...recipeSnap.data() });
}

export async function setDailyRecipe(recipeId) {
  const dateStr = todayDocId();
  const dailyRef = doc(db, DAILY_COL, dateStr);

  await runTransaction(db, async (transaction) => {
    const dailySnap = await transaction.get(dailyRef);
    if (dailySnap.exists()) {
      throw new Error('A recipe has already been published today. You can only post one recipe per day.');
    }
    const recipeRef = doc(db, RECIPES_COL, recipeId);
    const recipeSnap = await transaction.get(recipeRef);
    if (!recipeSnap.exists()) {
      throw new Error('Recipe not found');
    }
    transaction.set(dailyRef, {
      recipeId,
      date: dateStr,
      createdAt: Timestamp.now(),
    });
  });
}

export async function addRecipe(data) {
  const sanitized = sanitizeRecipeInput(data);
  const docRef = await addDoc(collection(db, RECIPES_COL), {
    ...sanitized,
    rating: 0,
    ratingCount: 0,
    status: data.status || 'admin',
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getRecipeById(id) {
  const recipeRef = doc(db, RECIPES_COL, id);
  const snap = await getDoc(recipeRef);
  if (!snap.exists()) return null;
  return serializeRecipe({ id: snap.id, ...snap.data() });
}

export async function getAllRecipes() {
  const q = query(collection(db, RECIPES_COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => serializeRecipe({ id: d.id, ...d.data() }));
}

export async function searchByIngredients(ingredientList) {
  if (!ingredientList || ingredientList.length === 0) return [];
  const q = query(collection(db, RECIPES_COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const terms = ingredientList.map((s) => s.toLowerCase().trim()).filter(Boolean);
  return snap.docs
    .map((d) => serializeRecipe({ id: d.id, ...d.data() }))
    .filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((i) => {
        const name = typeof i === 'string' ? i : i.name;
        return name?.toLowerCase() || '';
      });
      return terms.some((term) =>
        recipeIngredients.some((ri) => ri.includes(term))
      );
    });
}

export async function rateRecipe(recipeId, ratingValue) {
  const sanitized = sanitizeRating(ratingValue);
  if (sanitized === null) throw new Error('Rating must be an integer between 1 and 5');

  const recipeRef = doc(db, RECIPES_COL, recipeId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(recipeRef);
    if (!snap.exists()) throw new Error('Recipe not found');
    const data = snap.data();
    const newCount = (data.ratingCount || 0) + 1;
    const newRating = ((data.rating || 0) * (data.ratingCount || 0) + sanitized) / newCount;
    transaction.update(recipeRef, {
      rating: Math.round(newRating * 10) / 10,
      ratingCount: newCount,
    });
  });
}
