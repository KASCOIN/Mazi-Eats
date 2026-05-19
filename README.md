# MAZI-EATS 🍽️

**Smart Meal Planning for University of Lagos (Unilag) Students**

An AI-powered web application that helps students plan meals, find campus food vendors, and eat healthily on a budget.

**Tagline:** *Eat Smart. Eat Well. Eat Unilag.*

---

## 🌟 Features

### 1. **Recipe Builder** 
Build personalized Nigerian recipes with a cascading UI:
- Pick a base food (Rice, Pasta, Yam, Plantain, Beans, Bread, Noodles)
- Choose cooking style dynamically based on base selection
- Set number of servings (1-10)
- Add proteins (Chicken, Beef, Fish, Egg, Tofu, Mackerel, Sardine)
- AI generates full recipe with:
  - Complete ingredient list with quantities scaled to servings
  - Step-by-step cooking instructions
  - Estimated cost in Nigerian Naira (₦)
  - Nutritional breakdown (protein, carbs, calories)
  - Cooking time estimate

### 2. **Campus Food Map**
Interactive map showing all campus food vendors:
- **Color-coded markers:**
  - 🟢 Green: Food stores & provision shops
  - 🔴 Red: Restaurants & canteens
  - 🟠 Orange: Snack points
- Hardcoded realistic Unilag locations
- Click markers to see vendor details and price ranges
- Get directions feature

**Vendors included:**
- **Food Stores:** Unilag Cooperative Store, SUB Mini Mart, Main Gate Provisions
- **Restaurants:** Malete Canteen, Senate Canteen, Moremi Hall, Queen Amina Cafeteria, FAD Canteen
- **Snacks:** Suya Spot, Shawarma Stand, Buka Row, Puff-Puff Junction

### 3. **Healthy Eating on Budget**
Smart meal suggestions based on available ingredients and budget:
- Enter ingredients you have
- Specify your budget in Naira
- AI returns 3 meal suggestions with:
  - Ingredients you already have ✓
  - Missing ingredients to buy 🛒
  - Nutrition tips 💡
  - Estimated total cost

### 4. **Sustainable Development Goals (SDG) Integration**
Footer highlighting commitment to:
- **SDG 2** - Zero Hunger
- **SDG 3** - Good Health & Well-being
- **SDG 4** - Quality Education
- **SDG 11** - Sustainable Cities & Communities
- **SDG 12** - Responsible Consumption
- **SDG 17** - Partnerships for Goals

---

## 🛠️ Tech Stack

### Backend
- **Language:** Julia
- **HTTP Server:** HTTP.jl
- **JSON Processing:** JSON3.jl
- **AI Integration:** Gemini API
- **Database:** None (stateless API)
- **Authentication:** None (no user accounts)

### Frontend
- **HTML/CSS/JavaScript** (vanilla, no frameworks)
- **Maps:** Leaflet.js with OpenStreetMap (free)
- **Styling:** Custom CSS with Poppins (headings) & Inter (body) from Google Fonts
- **Responsive:** Mobile-first design

### Key Libraries
- Leaflet 1.9.4 for interactive maps
- OpenStreetMap for mapping tiles

---

## 📁 Project Structure

