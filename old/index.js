const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById('meal');
const mealDetails = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

const mealContainer = document.getElementById('meal');
const loadingMeal = document.querySelector('.loading-meal')

 
function getMeals(id) {
  return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        const meal = data.meals[0];
        const mealDetails = {
          mealThumb: meal.strMealThumb,
          id: meal.idMeal,
          name: meal.strMeal,
          category: meal.strCategory
        };
        return mealDetails;  
      } else {
        throw new Error('Meal not found');
      }
    })
    .catch(error => {
      console.error('Error fetching meal details:', error);
      return null;  
    });
}
 
async function getMealsList() {
  let searchInputTxt = document.getElementById('search-input').value.trim(); 

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`);
    const data = await response.json();

    mealContainer.innerHTML = '' 

    if (data.meals) {
      for (const meal of data.meals.slice(0, 12)) {
        const mealDetails = await getMeals(meal.idMeal);
        mealContainer.innerHTML += `
          <div class="meal-item" data-id="${meal.idMeal}">
            <div class="meal-img">
              <img src="${meal.strMealThumb}" alt="">
            </div>
            <div class="meal-name">
              <h3>${meal.strMeal}</h3>
              <span class=''>${mealDetails ? `${mealDetails.mealThumb} ${mealDetails.id} ${mealDetails.name} categoty:${mealDetails.category}` : ''}</span>
              <span href="#" class="recipe-btn">Get Recipe</span>
            </div>
          </div>
        `;
      }
      mealList.classList.remove('notfound');
      loadingMeal.classList.add('active')
    } else {
      mealContainer.innerHTML += "Sorry, we didn't find any meal"; 
      // html += "Sorry, we didn't find any meal"; 
    }

    mealList.innerHTML = mealContainer.innerHTML; 
  } catch (error) {
    console.error('Error fetching meals list:', error);
  }
} 


// event listener 
searchBtn.addEventListener('click',getMealsList) 
mealList.addEventListener('click', getMealsRecipe) 
window.addEventListener('DOMContentLoaded',getMealsList)
 
 
function getMealsRecipe(e){
    e.preventDefault;
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(Response => Response.json())
        .then(data =>  { 
          
    console.log(data.meals);
          mealRecipeModal(data.meals)})
    }
}

function mealRecipeModal(meal){ 
    meal = meal[0];
    console.log(meal); 
    let html = `
            <h2 class="recipe-title"${meal.strMeal}</h2>
            <p class="recipe-category">${meal.strCategory}</p>
            <div class="recipe-instruct">
              <h3>instructions:</h3>
              <p>${meal.strInstructions}</p>
            </div>
            <div class="recipe-meal-img">
              <img src="${meal.strMealThumb}" alt="">
            </div>
            <div class="recipe-link">
              <a href="#" target="_blank">${meal.strYoutube}</a>
            </div>
      ` 
      mealDetails.innerHTML = html;
      mealDetails.parentElement.classList.add('showRecipe')
}

recipeCloseBtn.addEventListener('click', () => {
    mealDetails.parentElement.classList.remove('showRecipe')
})




