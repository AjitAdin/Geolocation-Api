let storeList = [
  {
    "id": "1",
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [72.82850485420479, 18.93952516462002]  
    },
    "properties": {
      "name": "A1 Bakery",
      "address": "Shop No 2, Ground Floor, Royal Plaza, Hospital Lane, Barrackpore",
      "phone": "23 2323 2323"
    }
  },
  {
    "id": "2",
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [77.209021, 28.613939]  
    },
    "properties": {
      "name": "Delhi Delights",
      "address": "Shop No 1, Ground Floor, Connaught Place, New Delhi",
      "phone": "11 1111 1111"
    }
  }
];

export { storeList, updateStoreList };
//module.exports = { storeList, updateStoreList };


function updateStoreList(store) {
  storeList.push(store);
}