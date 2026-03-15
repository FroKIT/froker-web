-- Add dietary preference columns to meals table
ALTER TABLE public.meals
ADD COLUMN IF NOT EXISTS is_keto boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_paleo boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_halal boolean DEFAULT true;

-- Update keto meals (carbs <= 25g, no high-carb ingredients)
UPDATE public.meals SET is_keto = true WHERE name IN (
  'Chicken Tikka Masala',
  'Grilled Fish with Salad',
  'Egg Masala Omelette',
  'Fish Tikka',
  'Chicken Afghani',
  'Tandoori Chicken Salad',
  'Lemon Herb Chicken with Soup',
  'Mutton Seekh Kebab',
  'Chicken Soup with Veggies',
  'Egg White Omelette',
  'Grilled Paneer Tikka',
  'Palak Tofu',
  'Mutton Rogan Josh'
);

-- Update paleo meals (no grains, no dairy, no legumes; ghee OK)
UPDATE public.meals SET is_paleo = true WHERE name IN (
  'Grilled Fish with Salad',
  'Egg Masala Omelette',
  'Lemon Herb Chicken with Soup',
  'Mutton Seekh Kebab',
  'Chicken Soup with Veggies',
  'Quinoa Tabbouleh Salad',
  'Grilled Chicken with Sweet Potato',
  'Tuna Salad Bowl',
  'Baked Salmon with Veggies',
  'Mushroom and Spinach Curry'
);

-- All 56 meals are halal by default (is_halal DEFAULT true above)
-- No pork or alcohol in any dish — no further updates needed
