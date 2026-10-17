
const sensorsLab6 = [
    { id: "NS-01", district: "Галицький", location: "просп. Свободи, 14", noiseLevel: 52, status: "normal" },
    { id: "NS-02", district: "Франківський", location: "вул. Наукова, 8", noiseLevel: 68, status: "warning" },
    { id: "NS-03", district: "Шевченківський", location: "просп. Чорновола, 21", noiseLevel: 83, status: "critical" },
    { id: "NS-04", district: "Сихівський", location: "вул. Зелена, 102", noiseLevel: 49, status: "normal" },
    { id: "NS-05", district: "Личаківський", location: "вул. Пасічна, 30", noiseLevel: 71, status: "warning" },
    { id: "NS-06", district: "Залізничний", location: "вул. Городоцька, 155", noiseLevel: 86, status: "critical" }
];

const sensorList = document.querySelector("#sensor-list");
const districtFilter = document.querySelector("#district-filter");
const criticalFilter = document.querySelector("#critical-filter");


function createSensorCard(sensor) {
    const card = document.createElement("article");
    card.classList.add("sensor-card-lab6");
    card.classList.add(`sensor-card--${sensor.status}`);


    const header = document.createElement("div");
    header.classList.add("sensor-card-header");
    const title = document.createElement("h3");
    title.textContent = sensor.id;
    const badge = document.createElement("span");
    badge.classList.add("sensor-badge");
    badge.textContent = sensor.status;
    header.append(title, badge);


    const body = document.createElement("div");
    body.classList.add("sensor-card-body");
    const district = document.createElement("p");
    district.textContent = `📍 ${sensor.district} район`;
    const location = document.createElement("p");
    location.textContent = `🏢 ${sensor.location}`;
    body.append(district, location);


    const footer = document.createElement("div");
    footer.classList.add("sensor-card-footer");
    const levelText = document.createElement("span");
    levelText.textContent = `🔊 Рівень шуму:`;
    const levelValue = document.createElement("strong");
    levelValue.textContent = `${sensor.noiseLevel} дБ`;
    footer.append(levelText, levelValue);


    card.append(header, body, footer);
    return card;
}


function renderSensors(sensorArray) {
    sensorList.replaceChildren(); 
    
    sensorArray.forEach((sensor) => {
        const card = createSensorCard(sensor);
        sensorList.append(card);
    });
}


function applyFilters() {
    const selectedDistrict = districtFilter.value;
    const criticalOnly = criticalFilter.checked;

    const filteredSensors = sensorsLab6.filter((sensor) => {
        const matchesDistrict = selectedDistrict === "all" || sensor.district === selectedDistrict;
        const matchesStatus = !criticalOnly || sensor.status === "critical";
        
        return matchesDistrict && matchesStatus;
    });

    renderSensors(filteredSensors);
}

if (districtFilter && criticalFilter && sensorList) {
    districtFilter.addEventListener("change", applyFilters);
    criticalFilter.addEventListener("change", applyFilters);
    
    renderSensors(sensorsLab6);
}