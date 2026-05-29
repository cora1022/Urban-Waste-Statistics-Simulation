/**
 * 도시 폐기물 시뮬레이션 - 멀티 시티 엔진
 */

// --- 데이터 세트 ---
const RATIO_PRESETS = {
    residential: { RESIDENTIAL: 70, COMMERCIAL_FOOD: 10, COMMERCIAL_RETAIL: 10, SCHOOL: 5, INDUSTRIAL: 0, MEDICAL: 5, OFFICE: 0, PARK: 20, CONSTRUCTION: 5, GOVERNMENT: 5 },
    commercial: { RESIDENTIAL: 10, COMMERCIAL_FOOD: 40, COMMERCIAL_RETAIL: 40, SCHOOL: 0, INDUSTRIAL: 5, MEDICAL: 5, OFFICE: 10, PARK: 5, CONSTRUCTION: 10, GOVERNMENT: 5 },
    industrial: { RESIDENTIAL: 5, COMMERCIAL_FOOD: 5, COMMERCIAL_RETAIL: 5, SCHOOL: 0, INDUSTRIAL: 50, MEDICAL: 0, OFFICE: 40, PARK: 0, CONSTRUCTION: 10, GOVERNMENT: 5 },
    balanced: { RESIDENTIAL: 20, COMMERCIAL_FOOD: 20, COMMERCIAL_RETAIL: 20, SCHOOL: 10, INDUSTRIAL: 10, MEDICAL: 10, OFFICE: 20, PARK: 15, CONSTRUCTION: 5, GOVERNMENT: 10 }
};

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
    RESIDENTIAL: { standing: 0.95, visitor: 0.03 },
    COMMERCIAL_FOOD: { standing: 1.20, visitor: 0.09 },
    COMMERCIAL_RETAIL: { standing: 0.60, visitor: 0.04 },
    SCHOOL: { standing: 0.32, visitor: 0.04 },
    INDUSTRIAL: { standing: 0.38, visitor: 0.02 },
    MEDICAL: { standing: 0.55, visitor: 0.05 },
    OFFICE: { standing: 0.42, visitor: 0.03 },
    PARK: { standing: 0.04, visitor: 0.02 },
    CONSTRUCTION: { standing: 0.45, visitor: 0.03 },
    GOVERNMENT: { standing: 0.38, visitor: 0.03 }
};

