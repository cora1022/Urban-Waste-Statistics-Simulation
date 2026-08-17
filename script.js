/**
 * 도시 폐기물 시뮬레이션 - 멀티 시티 엔진
 */

// --- 데이터 세트 ---
const RATIO_PRESETS = {
    villa: { RESIDENTIAL: 82, COMMERCIAL_FOOD: 6, COMMERCIAL_RETAIL: 8, SCHOOL: 5, INDUSTRIAL: 0, MEDICAL: 2, OFFICE: 1, PARK: 8, CONSTRUCTION: 2, GOVERNMENT: 1 },
    apartment: { RESIDENTIAL: 88, COMMERCIAL_FOOD: 5, COMMERCIAL_RETAIL: 8, SCHOOL: 6, INDUSTRIAL: 0, MEDICAL: 3, OFFICE: 2, PARK: 10, CONSTRUCTION: 1, GOVERNMENT: 2 },
    oldDowntown: { RESIDENTIAL: 42, COMMERCIAL_FOOD: 22, COMMERCIAL_RETAIL: 24, SCHOOL: 4, INDUSTRIAL: 3, MEDICAL: 7, OFFICE: 10, PARK: 3, CONSTRUCTION: 4, GOVERNMENT: 5 },
    officeDistrict: { RESIDENTIAL: 10, COMMERCIAL_FOOD: 18, COMMERCIAL_RETAIL: 14, SCHOOL: 1, INDUSTRIAL: 2, MEDICAL: 5, OFFICE: 70, PARK: 4, CONSTRUCTION: 5, GOVERNMENT: 8 },
    factoryDistrict: { RESIDENTIAL: 6, COMMERCIAL_FOOD: 5, COMMERCIAL_RETAIL: 5, SCHOOL: 0, INDUSTRIAL: 80, MEDICAL: 1, OFFICE: 18, PARK: 1, CONSTRUCTION: 8, GOVERNMENT: 2 },
    mixedCity: { RESIDENTIAL: 58, COMMERCIAL_FOOD: 12, COMMERCIAL_RETAIL: 14, SCHOOL: 5, INDUSTRIAL: 8, MEDICAL: 4, OFFICE: 8, PARK: 6, CONSTRUCTION: 3, GOVERNMENT: 4 }
};

const ROAD_LAYOUT_COUNT = 7;
const TYPE_ICON_DISPLAY_RATIO = 0.2;

const NAME_PREFIXES = ['푸른', '빛나는', '오래된', '중앙', '강변', '숲속', '행복한', '스마트', '미래', '평화'];
const NAME_SUFFIXES = {
    RESIDENTIAL: ['아파트', '빌라', '맨션', '주택'],
    COMMERCIAL_FOOD: ['식당', '카페', '베이커리', '키친'],
    COMMERCIAL_RETAIL: ['상점', '마트', '백화점', '센터'],
    SCHOOL: ['학교', '학원', '교육관', '캠퍼스'],
    INDUSTRIAL: ['공장', '플랜트', '제조창', '산업단지'],
    MEDICAL: ['병원', '의원', '클리닉', '센터'],
    OFFICE: ['타워', '빌딩', '오피스', '스퀘어'],
    PARK: ['공원', '쉼터', '정원', '스퀘어'],
    CONSTRUCTION: ['현장', '구역', '단지', '지구'],
    GOVERNMENT: ['청사', '본부', '지원센터', '공사']
};

const WASTE_RATES = {
    RESIDENTIAL: { standing: 0.99, visitor: 0.031 },
    COMMERCIAL_FOOD: { standing: 1.25, visitor: 0.094 },
    COMMERCIAL_RETAIL: { standing: 0.62, visitor: 0.042 },
    SCHOOL: { standing: 0.33, visitor: 0.042 },
    INDUSTRIAL: { standing: 0.40, visitor: 0.021 },
    MEDICAL: { standing: 0.57, visitor: 0.052 },
    OFFICE: { standing: 0.44, visitor: 0.031 },
    PARK: { standing: 0.04, visitor: 0.021 },
    CONSTRUCTION: { standing: 0.47, visitor: 0.031 },
    GOVERNMENT: { standing: 0.40, visitor: 0.031 }
};

const BUILDING_TYPES = {
    RESIDENTIAL: { label: '주거 시설', color: 'rgba(54, 73, 145, 0.72)', volatility: 0.2, workerDensity: 8.5, visitorDensity: 0.5, workerWasteRate: WASTE_RATES.RESIDENTIAL.standing, visitorWasteRate: WASTE_RATES.RESIDENTIAL.visitor, icon: '🏠', wasteShares: { foodWaste: 0.34, paper: 0.077, vinyl: 0.075, plastic: 0.07, glass: 0.035, metal: 0.025, styrofoam: 0.03, sanitary: 0.055, mixedCombustible: 0.205, mixedNoncombustible: 0.05, textile: 0.028, bulkyFurniture: 0.007, bulkyAppliance: 0.003 } },
    COMMERCIAL_FOOD: { label: '음식점/카페', color: 'rgba(139, 54, 93, 0.72)', volatility: 0.65, workerDensity: 1.0, visitorDensity: 12.0, workerWasteRate: WASTE_RATES.COMMERCIAL_FOOD.standing, visitorWasteRate: WASTE_RATES.COMMERCIAL_FOOD.visitor, icon: '🍕', wasteShares: { foodWaste: 0.46, paper: 0.07, vinyl: 0.08, plastic: 0.055, glass: 0.03, metal: 0.02, styrofoam: 0.035, sanitary: 0.03, mixedCombustible: 0.16, mixedNoncombustible: 0.05, bulkyFurniture: 0.006, bulkyAppliance: 0.004 }, specialWastePerWorker: 0.12, specialWasteShares: { businessWaste: 1 } },
    COMMERCIAL_RETAIL: { label: '상점/마트', color: 'rgba(145, 111, 42, 0.72)', volatility: 0.45, workerDensity: 0.8, visitorDensity: 10.0, workerWasteRate: WASTE_RATES.COMMERCIAL_RETAIL.standing, visitorWasteRate: WASTE_RATES.COMMERCIAL_RETAIL.visitor, icon: '🛍️', wasteShares: { foodWaste: 0.11, paper: 0.17, vinyl: 0.16, plastic: 0.12, glass: 0.035, metal: 0.04, styrofoam: 0.055, sanitary: 0.025, mixedCombustible: 0.24, mixedNoncombustible: 0.025, bulkyFurniture: 0.014, bulkyAppliance: 0.006 }, specialWastePerWorker: 0.08, specialWasteShares: { businessWaste: 1 } },
    SCHOOL: { label: '학교/교육시설', color: 'rgba(56, 112, 128, 0.72)', volatility: 0.3, workerDensity: 0.5, visitorDensity: 5.0, workerWasteRate: WASTE_RATES.SCHOOL.standing, visitorWasteRate: WASTE_RATES.SCHOOL.visitor, icon: '🏫', wasteShares: { foodWaste: 0.35, paper: 0.14, vinyl: 0.06, plastic: 0.05, glass: 0.01, metal: 0.02, styrofoam: 0.015, sanitary: 0.05, mixedCombustible: 0.24, mixedNoncombustible: 0.055, bulkyFurniture: 0.007, bulkyAppliance: 0.003 } },
    INDUSTRIAL: { label: '산업/공장', color: 'rgba(88, 61, 139, 0.72)', volatility: 0.75, workerDensity: 3.0, visitorDensity: 0.5, workerWasteRate: WASTE_RATES.INDUSTRIAL.standing, visitorWasteRate: WASTE_RATES.INDUSTRIAL.visitor, icon: '🏭', wasteShares: { foodWaste: 0.10, paper: 0.09, vinyl: 0.08, plastic: 0.09, glass: 0.01, metal: 0.07, styrofoam: 0.02, sanitary: 0.03, mixedCombustible: 0.34, mixedNoncombustible: 0.17 }, specialWastePerWorker: 0.35, specialWasteShares: { businessWaste: 0.9, constructionDebris: 0.1 } },
    MEDICAL: { label: '의료/병원', color: 'rgba(143, 60, 60, 0.72)', volatility: 0.35, workerDensity: 1.5, visitorDensity: 6.0, workerWasteRate: WASTE_RATES.MEDICAL.standing, visitorWasteRate: WASTE_RATES.MEDICAL.visitor, icon: '🏥', wasteShares: { foodWaste: 0.16, paper: 0.08, vinyl: 0.07, plastic: 0.055, glass: 0.02, metal: 0.015, styrofoam: 0.01, sanitary: 0.09, mixedCombustible: 0.40, mixedNoncombustible: 0.10 }, specialWastePerWorker: 0.22, specialWastePerVisitor: 0.01, specialWasteShares: { medicalWaste: 0.78, businessWaste: 0.22 } },
    OFFICE: { label: '업무/오피스', color: 'rgba(91, 90, 151, 0.72)', volatility: 0.35, workerDensity: 6.0, visitorDensity: 2.0, workerWasteRate: WASTE_RATES.OFFICE.standing, visitorWasteRate: WASTE_RATES.OFFICE.visitor, icon: '🏢', wasteShares: { foodWaste: 0.26, paper: 0.18, vinyl: 0.06, plastic: 0.06, glass: 0.02, metal: 0.03, styrofoam: 0.01, sanitary: 0.04, mixedCombustible: 0.27, mixedNoncombustible: 0.05, bulkyFurniture: 0.014, bulkyAppliance: 0.006 }, specialWastePerWorker: 0.03, specialWasteShares: { businessWaste: 1 } },
    PARK: { label: '공원/녹지', color: 'rgba(50, 116, 94, 0.72)', volatility: 0.25, workerDensity: 0.1, visitorDensity: 4.0, workerWasteRate: WASTE_RATES.PARK.standing, visitorWasteRate: WASTE_RATES.PARK.visitor, icon: '🌳', wasteShares: { foodWaste: 0.30, paper: 0.10, vinyl: 0.09, plastic: 0.10, glass: 0.04, metal: 0.035, styrofoam: 0.02, sanitary: 0.04, mixedCombustible: 0.21, mixedNoncombustible: 0.065 } },
    CONSTRUCTION: { label: '공사 현장', color: 'rgba(143, 112, 58, 0.72)', volatility: 1.0, workerDensity: 2.0, visitorDensity: 0.2, workerWasteRate: WASTE_RATES.CONSTRUCTION.standing, visitorWasteRate: WASTE_RATES.CONSTRUCTION.visitor, icon: '🚧', wasteShares: { foodWaste: 0.10, paper: 0.05, vinyl: 0.05, plastic: 0.04, glass: 0.01, metal: 0.04, styrofoam: 0.02, sanitary: 0.03, mixedCombustible: 0.38, mixedNoncombustible: 0.28 }, specialWasteAreaRate: 0.028, specialWasteShares: { constructionDebris: 0.86, metal: 0.06, plastic: 0.03, mixedNoncombustible: 0.05 } },
    GOVERNMENT: { label: '공공 기관', color: 'rgba(52, 94, 133, 0.72)', volatility: 0.3, workerDensity: 1.5, visitorDensity: 8.0, workerWasteRate: WASTE_RATES.GOVERNMENT.standing, visitorWasteRate: WASTE_RATES.GOVERNMENT.visitor, icon: '🏛️', wasteShares: { foodWaste: 0.24, paper: 0.19, vinyl: 0.055, plastic: 0.055, glass: 0.02, metal: 0.03, styrofoam: 0.01, sanitary: 0.045, mixedCombustible: 0.27, mixedNoncombustible: 0.065, bulkyFurniture: 0.01, bulkyAppliance: 0.01 }, specialWastePerWorker: 0.03, specialWasteShares: { businessWaste: 1 } }
};

