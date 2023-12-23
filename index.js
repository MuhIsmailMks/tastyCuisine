 
const menuBtn = $('.menu-button')
const navbar = $('.navbar')
const heroImage = $('.hero-image img')


// menu navigation mobile
menuBtn.click(function (){
    navbar.toggleClass('active')
})


// responsive element
 let screenWidth = $(window).width(); 
 
$(document).ready(function() { 
    function displayScreenWidth() {
      let screenWidth = $(window).width();   
      
      // responsive hero image 
      heroImage.prop('src', screenWidth >= 600 ? './images/hero-image.webp' : './images/hero-image-mobile.png');
    }

      // responsive hero image 
     function responsiveHeroImage(){
        heroImage.prop('src', screenWidth >= 600 ? './images/hero-image.webp' : './images/hero-image-mobile.png');
 
    }

    responsiveHeroImage()
    displayScreenWidth(); 
    $(window).resize(function() {
      displayScreenWidth();
    });
  });



// meals
const mealContainer = $('.meal-container'); 
const searchMealButton = $('.search-meal button');  
const mealDetailsContainer = $('.meal-detail')
const aboutMealContainer = $('.about-meal-container')
const closeMealDetails  = $('.meal-detail .close');
const mealList = $('#meal');
const loadMoreMeal = $('.load-more');


let displayedMeals = 8;
let totalMeals = 0; 
let retrievedMealsData = null; 
let currentDisplayed = 0;  
function getMeals(id, callback) {
  $.ajax({
    url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    method: 'GET',
    success: function (data) {
      if (data.meals) {
        const meal = data.meals[0];
        const mealDetails = {
          mealThumb: meal.strMealThumb,
          id: meal.idMeal,
          name: meal.strMeal,
          category: meal.strCategory
        };
        callback(mealDetails);  
      } else {
        callback(null, 'Meal not found');
      }
    },
    error: function (error) {
      console.error('Error fetching meal details:', error);
      callback(null, error);
    }
  });
}

function getMealsList() {
  const searchMealInput = $('.search-meal input').val().trim(); 

  $.ajax({
    url: `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchMealInput}`,
    method: 'GET',
    success: function (data) {
      retrievedMealsData = data
      mealContainer.html(`  <div class="loading-meal"> 
      <div class="loading-effect"><div></div><div></div><div></div><div></div></div>
   </div>   
   `);   
    const loadingMeal = $('.loading-meal');  
      if (data.meals) {
        const mealsSlice = data.meals.slice(0, displayedMeals);

        mealsSlice.forEach(function (meal) {
          getMeals(meal.idMeal, function (mealDetails, error) {
            if (error) {
              console.error('Error fetching meal details:', error);
              return;
            } 
            const mealElement = $(`
              <div class="meal" data-id="${meal.idMeal}">
                <div class="image">
                  <img src="${mealDetails.mealThumb}" alt="${mealDetails.name}">
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
              </div>
            `);

            mealContainer.append(mealElement);
            loadingMeal.addClass('hide'); 
          });
        });
 
      } else {
        mealContainer.html(` <div class="no-meal">
        Sorry, we didn't find any meal
     </div>`);
     loadMoreMeal.addClass('hide')
      }
    },
    error: function (error) {
      console.error('Error fetching meals list:', error);
    }
  });

  // displaying next meal 
    function displayMeal(){
      // const nilaiawal = 
    }


}

// top screen 
let initialScrollPosition = 0;
function saveScrollPosition() {
  initialScrollPosition = mealContainer.scrollTop();
}

 // load more button
 loadMoreMeal.on('click',() => {
      displayedMeals += 8
      mealContainer.scrollTop(initialScrollPosition);
      getMealsList(); 
 }) 

 
 
$(document).ready(function() {
  getMealsList();
}); 
 
// search meal
searchMealButton.click(() => {
  getMealsList()
});

const inputSearch = $('.search-meal input')
inputSearch.keypress((event) => {
  console.log(event);
  if (event.key === 'Enter' || event.keyCode === 13) {
      getMealsList();
  }
}); 

mealList.click(getMealsRecipe)  