const BUILDING_TYPES = {
    RESIDENTIAL: { label: '주거 시설', color: '#5c7aff', volatility: 0.2, workerDensity: 8.5, visitorDensity: 0.5, workerWasteRate: WASTE_RATES.RESIDENTIAL.standing, visitorWasteRate: WASTE_RATES.RESIDENTIAL.visitor, icon: '🏠', wasteShares: { foodWaste: 0.34, paper: 0.077, vinyl: 0.075, plastic: 0.07, glass: 0.035, metal: 0.025, styrofoam: 0.03, sanitary: 0.055, mixedCombustible: 0.205, mixedNoncombustible: 0.05, textile: 0.028, bulkyFurniture: 0.007, bulkyAppliance: 0.003 } },
    COMMERCIAL_FOOD: { label: '음식점/카페', color: '#ff6b9d', volatility: 0.65, workerDensity: 1.0, visitorDensity: 12.0, workerWasteRate: WASTE_RATES.COMMERCIAL_FOOD.standing, visitorWasteRate: WASTE_RATES.COMMERCIAL_FOOD.visitor, icon: '🍕', wasteShares: { foodWaste: 0.46, paper: 0.07, vinyl: 0.08, plastic: 0.055, glass: 0.03, metal: 0.02, styrofoam: 0.035, sanitary: 0.03, mixedCombustible: 0.16, mixedNoncombustible: 0.05, bulkyFurniture: 0.006, bulkyAppliance: 0.004 }, specialWastePerWorker: 0.12, specialWasteShares: { businessWaste: 1 } },
    COMMERCIAL_RETAIL: { label: '상점/마트', color: '#ffcf56', volatility: 0.45, workerDensity: 0.8, visitorDensity: 10.0, workerWasteRate: WASTE_RATES.COMMERCIAL_RETAIL.standing, visitorWasteRate: WASTE_RATES.COMMERCIAL_RETAIL.visitor, icon: '🛍️', wasteShares: { foodWaste: 0.11, paper: 0.17, vinyl: 0.16, plastic: 0.12, glass: 0.035, metal: 0.04, styrofoam: 0.055, sanitary: 0.025, mixedCombustible: 0.24, mixedNoncombustible: 0.025, bulkyFurniture: 0.014, bulkyAppliance: 0.006 }, specialWastePerWorker: 0.08, specialWasteShares: { businessWaste: 1 } },
    SCHOOL: { label: '학교/교육시설', color: '#7ad3f0', volatility: 0.3, workerDensity: 0.5, visitorDensity: 5.0, workerWasteRate: WASTE_RATES.SCHOOL.standing, visitorWasteRate: WASTE_RATES.SCHOOL.visitor, icon: '🏫', wasteShares: { foodWaste: 0.35, paper: 0.14, vinyl: 0.06, plastic: 0.05, glass: 0.01, metal: 0.02, styrofoam: 0.015, sanitary: 0.05, mixedCombustible: 0.24, mixedNoncombustible: 0.055, bulkyFurniture: 0.007, bulkyAppliance: 0.003 } },
    INDUSTRIAL: { label: '산업/공장', color: '#9d66ff', volatility: 0.75, workerDensity: 3.0, visitorDensity: 0.5, workerWasteRate: WASTE_RATES.INDUSTRIAL.standing, visitorWasteRate: WASTE_RATES.INDUSTRIAL.visitor, icon: '🏭', wasteShares: { foodWaste: 0.10, paper: 0.09, vinyl: 0.08, plastic: 0.09, glass: 0.01, metal: 0.07, styrofoam: 0.02, sanitary: 0.03, mixedCombustible: 0.34, mixedNoncombustible: 0.17 }, specialWastePerWorker: 0.35, specialWasteShares: { businessWaste: 0.9, constructionDebris: 0.1 } },
    MEDICAL: { label: '의료/병원', color: '#ff7676', volatility: 0.35, workerDensity: 1.5, visitorDensity: 6.0, workerWasteRate: WASTE_RATES.MEDICAL.standing, visitorWasteRate: WASTE_RATES.MEDICAL.visitor, icon: '🏥', wasteShares: { foodWaste: 0.16, paper: 0.08, vinyl: 0.07, plastic: 0.055, glass: 0.02, metal: 0.015, styrofoam: 0.01, sanitary: 0.09, mixedCombustible: 0.40, mixedNoncombustible: 0.10 }, specialWastePerWorker: 0.22, specialWastePerVisitor: 0.01, specialWasteShares: { medicalWaste: 0.78, businessWaste: 0.22 } },
    OFFICE: { label: '업무/오피스', color: '#b2b0ff', volatility: 0.35, workerDensity: 6.0, visitorDensity: 2.0, workerWasteRate: WASTE_RATES.OFFICE.standing, visitorWasteRate: WASTE_RATES.OFFICE.visitor, icon: '🏢', wasteShares: { foodWaste: 0.26, paper: 0.18, vinyl: 0.06, plastic: 0.06, glass: 0.02, metal: 0.03, styrofoam: 0.01, sanitary: 0.04, mixedCombustible: 0.27, mixedNoncombustible: 0.05, bulkyFurniture: 0.014, bulkyAppliance: 0.006 }, specialWastePerWorker: 0.03, specialWasteShares: { businessWaste: 1 } },
    PARK: { label: '공원/녹지', color: '#56d8b1', volatility: 0.25, workerDensity: 0.1, visitorDensity: 4.0, workerWasteRate: WASTE_RATES.PARK.standing, visitorWasteRate: WASTE_RATES.PARK.visitor, icon: '🌳', wasteShares: { foodWaste: 0.30, paper: 0.10, vinyl: 0.09, plastic: 0.10, glass: 0.04, metal: 0.035, styrofoam: 0.02, sanitary: 0.04, mixedCombustible: 0.21, mixedNoncombustible: 0.065 } },
    CONSTRUCTION: { label: '공사 현장', color: '#ffd891', volatility: 1.0, workerDensity: 2.0, visitorDensity: 0.2, workerWasteRate: WASTE_RATES.CONSTRUCTION.standing, visitorWasteRate: WASTE_RATES.CONSTRUCTION.visitor, icon: '🚧', wasteShares: { foodWaste: 0.10, paper: 0.05, vinyl: 0.05, plastic: 0.04, glass: 0.01, metal: 0.04, styrofoam: 0.02, sanitary: 0.03, mixedCombustible: 0.38, mixedNoncombustible: 0.28 }, specialWasteAreaRate: 0.028, specialWasteShares: { constructionDebris: 0.86, metal: 0.06, plastic: 0.03, mixedNoncombustible: 0.05 } },
    GOVERNMENT: { label: '공공 기관', color: '#66b2ff', volatility: 0.3, workerDensity: 1.5, visitorDensity: 8.0, workerWasteRate: WASTE_RATES.GOVERNMENT.standing, visitorWasteRate: WASTE_RATES.GOVERNMENT.visitor, icon: '🏛️', wasteShares: { foodWaste: 0.24, paper: 0.19, vinyl: 0.055, plastic: 0.055, glass: 0.02, metal: 0.03, styrofoam: 0.01, sanitary: 0.045, mixedCombustible: 0.27, mixedNoncombustible: 0.065, bulkyFurniture: 0.01, bulkyAppliance: 0.01 }, specialWastePerWorker: 0.03, specialWasteShares: { businessWaste: 1 } }
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

const KOREA_WASTE_BENCHMARK = {
    municipalPerCapitaKg: 0.9506,
    categoryShares: {
        standardBag: 330.8 / 950.6,
        food: 310.9 / 950.6,
        recyclable: 308.8 / 950.6
    },
    source: '환경부 제6차 전국폐기물통계조사(2021~2022)'
};

const SIMULATION_BASELINE = {
    unit: 'kg/일',
    collectionStorageDays: 1.5,
    minDailyFactor: 0.35,
    maxDailyFactor: 1.85,
    description: '제6차 전국폐기물통계조사 생활폐기물 0.9506kg/일·인 기준, 업종별 보정계수 적용'
};

const COLORS = {
    BG: '#05050a',
    ROAD: '#12121c',
    BUILDING_DEFAULT: '#1a1a2e',
    CAR_TYPES: ['#4361ee', '#f72585', '#7209b7', '#4cc9f0', '#fbbf24']
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

function createWasteBreakdown() {
    return Object.keys(WASTE_STREAMS).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
    }, {});
}

