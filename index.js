const menuBtn = $('.menu-button')
const navbar = $('.navbar')
const heroImage = $('.hero-image img')

// menu navigation mobile
menuBtn.click(function () {
  navbar.toggleClass('active')
})

AOS.init({
  once: true,
});

// responsive element
let screenWidth = $(window).width();

$(document).ready(function () {
  function displayScreenWidth() {
    let screenWidth = $(window).width();

    // responsive hero image 
    heroImage.prop('src', screenWidth >= 600 ? './images/hero-imageDekstop.webp' : './images/hero-imageMobile.webp');
  }

  // responsive hero image 
  function responsiveHeroImage() {
    heroImage.prop('src', screenWidth >= 600 ? './images/hero-imageDekstop.webp' : './images/hero-imageMobile.webp');
  }

  responsiveHeroImage()
  displayScreenWidth();
  $(window).resize(function () {
    displayScreenWidth();
  });
});

// meals
const mealContainer = $('.meal-container');
const searchMealButton = $('.search-meal button');
const mealDetailsContainer = $('.meal-detail')
const aboutMealContainer = $('.about-meal-container')
const closeMealDetails = $('.meal-detail .close');
const mealList = $('#meal');
const loadMoreMeal = $('.load-more');
let displayedMeals = 8;
let totalMeals = 0;
let retrievedMealsData = null;
let currentDisplayed = 0;

// get meal by id
async function getMeals(id) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();

    if (data.meals) {
      const meal = data.meals[0];
      return {
        mealThumb: meal.strMealThumb,
        id: meal.idMeal,
        name: meal.strMeal,
        category: meal.strCategory
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching meal details:', error);
    return null;
  }
}

// get meal list
async function getMealsList() {
  const searchMealInput = document.querySelector('.search-meal input').value.trim();
  const mealContainer = document.querySelector('.meal-container');
  const loadMoreMeal = document.querySelector('.load-more');

  try {
    mealContainer.innerHTML = `
      <div class="loading-meal"> 
        <div class="loading-effect"><div></div><div></div><div></div><div></div></div>
      </div>
    `;

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchMealInput}`);
    const data = await response.json();

    retrievedMealsData = data;
    const loadingMeal = document.querySelector('.loading-meal');

    if (data.meals) {
      const mealsSlice = data.meals.slice(0, displayedMeals);

      for (let i = 0; i < mealsSlice.length; i++) {
        const meal = mealsSlice[i];
        const mealDetails = await getMeals(meal.idMeal);

        if (!mealDetails) continue;

        const mealElement = document.createElement('div');
        mealElement.classList.add('meal');
        mealElement.setAttribute('data-id', meal.idMeal);
        mealElement.setAttribute('data-aos', 'zoom-in');
        mealElement.setAttribute('data-aos-delay', `${i}00`);

        mealElement.innerHTML = `
          <div class="image">
            <img src="${mealDetails.mealThumb}" alt="${mealDetails.name}" loading="lazy">
          </div>
          <div class="about-meal">
            <div class="type-meal">
              <p>Category :</p>
              <h4>${mealDetails.category}</h4>
            </div>
            <div class="name">
              <h4>${meal.strMeal}</h4>
            </div>
            <button class="get-recipe">
              See Recipe
            </button>
          </div>
        `;

        mealContainer.appendChild(mealElement);
      }

      loadingMeal.classList.add('hide');
    } else {
      mealContainer.innerHTML = `
        <div class="no-meal">
          Sorry, we didn't find any meal
        </div>
      `;
      loadMoreMeal.classList.add('hide');
    }

  } catch (error) {
    console.error('Error fetching meals list:', error);
  }
}

// top screen 
let initialScrollPosition = 0;
function saveScrollPosition() {
  initialScrollPosition = mealContainer.scrollTop();
}

// load more button
loadMoreMeal.on('click', () => {
  displayedMeals += 8
  mealContainer.scrollTop(initialScrollPosition);
  getMealsList();
});

$(document).ready(function () {
  getMealsList();
});

// search meal
searchMealButton.click(() => {
  getMealsList();
});

const inputSearch = $('.search-meal input');
inputSearch.keypress((event) => {
  if (event.key === 'Enter' || event.keyCode === 13) {
    getMealsList();
  }
});

mealList.click(getMealsRecipe);

async function getMealsRecipe(e) {
  e.preventDefault();
  if ($(e.target).hasClass('get-recipe')) {
    let mealItem = $(e.target).closest('.meal');
    const mealId = mealItem.data('id');

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const data = await response.json();

      if (data.meals) {
        mealRecipeModal(data.meals);
      } else {
        console.warn('No recipe found for this meal');
      }
    } catch (error) {
      console.error('Error fetching meal recipe:', error);
    }
  }
}

function mealRecipeModal(meal) {
  meal = meal[0];
  mealDetailsContainer.empty();
  let gradient = '';
  let measures = '';

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== '' && measure && measure.trim() !== '') {
      gradient += `<li>${ingredient}</li>`;
      measures += `<li>${measure}</li>`;
    }
  }

  const details = $(`
    <div class="close-btn">
      <img src="./icon/close-about-meal.svg" alt="">
    </div>

    <div class="image-source">
      <img src="${meal.strMealThumb}" alt="">
      <div class="source">
        <section>
          <div class="section-title">
            <h2>See How</h2>
          </div>
          <span>:</span>
          <a href="${meal.strYoutube}" target="_blank">${meal.strYoutube}</a>
        </section>
        <section>
          <div class="section-title">
            <h2>Source</h2>
          </div>
          <span>:</span>
          <a href="${meal.strSource}" target="_blank">${meal.strSource}</a>
        </section>
      </div>
    </div>

    <div class="meal-details">
      <h2 class="name">${meal.strMeal}</h2>
      <p class="from">From : ${meal.strArea} </p>
      <div class="gradient-measure">
        <div class="gradient">
          <h4>Gradient</h4>
          <ul>${gradient}</ul>
        </div>
        <div class="measure">
          <h4>Measure</h4>
          <ul>${measures}</ul>
        </div>
      </div>
      <div class="instructions">
        <h4>Instructions</h4>
        <p>${meal.strInstructions}</p>
      </div>
    </div>
  `);

  mealDetailsContainer.append(details);
  aboutMealContainer.addClass('show');
}

aboutMealContainer.click((e) => {
  let target = $(e.target);
  let parentClass = target.parent().attr('class');
  if (parentClass && parentClass.includes('close-btn')) {
    aboutMealContainer.removeClass('show');
  }
});

// swiper slide
$(window).ready(function () {
  new Swiper('.mySwiper', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      10: {
        slidesPerView: 1,
      },
      600: {
        slidesPerView: 2,
        centeredSlides: false,
        spaceBetween: 20,
      },
      1100: {
        slidesPerView: 3,
        // centeredSlides: true,  
      },

    },
  });
});