const LIGHT_BUILDING_TYPE_COLORS = {
    RESIDENTIAL: '#aebcf2',
    COMMERCIAL_FOOD: '#f2b4cb',
    COMMERCIAL_RETAIL: '#efd18a',
    SCHOOL: '#9ed9e5',
    INDUSTRIAL: '#c6b5ee',
    MEDICAL: '#f2b4b4',
    OFFICE: '#bbbdf2',
    PARK: '#a8dfc7',
    CONSTRUCTION: '#efd19c',
    GOVERNMENT: '#a8c9e8'
};

const WASTE_STREAMS = {
    foodWaste: { label: '음식물쓰레기', category: 'food' },
    paper: { label: '종이류', category: 'recyclable' },
    vinyl: { label: '비닐류', category: 'recyclable' },
    plastic: { label: '플라스틱류', category: 'recyclable' },
    glass: { label: '유리병', category: 'recyclable' },
    metal: { label: '캔/고철류', category: 'recyclable' },
    styrofoam: { label: '스티로폼', category: 'recyclable' },
    textile: { label: '의류/섬유류', category: 'standardBag' },
    sanitary: { label: '위생용품', category: 'standardBag' },
    mixedCombustible: { label: '일반 가연성', category: 'standardBag' },
    mixedNoncombustible: { label: '불연성 생활폐기물', category: 'standardBag' },
    bulkyFurniture: { label: '가구류', category: 'bulky' },
    bulkyAppliance: { label: '가전류', category: 'bulky' },
    constructionDebris: { label: '건설폐기물', category: 'construction' },
    medicalWaste: { label: '의료폐기물', category: 'medical' },
    businessWaste: { label: '사업장 일반폐기물', category: 'business' }
};

const WASTE_CATEGORIES = {
    standardBag: '종량제봉투 대상 폐기물',
    food: '음식물류 폐기물',
    recyclable: '재활용가능자원',
    bulky: '대형폐기물',
    construction: '건설폐기물',
    medical: '의료폐기물',
    business: '사업장 일반폐기물'
};

// --- 자료구조 키 목록 ---
// 같은 키 배열을 여러 번 만들지 않고, 배열/해시 테이블 기반 알고리즘의 기준 순서로 사용한다.
const BUILDING_TYPE_KEYS = Object.keys(BUILDING_TYPES);
const WASTE_STREAM_KEYS = Object.keys(WASTE_STREAMS);
const WASTE_CATEGORY_KEYS = Object.keys(WASTE_CATEGORIES);
const RATIO_PRESET_KEYS = Object.keys(RATIO_PRESETS);

const KOREA_WASTE_BENCHMARK = {
    municipalPerCapitaKg: 1.2,
    householdSurveyPerCapitaKg: 0.9506,
    simulationTargetRangeKgPerResident: [1.1, 1.3],
    categoryShares: {
        standardBag: 330.8 / 950.6,
        food: 310.9 / 950.6,
        recyclable: 308.8 / 950.6
    },
    source: '2023년 전국 폐기물 발생 및 처리현황 1.2kg/일·인, 제6차 전국폐기물통계조사 세부 조성비'
};

const SIMULATION_BASELINE = {
    unit: 'kg/일',
    collectionStorageDays: 1.5,
    minDailyFactor: 0.35,
    maxDailyFactor: 1.85,
    populationVariance: 0.025,
    description: '2023년 전국 생활폐기물 1.2kg/일·인과 제6차 전국폐기물통계조사 세부 조성비 기준 보정'
};

const COLORS = {
    BG: '#05050a',
    ROAD: '#12121c',
    ROAD_EDGE: '#0f1118',
    ROAD_LANE: 'rgba(255, 255, 255, 0.62)',
    BUILDING_DEFAULT: '#1a1a2e',
    BUILDING_SHADOW: 'rgba(0,0,0,0.5)',
    CAR_TYPES: ['#4361ee', '#f72585', '#7209b7', '#4cc9f0', '#fbbf24']
};

const THEME_COLORS = {
    dark: {
        BG: '#05050a',
        ROAD: '#12121c',
        ROAD_EDGE: '#0f1118',
        ROAD_LANE: 'rgba(255, 255, 255, 0.62)',
        BUILDING_DEFAULT: '#1a1a2e',
        BUILDING_SHADOW: 'rgba(0,0,0,0.5)'
    },
    light: {
        BG: '#f7f8fb',
        ROAD: '#4f535c',
        ROAD_EDGE: '#4f535c',
        ROAD_LANE: 'rgba(255, 255, 255, 0.78)',
        BUILDING_DEFAULT: '#b8bcc5',
        BUILDING_SHADOW: 'rgba(70, 74, 84, 0.24)'
    }
};

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function formatKg(value) {
    return Math.round(value || 0).toLocaleString();
}

function formatPeople(value) {
    return Math.round(value || 0).toLocaleString();
}

function getBuildingTypeColor(typeKey, type) {
    if (currentTheme === 'light') {
        return LIGHT_BUILDING_TYPE_COLORS[typeKey] || COLORS.BUILDING_DEFAULT;
    }
    return type.color;
}

function randomVariance(scale = SIMULATION_BASELINE.populationVariance) {
    return 1 + (Math.random() * 2 - 1) * scale;
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function randomInt(min, max) {
    return Math.floor(randomBetween(min, max + 1));
}

function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function createZeroTable(keys) {
    return keys.reduce((table, key) => {
        table[key] = 0;
        return table;
    }, {});
}

function createHashTable(keys, createValue) {
    return keys.reduce((table, key) => {
        table[key] = createValue(key);
        return table;
    }, {});
}

class PrefixSumTable {
    constructor(keys, getWeight) {
        this.keys = [];
        this.prefixSums = [];
        this.totalWeight = 0;

        keys.forEach(key => {
            const weight = Math.max(0, Number(getWeight(key)) || 0);
            if (weight <= 0) return;
            this.totalWeight += weight;
            this.keys.push(key);
            this.prefixSums.push(this.totalWeight);
        });
    }

    pick(randomValue = Math.random()) {
        if (this.totalWeight <= 0 || this.keys.length === 0) return null;

        const target = randomValue * this.totalWeight;
        let left = 0;
        let right = this.prefixSums.length - 1;

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (target < this.prefixSums[mid]) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }

        return this.keys[left];
    }
}

function createRandomTypeWeights(excludedPresetKeys = []) {
    const availablePresets = RATIO_PRESET_KEYS.filter(key => !excludedPresetKeys.includes(key));
    const presetKey = pickRandom(availablePresets.length > 0 ? availablePresets : RATIO_PRESET_KEYS);
    const source = RATIO_PRESETS[presetKey];
    const weights = {};

    BUILDING_TYPE_KEYS.forEach(key => {
        const base = source[key] || 0;
        if (base <= 0) {
            weights[key] = Math.random() < 0.18 ? randomInt(1, 4) : 0;
            return;
        }
        weights[key] = Math.round(clamp(base * randomBetween(0.78, 1.24), 0, 100));
    });

    return { presetKey, weights };
}

function applyRandomStartupConfig(city, usedLayouts = [], usedPresetKeys = []) {
    const randomWeights = createRandomTypeWeights(usedPresetKeys);
    const availableLayouts = Array.from({ length: ROAD_LAYOUT_COUNT }, (_, index) => index).filter(layout => !usedLayouts.includes(layout));
    city.config.roadLayout = pickRandom(availableLayouts.length > 0 ? availableLayouts : Array.from({ length: ROAD_LAYOUT_COUNT }, (_, index) => index));
    city.config.targetBuildings = randomInt(45, 95);
    city.config.populationScale = Number(randomBetween(0.35, 1.25).toFixed(1));
    city.config.workerPopulationScale = Number(randomBetween(0.75, 1.35).toFixed(2));
    city.config.floatPopulationScale = Number(randomBetween(0.75, 1.45).toFixed(2));
    city.config.trafficScale = Number(randomBetween(0.75, 1.25).toFixed(2));
    city.config.wasteScale = 1.0;
    city.config.preset = 'custom';
    city.config.randomBasePreset = randomWeights.presetKey;
    city.config.typeWeights = randomWeights.weights;
    usedLayouts.push(city.config.roadLayout);
    usedPresetKeys.push(randomWeights.presetKey);
}

function createWasteBreakdown() {
    return createZeroTable(WASTE_STREAM_KEYS);
}

function createWasteCategoryBreakdown(materialBreakdown) {
    const categoryBreakdown = createZeroTable(WASTE_CATEGORY_KEYS);

    Object.keys(materialBreakdown || {}).forEach(key => {
        const category = WASTE_STREAMS[key]?.category;
        if (category && categoryBreakdown[category] !== undefined) {
            categoryBreakdown[category] += materialBreakdown[key] || 0;
        }
    });

    return categoryBreakdown;
}

function addWasteBreakdown(target, source) {
    WASTE_STREAM_KEYS.forEach(key => {
        target[key] = (target[key] || 0) + (source?.[key] || 0);
    });
    return target;
}

function allocateWaste(totalWaste, shares) {
    const breakdown = createWasteBreakdown();
    const totalShare = Object.values(shares).reduce((sum, value) => sum + value, 0);
    if (totalShare <= 0 || totalWaste <= 0) return breakdown;

    Object.keys(shares).forEach(key => {
        if (breakdown[key] !== undefined) {
            breakdown[key] = totalWaste * (shares[key] / totalShare);
        }
    });
    return breakdown;
}

function mergeWasteBreakdowns(...breakdowns) {
    const merged = createWasteBreakdown();
    breakdowns.forEach(breakdown => addWasteBreakdown(merged, breakdown));
    return merged;
}

function getExpectedBuildingSizeSquared() {
    const minSize = 35;
    const maxSize = 75;
    return (minSize * minSize + minSize * maxSize + maxSize * maxSize) / 3;
}

function getPopulationAreaFactor() {
    return getExpectedBuildingSizeSquared() * 0.02;
}

function getBuildingSizeRange(targetBuildings) {
    const densityFactor = clamp(Math.sqrt(60 / Math.max(targetBuildings || 60, 1)), 0.42, 1.15);
    return {
        min: 35 * densityFactor,
        max: 75 * densityFactor,
        spacing: 10 * densityFactor,
        roadBufferScale: 0.65 + 0.15 * densityFactor
    };
}