```
Mazi-Eats/
├── app.jl                      # Entry point, starts server on port 8080
├── Project.toml                # Julia dependencies
├── README.md                   # This file
├── src/
│   ├── Mazagri.jl              # Main module
│   ├── router.jl               # Route definitions & static file serving
│   ├── controllers/
│   │   ├── recipe_controller.jl     # Handles POST /api/recipe
│   │   └── healthy_controller.jl    # Handles POST /api/healthy
│   └── services/
│       └── claude_service.jl   # Claude API integration
├── public/
│   ├── index.html              # Home page
│   ├── recipe-builder.html     # Recipe builder
│   ├── map.html                # Campus food map
│   ├── healthy.html            # Healthy eating on budget
│   ├── css/
│   │   └── style.css           # All styling (responsive, professional)
│   └── js/
│       ├── recipe.js           # Recipe builder functionality
│       ├── map.js              # Map initialization & markers
│       └── healthy.js          # Healthy eating page logic
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Julia** (1.6+ recommended) - [Download](https://julialang.org/downloads/)
- **ANTHROPIC_API_KEY** - Your Claude API key
- A modern web browser

### Installation Steps

1. **Clone or download the project:**
   ```bash
   cd /path/to/Mazi-Eats
   ```

2. **Set environment variable for Claude API:**
   ```bash
   export ANTHROPIC_API_KEY="your-anthropic-api-key-here"
   ```
   
   **On Windows:**
   ```cmd
   set ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```

3. **Start the Julia server:**
   ```bash
   julia app.jl
   ```

   **Expected output:**
   ```
   [ Info: Starting MAZI-EATS server on port 8080...
   ```

4. **Open your browser:**
   Navigate to `http://localhost:8080`

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Home page |
| GET | `/recipe-builder` | Recipe builder page |
| GET | `/map` | Campus food map |
| GET | `/healthy` | Healthy eating page |
| POST | `/api/recipe` | AI recipe generation |
| POST | `/api/healthy` | AI meal suggestions |
| GET | `/public/*` | Static files (CSS, JS, images) |

### POST /api/recipe
**Request:**
```json
{
  "baseFood": "Rice",
  "style": "Jollof Rice",
  "servings": 2,
  "proteins": ["Chicken", "Fish"]
}
```

**Response:**
```json
{
  "ingredients": [
    {"name": "Parboiled Rice", "quantity": "2 cups", "estimated_naira_cost": 800},
    ...
  ],
  "steps": ["Wash rice...", "Heat oil...", ...],
  "total_cost_naira": 4500,
  "nutrition_summary": "Complete meal with protein and carbs",
  "cooking_time_minutes": 45
}
```

### POST /api/healthy
**Request:**
```json
{
  "ingredients": "Rice, 3 eggs, tomatoes, onions, garlic, salt",
  "budget": 1500
}
```

**Response:**
```json
[
  {
    "name": "Tomato Rice with Eggs",
    "ingredients_needed": ["Rice", "Eggs", "Tomatoes"],
    "missing_ingredients_to_buy": ["Peppers", "Oil"],
    "estimated_cost": 1200,
    "nutrition_tips": "Rich in protein from eggs, good carbs from rice"
  },
  ...
]
```

---

## 🎨 Design Features

### Color Scheme
- **Primary Green:** #1B5E20 (Nigerian flag inspired)
- **Primary Gold:** #F9A825 (Nigerian flag inspired)
- **Background:** #F5F5F5 (Light gray)
- **Text:** #212121 (Dark) / #666666 (Light)

### Typography
- **Headings:** Poppins (Google Fonts) - Bold, 700 weight
- **Body:** Inter (Google Fonts) - Regular, 400/500/600 weights

### UI Components
- **Cards:** Smooth shadow, hover effects
- **Buttons:** Primary (Gold on Green), Secondary (Green outline)
- **Forms:** Responsive checkboxes, modern inputs
- **Animations:** CSS transitions, loading spinner
- **Toast Notifications:** Success, Error, Warning, Info
- **Loading State:** Spinner animation with text

### Responsive Design
- Mobile-first approach
- Tested breakpoints: 768px, 480px
- Touch-friendly buttons and inputs
- Hamburger menu ready (structure in place)

---

## 🤖 Claude API Integration

### Model
- **Model:** `claude-sonnet-4-20250514`
- **API Version:** `2023-06-01`
- **Endpoint:** `https://api.anthropic.com/v1/messages`

### Authentication
- Requires `ANTHROPIC_API_KEY` environment variable
- Passed in `x-api-key` header

### Prompts

**Recipe Generation:**
```
You are a Nigerian meal planning assistant for university students.
A student at University of Lagos wants to cook: [meal style] based on [base food].
Servings: [n] people. Proteins: [proteins].
Return a JSON object with: ingredients (name, quantity, estimated_naira_cost),
steps (array of strings), total_cost_naira, nutrition_summary, cooking_time_minutes.
Return ONLY valid JSON, no markdown.
```

**Healthy Eating:**
```
You are a nutrition advisor for Nigerian university students on tight budgets.
The student has these ingredients: [ingredients].
Their budget is ₦[budget].
Suggest 3 meals they can make. For each meal return: name, ingredients_needed,
missing_ingredients_to_buy, estimated_cost, nutrition_tips.
Return ONLY valid JSON, no markdown.
```

---

## 🌐 No External Dependencies Required For Core Functionality

✅ No database setup needed
✅ No user authentication
✅ No complex DevOps
✅ Leaflet.js and OpenStreetMap are CDN-hosted (free)
✅ Google Fonts loaded from CDN

---

## 📱 Mobile Responsive

- All pages fully responsive
- Touch-friendly interface
- Mobile-optimized forms
- Readable on screens 320px and up
- Maps optimize for mobile viewing

---

## 🔒 Security Notes

- No sensitive data stored locally
- API key kept in environment variable
- CORS handled by browser same-origin policy
- Directory traversal prevention in file serving
- Input validation on all API endpoints

---

## 🌍 SDG Alignment

MAZI-EATS supports the United Nations Sustainable Development Goals:

1. **SDG 2 (Zero Hunger)** - Helps students access affordable nutrition
2. **SDG 3 (Good Health)** - Promotes healthy eating habits
3. **SDG 4 (Quality Education)** - Solves food insecurity for better focus
4. **SDG 11 (Sustainable Communities)** - Builds smarter campus food system
5. **SDG 12 (Responsible Consumption)** - Reduces food waste through planning
6. **SDG 17 (Partnerships)** - Collaborates with campus vendors

---

## 🚀 Future Enhancements

- User accounts (optional) with saved favorites
- Database for vendor reviews and ratings
- Real-time pricing updates
- Nutritionist consultation feature
- Recipe sharing and social features
- Multiple campus support (other Nigerian universities)
- Offline mode for campus map
- SMS/WhatsApp integration for orders

---

## 📝 License

Open source for educational purposes at University of Lagos.

---

## 👨‍💻 Contributing

Contributions welcome! This is a community project for Unilag students.

---

## 📧 Support

For issues or suggestions, contact the development team at unilag.mazieats@example.com

---

**Built with ❤️ for Unilag Students**

*Eat Smart. Eat Well. Eat Unilag.* 🍽️
