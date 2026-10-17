import { NoiseSensor } from './models/NoiseSensor.js';
import { MobileNoiseSensor } from './models/MobileNoiseSensor.js';
import { MonitoringSystem } from './services/MonitoringSystem.js';

// 1. Стартові дані з методички
const sensorsData = [
    { id: "NS-01", district: "Галицький", location: "просп. Свободи", noiseLevel: 58 },
    { id: "NS-02", district: "Франківський", location: "вул. Наукова", noiseLevel: 74 },
    { id: "NS-03", district: "Шевченківський", location: "просп. Чорновола", noiseLevel: 83 },
];

const system = new MonitoringSystem();

sensorsData.forEach(data => {
    const sensor = new NoiseSensor(data.id, data.district, data.location, data.noiseLevel);
    system.addSensor(sensor);
});

const droneSensor = new MobileNoiseSensor("NS-M1", "Сихівський", "Парк Івана Павла II", 45, 15);
system.addSensor(droneSensor);


const container = document.getElementById('sensors-container');
const statsContainer = document.getElementById('system-stats');


function renderSensorCard(sensor) {
    const status = sensor.getStatus(); 
    

    const statusText = status === 'normal' ? 'НОРМА' : (status === 'warning' ? 'ПОПЕРЕДЖЕННЯ' : 'КРИТИЧНО');
    
    const card = document.createElement('article');
    card.className = `card stat-card ${status}`;
    
    let batteryInfo = '';

    if (sensor instanceof MobileNoiseSensor) {
        const warningTxt = sensor.needsCharging() ? ' <b style="color:red">(Зарядити)</b>' : '';
        batteryInfo = `<small>🔋 Батарея: ${sensor.batteryLevel}% ${warningTxt}</small>`;
    }

    card.innerHTML = `
        <span>Об'єкт: ${sensor.district}</span>
        <strong>${sensor.id}</strong>
        <small>${sensor.location}</small>
        
        <div style="margin: 15px 0;">
            <span>Рівень шуму:</span><br>
            <strong style="font-size: 24px;">${sensor.noiseLevel} дБ</strong>
        </div>
        
        <em class="status-badge status-${status}">${statusText}</em>
        ${batteryInfo}
    `;
    
    return card;
}

function renderApp() {
    container.innerHTML = ''; 
    
    system.sensors.forEach(sensor => {
        container.appendChild(renderSensorCard(sensor));
    });

    // Малюємо статистику
    statsContainer.innerHTML = `
        <div style="margin-bottom: 20px;">
            <strong>Усього датчиків:</strong> ${system.sensors.length} |
            <strong>Критичних:</strong> <span style="color:red">${system.getCriticalSensors().length}</span> |
            <strong>Середній рівень по місту:</strong> ${system.getAverageNoiseLevel()} дБ
        </div>
    `;
}

renderApp();

console.log("Вся система:", system);
console.log("Пошук NS-02:", system.findSensorById("NS-02"));