function calculateBuildingPopulation(type, config) {
    const areaFactor = getPopulationAreaFactor();
    const populationScale = config.populationScale || 1;
    const workerPopulationScale = config.workerPopulationScale || 1;
    const floatPopulationScale = config.floatPopulationScale || 1;
    const isResidential = type === BUILDING_TYPES.RESIDENTIAL;
    return {
        residentPop: Math.round(areaFactor * (isResidential ? (type.workerDensity || 0) : 0) * populationScale),
        workerPop: Math.round(areaFactor * (!isResidential ? (type.workerDensity || 0) : 0) * populationScale * workerPopulationScale),
        visitorPop: Math.round(areaFactor * (type.visitorDensity || 0) * populationScale * floatPopulationScale)
    };
}

function estimatePopulationForConfig(config) {
    const totalWeight = BUILDING_TYPE_KEYS.reduce((sum, key) => sum + (config.typeWeights[key] || 0), 0);
    const buildingCount = config.targetBuildings || 0;
    const populationScale = config.populationScale || 1;
    const workerPopulationScale = config.workerPopulationScale || 1;
    const floatPopulationScale = config.floatPopulationScale || 1;
    const expectedAreaFactor = getPopulationAreaFactor();

    if (totalWeight <= 0 || buildingCount <= 0) {
        return { residentPop: 0, workerPop: 0, visitorPop: 0, totalPop: 0 };
    }

    const density = BUILDING_TYPE_KEYS.reduce((acc, key) => {
        const type = BUILDING_TYPES[key];
        const share = (config.typeWeights[key] || 0) / totalWeight;
        if (type === BUILDING_TYPES.RESIDENTIAL) {
            acc.resident += share * (type.workerDensity || 0);
        } else {
            acc.worker += share * (type.workerDensity || 0);
        }
        acc.visitor += share * (type.visitorDensity || 0);
        return acc;
    }, { resident: 0, worker: 0, visitor: 0 });

    const residentPop = buildingCount * expectedAreaFactor * density.resident * populationScale;
    const workerPop = buildingCount * expectedAreaFactor * density.worker * populationScale * workerPopulationScale;
    const visitorPop = buildingCount * expectedAreaFactor * density.visitor * populationScale * floatPopulationScale;
    return {
        residentPop,
        workerPop,
        visitorPop,
        totalPop: residentPop + workerPop + visitorPop
    };
}

function estimateDailyWasteForConfig(config) {
    const totalWeight = BUILDING_TYPE_KEYS.reduce((sum, key) => sum + (config.typeWeights[key] || 0), 0);
    const buildingCount = config.targetBuildings || 0;
    if (totalWeight <= 0 || buildingCount <= 0) return 0;

    const baseConfig = { ...config, wasteScale: 1 };
    const expectedArea = getExpectedBuildingSizeSquared();

    const baseWaste = BUILDING_TYPE_KEYS.reduce((sum, key) => {
        const type = BUILDING_TYPES[key];
        const count = buildingCount * (config.typeWeights[key] || 0) / totalWeight;
        const population = calculateBuildingPopulation(type, baseConfig);
        const standingPopulation = population.residentPop + population.workerPop;
        const municipalWaste = standingPopulation * (type.workerWasteRate || 0) + population.visitorPop * (type.visitorWasteRate || 0);
        const specialWaste =
            standingPopulation * (type.specialWastePerWorker || 0) +
            population.visitorPop * (type.specialWastePerVisitor || 0) +
            expectedArea * (type.specialWasteAreaRate || 0);
        return sum + count * (municipalWaste + specialWaste);
    }, 0);

    return baseWaste * (config.wasteScale || 1);
}

// --- 서포트 클래스 ---

class Building {
    constructor(x, y, size, city) {
        this.x = x;
        this.y = y;
        this.w = size;
        this.h = size;
        this.waste = 0;
        this.city = city;
        this.showTypeIcon = false;
        
        const typeKey = BUILDING_TYPE_KEYS[Math.floor(Math.random() * BUILDING_TYPE_KEYS.length)];
        this.typeKey = typeKey;
        this.type = BUILDING_TYPES[typeKey];
        
        const pre = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
        const sufList = NAME_SUFFIXES[typeKey] || ['건물'];
        const suf = sufList[Math.floor(Math.random() * sufList.length)];
        this.name = `${pre} ${suf}`;
        
        const population = calculateBuildingPopulation(this.type, this.city.config);
        this.residentPopulation = population.residentPop;
        this.workerPopulation = population.workerPop;
        this.visitorPopulation = population.visitorPop;
        this.baseDailyWaste = this.estimateDailyWaste();
        this.capacity = this.baseDailyWaste * SIMULATION_BASELINE.collectionStorageDays;
        this.wasteBreakdown = createWasteBreakdown();
        this.lastStandingWaste = 0;
        this.lastVisitorWaste = 0;
        this.lastSpecialWaste = 0;
    }

    estimateMunicipalWaste() {
        const standingWaste = this.getStandingPopulation() * (this.type.workerWasteRate || 0);
        const visitorWaste = this.visitorPopulation * (this.type.visitorWasteRate || 0);
        return (standingWaste + visitorWaste) * this.city.config.wasteScale;
    }

    estimateSpecialWaste() {
        const workerWaste = this.getStandingPopulation() * (this.type.specialWastePerWorker || 0);
        const visitorWaste = this.visitorPopulation * (this.type.specialWastePerVisitor || 0);
        const areaWaste = this.w * this.h * (this.type.specialWasteAreaRate || 0);
        return (workerWaste + visitorWaste + areaWaste) * this.city.config.wasteScale;
    }

    getStandingPopulation() {
        return (this.residentPopulation || 0) + (this.workerPopulation || 0);
    }

    estimateDailyWaste() {
        return this.estimateMunicipalWaste() + this.estimateSpecialWaste();
    }

    randomize() {
        const baseWaste = this.estimateDailyWaste();
        const dailyFactor = clamp(
            1 + (Math.random() * 2 - 1) * this.type.volatility * 0.45,
            SIMULATION_BASELINE.minDailyFactor,
            SIMULATION_BASELINE.maxDailyFactor
        );

        const standingWaste = this.getStandingPopulation() * (this.type.workerWasteRate || 0) * this.city.config.wasteScale * dailyFactor;
        const visitorWaste = this.visitorPopulation * (this.type.visitorWasteRate || 0) * this.city.config.wasteScale * dailyFactor;
        const specialFactor = clamp(
            1 + (Math.random() * 2 - 1) * this.type.volatility * 0.75,
            SIMULATION_BASELINE.minDailyFactor,
            SIMULATION_BASELINE.maxDailyFactor
        );
        const specialWaste = this.estimateSpecialWaste() * specialFactor;

        this.baseDailyWaste = baseWaste;
        this.lastStandingWaste = standingWaste;
        this.lastVisitorWaste = visitorWaste;
        this.lastSpecialWaste = specialWaste;
        this.waste = standingWaste + visitorWaste + specialWaste;
        this.capacity = Math.max(baseWaste * SIMULATION_BASELINE.collectionStorageDays, this.waste * 1.1, 1);
        this.wasteBreakdown = mergeWasteBreakdowns(
            allocateWaste(standingWaste + visitorWaste, this.type.wasteShares || { mixedCombustible: 1 }),
            allocateWaste(specialWaste, this.type.specialWasteShares || {})
        );
        return this.waste;
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = COLORS.BUILDING_SHADOW;
        const typeColor = getBuildingTypeColor(this.typeKey, this.type);
        ctx.fillStyle = this.city.config.showTypes ? typeColor : COLORS.BUILDING_DEFAULT;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.w, this.h, 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (this.city.config.showTypes && this.showTypeIcon) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = `${clamp(this.w * 0.32, 9, 15)}px Segoe UI`;
            ctx.textAlign = 'center';
            ctx.fillText(this.type.icon, this.x + this.w / 2, this.y + this.h / 2 + 4);
        }

        if (this.waste > 0) {
            const fillPercent = this.waste / this.capacity;
            let color = '#00f2fe';
            if (fillPercent > 0.8) color = '#ff0844';
            else if (fillPercent > 0.5) color = '#f9d423';

            const dotRadius = clamp(this.w * 0.09, 2.8, 5);
            const dotX = this.x + dotRadius + 3;
            const dotY = this.y + this.h - dotRadius - 3;
            ctx.fillStyle = color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = color;
            ctx.beginPath();
            ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        ctx.restore();
    }
}

class Vehicle {
    constructor(path, roadWidth, reverse = false) {
        this.path = path;
        this.progress = 0;
        this.reverse = reverse;
        this.laneOffset = (this.reverse ? -1 : 1) * roadWidth * 0.24;
        this.speed = (0.0013 + Math.random() * 0.0022);
        this.color = COLORS.CAR_TYPES[Math.floor(Math.random() * COLORS.CAR_TYPES.length)];
        this.width = 16 + Math.random() * 6;
        this.height = this.width * 0.5;
        this.alive = true;
        this.updatePos();
    }
    updatePos() {
        const start = this.reverse ? { x: this.path.x2, y: this.path.y2 } : { x: this.path.x1, y: this.path.y1 };
        const end = this.reverse ? { x: this.path.x1, y: this.path.y1 } : { x: this.path.x2, y: this.path.y2 };
        const travelDx = end.x - start.x;
        const travelDy = end.y - start.y;
        const roadDx = this.path.x2 - this.path.x1;
        const roadDy = this.path.y2 - this.path.y1;
        const roadLen = Math.hypot(roadDx, roadDy) || 1;
        const nx = -roadDy / roadLen;
        const ny = roadDx / roadLen;

        this.x = start.x + travelDx * this.progress + nx * this.laneOffset;
        this.y = start.y + travelDy * this.progress + ny * this.laneOffset;
        this.angle = Math.atan2(travelDy, travelDx);
    }
    update() {
        this.progress += this.speed;
        if (this.progress >= 1) this.alive = false;
        this.updatePos();
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.roundRect(-this.width/2, -this.height/2, this.width, this.height, 3);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
        ctx.fillRect(this.width * 0.12, -this.height * 0.24, this.width * 0.22, this.height * 0.48);
        ctx.restore();
    }
}

// --- 핵심 시뮬레이션 엔진 ---

