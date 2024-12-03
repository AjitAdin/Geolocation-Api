

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success);
}


let map;
let ul = document.querySelector(".store-ul-list");
let storeList = []; // Define storeList globally

class Storeclass {
  constructor(latlng, name, address, phone) {
    this.id = Date.now().toString();
    this.type = "Feature";
    this.geometry = {
      type: "Point",
      coordinates: latlng
    };
    this.properties = {
      name: name,
      address: address,
      phone: phone
    };
  }
}
function handleFormSubmit(event) {
  event.preventDefault()
   
  let lat = document.getElementById('Latitude').value;
  let lng = document.getElementById('Longitude').value;
  let storename = document.getElementById('store-name').value;
  let address = document.getElementById('address').value;
  let phone = document.getElementById('phone').value;

  let ltlg = [parseFloat(lng), parseFloat(lat)]; // Ensure latlng are numbers
  let store = new Storeclass(ltlg, storename, address, phone);


  // Update store list locally
  storeList.push(store);

  // Prepare data for server-side storage (Node.js with Express)
  const postData = {
  
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(lng),
        parseFloat(lat)
      ]
    },
    properties: {
      name: storename,
      address: address,
      phone: phone
    }
  };
  fetch('/stores',{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(postData)
  })
  .then((response)=>{
    if(!response.ok){
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data)=>{
    console.log("store added"+data);
  })
  .catch((error)=>{
    console.log("Error",error);
  })
  // Send data to server (POST request)


  // Update UI
  createstore(store, ul);
  displaymarker(store);
}

// Attach event listener to the form
document.getElementById('store-form').addEventListener('submit', handleFormSubmit);




function displaymarker(storeList) {
  let customIcon = L.icon({
    iconUrl: "/images/storeimage.png",
    iconSize: [18, 15],
  });

  function runForEachFeature(feature, layer) {
    layer.bindPopup(customPopup(feature));
  }

  let storeLayer = L.geoJSON(storeList, {
    onEachFeature: runForEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: customIcon });
    },
  });
  storeLayer.addTo(map);
}

function success(position) {
  let lat = position.coords.latitude;
  let log = position.coords.longitude;

  map = L.map("map", { center: [lat, log], zoom: 5 });
  let layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
  layer.addTo(map);

  fetchStores();

  map.on('click', function(eventobject) {
    let { lat, lng } = eventobject.latlng;
    document.getElementById('Latitude').value = lat;
    document.getElementById('Longitude').value = lng;
  });
}

function customPopup(store) {
  return `
    <div>
      <h4>${store.properties.name}</h4>
      <p>${store.properties.address}</p>
      <div>
        <a href="tel:${store.properties.phone}">${store.properties.phone}</a>
      </div>
    </div>
  `;
}

function createstore(storeparameter, ul) {
  let list = document.createElement("li");

  let div = document.createElement("div");
  div.classList.add("store-item");

  let a = document.createElement("a");
  a.innerText = storeparameter.properties.name;
  a.href = "#";
  a.dataset.storeID = storeparameter.id;
  a.addEventListener("click", () => {
    flyToStore(storeparameter.id);
  });

  let p = document.createElement("p");
  p.innerText = storeparameter.properties.address;

  div.appendChild(a);
  div.appendChild(p);
  list.appendChild(div);
  ul.appendChild(list);
}

function fetchStores() {
  fetch("/stores")
    .then((response) => response.json())
    .then((stores) => {
      storeList = stores; // Populate storeList
      displaymarker(stores); // Display markers on the map
      generatestorelist(stores); // Generate store list on UI
    })
    .catch((error) => {
      console.error("Error fetching stores:", error);
    });
}

function generatestorelist(stores) {
  stores.forEach(function (store) {
    createstore(store, ul);
  });
}

function flyToStore(storeId) {
  let storeparameter = storeList.find(store => store.id === storeId);
  if (!storeparameter) return;

  let lat = storeparameter.geometry.coordinates[1];
  let log = storeparameter.geometry.coordinates[0];

  map.flyTo([lat, log], 14);

  setTimeout(function() {
    map.eachLayer(function(layer) {
      if (layer.feature && layer.feature.id === storeId) {
        layer.openPopup();
      }
    });
  }, 3000);
}
