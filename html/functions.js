const apiKey = 'YOUR_API_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
const responseCache = new Map();
var currentDate = new Date();

addEventListener("load", (event) => {
    callApodApi(apiUrl);
})

function callApodApi(url) {
    fetch(url)
        .then(response => {
            if(!response.ok) {
                throw new Error('Error getting apod data from api');
            }
            return response.json();
        })
        .then(data => {
            updateScreenData(data);
            responseCache.set(data.date, data);
        })
        .catch(error => {
            console.error('Error: ', error);
        })  
}

function callApodApiWithDate(date) {
    const urlWithDate = apiUrl + `&date=${date}`;
    console.log(urlWithDate);
    if(responseCache.get(date)) {
        console.log("Cache hit for date: ", date)
        updateScreenData(responseCache.get(date));
    } else {
        console.log("Cache miss calling api.")
        callApodApi(urlWithDate);  
    }
}

function updateScreenData(data){
    document.getElementById('title').innerHTML = data.title;
    var date = new Date(data.date);
    date.setDate(date.getDate() + 1);
    document.getElementById('date').innerHTML = date.toLocaleDateString('en-US');
    document.getElementById('explanation').innerHTML = data.explanation;
    mediaElement = document.getElementById('media')
    oldMediaElement = document.getElementById('apodMedia')
    var newMediaElement;
    if(data.media_type === 'image') {
        newMediaElement = document.createElement("img");
        newMediaElement.setAttribute("src", data.url);
        newMediaElement.setAttribute("id", "apodMedia");
    }
    if(data.media_type === 'video') {
        newMediaElement = document.createElement("iframe");
        newMediaElement.setAttribute("src", data.url+'&control=1&autoplay=1&mute=1');
        newMediaElement.setAttribute("id", "apodMedia");
    }
    mediaElement.replaceChild(newMediaElement, oldMediaElement);
}

function doPrevious() {
    currentDate.setDate(currentDate.getDate() - 1);
    console.log(currentDate);
    callApodApiWithDate(currentDate.toISOString().split("T")[0]);
}

function doNext() {
    currentDate.setDate(currentDate.getDate() + 1);
    console.log(currentDate);
    callApodApiWithDate(currentDate.toISOString().split("T")[0]);
}

function search() {
    const date = document.getElementById('searchDate').value;
    dateArray = date.split("-")
    currentDate = new Date(dateArray[0], dateArray[1]-1, dateArray[2]);
    console.log(date);
    callApodApiWithDate(date);
}