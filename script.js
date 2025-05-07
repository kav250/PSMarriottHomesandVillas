// Task 1
// Filter PLACES by type. If the type property of an object in PLACES matches the typePreference parameter.
function filterPlacesByType(typePreference) {
  // Step 1: Create a new filteredPlaces array and store it in a variable
  const filteredPlaces = [];
  // Step 2: Loop through PLACES
  for (let i = 0; i < PLACES.length; i++) {
    const place = PLACES[i];
    // Step 3: If a place object's type property matches the typePreference parameter, add it to filteredPlaces
    if (place.type === typePreference) {
      filteredPlaces.push(place);
    }
  }
  // Step 4: After the loop, return filteredPlaces
  return filteredPlaces;
}

// Task 2
function createCard(place) {
  // Step 1: Create a new div element and store it in a variable
  const col = document.createElement("div");
  // Step 2: Add the col class to the new div element
  col.classList.add("col");
  // Step 3: Set the innerHTML of the div with a template string. It should resemble the structure shown in the readme. Interpolate the values for place.name, place.img, and place.location where needed. More info - https://wesbos.com/template-strings-html
  col.innerHTML = `
  <div class="card h-100" onclick="centerPlaceOnMap('${place.name}')">
    <img src="${place.img}" class="card-img-top h-100" alt="${place.name}">

    <div class="heart-icon" style="position:absolute; top:10px; right:10px; z-index:10;" onclick="event.stopPropagation(); toggleHeart(this)">
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
       <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
     </svg>
    </div>

      <div class="card-body"> 
        <h5 class="card-title">${place.name}</h5>
        <p class="card-text">${place.location}</p>
        </div>
      </div> `;

  // Step 4: Return the element
  return col;
}

function toggleHeart(el) {
  const svg = el.querySelector("svg");
  const isGray = svg.getAttribute("fill") === "gray";
  svg.setAttribute("fill", isGray ? "red" : "gray");
}

// Task 3
function populateRecommendationCards(filteredPlaces) {
  // Step 1: Store the DOM element with the id of "recommendations" in a variable
  const recommendationsSection = document.getElementById("recommendations");
  // Step 2: Clear the "recommendations" innerHTML
  recommendationsSection.innerHTML = "";
  // Step 3: Loop through the filteredPlaces array
  filteredPlaces.forEach((place) => {
    // Step 4: Create a card for each place using the createCard function
    const card = createCard(place);
    // Step 5: Add/append each card to the recommendations DOM element
    recommendationsSection.appendChild(card);
  });
}

// Task 4
function findPlaceByName(placeName) {
  const normalizedInput = placeName.trim().toLowerCase();

  // Step 1: Loop through the PLACES array
  for (let i = 0; i < PLACES.length; i++) {
    const normalizedPlaceName = PLACES[i].name.trim().toLowerCase();

    // Step 2: If a place object's name property matches the placeName parameter, return that place object
    if (normalizedPlaceName === normalizedInput) {
      return PLACES[i];
    }
  }
  // Return null if not able to be found
  return null;
}

// Center map on place & drops a pin based on selected place name
function centerPlaceOnMap(placeName) {
  const placeObj = findPlaceByName(placeName);
  if (placeObj) {
    dropMapPin(placeObj);
    document.getElementById("map").scrollIntoView();
    flyTo(ol.proj.fromLonLat([placeObj.long, placeObj.lat]), function () {
      flying = false;
    });

    // Stimulates the map click and triggers the pop-up
    const coordinate = ol.proj.fromLonLat([placeObj.long, placeObj.lat]);
    map.dispatchEvent({
      type: "click",
      coordinate: coordinate,
      pixel: map.getPixelFromCoordinate(coordinate),
    });
  } else {
    console.log("findPlaceByName function error");
  }
}

// Adds event listeners for popup buttons: City, Beach or Mountains
["city", "beach", "mountains"].forEach((type) => {
  const btn = document.getElementById(type + "Btn");
  if (btn) {
    btn.addEventListener("click", () => handlePreference(type));
  }
});

