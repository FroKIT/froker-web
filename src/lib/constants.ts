export const ALLERGIES = [
  'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Gluten',
  'Soy', 'Shellfish', 'Fish', 'Sesame', 'Mustard'
]

export const HEALTH_CONDITIONS = [
  'Diabetes (Type 1)', 'Diabetes (Type 2)', 'Hypertension',
  'PCOS', 'IBS', 'Celiac Disease', 'Thyroid Disorder',
  'Kidney Disease', 'Heart Disease', 'Lactose Intolerance'
]

export const DIETARY_PREFERENCES = [
  { value: 'omnivore', label: 'Non-Vegetarian' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'halal', label: 'Halal' },
]

export const GOALS = [
  { value: 'weight_loss', label: 'Lose Weight', icon: '⬇️' },
  { value: 'muscle_gain', label: 'Build Muscle', icon: '💪' },
  { value: 'maintenance', label: 'Stay Healthy', icon: '✅' },
  { value: 'medical', label: 'Medical Diet', icon: '🏥' },
]

export const DELIVERY_SLOTS = {
  breakfast: [
    { value: 'morning', label: '7:00 AM – 9:00 AM' },
  ],
  lunch: [
    { value: 'afternoon', label: '12:00 PM – 2:00 PM' },
  ],
  dinner: [
    { value: 'evening', label: '7:00 PM – 9:00 PM' },
  ],
}

export const ONBOARDING_STEPS = [
  { step: 1, label: 'Profile', path: '/onboarding/profile' },
  { step: 2, label: 'Health', path: '/onboarding/health' },
  { step: 3, label: 'Package', path: '/onboarding/packages' },
  { step: 4, label: 'Address', path: '/onboarding/address' },
  { step: 5, label: 'Slots', path: '/onboarding/slots' },
  { step: 6, label: 'Meals', path: '/onboarding/meals' },
]