const ROAD_LAYOUT_FACTORIES = [
    (w, h) => [
        {x1: -50, y1: h * 0.2, x2: w + 50, y2: h * 0.8},
        {x1: w + 50, y1: h * 0.3, x2: -50, y2: h * 0.7},
        {x1: w * 0.5, y1: -50, x2: w * 0.5, y2: h + 50}
    ],
    (w, h) => [
        {x1: -50, y1: h * 0.5, x2: w + 50, y2: h * 0.5},
        {x1: w * 0.33, y1: -50, x2: w * 0.33, y2: h + 50},
        {x1: w * 0.66, y1: -50, x2: w * 0.66, y2: h + 50}
    ],
    (w, h) => [
        {x1: w*0.15, y1: h*0.2, x2: w*0.85, y2: h*0.2},
        {x1: w*0.85, y1: h*0.2, x2: w*0.85, y2: h*0.8},
        {x1: w*0.85, y1: h*0.8, x2: w*0.15, y2: h*0.8},
        {x1: w*0.15, y1: h*0.8, x2: w*0.15, y2: h*0.2}
    ],
    (w, h) => [
        {x1: -50, y1: h * 0.3, x2: w + 50, y2: h * 0.3},
        {x1: -50, y1: h * 0.7, x2: w + 50, y2: h * 0.7}
    ],
    (w, h) => [
        {x1: w * 0.5, y1: -50, x2: w * 0.5, y2: h + 50},
        {x1: -50, y1: h * 0.28, x2: w * 0.5, y2: h * 0.28},
        {x1: w * 0.5, y1: h * 0.48, x2: w + 50, y2: h * 0.48},
        {x1: -50, y1: h * 0.72, x2: w * 0.5, y2: h * 0.72}
    ],
    (w, h) => [
        {x1: -50, y1: h * 0.5, x2: w + 50, y2: h * 0.5},
        {x1: w * 0.5, y1: -50, x2: w * 0.5, y2: h + 50},
        {x1: -50, y1: -20, x2: w + 50, y2: h + 20},
        {x1: w + 50, y1: -20, x2: -50, y2: h + 20}
    ],
    (w, h) => [
        {x1: w * 0.12, y1: h * 0.18, x2: w * 0.88, y2: h * 0.18},
        {x1: w * 0.88, y1: h * 0.18, x2: w * 0.88, y2: h * 0.82},
        {x1: w * 0.88, y1: h * 0.82, x2: w * 0.12, y2: h * 0.82},
        {x1: w * 0.12, y1: h * 0.82, x2: w * 0.12, y2: h * 0.18},
        {x1: w * 0.12, y1: h * 0.5, x2: w * 0.88, y2: h * 0.5}
    ]
];

function createRoadPaths(layoutIndex, width, height) {
    const createPaths = ROAD_LAYOUT_FACTORIES[layoutIndex] || ROAD_LAYOUT_FACTORIES[0];
    return createPaths(width, height);
}

