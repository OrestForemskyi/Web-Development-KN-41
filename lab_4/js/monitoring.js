const noiseLevels = [
    42, 55, 61, 78, 83, 67, 49, 72, 91, 58, 64, 76,
    53, 47, 88, 69, 74, 82, 95, 51, 71, -1, 85, 63,
    79, 39, 141, 86
];

const warningLevel = 70;
const criticalLevel = 85;
const minValidLevel = 30;
const maxValidLevel = 130;

// Стрілкова функція
const isValidLevel = (level, min, max) => Number.isFinite(level) && level >= min && level <= max;

// Стрілкова функція
const formatDb = value => `${value} dB`;

// Function Expression
const countByCategory = function(data) {
    let normal = 0;
    let warning = 0;
    let critical = 0;
    for (const level of data) {
        if (!isValidLevel(level, minValidLevel, maxValidLevel)) {
            continue;
        }

        if (level <= warningLevel) {
            normal++;
        } else if (level <= criticalLevel) {
            warning++;
        } else {
            critical++;
        }
    }
    return { normal, warning, critical };
};

// Function Declaration
function findFirstCritical(data) {
    for (let i = 0; i < data.length; i++) {
        const level = data[i];
        
        if (!isValidLevel(level, minValidLevel, maxValidLevel)) {
            continue;
        }

        if (level > criticalLevel) {
            return { value: level, position: i + 1, index: i };
            break; 
        }
    }
    return null;
}

// Цикл do...while. 
function checkFirstValid(data) {
    if (data.length === 0) return null;
    
    let i = 0;
    do {
        if (isValidLevel(data[i], minValidLevel, maxValidLevel)) {
            return { value: data[i], position: i + 1 };
        }
        i++;
    } while (i < data.length);
    
    return null;
}

// Цикл while. Шукає 3 безпечні виміри підряд після критичного.
function findRecovery(data, startIndex) {
    if (startIndex === null || startIndex >= data.length - 1) return null;

    let safeCount = 0;
    let i = startIndex + 1; 

    while (i < data.length) {
        const level = data[i];

        if (!isValidLevel(level, minValidLevel, maxValidLevel) || level > warningLevel) {
            safeCount = 0; 
        } else {
            safeCount++;
        }

        if (safeCount === 3) {
            return { position: i + 1 }; 
        }
        i++;
    }
    return null;
}

// Універсальний підрахунок статистики 
function calculateStats(data) {
    let sum = 0;
    let validCount = 0;
    let min = null;
    let max = null;
    let invalidRecords = [];

    for (let i = 0; i < data.length; i++) {
        const level = data[i];

        if (!isValidLevel(level, minValidLevel, maxValidLevel)) {
            invalidRecords.push({ value: level, position: i + 1 });
            continue;
        }

        sum += level;
        validCount++;

        if (min === null || level < min) min = level;
        if (max === null || level > max) max = level;
    }

    const avg = validCount === 0 ? null : +(sum / validCount).toFixed(2);
    
    return { validCount, min, max, avg, invalidRecords };
}

function generateReport() {
    const stats = calculateStats(noiseLevels);
    const categories = countByCategory(noiseLevels);
    const firstCritical = findFirstCritical(noiseLevels);
    const recovery = firstCritical ? findRecovery(noiseLevels, firstCritical.index) : null;
    const totalWarningsAndCriticals = categories.warning + categories.critical;

    console.group("Акустична варта -- звіт моніторингу");
    
    console.log(`Пороги: попередження > ${warningLevel} dB; критичний рівень > ${criticalLevel} dB`);
    console.log(`Усього вимірювань: ${noiseLevels.length}`);
    console.log(`Коректних: ${stats.validCount}`);
    console.log(`Некоректних: ${stats.invalidRecords.length}`);
    
    const tableData = [
        { "Категорія": "Без перевищення", "Кількість": categories.normal },
        { "Категорія": "Попередження", "Кількість": categories.warning },
        { "Категорія": "Критичні", "Кількість": categories.critical }
    ];
    console.table(tableData);

    console.log(`Середній рівень: ${formatDb(stats.avg)}`);
    console.log(`Мінімальний рівень: ${formatDb(stats.min)}`);
    console.log(`Максимальний рівень: ${formatDb(stats.max)}`);
    
    if (firstCritical) {
        console.log(`Перше критичне вимірювання: ${formatDb(firstCritical.value)}, позиція ${firstCritical.position}`);
    } else {
        console.log("Критичних вимірювань не знайдено.");
    }

    if (recovery) {
        console.log(`Відновлення -- три безпечні вимірювання поспіль: знайдено на позиції ${recovery.position}`);
    } else {
        console.log("Відновлення -- три безпечні вимірювання поспіль: не знайдено");
    }

    if (totalWarningsAndCriticals > 0) {
        console.warn(`Поріг ${warningLevel} dB перевищено у ${totalWarningsAndCriticals} вимірюваннях.`);
    }

    if (stats.invalidRecords.length > 0) {
        const errorMsg = stats.invalidRecords.map(rec => `позиція ${rec.position} (${formatDb(rec.value)})`).join(', ');
        console.error(`Некоректні дані: ${errorMsg}.`);
    }

    const recoveryText = recovery ? "було зафіксовано стійке відновлення." : "стійкого відновлення не виявлено.";
    console.log(`Висновок: зафіксовано ${categories.critical} критичні вимірювання; після першого з них ${recoveryText}`);
    
    console.groupEnd();
}

generateReport();