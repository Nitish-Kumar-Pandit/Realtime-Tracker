const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
    const {latitude, longitude}   =  position.coords
    socket.emit("send-location", {latitude, longitude})
    }, 
    (error)=>{
        console.log(error);
    }, 
    {
        enableHighAccuracy: true,
        maximumAge: 0, //no caching
        timeout: 5000
    })
}

const map = L.map("map").setView([0,0], 16)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Nitish Kumar Pandit"
}).addTo(map);

const markers = {}

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // Center the map on the new location
    map.setView([latitude, longitude]);

    // Update the marker or create a new one if it doesn't exist
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]); // Corrected from removerLayer to removeLayer
        delete markers[id];
    }
});


 