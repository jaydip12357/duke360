'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Search, Clock, Flame, ChefHat, Sparkles, Heart, Share2, Bookmark, Microwave, UtensilsCrossed } from 'lucide-react'

interface Ingredient {
  id: string
  name: string
  category: 'protein' | 'vegetable' | 'grain' | 'dairy' | 'pantry' | 'fruit'
}

interface Recipe {
  id: string
  name: string
  description: string
  ingredients: string[]
  matchedIngredients: string[]
  missingIngredients: string[]
  cookTime: number
  difficulty: 'easy' | 'medium'
  method: 'microwave' | 'stovetop' | 'no-cook' | 'toaster'
  servings: number
  calories: number
  instructions: string[]
  tags: string[]
  image: string
  saved: boolean
}

const commonIngredients: Ingredient[] = [
  // Proteins
  { id: 'eggs', name: 'Eggs', category: 'protein' },
  { id: 'chicken', name: 'Leftover Chicken', category: 'protein' },
  { id: 'tofu', name: 'Tofu', category: 'protein' },
  { id: 'beans', name: 'Canned Beans', category: 'protein' },
  { id: 'tuna', name: 'Canned Tuna', category: 'protein' },
  // Vegetables
  { id: 'spinach', name: 'Spinach', category: 'vegetable' },
  { id: 'tomato', name: 'Tomatoes', category: 'vegetable' },
  { id: 'onion', name: 'Onion', category: 'vegetable' },
  { id: 'bell-pepper', name: 'Bell Pepper', category: 'vegetable' },
  { id: 'carrots', name: 'Carrots', category: 'vegetable' },
  { id: 'broccoli', name: 'Broccoli', category: 'vegetable' },
  // Grains
  { id: 'rice', name: 'Leftover Rice', category: 'grain' },
  { id: 'pasta', name: 'Pasta', category: 'grain' },
  { id: 'bread', name: 'Bread', category: 'grain' },
  { id: 'tortilla', name: 'Tortillas', category: 'grain' },
  { id: 'ramen', name: 'Ramen Noodles', category: 'grain' },
  // Dairy
  { id: 'cheese', name: 'Cheese', category: 'dairy' },
  { id: 'milk', name: 'Milk', category: 'dairy' },
  { id: 'yogurt', name: 'Yogurt', category: 'dairy' },
  { id: 'butter', name: 'Butter', category: 'dairy' },
  // Pantry
  { id: 'soy-sauce', name: 'Soy Sauce', category: 'pantry' },
  { id: 'olive-oil', name: 'Olive Oil', category: 'pantry' },
  { id: 'garlic', name: 'Garlic', category: 'pantry' },
  { id: 'peanut-butter', name: 'Peanut Butter', category: 'pantry' },
  // Fruit
  { id: 'banana', name: 'Bananas', category: 'fruit' },
  { id: 'apple', name: 'Apples', category: 'fruit' }
]

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Microwave Egg Fried Rice',
    description: 'Quick and easy fried rice using leftover rice and whatever veggies you have.',
    ingredients: ['rice', 'eggs', 'soy-sauce', 'vegetables'],
    matchedIngredients: [],
    missingIngredients: [],
    cookTime: 5,
    difficulty: 'easy',
    method: 'microwave',
    servings: 1,
    calories: 350,
    instructions: [
      'Mix cold rice with a beaten egg in a microwave-safe bowl',
      'Add a splash of soy sauce and any chopped veggies',
      'Microwave for 2 minutes, stir, then microwave 1 more minute',
      'Stir well and enjoy!'
    ],
    tags: ['quick', 'filling', 'customizable'],
    image: '🍳',
    saved: false
  },
  {
    id: '2',
    name: 'Quesadilla',
    description: 'Crispy tortilla with melted cheese and your choice of fillings.',
    ingredients: ['tortilla', 'cheese', 'chicken', 'vegetables'],
    matchedIngredients: [],
    missingIngredients: [],
    cookTime: 8,
    difficulty: 'easy',
    method: 'stovetop',
    servings: 1,
    calories: 400,
    instructions: [
      'Heat a pan over medium heat',
      'Place tortilla in pan, add cheese and fillings to one half',
      'Fold tortilla in half and cook until golden (2-3 min per side)',
      'Cut into wedges and serve with salsa'
    ],
    tags: ['cheesy', 'customizable', 'quick'],
    image: '🌮',
    saved: true
  },
  {
    id: '3',
    name: 'Upgraded Ramen',
    description: 'Transform instant ramen into a proper meal.',
    ingredients: ['ramen', 'eggs', 'spinach', 'soy-sauce'],
    matchedIngredients: [],
    missingIngredients: [],
    cookTime: 10,
    difficulty: 'easy',
    method: 'microwave',
    servings: 1,
    calories: 450,
    instructions: [
      'Cook ramen according to package (use half the seasoning)',
      'Add an egg to the hot broth and stir',
      'Add fresh spinach and let it wilt',
      'Top with soy sauce and any other toppings'
    ],
    tags: ['comfort food', 'budget', 'filling'],
    image: '🍜',
    saved: false
  },
  {
    id: '4',
    name: 'Peanut Butter Banana Toast',
    description: 'Simple, filling, and surprisingly nutritious.',
    ingredients: ['bread', 'peanut-butter', 'banana'],
    matchedIngredients: [],
    missingIngredients: [],
    cookTime: 3,
    difficulty: 'easy',
    method: 'toaster',
    servings: 1,
    calories: 300,
    instructions: [
      'Toast bread to desired crispness',
      'Spread peanut butter generously',
      'Top with sliced banana',
      'Optional: drizzle honey or add cinnamon'
    ],
    tags: ['breakfast', 'snack', 'no-cook'],
    image: '🍌',
    saved: false
  },
  {
    id: '5',
    name: 'Bean & Cheese Burrito',
    description: 'Filling and protein-packed meal in minutes.',
    ingredients: ['tortilla', 'beans', 'cheese', 'rice'],
    matchedIngredients: [],
    missingIngredients: [],
    cookTime: 5,
    difficulty: 'easy',
    method: 'microwave',
    servings: 1,
    calories: 500,
    instructions: [
      'Warm beans in microwave',
      'Layer beans, cheese, and rice on tortilla',
      'Microwave for 30 seconds to melt cheese',
      'Roll up and enjoy'
    ],
    tags: ['filling', 'protein', 'budget'],
    image: '🌯',
    saved: false
  },
  {
    id: '6',
    name: 'Caprese Salad',
    description: 'Fresh and light - no cooking required!',
    ingredients: ['tomato', 'cheese', 'olive-oil'],
    matchedIngredients: [],
    missingIngredients: [],
    cookTime: 5,
    difficulty: 'easy',
    method: 'no-cook',
    servings: 1,
    calories: 250,
    instructions: [
      'Slice tomatoes and fresh mozzarella',
      'Arrange alternating slices on plate',
      'Drizzle with olive oil',
      'Season with salt, pepper, and basil if available'
    ],
    tags: ['healthy', 'fresh', 'light'],
    image: '🍅',
    saved: false
  }
]