function getMealsRecipe(e) {
  e.preventDefault();
  if ($(e.target).hasClass('get-recipe')) {
    let mealItem = $(e.target).closest('.meal');
  console.log(mealItem.data('id'));
    $.ajax({ 
      url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.data('id')}`,
      method: 'GET',
      dataType: 'json',
      success:  (data) => { 
        mealRecipeModal(data.meals);
      },
      error: function (xhr, status, error) {
        console.error(error);
      }
    });
  }
}


function mealRecipeModal(meal){ 
    meal = meal[0];   
    mealDetailsContainer.empty();
    let gradient = '';
    let measures = '';
    for(let i = 1 ; i <= 20 ; i++){
        const ingradient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if(ingradient && ingradient.trim() !== '' && measure && measure.trim() !== ''){
          gradient += `<li>${ingradient}</li>`
          measures += `<li>${measure}</li>`
        }  
      }  
      console.log(measures);
    const details = $(` 
               <div class="close-btn">
                    <img src="/icon/close-about-meal.svg" alt="">
                </div>


            <div class="image-source">
            <img src="${meal.strMealThumb}" alt="">
            <div class="source">
                <section>
                    <div class="section-title">
                         <h2>See How</h2>
                    </div>
                   
                    <span>:</span>
                    <a href="${meal.strYoutube}">${meal.strYoutube}</a>
                </section>
                <section>
                    <div class="section-title">
                        <h2>Source</h2>
                    </div>
                    <span>:</span>
                    <a href="${meal.strSource}">${meal.strSource}</a>
                </section>
            </div>
        </div>

        <div class="meal-details">
            <h2 class="name">${meal.strMeal}</h2>
            <p class="from">From : ${meal.strArea} </p>
            <div class="gradient-measure">
                <div class="gradient">
                    <h4>Gradient</h4>
                    <ul>
                        ${gradient}
                    </ul>
                </div>
                <div class="measure">
                    <h4>Measure</h4>
                    <ul>
                        ${measures}
                    </ul>
                </div>
            </div>
            <div class="intructions">
                <h4>Intructions</h4>
                <p>${meal.strInstructions}</p>
            </div>
        </div>
      `  );
 
      mealDetailsContainer.append(details)
      aboutMealContainer.addClass('show');
}

 
aboutMealContainer.click((e) => {
  let target = $(e.target);
  let parentClass = target.parent().attr('class'); 
  if(parentClass && parentClass.includes('close-btn')){
    aboutMealContainer.removeClass('show');;
  }
});




// information content

const informationContent = [
  {
    image:'/images/information-image.png',
    alt:'organic meal',
    tagLines:[
      'Education',
      'Organic Food',
      'Healthy Living'
    ],
    heading:'Building Health from Within: The Nutritional Key to Healthy Living', 
    aboutInformation:`follow food trends, culinary events, or ways to make the dining experience more interesting such as food pairing, dish decoration, and so on, It is important to realize that nutrition is not just about 'diet', it is the foundation of our health. In this article, we will discuss why nutrition is a key factor in maintaining balance in our body and mind.`,
  },
  {
    image:'/images/image-information2.webp',
    alt:'cooking meal',
    tagLines:[
      'Tips',
      'Taste',
      'Cooking'
    ],
    heading:'find cooking tips and Authentic Recipes from Various Cultures to Excite Your Taste at Home', 
    aboutInformation:`We not only provide information about delicious dishes, but also serve authentic recipes from various cultures. Discover how to make your favorite dishes at home with easy-to-understand step-by-step instructions, allowing you to experience signature flavors without leaving your kitchen.`,
  },
  {
    image:'/images/image-information3.webp',
    alt:'restaurant',
    tagLines:[
      'Restaurant',
      'Delicious Food',
      'Tips'
    ],
    heading:'Find interesting places for delicious food around you', 
    aboutInformation:`We explore the best restaurants in various destinations, providing in-depth reviews of extraordinary dining experiences. From luxury restaurants to street food stalls, every place to eat has its own unique story. We explore the specialties of each place, providing useful information to guide you in choosing a dining destination that suits your tastes.`,
  },
]

const informationContainer = document.querySelector('.information-container');

informationContent.map(info => { 
  const createInformation = document.createElement('div');
  createInformation.classList.add('information');

  const tagLines = info.tagLines.map(info => `<div class="tag">${info}</div>`).join(' ');
 
      
  createInformation.innerHTML = `
  <div class="image">
    <img src="${info.image}" alt="${info.alt}">
  </div>

  <section class="about-information">
    <div class="tag-lines">
       ${tagLines}
    </div>
    <h2 class="heading">${info.heading} </h2>
    <p>${info.aboutInformation}</p>
    <button class="read-more">Read More</button>
  </section> 
  `

  informationContainer.appendChild(createInformation)
})



// Mendapatkan lebar layar saat ini
var lebarLayar = window.innerWidth;

// Menampilkan lebar layar di konsol
console.log("Lebar layar saat ini adalah: " + lebarLayar + " piksel");
console.log('sd');


   


  
  
  
  
  
  