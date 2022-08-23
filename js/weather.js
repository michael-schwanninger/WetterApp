const currentDate = new Date();
let shownDays = [];
let Weekdays = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

getLocation();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchWeather, positionError);
  }
}

function positionError(error) {
  if (error.code == 1) alert("Standort Berechtigung wird benötigt!");
  else if (error.code == 2) alert("Fehler bei der Positionsbestmmung!");
  else alert("Überprüfen Sie ihre Internetverbindung!");
}

function fetchWeather(position) {
  $.ajax({
    url: "php/fetchWeather.php",
    type: "post",
    dataType: "json",
    data: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },
    success: function (result) {
      setWeather(result);
    },
  });
}

function setWeather(data) {
  const {
    city: { name, sunrise, sunset },
    list: {
      [0]: {
        main: { temp, humidity },
        weather: {
          [0]: { description, main },
        },
        wind: { speed }
      }
    }
  } = data;

  const sunriseTime = new Date(sunrise * 1000);
  const sunrsetTime = new Date(sunset * 1000);

  document.getElementById("weather").style.backgroundImage =
    "url('https://source.unsplash.com/960x540/?" + main + "')";
  document.getElementById("weather__city").innerHTML = "Wetter in " + name;
  document.getElementById("weather__temp").innerHTML = temp + "°C";
  document.getElementById("weather__description").innerHTML = description;
  document.getElementById("weather__wind-speed").innerHTML =
    "Windgescheindigkeit: " + speed.toFixed(0) + " km/h";
  document.getElementById("weather__humidity").innerHTML =
    "Luftfeuchtigkeit: " + humidity + "%";
  document.getElementById("weather__sunrise").innerHTML =
    "Sonnenaufgang: " + sunriseTime.getHours() + ":" + sunriseTime.getMinutes();
  document.getElementById("weather__sunset").innerHTML =
    "Sonnenuntergang: " +
    sunrsetTime.getHours() +
    ":" +
    sunrsetTime.getMinutes();

  getForecast(data);
}

function getForecast(data) {
  //Loop through all 40 data items
  for (let i = 0; i < 40; i++) {
    const {
      list: {
        [i]: {
          dt,
          dt_txt,
          main: { temp },
          weather: {
            [0]: { description, icon }
          }
        }
      }
    } = data;

    const date = new Date(dt * 1000);
    let day;

    //Check if day is already shown or add to showDays
    let alreadyUsed;
    for (let j = 0; j < shownDays.length; j++) {
      if (date.getDay() == shownDays[j]) {
        alreadyUsed = true;
      }
    }

    //Only show forecast with data from "12:00" o'clock
    if (dt_txt.includes("12:00:00") && !alreadyUsed) {
      shownDays.push(date.getDay());
      if (date.getDate() == currentDate.getDate()) {
        day = "Heute";
      } else {
        day = Weekdays[date.getDay()];
      }
      setForecast(day, temp, description, icon);
    }
  }
}

function setForecast(day, temp, desc, icon) {
  document.getElementsByClassName("forecast__container")[0].innerHTML +=
    "<div class='forecast__item'>" +
    "<div class='forecast__item__day'>" +
    day +
    "</div>" +
    "<div id='forecast__item__img'><img src='http://openweathermap.org/img/wn/" +
    icon +
    ".png'></div>" +
    "<div id='forecast__item__temp'>" +
    temp +
    "°C </div>" +
    "<div id='forecast__item__desc'>" +
    desc +
    "</div>" +
    "</div>";
}