function createWasteCategoryBreakdown(materialBreakdown) {
    const categoryBreakdown = Object.keys(WASTE_CATEGORIES).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
    }, {});

    Object.keys(materialBreakdown || {}).forEach(key => {
        const category = WASTE_STREAMS[key]?.category;
        if (category && categoryBreakdown[category] !== undefined) {
            categoryBreakdown[category] += materialBreakdown[key] || 0;
        }
    });

    return categoryBreakdown;
}

function addWasteBreakdown(target, source) {
    Object.keys(WASTE_STREAMS).forEach(key => {
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
    const types = Object.keys(BUILDING_TYPES);
    const totalWeight = types.reduce((sum, key) => sum + (config.typeWeights[key] || 0), 0);
    const buildingCount = config.targetBuildings || 0;
    const populationScale = config.populationScale || 1;
    const workerPopulationScale = config.workerPopulationScale || 1;
    const floatPopulationScale = config.floatPopulationScale || 1;
    const expectedAreaFactor = getPopulationAreaFactor();

    if (totalWeight <= 0 || buildingCount <= 0) {
        return { residentPop: 0, workerPop: 0, visitorPop: 0, totalPop: 0 };
    }

    const density = types.reduce((acc, key) => {
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
    const types = Object.keys(BUILDING_TYPES);
    const totalWeight = types.reduce((sum, key) => sum + (config.typeWeights[key] || 0), 0);
    const buildingCount = config.targetBuildings || 0;
    if (totalWeight <= 0 || buildingCount <= 0) return 0;

    const baseConfig = { ...config, wasteScale: 1 };
    const expectedArea = getExpectedBuildingSizeSquared();

    const baseWaste = types.reduce((sum, key) => {
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
        
        const types = Object.keys(BUILDING_TYPES);
        const typeKey = types[Math.floor(Math.random() * types.length)];
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
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.fillStyle = this.city.config.showTypes ? this.type.color : COLORS.BUILDING_DEFAULT;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.w, this.h, 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (this.city.config.showTypes && this.w > 40) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '12px Segoe UI';
            ctx.textAlign = 'center';
            ctx.fillText(this.type.icon, this.x + this.w / 2, this.y + this.h / 2 + 4);
        }

        if (this.waste > 0) {
            const fillPercent = this.waste / this.capacity;
            const barW = this.w * 0.7;
            const bx = this.x + (this.w - barW) / 2;
            const by = this.y + this.h * 0.8;
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(bx, by, barW, 3);
            let color = '#00f2fe';
            if (fillPercent > 0.8) color = '#ff0844';
            else if (fillPercent > 0.5) color = '#f9d423';
            ctx.fillStyle = color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = color;
            ctx.fillRect(bx, by, barW * fillPercent, 3);
        }
        ctx.restore();
    }
}

class Vehicle {
    constructor(path) {
        this.path = path;
        this.progress = 0;
        this.speed = (0.0015 + Math.random() * 0.0025);
        this.color = COLORS.CAR_TYPES[Math.floor(Math.random() * COLORS.CAR_TYPES.length)];
        this.width = 20 + Math.random() * 8;
        this.height = this.width * 0.5;
        this.alive = true;
        this.updatePos();
    }
    updatePos() {
        this.x = this.path.x1 + (this.path.x2 - this.path.x1) * this.progress;
        this.y = this.path.y1 + (this.path.y2 - this.path.y1) * this.progress;
        this.angle = Math.atan2(this.path.y2 - this.path.y1, this.path.x2 - this.path.x1);
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
        ctx.restore();
    }
}

// --- 핵심 시뮬레이션 엔진 ---

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
        
        this.config = {
            roadWidth: 45,
            targetBuildings: 60,
            populationScale: 0.5,
            workerPopulationScale: 1,
            floatPopulationScale: 1,
            spawnChance: 0.05,
            wasteScale: 1.0,
            showTypes: false,
            roadLayout: 0,
            preset: 'custom',
            typeWeights: {
                RESIDENTIAL: 50,
                COMMERCIAL_FOOD: 20,
                COMMERCIAL_RETAIL: 20,
                SCHOOL: 10,
                INDUSTRIAL: 10,
                MEDICAL: 10,
                OFFICE: 20,
                PARK: 15,
                CONSTRUCTION: 5,
                GOVERNMENT: 10
            }
        };
    }

    init() {
        this.resize();
        this.animate();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.createCity();
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
        this.totalWasteDisplay.parentElement.title = "계산식: ∑((거주+종사 인구) × 1인 1일 생활폐기물 계수 + 유동 인구 × 방문 배출계수 + 건물 유형별 특수 폐기물)\n* 단위: kg/일, 제6차 전국폐기물통계조사 기준 보정";
        this.totalResidentPopDisplay.parentElement.style.cursor = 'help';
        this.totalWorkerPopDisplay.parentElement.style.cursor = 'help';
        this.totalVisitorPopDisplay.parentElement.style.cursor = 'help';
        this.totalWasteDisplay.parentElement.style.cursor = 'help';

        const layout = this.config.roadLayout || 0;
        
        if (layout === 0) {
            // 기본 (대각선)
            this.roadPaths.push({x1: -50, y1: h * 0.2, x2: w + 50, y2: h * 0.8});
            this.roadPaths.push({x1: w + 50, y1: h * 0.3, x2: -50, y2: h * 0.7});
            this.roadPaths.push({x1: w * 0.5, y1: -50, x2: w * 0.5, y2: h + 50});
        } else if (layout === 1) {
            // 그리드 (격자형)
            this.roadPaths.push({x1: -50, y1: h * 0.5, x2: w + 50, y2: h * 0.5});
            this.roadPaths.push({x1: w * 0.33, y1: -50, x2: w * 0.33, y2: h + 50});
            this.roadPaths.push({x1: w * 0.66, y1: -50, x2: w * 0.66, y2: h + 50});
        } else if (layout === 2) {
            // 순환도로
            this.roadPaths.push({x1: w*0.15, y1: h*0.2, x2: w*0.85, y2: h*0.2});
            this.roadPaths.push({x1: w*0.85, y1: h*0.2, x2: w*0.85, y2: h*0.8});
            this.roadPaths.push({x1: w*0.85, y1: h*0.8, x2: w*0.15, y2: h*0.8});
            this.roadPaths.push({x1: w*0.15, y1: h*0.8, x2: w*0.15, y2: h*0.2});
        } else if (layout === 3) {
            // 수평 평행선
            this.roadPaths.push({x1: -50, y1: h * 0.3, x2: w + 50, y2: h * 0.3});
            this.roadPaths.push({x1: -50, y1: h * 0.7, x2: w + 50, y2: h * 0.7});
        }

        let attempts = 0;
        
        // Weight-based selection logic
        const getWeightedType = () => {
            const types = Object.keys(BUILDING_TYPES);
            const totalWeight = types.reduce((acc, t) => acc + (this.config.typeWeights[t] || 0), 0);
            if (totalWeight <= 0) return types[0];
            let rand = Math.random() * totalWeight;
            for (const t of types) {
                const weight = this.config.typeWeights[t] || 0;
                if (rand < weight) return t;
                rand -= weight;
            }
            return types[0];
        };

        const sizeRange = getBuildingSizeRange(this.config.targetBuildings);
        const maxPlacementAttempts = Math.max(1500, this.config.targetBuildings * 80);
        while (this.buildings.length < this.config.targetBuildings && attempts < maxPlacementAttempts) {
            const size = sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min);
            const x = Math.random() * (w - size - 20) + 10;
            const y = Math.random() * (h - size - 20) + 10;

            let overlap = false;
            for (let road of this.roadPaths) {
                if (this.distToSegment({x: x+size/2, y: y+size/2}, {x: road.x1, y: road.y1}, {x: road.x2, y: road.y2}) < (this.config.roadWidth/2 + size * sizeRange.roadBufferScale)) {
                    overlap = true; break;
                }
            }
            if (!overlap) {
                for (let b of this.buildings) {
                    const dist = Math.sqrt(Math.pow((b.x + b.w/2) - (x + size/2), 2) + Math.pow((b.y + b.h/2) - (y + size/2), 2));
                    if (dist < (b.w/2 + size/2 + sizeRange.spacing)) { overlap = true; break; }
                }
            }
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
        
        this.totalResidentPopulation = this.buildings.reduce((sum, b) => sum + (b.residentPopulation || 0), 0);
        this.totalWorkerPopulation = this.buildings.reduce((sum, b) => sum + (b.workerPopulation || 0), 0);
        this.totalVisitorPopulation = this.buildings.reduce((sum, b) => sum + (b.visitorPopulation || 0), 0);
        this.totalResidentPopDisplay.innerText = this.totalResidentPopulation.toLocaleString();
        this.totalWorkerPopDisplay.innerText = this.totalWorkerPopulation.toLocaleString();
        this.totalVisitorPopDisplay.innerText = this.totalVisitorPopulation.toLocaleString();
        this.totalBldDisplay.innerText = this.buildings.length;

        this.updateStatsTooltips();
    }

    normalizePopulationToEstimate() {
        if (this.buildings.length === 0) return;

        const target = estimatePopulationForConfig(this.config);
        this.scaleBuildingPopulation('residentPopulation', target.residentPop);
        this.scaleBuildingPopulation('workerPopulation', target.workerPop);
        this.scaleBuildingPopulation('visitorPopulation', target.visitorPop);

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

        let assigned = 0;
        this.buildings.forEach((b, index) => {
            if (index === this.buildings.length - 1) {
                b[field] = Math.max(0, Math.round(targetTotal) - assigned);
                return;
            }

            b[field] = Math.max(0, Math.round((b[field] || 0) * targetTotal / currentTotal));
            assigned += b[field];
        });
    }

    updateStatsTooltips() {
        const stats = {};
        Object.keys(BUILDING_TYPES).forEach(type => {
            stats[type] = { count: 0, residentPop: 0, workerPop: 0, visitorPop: 0, standingWaste: 0, visitorWaste: 0, specialWaste: 0, totalWaste: 0 };
        });
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
            };
            box.onmousemove = (e) => {
                tooltip.style.left = (e.clientX + 15) + 'px';
                tooltip.style.top = (e.clientY + 15) + 'px';
            };
            box.onmouseleave = () => {
                tooltip.style.display = 'none';
            };
        };

        // 건물 수 툴팁
        setupHeaderTooltip(this.totalBldDisplay, () => "🏙️ 건물 유형별 통계", () => {
            return Object.keys(BUILDING_TYPES)
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${stats[k].count}동`,
                    show: stats[k].count > 0
                }))
                .filter(i => i.show);
        });

        // 거주 인구 툴팁
        setupHeaderTooltip(this.totalResidentPopDisplay, () => "🏠 거주 인구 상세", () => {
            return Object.keys(BUILDING_TYPES)
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${stats[k].residentPop.toLocaleString()}명`,
                    show: stats[k].residentPop > 0
                }))
                .filter(i => i.show);
        });

        // 종사 인구 툴팁
        setupHeaderTooltip(this.totalWorkerPopDisplay, () => "🏢 종사 인구 상세", () => {
            return Object.keys(BUILDING_TYPES)
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${stats[k].workerPop.toLocaleString()}명 (${formatKg(stats[k].standingWaste)}kg/일)`,
                    show: stats[k].workerPop > 0 || stats[k].standingWaste > 0
                }))
                .filter(i => i.show);
        });

        // 유동 인구 툴팁
        setupHeaderTooltip(this.totalVisitorPopDisplay, () => "🏃 유동 인구 상세", () => {
            return Object.keys(BUILDING_TYPES)
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${stats[k].visitorPop.toLocaleString()}명 (${formatKg(stats[k].visitorWaste)}kg/일)`,
                    show: stats[k].visitorPop > 0 || stats[k].visitorWaste > 0
                }))
                .filter(i => i.show);
        });

        // 폐기물 툴팁
        setupHeaderTooltip(this.totalWasteDisplay, () => "♻️ 1일 폐기물 배출량 상세", () => {
            const categoryItems = Object.keys(WASTE_CATEGORIES)
                .map(k => ({
                    label: WASTE_CATEGORIES[k],
                    value: `${formatKg(cityCategoryBreakdown[k])}kg/일`,
                    show: cityCategoryBreakdown[k] > 0
                }))
                .filter(i => i.show);

            const materialItems = Object.keys(WASTE_STREAMS)
                .map(k => ({
                    label: WASTE_STREAMS[k].label,
                    value: `${formatKg(cityWasteBreakdown[k])}kg/일`,
                    show: cityWasteBreakdown[k] > 0
                }))
                .filter(i => i.show);

            const typeItems = Object.keys(BUILDING_TYPES)
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
        this.totalWasteDisplay.innerText = formatKg(this.totalCityWaste);
        this.updateStatsTooltips();
    }

    animate() {
        this.ctx.fillStyle = COLORS.BG;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = COLORS.ROAD;
        this.ctx.lineWidth = this.config.roadWidth;
        this.ctx.lineCap = 'round';
        this.roadPaths.forEach(path => {
            this.ctx.beginPath();
            this.ctx.moveTo(path.x1, path.y1);
            this.ctx.lineTo(path.x2, path.y2);
            this.ctx.stroke();
        });

        this.buildings.forEach(b => b.draw(this.ctx));

        if (Math.random() < this.config.spawnChance) {
            this.vehicles.push(new Vehicle(this.roadPaths[Math.floor(Math.random() * this.roadPaths.length)]));
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

// Ensure initialization happens after DOM load
window.onload = () => {
    cityLeft.init();
    cityRight.init();
};

const tooltip = document.getElementById('tooltip');
const modal = document.getElementById('settings-modal');
const closeBtn = document.querySelector('.close-btn');
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

// 전역 컨트롤
document.getElementById('btn-generate-all').onclick = () => {
    cityLeft.generateWaste();
    cityRight.generateWaste();
    updateComparisonBar();
};

document.getElementById('btn-reset-all').onclick = () => {
    cityLeft.createCity();
    cityLeft.totalCityWaste = 0;
    cityLeft.totalWasteDisplay.innerText = '0';
    
    cityRight.createCity();
    cityRight.totalCityWaste = 0;
    cityRight.totalWasteDisplay.innerText = '0';
    
    updateComparisonBar();
};

function updateComparisonBar() {
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
}

function updateScaleControlsFromConfig() {
    populationScaleRange.value = activeCity.config.populationScale;
    populationScaleNumber.value = activeCity.config.populationScale;
    document.getElementById('waste-scale').value = activeCity.config.wasteScale * 100;
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
        
        document.getElementById('modal-title').innerText = `도시 ${target === 'left' ? 'A' : 'B'} 설정`;
        document.getElementById('show-types').checked = activeCity.config.showTypes;
        buildingCountRange.value = activeCity.config.targetBuildings;
        buildingCountNumber.value = activeCity.config.targetBuildings;
        document.getElementById('spawn-rate').value = activeCity.config.spawnChance * 1000;
        updateScaleControlsFromConfig();
        cityFitResult.innerText = '거주 인구만 넣어도 인구 기준 배율을 자동 계산합니다.';
        
        roadLayoutSelect.value = activeCity.config.roadLayout || 0;
        presetSelect.value = activeCity.config.preset || 'custom';
        
        updateRatioUI();
        updatePopulationEstimateUI();
        modal.style.display = 'block';
    };
});

closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// 설정 변경 적용
document.getElementById('show-types').onchange = (e) => activeCity.config.showTypes = e.target.checked;
document.getElementById('btn-apply-city-data').onclick = applyCityDataToConfig;
buildingCountRange.oninput = (e) => syncBuildingCountControls(e.target.value);
buildingCountNumber.onchange = (e) => syncBuildingCountControls(e.target.value);
populationScaleRange.oninput = (e) => syncPopulationScaleControls(e.target.value);
populationScaleNumber.onchange = (e) => syncPopulationScaleControls(e.target.value);
document.getElementById('spawn-rate').oninput = (e) => activeCity.config.spawnChance = e.target.value / 1000;
document.getElementById('waste-scale').oninput = (e) => {
    activeCity.config.wasteScale = e.target.value / 100;
    if (cityFitResult) {
        const wasteTon = estimateDailyWasteForConfig(activeCity.config) / 1000;
        cityFitResult.innerText = `현재 설정의 예상 폐기물은 약 ${wasteTon.toFixed(1)}톤/일입니다.`;
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
    Object.keys(BUILDING_TYPES).forEach(key => {
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
    modal.style.display = 'none';
};

document.getElementById('btn-download-csv').onclick = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
    const categoryKeys = Object.keys(WASTE_CATEGORIES);
    const materialKeys = Object.keys(WASTE_STREAMS);
    const csvHeaders = [
        "도시", "ID", "이름", "유형", "인구기준배율", "종사인구보정", "유동인구보정",
        "거주인구(명)", "종사인구(명)", "유동인구(명)",
        "거주/종사계수(kg/일·인)", "유동계수(kg/일·인)", "특수폐기물(kg/일)", "총폐기물(kg/일)",
        ...categoryKeys.map(key => `${WASTE_CATEGORIES[key]}(kg/일)`),
        ...materialKeys.map(key => `${WASTE_STREAMS[key].label}(kg/일)`),
        "임시보관용량(kg)"
    ];
    csvContent += csvHeaders.join(",") + "\n";

    const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
    
    const exportData = (city, label) => {
        city.buildings.forEach((b, i) => {
            const breakdown = b.wasteBreakdown || createWasteBreakdown();
            const categoryBreakdown = createWasteCategoryBreakdown(breakdown);
            const row = [
                label,
                i + 1,
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
            ];
            csvContent += row.map(csvCell).join(",") + "\n";
        });
    };

    exportData(cityLeft, "도시 A");
    exportData(cityRight, "도시 B");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `urban_comparison_stats_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// 툴팁 로직
[cityLeft, cityRight].forEach(city => {
    city.canvas.addEventListener('mousemove', (e) => {
        const rect = city.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        let hovered = null;
        for (let b of city.buildings) {
            if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
                hovered = b; break;
            }
        }

        if (hovered) {
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';

            const standingWaste = hovered.lastStandingWaste || 0;
            const visitorWaste = hovered.lastVisitorWaste || 0;
            const specialWaste = hovered.lastSpecialWaste || 0;
            const categoryBreakdown = createWasteCategoryBreakdown(hovered.wasteBreakdown);
            const categoryRows = Object.keys(WASTE_CATEGORIES)
                .filter(key => (categoryBreakdown[key] || 0) > 0)
                .map(key => `
                    <div class="tooltip-row"><span class="tooltip-label">${WASTE_CATEGORIES[key]}</span><span class="tooltip-value">${formatKg(categoryBreakdown[key])} kg/일</span></div>
                `)
                .join('');
            const breakdownRows = Object.keys(WASTE_STREAMS)
                .filter(key => (hovered.wasteBreakdown?.[key] || 0) > 0)
                .map(key => `
                    <div class="tooltip-row"><span class="tooltip-label">${WASTE_STREAMS[key].label}</span><span class="tooltip-value">${formatKg(hovered.wasteBreakdown[key])} kg/일</span></div>
                `)
                .join('');

            tooltip.innerHTML = `
                    <div class="tooltip-title"><span>${hovered.type.icon}</span><span>${hovered.name}</span></div>
                <div class="tooltip-info">
                    <div class="tooltip-row"><span class="tooltip-label">유형</span><span class="tooltip-value">${hovered.type.label}</span></div>
                    <div class="tooltip-row"><span class="tooltip-label">거주 인구</span><span class="tooltip-value">${(hovered.residentPopulation || 0).toLocaleString()}명</span></div>
                    <div class="tooltip-row"><span class="tooltip-label">종사 인구</span><span class="tooltip-value">${(hovered.workerPopulation || 0).toLocaleString()}명</span></div>
                    <div class="tooltip-row"><span class="tooltip-label">유동 인구</span><span class="tooltip-value">${(hovered.visitorPopulation || 0).toLocaleString()}명</span></div>
                    <div class="tooltip-divider" style="height: 1px; background: rgba(255,255,255,0.1); margin: 5px 0;"></div>
                    <div class="tooltip-row"><span class="tooltip-label">거주/종사 폐기물</span><span class="tooltip-value">${formatKg(standingWaste)} kg/일</span></div>
                    <div class="tooltip-row"><span class="tooltip-label">유동 폐기물</span><span class="tooltip-value">${formatKg(visitorWaste)} kg/일</span></div>
                    ${specialWaste > 0 ? `<div class="tooltip-row"><span class="tooltip-label">특수 폐기물</span><span class="tooltip-value">${formatKg(specialWaste)} kg/일</span></div>` : ''}
                    <div class="tooltip-row"><span class="tooltip-label">총 폐기물</span><span class="tooltip-value">${formatKg(hovered.waste)} kg/일</span></div>
                    ${categoryRows ? `<div class="tooltip-section">배출 카테고리</div>${categoryRows}` : ''}
                    ${breakdownRows ? `<div class="tooltip-section">세부 폐기물</div>${breakdownRows}` : ''}
                    <div class="tooltip-row"><span class="tooltip-label">포화도</span><span class="tooltip-value">${((hovered.waste / hovered.capacity) * 100).toFixed(1)}%</span></div>
                </div>
            `;
        } else {
            tooltip.style.display = 'none';
        }
    });
    city.canvas.addEventListener('mouseleave', () => tooltip.style.display = 'none');
});

window.addEventListener('resize', () => {
    cityLeft.resize();
    cityRight.resize();
});