// Handles button click
function handlePreference(type) {
  const filtered = filterPlacesByType(type);
  populateRecommendationCards(filtered);
  filtered.forEach(addPlaceToMegaMenu);

  const modal = document.getElementById("preferenceModal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Add items to the dropdown menu
function addPlaceToMegaMenu(place) {
  const col1 = document.getElementById("mega-menu-col-1");
  const col2 = document.getElementById("mega-menu-col-2");
  if (!col1 || !col2) return;

  // Flexbox styling to lay items in a row
  const item = document.createElement("a");
  item.classList.add("dropdown-item");
  item.href = "#";
  item.textContent = place.name;
  item.addEventListener("click", () => {
    centerPlaceOnMap(place.name);
  });

  if (col1.children.length <= col2.children.length) {
    col1.appendChild(item);
  } else {
    col2.appendChild(item);
  }
}

// Populates the nav bar dropdown with click destinations
function populateDropdown(filteredPlaces) {
  const dropdown = document.getElementById("destinationsDropdown");
  if (!dropdown) {
    console.warn("Dropdown element not found");
    return;
  }

  dropdown.innerHTML = "";

  // Flexbox styling to lay items in a row
  dropdown.style.display = "flex";
  dropdown.style.flexWrap = "wrap";
  dropdown.style.maxWidth = "600px";
  dropdown.style.padding = "1rem";
  dropdown.style.gap = "0.5rem";

  // Scroll and styling setup
  dropdown.style.maxHeight = "400px";
  dropdown.style.overflowY = "auto";
  dropdown.style.overflowX = "hidden";
  dropdown.style.display = "block";
  dropdown.style.whiteSpace = "nowrap";

  dropdown.style.scrollbarWidth = "thin";
  dropdown.style.borderRadius = "0.5rem";
  dropdown.style.paddingRight = "0.5rem";

  filteredPlaces.forEach((place) => {
    const item = document.createElement("a");
    item.classList.add("dropdown-item");
    item.href = "#";
    item.textContent = place.name;
    item.addEventListener("click", () => {
      centerPlaceOnMap(place.name);

      // Hide dropbox after click
      const toggleLink = document.querySelector(".nav-link.dropdown-toggle");
      if (toggleLink) {
        toggleLink.click();
      }
    });
    dropdown.appendChild(item);
  });

  console.log("Dropdown populated with", filteredPlaces.length, "items");
}

// Function to drop pin and show pop-up image
function dropMapPin(place) {
  // Clear any exsisting map pins
  vectorSource.clear();

  const feature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([place.long, place.lat])),
    name: place.name,
    attributes: { img: place.img },
  });

  // Style the feature
  feature.setStyle(iconStyle);

  // Add the pin to the layer
  vectorSource.addFeature(feature);
}

// Popup content and attach to openlayers overlay
const popupE1 = document.getElementById("popup");
popupE1.className = "ol-popup";
popupE1.style.backgroundColor = "white";
popupE1.style.overflow = "hidden";
popupE1.style.borderRadius = "0.5rem";
popupE1.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";

popupE1.innerHTML = `
  <img src="${place.img}" alt="${place.name}" style="width: 100%; height: auto; display: block;" />
  <div style="padding: 0.75rem;">
    <h3 style="margin: 0 0 0.25rem 0;">${place.name}</h3>
    <p style="margin: 0; font-size: 0.9rem;">${place.location}</p>
  </div>
`;

// Fly to
function flyTo(coordinates, done) {
  map.getView().setCenter(coordinates);
  map.getView().setZoom(10);
  if (done) {
    done();
  }
}

// Optional zoom level version to flyto
function flyToZoom(coordinates, zoom, done) {
  map.getView().setCenter(coordinates);
  map.getView().setZoom(zoom);
  if (done) {
    done();
  }
}

// Auto show
window.addEventListener("DOMContentLoaded", () => {
  // Show preference modal if exsist
  const modal = document.getElementById("preferenceModal");
  if (modal) {
    modal.style.display = "flex";
  }
  // Setup map layer and popup overlay
  window.popupElement = document.getElementById("popup");
  window.popupOverlay = new ol.Overlay({
    element: popupElement,
    positioning: "bottom-center",
  });
  map.addOverlay(popupOverlay);

  // Enable the search button
  const searchBtn = document.getElementById("search-homes-button");
  if (searchBtn) {
    searchBtn.classList.remove("disabled");
    searchBtn.disabled = false;
    searchBtn.style.pointerEvents = "auto";
    searchBtn.style.opacity = "1";

    searchBtn.addEventListener("click", () => {
      const input = document.getElementById("destination").value.trim();

      if (!input) {
        console.log("No input provided");
        return;
      }

      const result = findPlaceByName(input);
      console.log("Search result:", result);

      if (result) {
        centerPlaceOnMap(result.name);
      } else {
        swal("Destination not found", `No match for "${input}"`, "warning");
      }
    });

    // Hovering "Destinations"
    const destinationInput = document.getElementById("destination");
    if (destinationInput) {
      destinationInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          searchBtn.click();
        }
      });
    }
  }
  // Populate inital dropdown with all places
  populateDropdown(PLACES);
});

// Force-enable the search button once everything loads
window.addEventListener("load", () => {
  console.log("Page fully loaded!");
  const searchBtn = document.getElementById("search-homes-button");
  if (searchBtn) {
    searchBtn.classList.remove("disabled");
    searchBtn.disabled = false;
    searchBtn.style.pointerEvents = "auto";
    searchBtn.style.opacity = "1";
  }
});

// MutationObserver
const observer = new MutationObserver(() => {
  const searchBtn = document.getElementById("search-homes-button");
  if (searchBtn) {
    searchBtn.classList.remove("disabled");
    searchBtn.disabled = false;
    searchBtn.style.pointerEvents = "auto";
    searchBtn.style.opacity = "1";
    console.log("Search button enabled");
  } else {
    console.log("Search button not found");
  }
});
observer.observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
});