class CitySimulation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = this.container.querySelector('.simulation-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.totalWasteDisplay = this.container.querySelector('.total-waste');
        this.totalResidentPopDisplay = this.container.querySelector('.total-resident-pop');
        this.totalWorkerPopDisplay = this.container.querySelector('.total-worker-pop');
        this.totalVisitorPopDisplay = this.container.querySelector('.total-visitor-pop');
        this.totalBldDisplay = this.container.querySelector('.total-buildings');
        
        this.buildings = [];
        this.roadPaths = [];
        this.vehicles = [];
        this.totalCityWaste = 0;
        this.totalResidentPopulation = 0;
        this.totalWorkerPopulation = 0;
        this.totalVisitorPopulation = 0;
        this.isInitialized = false;
        
        this.config = {
            roadWidth: 46,
            targetBuildings: 60,
            populationScale: 0.5,
            workerPopulationScale: 1,
            floatPopulationScale: 1,
            trafficScale: 1,
            wasteScale: 1.0,
            showTypes: false,
            roadLayout: 0,
            preset: 'mixedCity',
            typeWeights: {
                ...RATIO_PRESETS.mixedCity
            }
        };
    }

    init() {
        if (this.isInitialized) return;
        this.resize();
        this.isInitialized = true;
        this.animate();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        const nextWidth = Math.round(rect.width);
        const nextHeight = Math.round(rect.height);
        if (this.canvas.width === nextWidth && this.canvas.height === nextHeight && this.buildings.length > 0) {
            return false;
        }

        this.canvas.width = nextWidth;
        this.canvas.height = nextHeight;
        this.createCity();
        return true;
    }

    createCity() {
        this.buildings = [];
        this.roadPaths = [];
        this.vehicles = [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 헤더 통계에 툴팁 추가
        this.totalResidentPopDisplay.parentElement.title = "계산식: 주거 시설 면적 × 거주 밀도 × 인구 기준 배율\n* 주민등록인구처럼 실제 거주자를 맞추는 값";
        this.totalWorkerPopDisplay.parentElement.title = "계산식: 비주거 시설 면적 × 종사자 밀도 × 인구 기준 배율 × 종사 인구 보정\n* 사업체 종사자/작업자 성격의 인구";
        this.totalVisitorPopDisplay.parentElement.title = "계산식: 건물 면적 × 방문 밀도 × 인구 기준 배율 × 유동 인구 보정\n* 방문자, 통행자, 이용자 성격의 인구";
        this.totalWasteDisplay.parentElement.title = "계산식: ∑((거주+종사 인구) × 1인 1일 생활폐기물 계수 + 유동 인구 × 방문 배출계수 + 건물 유형별 특수 폐기물)\n* 단위: kg/일, 2023년 전국 생활폐기물 1.2kg/일·인과 제6차 조성비 기준 보정";
        this.totalResidentPopDisplay.parentElement.style.cursor = 'help';
        this.totalWorkerPopDisplay.parentElement.style.cursor = 'help';
        this.totalVisitorPopDisplay.parentElement.style.cursor = 'help';
        this.totalWasteDisplay.parentElement.style.cursor = 'help';

        this.roadPaths = createRoadPaths(this.config.roadLayout || 0, w, h);

        let attempts = 0;
        const buildingTypePicker = new PrefixSumTable(BUILDING_TYPE_KEYS, key => this.config.typeWeights[key] || 0);
        const getWeightedType = () => buildingTypePicker.pick() || BUILDING_TYPE_KEYS[0];

        const sizeRange = getBuildingSizeRange(this.config.targetBuildings);
        const maxPlacementAttempts = Math.max(1500, this.config.targetBuildings * 80);
        while (this.buildings.length < this.config.targetBuildings && attempts < maxPlacementAttempts) {
            const size = sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min);
            const x = Math.random() * (w - size - 20) + 10;
            const y = Math.random() * (h - size - 20) + 10;
            const candidate = { x, y, size };

            const overlap = this.roadPaths.some(road => this.isTooCloseToRoad(candidate, road, sizeRange))
                || this.buildings.some(building => this.isTooCloseToBuilding(candidate, building, sizeRange));

            if (!overlap) {
                const b = new Building(x, y, size, this);
                const forcedType = getWeightedType();
                b.typeKey = forcedType;
                b.type = BUILDING_TYPES[forcedType];
                
                const pre = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
                const sufList = NAME_SUFFIXES[forcedType] || ['건물'];
                b.name = `${pre} ${sufList[Math.floor(Math.random() * sufList.length)]}`;
                const population = calculateBuildingPopulation(b.type, this.config);
                b.residentPopulation = population.residentPop;
                b.workerPopulation = population.workerPop;
                b.visitorPopulation = population.visitorPop;
                b.baseDailyWaste = b.estimateDailyWaste();
                b.capacity = b.baseDailyWaste * SIMULATION_BASELINE.collectionStorageDays;
                b.wasteBreakdown = createWasteBreakdown();
                b.lastStandingWaste = 0;
                b.lastVisitorWaste = 0;
                b.lastSpecialWaste = 0;
                
                this.buildings.push(b);
            }
            attempts++;
        }

        this.normalizePopulationToEstimate();
        this.assignTypeIconVisibility();
        
        this.totalResidentPopulation = this.buildings.reduce((sum, b) => sum + (b.residentPopulation || 0), 0);
        this.totalWorkerPopulation = this.buildings.reduce((sum, b) => sum + (b.workerPopulation || 0), 0);
        this.totalVisitorPopulation = this.buildings.reduce((sum, b) => sum + (b.visitorPopulation || 0), 0);
        this.totalResidentPopDisplay.innerText = this.totalResidentPopulation.toLocaleString();
        this.totalWorkerPopDisplay.innerText = this.totalWorkerPopulation.toLocaleString();
        this.totalVisitorPopDisplay.innerText = this.totalVisitorPopulation.toLocaleString();
        this.totalBldDisplay.innerText = this.buildings.length;

        this.updateStatsTooltips();
    }

    assignTypeIconVisibility() {
        this.buildings.forEach(building => {
            building.showTypeIcon = false;
        });

        const iconBudget = Math.round(this.buildings.length * TYPE_ICON_DISPLAY_RATIO);
        if (iconBudget === 0) return;

        const rankScore = building => {
            const dailyWaste = building.waste > 0 ? building.waste : building.baseDailyWaste;
            const totalPopulation = (building.residentPopulation || 0) + (building.workerPopulation || 0) + (building.visitorPopulation || 0);
            return { dailyWaste, totalPopulation, area: building.w * building.h };
        };
        const compareRank = (left, right) => {
            const leftScore = rankScore(left);
            const rightScore = rankScore(right);
            return rightScore.dailyWaste - leftScore.dailyWaste
                || rightScore.totalPopulation - leftScore.totalPopulation
                || rightScore.area - leftScore.area;
        };

        const rankedGroups = BUILDING_TYPE_KEYS
            .map(typeKey => this.buildings.filter(building => building.typeKey === typeKey).sort(compareRank))
            .filter(group => group.length > 0);
        const selectedBuildings = new Set();

        // 아이콘 예산이 허용하는 범위에서 각 건물 유형의 1위부터 우선 표시한다.
        [...rankedGroups]
            .sort((left, right) => right.length - left.length || compareRank(left[0], right[0]))
            .slice(0, iconBudget)
            .forEach(group => selectedBuildings.add(group[0]));

        // 남은 자리는 유형별 순위 백분율이 높은 건물부터 고르게 채운다.
        const remainingCandidates = rankedGroups.flatMap(group => (
            group.slice(1).map((building, index) => ({
                building,
                rankPercentile: (index + 2) / group.length
            }))
        ));
        remainingCandidates.sort((left, right) => (
            left.rankPercentile - right.rankPercentile || compareRank(left.building, right.building)
        ));

        for (const candidate of remainingCandidates) {
            if (selectedBuildings.size >= iconBudget) break;
            selectedBuildings.add(candidate.building);
        }

        selectedBuildings.forEach(building => {
            building.showTypeIcon = true;
        });
    }

    normalizePopulationToEstimate() {
        if (this.buildings.length === 0) return;

        const target = estimatePopulationForConfig(this.config);
        this.scaleBuildingPopulation('residentPopulation', target.residentPop * randomVariance());
        this.scaleBuildingPopulation('workerPopulation', target.workerPop * randomVariance());
        this.scaleBuildingPopulation('visitorPopulation', target.visitorPop * randomVariance());

        this.buildings.forEach(b => {
            b.baseDailyWaste = b.estimateDailyWaste();
            b.capacity = b.baseDailyWaste * SIMULATION_BASELINE.collectionStorageDays;
            b.wasteBreakdown = createWasteBreakdown();
            b.lastStandingWaste = 0;
            b.lastVisitorWaste = 0;
            b.lastSpecialWaste = 0;
        });
    }

    scaleBuildingPopulation(field, targetTotal) {
        const currentTotal = this.buildings.reduce((sum, b) => sum + (b[field] || 0), 0);
        if (currentTotal <= 0) return;

        const eligible = this.buildings.filter(b => (b[field] || 0) > 0);
        if (eligible.length === 0) return;

        let assigned = 0;
        this.buildings.forEach(b => {
            if (!eligible.includes(b)) {
                b[field] = 0;
            }
        });

        eligible.forEach((b, index) => {
            if (index === eligible.length - 1) {
                b[field] = Math.max(0, Math.round(targetTotal) - assigned);
                return;
            }

            b[field] = Math.max(0, Math.round((b[field] || 0) * targetTotal / currentTotal));
            assigned += b[field];
        });
    }

    updateStatsTooltips() {
        const stats = createHashTable(BUILDING_TYPE_KEYS, () => ({
            count: 0,
            residentPop: 0,
            workerPop: 0,
            visitorPop: 0,
            standingWaste: 0,
            visitorWaste: 0,
            specialWaste: 0,
            totalWaste: 0
        }));
        const cityWasteBreakdown = createWasteBreakdown();

        this.buildings.forEach(b => {
            const s = stats[b.typeKey];
            s.count++;
            s.residentPop += b.residentPopulation || 0;
            s.workerPop += b.workerPopulation || 0;
            s.visitorPop += b.visitorPopulation || 0;
            
            s.standingWaste += b.lastStandingWaste || 0;
            s.visitorWaste += b.lastVisitorWaste || 0;
            s.specialWaste += b.lastSpecialWaste || 0;
            s.totalWaste += b.waste;
            addWasteBreakdown(cityWasteBreakdown, b.wasteBreakdown);
        });
        const cityCategoryBreakdown = createWasteCategoryBreakdown(cityWasteBreakdown);

        const createTooltipHTML = (title, items) => {
            let html = `<div class="tooltip-title">${title}</div><div class="tooltip-info">`;
            items.forEach(item => {
                if (item.kind === 'section') {
                    html += `<div class="tooltip-section">${item.label}</div>`;
                    return;
                }
                html += `<div class="tooltip-row"><span class="tooltip-label">${item.label}</span><span class="tooltip-value">${item.value}</span></div>`;
            });
            html += `</div>`;
            return html;
        };

        const setupHeaderTooltip = (displayEl, getTitle, getItems) => {
            const box = displayEl.closest('.stat-box');
            if (!box) return;
            
            // 브라우저 기본 툴팁 제거 및 안정적인 타겟 설정
            box.title = "";
            box.style.cursor = 'help';
            
            box.onmouseenter = () => {
                const items = getItems();
                if (items.length === 0) return;
                tooltip.style.display = 'block';
                tooltip.innerHTML = createTooltipHTML(getTitle(), items);
                tooltip.scrollTop = 0;
            };
            box.onmousemove = (e) => {
                positionTooltip(e);
            };
            box.onmouseleave = () => {
                hideTooltip();
            };
        };

        // 건물 수 툴팁
        setupHeaderTooltip(this.totalBldDisplay, () => "🏙️ 건물 유형별 통계", () => {
            return BUILDING_TYPE_KEYS
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${stats[k].count}동`,
                    show: stats[k].count > 0
                }))
                .filter(i => i.show);
        });

        // 거주 인구 툴팁
        setupHeaderTooltip(this.totalResidentPopDisplay, () => "🏠 거주 인구 상세", () => {
            return BUILDING_TYPE_KEYS
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${stats[k].residentPop.toLocaleString()}명`,
                    show: stats[k].residentPop > 0
                }))
                .filter(i => i.show);
        });

        // 종사 인구 툴팁
        setupHeaderTooltip(this.totalWorkerPopDisplay, () => "🏢 종사 인구 상세", () => {
            return BUILDING_TYPE_KEYS
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${stats[k].workerPop.toLocaleString()}명 (${formatKg(stats[k].standingWaste)}kg/일)`,
                    show: stats[k].workerPop > 0 || stats[k].standingWaste > 0
                }))
                .filter(i => i.show);
        });

        // 유동 인구 툴팁
        setupHeaderTooltip(this.totalVisitorPopDisplay, () => "🏃 유동 인구 상세", () => {
            return BUILDING_TYPE_KEYS
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${stats[k].visitorPop.toLocaleString()}명 (${formatKg(stats[k].visitorWaste)}kg/일)`,
                    show: stats[k].visitorPop > 0 || stats[k].visitorWaste > 0
                }))
                .filter(i => i.show);
        });

        // 폐기물 툴팁
        setupHeaderTooltip(this.totalWasteDisplay, () => "♻️ 1일 폐기물 배출량 상세", () => {
            const categoryItems = WASTE_CATEGORY_KEYS
                .map(k => ({
                    label: WASTE_CATEGORIES[k],
                    value: `${formatKg(cityCategoryBreakdown[k])}kg/일`,
                    show: cityCategoryBreakdown[k] > 0
                }))
                .filter(i => i.show);

            const materialItems = WASTE_STREAM_KEYS
                .map(k => ({
                    label: WASTE_STREAMS[k].label,
                    value: `${formatKg(cityWasteBreakdown[k])}kg/일`,
                    show: cityWasteBreakdown[k] > 0
                }))
                .filter(i => i.show);

            const typeItems = BUILDING_TYPE_KEYS
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${formatKg(stats[k].totalWaste)}kg/일`,
                    show: stats[k].totalWaste > 0
                }))
                .filter(i => i.show);

            return [
                ...(categoryItems.length ? [{ kind: 'section', label: '배출 카테고리' }, ...categoryItems] : []),
                ...(materialItems.length ? [{ kind: 'section', label: '세부 폐기물' }, ...materialItems] : []),
                ...(typeItems.length ? [{ kind: 'section', label: '건물 유형별' }, ...typeItems] : [])
            ];
        });
    }

    isTooCloseToRoad(candidate, road, sizeRange) {
        const center = {
            x: candidate.x + candidate.size / 2,
            y: candidate.y + candidate.size / 2
        };
        const roadStart = { x: road.x1, y: road.y1 };
        const roadEnd = { x: road.x2, y: road.y2 };
        const limit = this.config.roadWidth / 2 + candidate.size * sizeRange.roadBufferScale;
        return this.distToSegment(center, roadStart, roadEnd) < limit;
    }

    isTooCloseToBuilding(candidate, building, sizeRange) {
        const dx = (building.x + building.w / 2) - (candidate.x + candidate.size / 2);
        const dy = (building.y + building.h / 2) - (candidate.y + candidate.size / 2);
        const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        return dist < (building.w / 2 + candidate.size / 2 + sizeRange.spacing);
    }

    distToSegment(p, v, w) {
        const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
        if (l2 === 0) return Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2));
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.sqrt(Math.pow(p.x - (v.x + t * (w.x - v.x)), 2) + Math.pow(p.y - (v.y + t * (w.y - v.y)), 2));
    }

    generateWaste() {
        this.totalCityWaste = 0;
        this.buildings.forEach(b => this.totalCityWaste += b.randomize());
        this.assignTypeIconVisibility();
        this.totalWasteDisplay.innerText = formatKg(this.totalCityWaste);
        this.updateStatsTooltips();
    }

    drawRoadLayer(path, style, width, dash = []) {
        const ctx = this.ctx;
        ctx.strokeStyle = style;
        ctx.lineWidth = width;
        ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.moveTo(path.x1, path.y1);
        ctx.lineTo(path.x2, path.y2);
        ctx.stroke();
    }

    drawRoadNetwork() {
        const ctx = this.ctx;
        ctx.save();
        ctx.lineCap = 'round';

        this.roadPaths.forEach(path => this.drawRoadLayer(path, COLORS.ROAD_EDGE, this.config.roadWidth + 6));
        this.roadPaths.forEach(path => this.drawRoadLayer(path, COLORS.ROAD, this.config.roadWidth));
        this.roadPaths.forEach(path => this.drawRoadLayer(path, COLORS.ROAD_LANE, 2, [18, 14]));

        ctx.restore();
    }

    getTrafficPopulation(population = null) {
        const resident = population?.residentPop ?? this.totalResidentPopulation;
        const worker = population?.workerPop ?? this.totalWorkerPopulation;
        const visitor = population?.visitorPop ?? this.totalVisitorPopulation;
        return resident * 0.12 + worker * 0.55 + visitor * 0.28;
    }

    getTargetVehicleCount(population = null) {
        const scaledTraffic = Math.sqrt(Math.max(this.getTrafficPopulation(population), 0)) * (this.config.trafficScale ?? 1);
        if ((this.config.trafficScale ?? 1) <= 0) return 0;
        return Math.round(clamp(scaledTraffic / 14, 2, 70));
    }

    getVehicleSpawnChance() {
        const target = this.getTargetVehicleCount();
        return clamp(0.012 + target / 900, 0.015, 0.09);
    }

    spawnVehiclePair(path, targetVehicles) {
        const canSpawnPair = this.vehicles.length <= targetVehicles - 2;
        if (canSpawnPair) {
            this.vehicles.push(new Vehicle(path, this.config.roadWidth, false));
            this.vehicles.push(new Vehicle(path, this.config.roadWidth, true));
            return;
        }

        const reverseCount = this.vehicles.filter(v => v.reverse).length;
        const forwardCount = this.vehicles.length - reverseCount;
        this.vehicles.push(new Vehicle(path, this.config.roadWidth, reverseCount < forwardCount));
    }

    animate() {
        this.ctx.fillStyle = COLORS.BG;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawRoadNetwork();

        this.buildings.forEach(b => b.draw(this.ctx));

        const targetVehicles = this.getTargetVehicleCount();
        if (this.roadPaths.length > 0 && this.vehicles.length < targetVehicles && Math.random() < this.getVehicleSpawnChance()) {
            const path = this.roadPaths[Math.floor(Math.random() * this.roadPaths.length)];
            this.spawnVehiclePair(path, targetVehicles);
        }
        this.vehicles = this.vehicles.filter(v => v.alive);
        this.vehicles.forEach(v => { v.update(); v.draw(this.ctx); });

        requestAnimationFrame(() => this.animate());
    }
}

// --- 전역 초기화 및 UI 로직 ---

const cityLeft = new CitySimulation('city-left');
const cityRight = new CitySimulation('city-right');
let activeCity = null;
let simulationMode = null;
let entrySelectedMode = 'comparison';

// Ensure initialization happens after DOM load
window.onload = () => {
    const usedStartupLayouts = [];
    const usedStartupPresets = [];
    applyTheme('dark');
    applyRandomStartupConfig(cityLeft, usedStartupLayouts, usedStartupPresets);
    applyRandomStartupConfig(cityRight, usedStartupLayouts, usedStartupPresets);
    setDailyWasteGenerated(false);
    syncTypeToggleButtons();
    openModeSelection();
};

const tooltip = document.getElementById('tooltip');
const modal = document.getElementById('settings-modal');
const closeBtn = document.querySelector('.close-btn');
const downloadModal = document.getElementById('download-modal');
const downloadForm = document.getElementById('download-form');
const downloadButton = document.getElementById('btn-download-stats');
const downloadCloseButton = document.getElementById('btn-close-download');
const downloadCancelButton = document.getElementById('btn-cancel-download');
const ratioControls = document.getElementById('ratio-controls');
const buildingCountRange = document.getElementById('building-count');
const buildingCountNumber = document.getElementById('building-count-number');
const populationScaleRange = document.getElementById('population-scale');
const populationScaleNumber = document.getElementById('population-scale-number');
const estimateResidentPop = document.getElementById('estimate-resident-pop');
const estimateWorkerPop = document.getElementById('estimate-worker-pop');
const estimateVisitorPop = document.getElementById('estimate-visitor-pop');
const estimateTotalPop = document.getElementById('estimate-total-pop');
const targetResidentPopInput = document.getElementById('target-resident-pop');
const targetWorkerPopInput = document.getElementById('target-worker-pop');
const targetVisitorPopInput = document.getElementById('target-visitor-pop');
const targetWasteTonInput = document.getElementById('target-waste-ton');
const cityFitResult = document.getElementById('city-fit-result');
const trafficScaleRange = document.getElementById('traffic-scale');
const trafficScaleLabel = document.getElementById('traffic-scale-label');
const trafficEstimate = document.getElementById('traffic-estimate');
const wasteScaleRange = document.getElementById('waste-scale');
const wasteScaleLabel = document.getElementById('waste-scale-label');
const wasteScaleStatus = document.getElementById('waste-scale-status');
const wasteScaleTitle = document.getElementById('waste-scale-title');
const wasteScaleDesc = document.getElementById('waste-scale-desc');
const generateAction = document.getElementById('generate-action');
const generateAllButton = document.getElementById('btn-generate-all');
const themeToggleButton = document.getElementById('btn-theme-toggle');
const typeToggleButtons = document.querySelectorAll('.btn-toggle-types');
const typeVisibilityGuide = document.getElementById('type-visibility-guide');
const typeVisibilityGuideCloseButton = document.getElementById('btn-close-type-guide');
const randomRatioButtons = document.querySelectorAll('.btn-random-ratio');
const modeSelection = document.getElementById('mode-selection');
const modeSelectionButtons = document.querySelectorAll('[data-select-mode]');
const modeContinueButton = document.getElementById('btn-mode-continue');
const modeContinueLabel = document.querySelector('[data-mode-continue-label]');
const modeSelectButton = document.getElementById('btn-mode-select');
let currentTheme = 'dark';
let typeGuideDismissed = false;
let downloadModalReturnFocus = null;

function getCityByKey(key) {
    return key === 'left' ? cityLeft : cityRight;
}

function getActiveCities() {
    return simulationMode === 'single' ? [cityLeft] : [cityLeft, cityRight];
}

function getCityLabel(city) {
    if (simulationMode === 'single') return '도시';
    return city === cityLeft ? '도시 A' : '도시 B';
}

function syncModeUI() {
    cityLeft.container.querySelector('.city-label').innerText = simulationMode === 'single' ? '도시' : '도시 A';
    cityRight.container.querySelector('.city-label').innerText = '도시 B';
    document.title = simulationMode === 'single'
        ? '도시 폐기물 시뮬레이션'
        : '도시 폐기물 비교 시뮬레이션';
    syncTypeToggleButtons();
}

function updateModeSelectionUI() {
    modeSelectionButtons.forEach(button => {
        const isSelected = button.dataset.selectMode === entrySelectedMode;
        button.classList.toggle('is-selected', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
    });

    modeContinueLabel.innerText = '시뮬레이션 시작';
}

function openModeSelection() {
    modal.style.display = 'none';
    closeDownloadModal();
    hideTooltip();
    entrySelectedMode = simulationMode || entrySelectedMode || 'comparison';
    updateModeSelectionUI();
    document.body.classList.add('awaiting-mode');
    modeSelection.hidden = false;
    modeSelection.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => modeSelection.focus({ preventScroll: true }));
}

function selectSimulationMode(mode) {
    if (mode !== 'single' && mode !== 'comparison') return;

    const previousMode = simulationMode;
    const modeChanged = Boolean(previousMode && previousMode !== mode);
    simulationMode = mode;
    if (modeChanged) {
        [cityLeft, cityRight].forEach(city => resetCityWaste(city));
    }
    document.body.dataset.cityMode = mode;
    document.body.classList.remove('awaiting-mode');
    modeSelection.hidden = true;
    modeSelection.setAttribute('aria-hidden', 'true');
    syncModeUI();

    window.requestAnimationFrame(() => {
        getActiveCities().forEach(city => {
            if (!city.isInitialized) {
                city.init();
            } else if (modeChanged) {
                city.resize();
            }
        });
        setDailyWasteGenerated(getActiveCities().every(city => city.totalCityWaste > 0));
        updateComparisonBar();
        generateAllButton.focus();
    });
}

function applyTheme(theme) {
    currentTheme = theme;
    Object.assign(COLORS, THEME_COLORS[theme]);
    document.body.classList.toggle('light-mode', theme === 'light');
    themeToggleButton.innerText = theme === 'light' ? '다크' : '화이트';
    themeToggleButton.setAttribute('aria-pressed', String(theme === 'light'));
}

function syncTypeToggleButtons() {
    typeToggleButtons.forEach(button => {
        const city = getCityByKey(button.dataset.city);
        const label = simulationMode === 'single' ? '' : (button.dataset.city === 'left' ? 'A ' : 'B ');
        button.classList.toggle('is-active', city.config.showTypes);
        button.setAttribute('aria-pressed', String(city.config.showTypes));
        button.innerText = city.config.showTypes ? `${label}숨김` : `${label}유형`;
    });
}

function setCityShowTypes(city, showTypes) {
    city.config.showTypes = showTypes;
    if (activeCity === city) {
        document.getElementById('show-types').checked = showTypes;
    }
    syncTypeToggleButtons();
    if (getActiveCities().every(active => active.config.showTypes)) {
        hideTypeVisibilityGuide();
    } else if (getActiveCities().every(active => active.totalCityWaste > 0)) {
        showTypeVisibilityGuideIfNeeded();
    }
}

function hideTypeVisibilityGuide() {
    typeVisibilityGuide.hidden = true;
}

function showTypeVisibilityGuideIfNeeded() {
    const hasHiddenTypes = getActiveCities().some(city => !city.config.showTypes);
    if (!typeGuideDismissed && hasHiddenTypes) {
        typeVisibilityGuide.hidden = false;
    }
}

function resetCityWaste(city) {
    city.totalCityWaste = 0;
    city.totalWasteDisplay.innerText = '0';
    city.buildings.forEach(building => {
        building.waste = 0;
        building.lastStandingWaste = 0;
        building.lastVisitorWaste = 0;
        building.lastSpecialWaste = 0;
        building.wasteBreakdown = createWasteBreakdown();
    });
    city.updateStatsTooltips();
    setDailyWasteGenerated(false);
}

function setDailyWasteGenerated(isGenerated) {
    generateAction.classList.toggle('needs-generation', !isGenerated);
    if (isGenerated) {
        generateAllButton.removeAttribute('aria-describedby');
    } else {
        generateAllButton.setAttribute('aria-describedby', 'generate-hint');
        hideTypeVisibilityGuide();
    }
}

function randomizeCityConfig(city) {
    applyRandomStartupConfig(city);
    city.createCity();
    resetCityWaste(city);

    if (activeCity === city) {
        presetSelect.value = 'custom';
        roadLayoutSelect.value = city.config.roadLayout || 0;
        buildingCountRange.value = city.config.targetBuildings;
        buildingCountNumber.value = city.config.targetBuildings;
        updateScaleControlsFromConfig();
        updateRatioUI();
        updatePopulationEstimateUI();
        cityFitResult.innerText = '도로, 건물 수, 인구 배율, 자동차 비율, 건물 유형 비율을 새로 섞었습니다.';
    }

    updateComparisonBar();
}

function positionTooltip(e) {
    const margin = 12;
    const offset = 16;
    const rect = tooltip.getBoundingClientRect();
    let left = e.clientX + offset;
    let top = e.clientY + offset;

    if (left + rect.width + margin > window.innerWidth) {
        left = e.clientX - rect.width - offset;
    }
    if (top + rect.height + margin > window.innerHeight) {
        top = window.innerHeight - rect.height - margin;
    }

    tooltip.style.left = `${Math.max(margin, left)}px`;
    tooltip.style.top = `${Math.max(margin, top)}px`;
}

// 전역 컨트롤
generateAllButton.onclick = () => {
    getActiveCities().forEach(city => city.generateWaste());
    setDailyWasteGenerated(true);
    updateComparisonBar();
    showTypeVisibilityGuideIfNeeded();
};

typeVisibilityGuideCloseButton.onclick = () => {
    typeGuideDismissed = true;
    hideTypeVisibilityGuide();
};

themeToggleButton.onclick = () => {
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
};

modeSelectionButtons.forEach(button => {
    button.onclick = () => {
        entrySelectedMode = button.dataset.selectMode;
        updateModeSelectionUI();
    };
});

modeContinueButton.onclick = () => selectSimulationMode(entrySelectedMode);
modeSelectButton.onclick = openModeSelection;

typeToggleButtons.forEach(button => {
    button.onclick = (e) => {
        const city = getCityByKey(e.currentTarget.dataset.city);
        setCityShowTypes(city, !city.config.showTypes);
    };
});

randomRatioButtons.forEach(button => {
    button.onclick = (e) => {
        const city = getCityByKey(e.currentTarget.dataset.city);
        randomizeCityConfig(city);
    };
});

function updateComparisonBar() {
    if (simulationMode !== 'comparison') return;

    const total = cityLeft.totalCityWaste + cityRight.totalCityWaste;
    const barLeft = document.getElementById('bar-left');
    const barRight = document.getElementById('bar-right');
    
    if (total === 0) {
        barLeft.style.width = '50%';
        barLeft.innerText = '도시 A (0%)';
        barRight.style.width = '50%';
        barRight.innerText = '도시 B (0%)';
        return;
    }

    const pctLeft = (cityLeft.totalCityWaste / total) * 100;
    const pctRight = (cityRight.totalCityWaste / total) * 100;

    barLeft.style.width = `${pctLeft}%`;
    barLeft.innerText = `도시 A (${pctLeft.toFixed(1)}%)`;
    
    barRight.style.width = `${pctRight}%`;
    barRight.innerText = `도시 B (${pctRight.toFixed(1)}%)`;
}

// 설정 모달 핸들러
const roadLayoutSelect = document.getElementById('road-layout');
const presetSelect = document.getElementById('ratio-preset');

function syncBuildingCountControls(value) {
    const min = parseInt(buildingCountRange.min, 10);
    const max = parseInt(buildingCountRange.max, 10);
    const count = clamp(parseInt(value, 10) || min, min, max);
    activeCity.config.targetBuildings = count;
    buildingCountRange.value = count;
    buildingCountNumber.value = count;
    updatePopulationEstimateUI();
}

function syncPopulationScaleControls(value) {
    const min = parseFloat(populationScaleRange.min);
    const max = parseFloat(populationScaleRange.max);
    const scale = clamp(parseFloat(value) || min, min, max);
    activeCity.config.populationScale = scale;
    populationScaleRange.value = scale;
    populationScaleNumber.value = scale;
    updatePopulationEstimateUI();
}

function updatePopulationEstimateUI() {
    if (!activeCity) return;
    const estimate = estimatePopulationForConfig(activeCity.config);
    estimateResidentPop.innerText = `${formatPeople(estimate.residentPop)}명`;
    estimateWorkerPop.innerText = `${formatPeople(estimate.workerPop)}명`;
    estimateVisitorPop.innerText = `${formatPeople(estimate.visitorPop)}명`;
    estimateTotalPop.innerText = `${formatPeople(estimate.totalPop)}명`;
    updateTrafficEstimateUI();
}

function updateScaleControlsFromConfig() {
    populationScaleRange.value = activeCity.config.populationScale;
    populationScaleNumber.value = activeCity.config.populationScale;
    wasteScaleRange.value = activeCity.config.wasteScale * 100;
    trafficScaleRange.value = Math.round((activeCity.config.trafficScale || 1) * 100);
    updateWasteScaleUI();
    updateTrafficEstimateUI();
}

function getWasteScaleProfile(scale) {
    const percent = Math.round(scale * 100);
    const diff = Math.abs(percent - 100);

    if (percent < 85) {
        return {
            key: 'saving',
            label: `절약형 ${percent}%`,
            title: '절약하는 도시',
            desc: `대한민국 평균보다 약 ${diff}% 적게 배출합니다. 감량, 재사용, 분리배출이 잘 되는 도시로 가정합니다.`
        };
    }

    if (percent > 115) {
        return {
            key: 'wasteful',
            label: `막배출형 ${percent}%`,
            title: '막폐기하는 도시',
            desc: `대한민국 평균보다 약 ${diff}% 많이 배출합니다. 일회용품 사용과 혼합배출이 많은 도시로 가정합니다.`
        };
    }

    return {
        key: 'normal',
        label: `대한민국 평균 ${percent}%`,
        title: '보통 도시',
        desc: '대한민국 생활폐기물 평균 배출계수를 그대로 적용합니다. 슬라이더 중앙값 100%가 기준입니다.'
    };
}

function updateWasteScaleUI() {
    if (!activeCity) return;
    const profile = getWasteScaleProfile(activeCity.config.wasteScale || 1);
    wasteScaleLabel.innerText = profile.label;
    wasteScaleTitle.innerText = profile.title;
    wasteScaleDesc.innerText = profile.desc;
    wasteScaleStatus.className = `waste-scale-status ${profile.key}`;
}

function updateTrafficEstimateUI() {
    if (!activeCity) return;
    const estimate = estimatePopulationForConfig(activeCity.config);
    trafficScaleLabel.innerText = `${Math.round((activeCity.config.trafficScale ?? 1) * 100)}%`;
    trafficEstimate.innerText = `예상 인구 기준 자동차 수: 약 ${activeCity.getTargetVehicleCount(estimate)}대`;
}

function applyCityDataToConfig() {
    if (!activeCity) return;

    const targetResidentPop = parseFloat(targetResidentPopInput.value);
    const targetWorkerPop = parseFloat(targetWorkerPopInput.value);
    const targetVisitorPop = parseFloat(targetVisitorPopInput.value);
    const targetWasteKg = parseFloat(targetWasteTonInput.value) * 1000;
    const messages = [];

    if (targetResidentPop > 0) {
        const baseEstimate = estimatePopulationForConfig({
            ...activeCity.config,
            populationScale: 1,
            workerPopulationScale: activeCity.config.workerPopulationScale || 1,
            floatPopulationScale: activeCity.config.floatPopulationScale || 1
        });
        if (baseEstimate.residentPop > 0) {
            const nextScale = clamp(targetResidentPop / baseEstimate.residentPop, parseFloat(populationScaleRange.min), parseFloat(populationScaleRange.max));
            activeCity.config.populationScale = Number(nextScale.toFixed(1));
            messages.push(`인구 기준 배율 ${activeCity.config.populationScale}배`);
        }
    }

    if (targetWorkerPop > 0) {
        const baseWorkerEstimate = estimatePopulationForConfig({
            ...activeCity.config,
            workerPopulationScale: 1
        });
        if (baseWorkerEstimate.workerPop > 0) {
            activeCity.config.workerPopulationScale = clamp(targetWorkerPop / baseWorkerEstimate.workerPop, 0.05, 20);
            messages.push(`종사 인구 보정 ${activeCity.config.workerPopulationScale.toFixed(2)}배`);
        }
    }

    if (targetVisitorPop > 0) {
        const baseVisitorEstimate = estimatePopulationForConfig({
            ...activeCity.config,
            floatPopulationScale: 1
        });
        if (baseVisitorEstimate.visitorPop > 0) {
            activeCity.config.floatPopulationScale = clamp(targetVisitorPop / baseVisitorEstimate.visitorPop, 0.05, 20);
            messages.push(`유동 인구 보정 ${activeCity.config.floatPopulationScale.toFixed(2)}배`);
        }
    }

    if (targetWasteKg > 0) {
        const baseWaste = estimateDailyWasteForConfig({ ...activeCity.config, wasteScale: 1 });
        if (baseWaste > 0) {
            const nextWasteScale = clamp(targetWasteKg / baseWaste, 0.01, 2);
            activeCity.config.wasteScale = Number(nextWasteScale.toFixed(3));
            messages.push(`폐기물 발생 배율 ${Math.round(activeCity.config.wasteScale * 100)}%`);
        }
    }

    updateScaleControlsFromConfig();
    updatePopulationEstimateUI();
    const estimate = estimatePopulationForConfig(activeCity.config);
    const wasteTon = estimateDailyWasteForConfig(activeCity.config) / 1000;
    cityFitResult.innerText = messages.length
        ? `${messages.join(', ')} 적용. 예상 거주 ${formatPeople(estimate.residentPop)}명, 종사 ${formatPeople(estimate.workerPop)}명, 유동 ${formatPeople(estimate.visitorPop)}명, 폐기물 ${wasteTon.toFixed(1)}톤/일.`
        : '목표 거주 인구, 종사 인구, 유동 인구 또는 폐기물 톤/일 중 하나 이상을 입력하세요.';
}

document.querySelectorAll('.btn-settings').forEach(btn => {
    btn.onclick = (e) => {
        const target = e.currentTarget.dataset.city;
        activeCity = (target === 'left') ? cityLeft : cityRight;
        
        document.getElementById('modal-title').innerText = `${getCityLabel(activeCity)} 설정`;
        document.getElementById('show-types').checked = activeCity.config.showTypes;
        buildingCountRange.value = activeCity.config.targetBuildings;
        buildingCountNumber.value = activeCity.config.targetBuildings;
        updateScaleControlsFromConfig();
        cityFitResult.innerText = '거주 인구만 넣어도 인구 기준 배율을 자동 계산합니다.';
        
        roadLayoutSelect.value = activeCity.config.roadLayout || 0;
        presetSelect.value = activeCity.config.preset || 'custom';
        
        syncTypeToggleButtons();
        updateRatioUI();
        updatePopulationEstimateUI();
        modal.style.display = 'block';
    };
});

closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
    if (e.target === downloadModal) closeDownloadModal();
};

// 설정 변경 적용
document.getElementById('show-types').onchange = (e) => setCityShowTypes(activeCity, e.target.checked);
document.getElementById('btn-apply-city-data').onclick = applyCityDataToConfig;
buildingCountRange.oninput = (e) => syncBuildingCountControls(e.target.value);
buildingCountNumber.onchange = (e) => syncBuildingCountControls(e.target.value);
populationScaleRange.oninput = (e) => syncPopulationScaleControls(e.target.value);
populationScaleNumber.onchange = (e) => syncPopulationScaleControls(e.target.value);
trafficScaleRange.oninput = (e) => {
    activeCity.config.trafficScale = parseInt(e.target.value, 10) / 100;
    updateTrafficEstimateUI();
};
wasteScaleRange.oninput = (e) => {
    activeCity.config.wasteScale = e.target.value / 100;
    updateWasteScaleUI();
    if (cityFitResult) {
        const wasteTon = estimateDailyWasteForConfig(activeCity.config) / 1000;
        const profile = getWasteScaleProfile(activeCity.config.wasteScale);
        cityFitResult.innerText = `${profile.title} 기준으로 예상 폐기물은 약 ${wasteTon.toFixed(1)}톤/일입니다.`;
    }
};

roadLayoutSelect.onchange = (e) => activeCity.config.roadLayout = parseInt(e.target.value);
presetSelect.onchange = (e) => {
    const val = e.target.value;
    activeCity.config.preset = val;
    if (val !== 'custom') {
        activeCity.config.typeWeights = { ...RATIO_PRESETS[val] };
        updateRatioUI();
        updatePopulationEstimateUI();
    }
};

// 가중치 컨트롤 동적 생성
function updateRatioUI() {
    ratioControls.innerHTML = '';
    BUILDING_TYPE_KEYS.forEach(key => {
        const type = BUILDING_TYPES[key];
        const item = document.createElement('div');
        item.className = 'ratio-item';
        
        const statsInfo = `[${type.label} 통계]\n` +
            `• 거주/종사 인구 밀도: ${type.workerDensity}\n` +
            `• 유동 인구 밀도: ${type.visitorDensity}\n` +
            `• 현재 인구 기준 배율: ${activeCity.config.populationScale || 1}배\n` +
            `• 거주/종사 1인 1일 배출계수: ${type.workerWasteRate}kg/일\n` +
            `• 방문 1인 배출계수: ${type.visitorWasteRate}kg/일\n` +
            `• 특수 폐기물: ${type.specialWasteShares ? '건물 유형별 별도 발생분 적용' : '없음'}`;

        item.innerHTML = `
            <label title="${statsInfo}" style="cursor: help;">${type.icon} ${type.label} ⓘ</label>
            <input type="range" min="0" max="100" value="${activeCity.config.typeWeights[key]}" data-type="${key}">
        `;
        item.querySelector('input').oninput = (e) => {
            activeCity.config.typeWeights[key] = parseInt(e.target.value);
            activeCity.config.preset = 'custom';
            presetSelect.value = 'custom';
            updatePopulationEstimateUI();
        };
        ratioControls.appendChild(item);
    });
}

document.getElementById('btn-reset-city').onclick = () => {
    activeCity.createCity();
    activeCity.totalCityWaste = 0;
    activeCity.totalWasteDisplay.innerText = '0';
    setDailyWasteGenerated(false);
    updateComparisonBar();
    modal.style.display = 'none';
};

function openDownloadModal() {
    downloadModalReturnFocus = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : downloadButton;
    downloadModal.style.display = 'block';
    downloadModal.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => downloadModal.querySelector('input:checked')?.focus());
}

function closeDownloadModal() {
    if (!downloadModal) return;
    const wasOpen = downloadModal.style.display === 'block';
    downloadModal.style.display = 'none';
    downloadModal.setAttribute('aria-hidden', 'true');
    if (wasOpen) {
        const returnFocus = downloadModalReturnFocus;
        downloadModalReturnFocus = null;
        window.requestAnimationFrame(() => returnFocus?.focus());
    }
}

function trapDownloadModalFocus(event) {
    const focusableElements = [...downloadModal.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )].filter(element => element.getClientRects().length > 0);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && (activeElement === firstElement || !downloadModal.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && (activeElement === lastElement || !downloadModal.contains(activeElement))) {
        event.preventDefault();
        firstElement.focus();
    }
}

function getBuildingTotalPopulation(building) {
    return (building.residentPopulation || 0)
        + (building.workerPopulation || 0)
        + (building.visitorPopulation || 0);
}

function getSortedExportRows(sortKey) {
    const typeOrder = new Map(BUILDING_TYPE_KEYS.map((key, index) => [key, index]));
    const rows = getActiveCities().flatMap((city, cityIndex) => (
        city.buildings.map((building, buildingIndex) => ({
            city,
            cityIndex,
            cityLabel: getCityLabel(city),
            building,
            buildingIndex
        }))
    ));
    const compareCity = (left, right) => left.cityIndex - right.cityIndex;
    const compareWaste = (left, right) => (right.building.waste || 0) - (left.building.waste || 0);
    const comparePopulation = (left, right) => getBuildingTotalPopulation(right.building) - getBuildingTotalPopulation(left.building);
    const compareName = (left, right) => left.building.name.localeCompare(right.building.name, 'ko');
    const compareOriginalIndex = (left, right) => left.buildingIndex - right.buildingIndex;

    const sortComparators = {
        type: (left, right) => compareCity(left, right)
            || (typeOrder.get(left.building.typeKey) ?? Number.MAX_SAFE_INTEGER) - (typeOrder.get(right.building.typeKey) ?? Number.MAX_SAFE_INTEGER)
            || compareWaste(left, right)
            || comparePopulation(left, right)
            || compareName(left, right),
        waste: (left, right) => compareCity(left, right)
            || compareWaste(left, right)
            || comparePopulation(left, right)
            || compareName(left, right),
        population: (left, right) => compareCity(left, right)
            || comparePopulation(left, right)
            || compareWaste(left, right)
            || compareName(left, right),
        name: (left, right) => compareCity(left, right)
            || compareName(left, right)
            || compareOriginalIndex(left, right)
    };

    return rows.sort(sortComparators[sortKey] || sortComparators.type);
}

function downloadStatistics(sortKey) {
    const csvRows = [];
    const categoryKeys = WASTE_CATEGORY_KEYS;
    const materialKeys = WASTE_STREAM_KEYS;
    const csvHeaders = [
        "도시", "ID", "이름", "유형", "인구기준배율", "종사인구보정", "유동인구보정",
        "거주인구(명)", "종사인구(명)", "유동인구(명)",
        "거주/종사계수(kg/일·인)", "유동계수(kg/일·인)", "특수폐기물(kg/일)", "총폐기물(kg/일)",
        ...categoryKeys.map(key => `${WASTE_CATEGORIES[key]}(kg/일)`),
        ...materialKeys.map(key => `${WASTE_STREAMS[key].label}(kg/일)`),
        "임시보관용량(kg)"
    ];
    csvRows.push(csvHeaders);

    const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
    getSortedExportRows(sortKey).forEach(({ city, cityLabel, building: b, buildingIndex }) => {
        const breakdown = b.wasteBreakdown || createWasteBreakdown();
        const categoryBreakdown = createWasteCategoryBreakdown(breakdown);
        csvRows.push([
            cityLabel,
            buildingIndex + 1,
            b.name,
            b.type.label,
            city.config.populationScale || 1,
            city.config.workerPopulationScale || 1,
            city.config.floatPopulationScale || 1,
            b.residentPopulation,
            b.workerPopulation,
            b.visitorPopulation,
            (b.type.workerWasteRate || 0).toFixed(2),
            (b.type.visitorWasteRate || 0).toFixed(2),
            Math.round(b.lastSpecialWaste || 0),
            Math.round(b.waste),
            ...categoryKeys.map(key => Math.round(categoryBreakdown[key] || 0)),
            ...materialKeys.map(key => Math.round(breakdown[key] || 0)),
            Math.round(b.capacity)
        ]);
    });

    const csvContent = `\uFEFF${csvRows.map(row => row.map(csvCell).join(',')).join('\n')}`;
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    const modeLabel = simulationMode === 'single' ? 'single' : 'comparison';
    const dateLabel = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    link.setAttribute("href", downloadUrl);
    link.setAttribute("download", `urban_waste_${modeLabel}_${sortKey}_${dateLabel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
}

downloadButton.onclick = openDownloadModal;
downloadCloseButton.onclick = closeDownloadModal;
downloadCancelButton.onclick = closeDownloadModal;
downloadForm.onsubmit = (event) => {
    event.preventDefault();
    const sortKey = new FormData(downloadForm).get('download-sort') || 'type';
    downloadStatistics(sortKey);
    closeDownloadModal();
};

document.addEventListener('keydown', (event) => {
    if (downloadModal.style.display === 'block') {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeDownloadModal();
        } else if (event.key === 'Tab') {
            trapDownloadModalFocus(event);
        }
        return;
    }

    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

let isTooltipHovered = false;
tooltip.addEventListener('mouseenter', () => { isTooltipHovered = true; });
tooltip.addEventListener('mouseleave', () => {
    isTooltipHovered = false;
    tooltip.style.display = 'none';
});

function hideTooltip() {
    if (!isTooltipHovered) {
        tooltip.style.display = 'none';
    }
}

function findBuildingAt(city, clientX, clientY) {
    const rect = city.canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    return city.buildings.find(b => (
        mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h
    )) || null;
}

function renderBuildingTooltip(building, pointerEvent, shouldResetScroll = false) {
    tooltip.style.display = 'block';
    if (shouldResetScroll) {
        tooltip.scrollTop = 0;
    }

    const standingWaste = building.lastStandingWaste || 0;
    const visitorWaste = building.lastVisitorWaste || 0;
    const specialWaste = building.lastSpecialWaste || 0;
    const categoryBreakdown = createWasteCategoryBreakdown(building.wasteBreakdown);
    const categoryRows = WASTE_CATEGORY_KEYS
        .filter(key => (categoryBreakdown[key] || 0) > 0)
        .map(key => `
            <div class="tooltip-row"><span class="tooltip-label">${WASTE_CATEGORIES[key]}</span><span class="tooltip-value">${formatKg(categoryBreakdown[key])} kg/일</span></div>
        `)
        .join('');
    const breakdownRows = WASTE_STREAM_KEYS
        .filter(key => (building.wasteBreakdown?.[key] || 0) > 0)
        .map(key => `
            <div class="tooltip-row"><span class="tooltip-label">${WASTE_STREAMS[key].label}</span><span class="tooltip-value">${formatKg(building.wasteBreakdown[key])} kg/일</span></div>
        `)
        .join('');

    tooltip.innerHTML = `
            <div class="tooltip-title"><span>${building.type.icon}</span><span>${building.name}</span></div>
        <div class="tooltip-info">
            <div class="tooltip-row"><span class="tooltip-label">유형</span><span class="tooltip-value">${building.type.label}</span></div>
            <div class="tooltip-row"><span class="tooltip-label">거주 인구</span><span class="tooltip-value">${(building.residentPopulation || 0).toLocaleString()}명</span></div>
            <div class="tooltip-row"><span class="tooltip-label">종사 인구</span><span class="tooltip-value">${(building.workerPopulation || 0).toLocaleString()}명</span></div>
            <div class="tooltip-row"><span class="tooltip-label">유동 인구</span><span class="tooltip-value">${(building.visitorPopulation || 0).toLocaleString()}명</span></div>
            <div class="tooltip-divider" style="height: 1px; background: rgba(255,255,255,0.1); margin: 5px 0;"></div>
            <div class="tooltip-row"><span class="tooltip-label">거주/종사 폐기물</span><span class="tooltip-value">${formatKg(standingWaste)} kg/일</span></div>
            <div class="tooltip-row"><span class="tooltip-label">유동 폐기물</span><span class="tooltip-value">${formatKg(visitorWaste)} kg/일</span></div>
            ${specialWaste > 0 ? `<div class="tooltip-row"><span class="tooltip-label">특수 폐기물</span><span class="tooltip-value">${formatKg(specialWaste)} kg/일</span></div>` : ''}
            <div class="tooltip-row"><span class="tooltip-label">총 폐기물</span><span class="tooltip-value">${formatKg(building.waste)} kg/일</span></div>
            ${categoryRows ? `<div class="tooltip-section">배출 카테고리</div>${categoryRows}` : ''}
            ${breakdownRows ? `<div class="tooltip-section">세부 폐기물</div>${breakdownRows}` : ''}
            <div class="tooltip-row"><span class="tooltip-label">포화도</span><span class="tooltip-value">${((building.waste / building.capacity) * 100).toFixed(1)}%</span></div>
        </div>
    `;
    positionTooltip(pointerEvent);
}

// 툴팁 로직
[cityLeft, cityRight].forEach(city => {
    let currentHoveredBuilding = null;
    city.canvas.addEventListener('mousemove', (e) => {
        const hovered = findBuildingAt(city, e.clientX, e.clientY);

        if (hovered) {
            renderBuildingTooltip(hovered, e, currentHoveredBuilding !== hovered);
            currentHoveredBuilding = hovered;
        } else {
            hideTooltip();
            currentHoveredBuilding = null;
        }
    });
    city.canvas.addEventListener('mouseleave', () => {
        hideTooltip();
        currentHoveredBuilding = null;
    });
    city.canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        const touched = findBuildingAt(city, touch.clientX, touch.clientY);
        if (touched) {
            renderBuildingTooltip(touched, touch, currentHoveredBuilding !== touched);
            currentHoveredBuilding = touched;
        } else {
            hideTooltip();
            currentHoveredBuilding = null;
        }
    }, { passive: true });
});

window.addEventListener('resize', () => {
    if (!simulationMode) return;
    let cityWasRebuilt = false;
    getActiveCities().forEach(city => {
        if (city.resize()) {
            resetCityWaste(city);
            cityWasRebuilt = true;
        }
    });
    if (cityWasRebuilt) updateComparisonBar();
});
