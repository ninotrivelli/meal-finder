// Elementos
const btnSearch = document.querySelector('#btnSearch');
const btnRandom = document.querySelector('#btnRandom');
const searchInput = document.querySelector('#searchInput');
const divResults = document.querySelector('#result-msg');
const gridResults = document.querySelector('#grid-results-container');
const singleRecipe = document.querySelector('#single-recipe');

btnSearch.addEventListener('click', showResults);

function showResults() {
  let input = searchInput.value;
  gridResults.innerHTML = '';
  singleRecipe.innerHTML = '';

  if (input.trim().length > 0) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals) {
          divResults.innerHTML = `<p>Results for "${input}"</p>`;

          data.meals.forEach((meal) => {
            let singleMeal = `
            <div class="single-meal" id="single-meal" >
                <img src="${meal.strMealThumb}" alt="${meal.strMealThumb}">
                <div class="single-meal-info" data-id=${meal.idMeal}>
                    <h3 data-id=${meal.idMeal} >${meal.strMeal}</h3>
                </div>
            </div>`;

            gridResults.innerHTML += singleMeal;
            searchInput.value = '';
          });
        } else {
          divResults.innerHTML = `<p>No results for "${input}"</p>`;
        }
      });
  } else {
    divResults.innerHTML = `<p>Please type something to search!</p>`;
  }
}

gridResults.addEventListener('click', (e) => {
  const mealID = e.target.dataset.id;

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      let meal = data.meals[0];
      console.log(meal);

      singleRecipe.innerHTML = `
      
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMealThumb}" />
      <p>
        ${meal.strInstructions}
      </p>
      <br>
      <h3>Ingredients</h3>
      <div class = 'ingredients-container'>
        ${displayIngredients(meal)}
        </div>`;
    });
});

function displayIngredients(mealObj) {
  let ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (mealObj[`strIngredient${i}`]) {
      let ingredient = `${mealObj[`strIngredient${i}`]} - ${
        mealObj[`strMeasure${i}`]
      }`;

      ingredients.push(ingredient);
    }
  }

  return ingredients
    .map((ing) => `<div class="ingredient">${ing}</div>`)
    .join('');
}