export default function RecipesPage() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [methodFilter, setMethodFilter] = useState<string>('all')

  const getMatchedRecipes = () => {
    if (selectedIngredients.length === 0) {
      return sampleRecipes.map(r => ({
        ...r,
        matchedIngredients: [],
        missingIngredients: r.ingredients
      }))
    }

    return sampleRecipes
      .map(recipe => {
        const matched = recipe.ingredients.filter(ing =>
          selectedIngredients.some(sel => ing.includes(sel) || sel.includes(ing))
        )
        const missing = recipe.ingredients.filter(ing =>
          !selectedIngredients.some(sel => ing.includes(sel) || sel.includes(ing))
        )
        return { ...recipe, matchedIngredients: matched, missingIngredients: missing }
      })
      .sort((a, b) => b.matchedIngredients.length - a.matchedIngredients.length)
  }

  const filteredRecipes = getMatchedRecipes().filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMethod = methodFilter === 'all' || recipe.method === methodFilter
    return matchesSearch && matchesMethod
  })

  const toggleIngredient = (id: string) => {
    setSelectedIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'microwave': return <Microwave className="w-4 h-4" />
      case 'stovetop': return <Flame className="w-4 h-4" />
      case 'no-cook': return <UtensilsCrossed className="w-4 h-4" />
      case 'toaster': return <ChefHat className="w-4 h-4" />
      default: return <ChefHat className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'protein': return 'bg-red-100 text-red-700 border-red-200'
      case 'vegetable': return 'bg-green-100 text-green-700 border-green-200'
      case 'grain': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'dairy': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'pantry': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'fruit': return 'bg-pink-100 text-pink-700 border-pink-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const RecipeDetail = ({ recipe }: { recipe: Recipe }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="font-semibold text-lg">{recipe.name}</h2>
          <button onClick={() => setSelectedRecipe(null)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="text-center">
            <span className="text-6xl">{recipe.image}</span>
          </div>

          <p className="text-gray-600 text-center">{recipe.description}</p>

          {/* Quick Info */}
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {recipe.cookTime} min
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              {getMethodIcon(recipe.method)}
              {recipe.method}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Flame className="w-4 h-4" />
              {recipe.calories} cal
            </div>
          </div>

          {/* Match Status */}
          {selectedIngredients.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">
                  ✓ {recipe.matchedIngredients.length} ingredients you have
                </span>
                {recipe.missingIngredients.length > 0 && (
                  <span className="text-orange-600">
                    {recipe.missingIngredients.length} missing
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-sm ${
                    recipe.matchedIngredients.includes(ing)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
            <ol className="space-y-2">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#001A57] text-white flex items-center justify-center flex-shrink-0 text-xs">
                    {i + 1}
                  </span>
                  <span className="text-gray-600 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 py-3 bg-[#001A57] text-white rounded-lg font-medium hover:bg-[#00296B] transition">
              I Made This!
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition">
              <Bookmark className={`w-5 h-5 ${recipe.saved ? 'fill-current text-yellow-500' : 'text-gray-600'}`} />
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const IngredientModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="font-semibold text-lg">What do you have?</h2>
          <button onClick={() => setShowIngredientModal(false)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {['protein', 'vegetable', 'grain', 'dairy', 'pantry', 'fruit'].map(category => (
            <div key={category}>
              <h3 className="font-medium text-gray-700 capitalize mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {commonIngredients
                  .filter(ing => ing.category === category)
                  .map(ing => (
                    <button
                      key={ing.id}
                      onClick={() => toggleIngredient(ing.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                        selectedIngredients.includes(ing.id)
                          ? 'bg-[#001A57] text-white border-[#001A57]'
                          : getCategoryColor(category)
                      }`}
                    >
                      {ing.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowIngredientModal(false)}
            className="w-full py-3 bg-[#001A57] text-white rounded-lg font-medium hover:bg-[#00296B] transition"
          >
            Find Recipes ({selectedIngredients.length} selected)
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#001A57] text-white px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-1 hover:bg-white/10 rounded">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="font-semibold text-lg">Recipe Generator</h1>
            </div>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* Selected Ingredients */}
        <div className="bg-white rounded-xl p-4 border mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-gray-900">Your Ingredients</h2>
            <button
              onClick={() => setShowIngredientModal(true)}
              className="text-sm text-[#001A57] font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {selectedIngredients.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map(id => {
                const ing = commonIngredients.find(i => i.id === id)
                return ing ? (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#001A57] text-white rounded-full text-sm"
                  >
                    {ing.name}
                    <button onClick={() => toggleIngredient(id)} className="hover:bg-white/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null
              })}
            </div>
          ) : (
            <button
              onClick={() => setShowIngredientModal(true)}
              className="w-full py-8 border-2 border-dashed rounded-lg text-gray-400 hover:text-gray-500 hover:border-gray-400 transition"
            >
              <ChefHat className="w-8 h-8 mx-auto mb-2" />
              <p>Tap to add ingredients you have</p>
            </button>
          )}
        </div>

        {/* Method Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'microwave', label: 'Microwave', icon: Microwave },
            { id: 'no-cook', label: 'No Cook', icon: UtensilsCrossed },
            { id: 'stovetop', label: 'Stovetop', icon: Flame }
          ].map(method => (
            <button
              key={method.id}
              onClick={() => setMethodFilter(method.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                methodFilter === method.id
                  ? 'bg-[#001A57] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {method.icon && <method.icon className="w-4 h-4" />}
              {method.label}
            </button>
          ))}
        </div>

        {/* Recipes */}
        <div className="space-y-3">
          {filteredRecipes.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="w-full bg-white rounded-xl border p-4 text-left hover:border-gray-300 transition"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{recipe.image}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{recipe.name}</h3>
                    {recipe.saved && <Bookmark className="w-4 h-4 fill-current text-yellow-500" />}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{recipe.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.cookTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      {getMethodIcon(recipe.method)}
                      {recipe.method}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {recipe.calories} cal
                    </span>
                  </div>
                </div>
                {selectedIngredients.length > 0 && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {recipe.matchedIngredients.length}/{recipe.ingredients.length}
                    </p>
                    <p className="text-xs text-gray-400">matched</p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recipes found</p>
            <p className="text-sm text-gray-400">Try different ingredients or filters</p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <h3 className="font-medium text-yellow-900 mb-2">Student Cooking Tips</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Leftover rice makes the best fried rice</li>
            <li>• Eggs can go in almost anything</li>
            <li>• Keep basic seasonings: salt, soy sauce, hot sauce</li>
            <li>• Frozen veggies are just as nutritious!</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      {showIngredientModal && <IngredientModal />}
      {selectedRecipe && <RecipeDetail recipe={selectedRecipe} />}
    </div>
  )
}
