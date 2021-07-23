/* Variables  */

const buttonsEl = document.getElementsByTagName("button");
const countriesDiv = document.querySelector("#countries");
const countriesRow = document.querySelector(".row");
const highlighted = document.querySelector(".btn-primary");

/* Common Async fetch function  */

async function fetchAPI(url, callbck) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`${resp.status}`);
    const data = await resp.json();
    callbck(data);
  } catch (error) {
    alert("Error in fetching  data , Getting " + error);
  }
}

/* Fetching country list from API and passing method for Html creation for all countries  */

fetchAPI("https://api.covid19api.com/countries", createStateDOM);

function createStateDOM(data) {
  const filteredData = data.filter((el, index) => index > 110 && index < 149);

  const total = {
    ISO2: "All",
    Country: "All",
  };

  const addedCountry = [total, ...filteredData];

  addedCountry.forEach((el) => {
    const btn = document.createElement("button");
    btn.setAttribute("type", "button");

    btn.setAttribute("ISO2", el.ISO2);
    btn.setAttribute("Country", el.Country);

    btn.classList.add("btn", "btn-secondary", "m-2");
    btn.innerText = el.Country;

    countriesDiv.append(btn);
  });
}

/* Function to create Date to pass to the API (that takes date range) */
const CustomDate = (days = 0) => {
  let today = new Date();
  return (
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    (today.getDate() - days)
  );
};

/* Remove highlight from previous highlighted buttons */
function removeHighlight() {
  const debug = document.getElementsByClassName("btn-primary");
  if (debug.length !== 0) {
    debug[0].classList.add("btn-secondary");
    debug[0].classList.remove("btn-primary");
  }
}

/*  Added listener for user click*/

countriesDiv.addEventListener("click", (e) => {
  const country = e.target.getAttribute("country");
  removeHighlight();

  e.target.classList.remove("btn-secondary");
  e.target.classList.add("btn-primary");

  if (country === "All") {
    fetchAPI(`https://api.covid19api.com/summary`, createGlobalCards);
  } else {
    fetchAPI(
      `https://api.covid19api.com/country/${country}?from=${CustomDate(
        2
      )}&to=${CustomDate(1)}`,
      createCards
    );
  }
});

/* function to create HTML structure when select "ALL" */

const createGlobalCards = ({ Global: el }) => {
  const time = el.Date.split("T")[0];
  countriesRow.innerHTML = `

      <div class="col-sm">
        <div class="card border-warning mb-3" style="max-width: 18rem;">
            <div class="card-header text-warning">Date- ${time}</div>
            <div class="card-body text-warning">
              <h5 class="card-title">Confirmed Cases</h5>
              <p class="card-text">New Confirmed  : ${el.NewConfirmed}</p>
              <p class="card-text">Total Confirmed  : ${el.TotalConfirmed}</p>
              <p class="card-text"></p>
            </div>
          </div>
      </div>
  
      <div class="col-sm">
        <div class="card border-success mb-3" style="max-width: 18rem;">
            <div class="card-header text-success">Date- ${time}</div>
            <div class="card-body text-success">
              <h5 class="card-title">Recovered Cases</h5>
              <p class="card-text">New Recovered  : ${el.NewRecovered}</p>
              <p class="card-text">Total Recovered  : ${el.TotalRecovered}</p>
              <p class="card-text"></p>
            </div>
          </div>
      </div>
  
  
      <div class="col-sm">
        <div class="card border-danger mb-3" style="max-width: 18rem;">
            <div class="card-header text-danger">Date- ${time}</div>
            <div class="card-body text-danger">
              <h5 class="card-title">Death Cases</h5>
              <p class="card-text">New Deaths: ${el.NewDeaths}</p>
              <p class="card-text">Total Deaths: ${el.TotalDeaths}</p>
              <p class="card-text"></p>
            </div>
          </div>
      </div>
      
      `;
};

/* function to create HTML structure when select specific "country" */

const createCards = (data) => {
  if (data.length !== 0) {
    data.forEach((el) => {
      const time = el.Date.split("T")[0];

      countriesRow.innerHTML = `
      <div class="col-sm">
        <div class="card border-dark mb-3" style="max-width: 18rem;">
        <div class="card-header text-warning">Date- ${time}</div>
        <div class="card-body text-warning">
              <h5 class="card-title">Covid Cases</h5>
              <p class="card-text">Confirmed  : ${el.Confirmed}</p>
              <p class="card-text"></p>
            </div>
          </div>
      </div>
  
      <div class="col-sm">
        <div class="card border-success mb-3" style="max-width: 18rem;">
        <div class="card-header text-success">Date- ${time}</div>
        <div class="card-body text-success">
              <h5 class="card-title">Covid Cases</h5>
              <p class="card-text">Recovered  : ${el.Recovered}</p>
              <p class="card-text"></p>
            </div>
          </div>
      </div>
  
  
      <div class="col-sm">
        <div class="card border-danger mb-3" style="max-width: 18rem;">
        <div class="card-header text-danger">Date- ${time}</div>
        <div class="card-body text-danger">
              <h5 class="card-title">Covid Cases</h5>
              <p class="card-text">Deaths: ${el.Deaths}</p>
              <p class="card-text"></p>
            </div>
          </div>
      </div>
      
      `;
    });
  } else {
    countriesRow.innerHTML = "";
    removeHighlight();
    alert("Records are not updated yet .Please try after some time!!! ");
  }
};
