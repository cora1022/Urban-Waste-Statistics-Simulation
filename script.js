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
    RESIDENTIAL: { standing: 1.23, visitor: 0.08 },
    COMMERCIAL_FOOD: { standing: 2.50, visitor: 0.08 },
    COMMERCIAL_RETAIL: { standing: 0.70, visitor: 0.05 },
    SCHOOL: { standing: 0.35, visitor: 0.08 },
    INDUSTRIAL: { standing: 1.35, visitor: 0.05 },
    MEDICAL: { standing: 0.95, visitor: 0.10 },
    OFFICE: { standing: 0.21, visitor: 0.04 },
    PARK: { standing: 0.10, visitor: 0.02 },
    // 임시 작업자까지 포함하는 경우 유동 인구 계수는 더 높게 설정 가능
    CONSTRUCTION: { standing: 2.80, visitor: 0.20 },
    GOVERNMENT: { standing: 0.25, visitor: 0.03 }
};

const BUILDING_TYPES = {
    RESIDENTIAL: { label: '주거 시설', color: '#5c7aff', volatility: 0.2, workerDensity: 8.5, visitorDensity: 0.5, workerWasteRate: WASTE_RATES.RESIDENTIAL.standing, visitorWasteRate: WASTE_RATES.RESIDENTIAL.visitor, icon: '🏠', wasteShares: { mixed: 0.269, food: 0.253, recyclable: 0.251, other: 0.227 } },
    COMMERCIAL_FOOD: { label: '음식점/카페', color: '#ff6b9d', volatility: 0.8, workerDensity: 1.0, visitorDensity: 12.0, workerWasteRate: WASTE_RATES.COMMERCIAL_FOOD.standing, visitorWasteRate: WASTE_RATES.COMMERCIAL_FOOD.visitor, icon: '🍕', wasteShares: { mixed: 0.20, food: 0.55, recyclable: 0.15, business: 0.10 } },
    COMMERCIAL_RETAIL: { label: '상점/마트', color: '#ffcf56', volatility: 0.5, workerDensity: 0.8, visitorDensity: 10.0, workerWasteRate: WASTE_RATES.COMMERCIAL_RETAIL.standing, visitorWasteRate: WASTE_RATES.COMMERCIAL_RETAIL.visitor, icon: '🛍️', wasteShares: { mixed: 0.25, food: 0.10, recyclable: 0.45, business: 0.20 } },
    SCHOOL: { label: '학교/교육시설', color: '#7ad3f0', volatility: 0.3, workerDensity: 0.5, visitorDensity: 5.0, workerWasteRate: WASTE_RATES.SCHOOL.standing, visitorWasteRate: WASTE_RATES.SCHOOL.visitor, icon: '🏫', wasteShares: { mixed: 0.35, food: 0.35, recyclable: 0.25, other: 0.05 } },
    INDUSTRIAL: { label: '산업/공장', color: '#9d66ff', volatility: 0.9, workerDensity: 3.0, visitorDensity: 0.5, workerWasteRate: WASTE_RATES.INDUSTRIAL.standing, visitorWasteRate: WASTE_RATES.INDUSTRIAL.visitor, icon: '🏭', wasteShares: { mixed: 0.05, recyclable: 0.20, business: 0.75 } },
    MEDICAL: { label: '의료/병원', color: '#ff7676', volatility: 0.4, workerDensity: 1.5, visitorDensity: 6.0, workerWasteRate: WASTE_RATES.MEDICAL.standing, visitorWasteRate: WASTE_RATES.MEDICAL.visitor, icon: '🏥', wasteShares: { mixed: 0.05, food: 0.05, recyclable: 0.05, medical: 0.75, other: 0.10 } },
    OFFICE: { label: '업무/오피스', color: '#b2b0ff', volatility: 0.4, workerDensity: 6.0, visitorDensity: 2.0, workerWasteRate: WASTE_RATES.OFFICE.standing, visitorWasteRate: WASTE_RATES.OFFICE.visitor, icon: '🏢', wasteShares: { mixed: 0.35, food: 0.15, recyclable: 0.45, other: 0.05 } },
    PARK: { label: '공원/녹지', color: '#56d8b1', volatility: 0.2, workerDensity: 0.1, visitorDensity: 4.0, workerWasteRate: WASTE_RATES.PARK.standing, visitorWasteRate: WASTE_RATES.PARK.visitor, icon: '🌳', wasteShares: { mixed: 0.45, food: 0.25, recyclable: 0.25, other: 0.05 } },
    CONSTRUCTION: { label: '공사 현장', color: '#ffd891', volatility: 1.2, workerDensity: 2.0, visitorDensity: 0.2, workerWasteRate: WASTE_RATES.CONSTRUCTION.standing, visitorWasteRate: WASTE_RATES.CONSTRUCTION.visitor, icon: '🚧', wasteShares: { mixed: 0.05, recyclable: 0.10, construction: 0.85 } },
    GOVERNMENT: { label: '공공 기관', color: '#66b2ff', volatility: 0.3, workerDensity: 1.5, visitorDensity: 8.0, workerWasteRate: WASTE_RATES.GOVERNMENT.standing, visitorWasteRate: WASTE_RATES.GOVERNMENT.visitor, icon: '🏛️', wasteShares: { mixed: 0.35, food: 0.15, recyclable: 0.45, other: 0.05 } }
};

const WASTE_STREAMS = {
    mixed: '혼합배출',
    food: '음식물',
    recyclable: '재활용',
    business: '사업장',
    construction: '건설',
    medical: '의료',
    other: '기타'
};

const SIMULATION_BASELINE = {
    unit: 'kg/일',
    collectionStorageDays: 1.5,
    minDailyFactor: 0.35,
    maxDailyFactor: 1.85,
    description: '2024 생활계폐기물 1.23kg/일·인 기준, 업종별 임시 보정계수 적용'
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

function createWasteBreakdown() {
    return Object.keys(WASTE_STREAMS).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
    }, {});
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
        
        this.resPopulation = Math.floor(size * size * 0.02 * (this.type.workerDensity || 0));
        this.floatPopulation = Math.floor(size * size * 0.02 * (this.type.visitorDensity || 0));
        this.baseDailyWaste = this.estimateDailyWaste();
        this.capacity = this.baseDailyWaste * SIMULATION_BASELINE.collectionStorageDays;
        this.wasteBreakdown = createWasteBreakdown();
        this.lastStandingWaste = 0;
        this.lastVisitorWaste = 0;
    }

    estimateDailyWaste() {
        const standingWaste = this.resPopulation * (this.type.workerWasteRate || 0);
        const visitorWaste = this.floatPopulation * (this.type.visitorWasteRate || 0);
        return (standingWaste + visitorWaste) * this.city.config.wasteScale;
    }

    randomize() {
        const baseWaste = this.estimateDailyWaste();
        const dailyFactor = clamp(
            1 + (Math.random() * 2 - 1) * this.type.volatility * 0.45,
            SIMULATION_BASELINE.minDailyFactor,
            SIMULATION_BASELINE.maxDailyFactor
        );

        const standingWaste = this.resPopulation * (this.type.workerWasteRate || 0) * this.city.config.wasteScale * dailyFactor;
        const visitorWaste = this.floatPopulation * (this.type.visitorWasteRate || 0) * this.city.config.wasteScale * dailyFactor;

        this.baseDailyWaste = baseWaste;
        this.lastStandingWaste = standingWaste;
        this.lastVisitorWaste = visitorWaste;
        this.waste = standingWaste + visitorWaste;
        this.capacity = Math.max(baseWaste * SIMULATION_BASELINE.collectionStorageDays, this.waste * 1.1, 1);
        this.wasteBreakdown = allocateWaste(this.waste, this.type.wasteShares || { other: 1 });
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
        this.totalResPopDisplay = this.container.querySelector('.total-res-pop');
        this.totalFloatPopDisplay = this.container.querySelector('.total-float-pop');
        this.totalBldDisplay = this.container.querySelector('.total-buildings');
        
        this.buildings = [];
        this.roadPaths = [];
        this.vehicles = [];
        this.totalCityWaste = 0;
        this.totalResPopulation = 0;
        this.totalFloatPopulation = 0;
        
        this.config = {
            roadWidth: 45,
            targetBuildings: 60,
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
        this.totalResPopDisplay.parentElement.title = "계산식: ∑(건물 면적 × 유형별 상주/종사 인구 밀도 × 0.02)\n* 주거지는 거주자, 비주거지는 종사자/작업자 성격의 상주 인구로 간주";
        this.totalFloatPopDisplay.parentElement.title = "계산식: ∑(건물 면적 × 유형별 방문 밀도 × 0.02)\n* 방문 밀도는 건물 유형마다 상이함";
        this.totalWasteDisplay.parentElement.title = "계산식: ∑(상주/종사 인구 × 1인 1일 배출계수 + 유동 인구 × 방문 배출계수)\n* 단위: kg/일, 업종별 변동계수 적용";
        this.totalResPopDisplay.parentElement.style.cursor = 'help';
        this.totalFloatPopDisplay.parentElement.style.cursor = 'help';
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

        while (this.buildings.length < this.config.targetBuildings && attempts < 1000) {
            const size = 35 + Math.random() * 40;
            const x = Math.random() * (w - size - 20) + 10;
            const y = Math.random() * (h - size - 20) + 10;

            let overlap = false;
            for (let road of this.roadPaths) {
                if (this.distToSegment({x: x+size/2, y: y+size/2}, {x: road.x1, y: road.y1}, {x: road.x2, y: road.y2}) < (this.config.roadWidth/2 + size/0.8)) {
                    overlap = true; break;
                }
            }
            if (!overlap) {
                for (let b of this.buildings) {
                    const dist = Math.sqrt(Math.pow((b.x + b.w/2) - (x + size/2), 2) + Math.pow((b.y + b.h/2) - (y + size/2), 2));
                    if (dist < (b.w/2 + size/2 + 10)) { overlap = true; break; }
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
                b.resPopulation = Math.floor(size * size * 0.02 * (b.type.workerDensity || 0));
                b.floatPopulation = Math.floor(size * size * 0.02 * (b.type.visitorDensity || 0));
                b.baseDailyWaste = b.estimateDailyWaste();
                b.capacity = b.baseDailyWaste * SIMULATION_BASELINE.collectionStorageDays;
                b.wasteBreakdown = createWasteBreakdown();
                b.lastStandingWaste = 0;
                b.lastVisitorWaste = 0;
                
                this.buildings.push(b);
            }
            attempts++;
        }
        
        this.totalResPopulation = this.buildings.reduce((sum, b) => sum + (b.resPopulation || 0), 0);
        this.totalFloatPopulation = this.buildings.reduce((sum, b) => sum + (b.floatPopulation || 0), 0);
        this.totalResPopDisplay.innerText = this.totalResPopulation.toLocaleString();
        this.totalFloatPopDisplay.innerText = this.totalFloatPopulation.toLocaleString();
        this.totalBldDisplay.innerText = this.buildings.length;

        this.updateStatsTooltips();
    }

    updateStatsTooltips() {
        const stats = {};
        Object.keys(BUILDING_TYPES).forEach(type => {
            stats[type] = { count: 0, resPop: 0, floatPop: 0, resWaste: 0, floatWaste: 0, totalWaste: 0 };
        });

        this.buildings.forEach(b => {
            const s = stats[b.typeKey];
            s.count++;
            s.resPop += b.resPopulation || 0;
            s.floatPop += b.floatPopulation || 0;
            
            s.resWaste += b.lastStandingWaste || 0;
            s.floatWaste += b.lastVisitorWaste || 0;
            s.totalWaste += b.waste;
        });

        const createTooltipHTML = (title, items) => {
            let html = `<div class="tooltip-title">${title}</div><div class="tooltip-info">`;
            items.forEach(item => {
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

        // 상주/종사 인구 툴팁
        setupHeaderTooltip(this.totalResPopDisplay, () => "🏠 상주/종사 인구 상세", () => {
            return Object.keys(BUILDING_TYPES)
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${stats[k].resPop.toLocaleString()}명 (${formatKg(stats[k].resWaste)}kg/일)`,
                    show: stats[k].resPop > 0 || stats[k].resWaste > 0
                }))
                .filter(i => i.show);
        });

        // 유동 인구 툴팁
        setupHeaderTooltip(this.totalFloatPopDisplay, () => "🏃 유동 인구 상세", () => {
            return Object.keys(BUILDING_TYPES)
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${stats[k].floatPop.toLocaleString()}명 (${formatKg(stats[k].floatWaste)}kg/일)`,
                    show: stats[k].floatPop > 0 || stats[k].floatWaste > 0
                }))
                .filter(i => i.show);
        });

        // 폐기물 툴팁
        setupHeaderTooltip(this.totalWasteDisplay, () => "♻️ 유형별 1일 폐기물 배출량", () => {
            return Object.keys(BUILDING_TYPES)
                .map(k => ({
                    label: BUILDING_TYPES[k].label,
                    value: `${formatKg(stats[k].totalWaste)}kg/일`,
                    show: stats[k].totalWaste > 0
                }))
                .filter(i => i.show);
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

document.querySelectorAll('.btn-settings').forEach(btn => {
    btn.onclick = (e) => {
        const target = e.currentTarget.dataset.city;
        activeCity = (target === 'left') ? cityLeft : cityRight;
        
        document.getElementById('modal-title').innerText = `도시 ${target === 'left' ? 'A' : 'B'} 설정`;
        document.getElementById('show-types').checked = activeCity.config.showTypes;
        document.getElementById('spawn-rate').value = activeCity.config.spawnChance * 1000;
        document.getElementById('waste-scale').value = activeCity.config.wasteScale * 100;
        
        roadLayoutSelect.value = activeCity.config.roadLayout || 0;
        presetSelect.value = activeCity.config.preset || 'custom';
        
        updateRatioUI();
        modal.style.display = 'block';
    };
});

closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// 설정 변경 적용
document.getElementById('show-types').onchange = (e) => activeCity.config.showTypes = e.target.checked;
document.getElementById('spawn-rate').oninput = (e) => activeCity.config.spawnChance = e.target.value / 1000;
document.getElementById('waste-scale').oninput = (e) => activeCity.config.wasteScale = e.target.value / 100;

roadLayoutSelect.onchange = (e) => activeCity.config.roadLayout = parseInt(e.target.value);
presetSelect.onchange = (e) => {
    const val = e.target.value;
    activeCity.config.preset = val;
    if (val !== 'custom') {
        activeCity.config.typeWeights = { ...RATIO_PRESETS[val] };
        updateRatioUI();
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
            `• 상주/종사 인구 밀도: ${type.workerDensity}\n` +
            `• 유동 인구 밀도: ${type.visitorDensity}\n` +
            `• 상주/종사 1인 1일 배출계수: ${type.workerWasteRate}kg/일\n` +
            `• 방문 1인 배출계수: ${type.visitorWasteRate}kg/일`;

        item.innerHTML = `
            <label title="${statsInfo}" style="cursor: help;">${type.icon} ${type.label} ⓘ</label>
            <input type="range" min="0" max="100" value="${activeCity.config.typeWeights[key]}" data-type="${key}">
        `;
        item.querySelector('input').oninput = (e) => {
            activeCity.config.typeWeights[key] = parseInt(e.target.value);
            activeCity.config.preset = 'custom';
            presetSelect.value = 'custom';
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
    csvContent += [
        "도시", "ID", "이름", "유형", "상주/종사인구(명)", "유동인구(명)",
        "상주계수(kg/일·인)", "유동계수(kg/일·인)", "총폐기물(kg/일)",
        "혼합배출(kg/일)", "음식물(kg/일)", "재활용(kg/일)", "사업장(kg/일)",
        "건설(kg/일)", "의료(kg/일)", "기타(kg/일)", "임시보관용량(kg)"
    ].join(",") + "\n";

    const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
    
    const exportData = (city, label) => {
        city.buildings.forEach((b, i) => {
            const breakdown = b.wasteBreakdown || createWasteBreakdown();
            const row = [
                label,
                i + 1,
                b.name,
                b.type.label,
                b.resPopulation,
                b.floatPopulation,
                (b.type.workerWasteRate || 0).toFixed(2),
                (b.type.visitorWasteRate || 0).toFixed(2),
                Math.round(b.waste),
                Math.round(breakdown.mixed),
                Math.round(breakdown.food),
                Math.round(breakdown.recyclable),
                Math.round(breakdown.business),
                Math.round(breakdown.construction),
                Math.round(breakdown.medical),
                Math.round(breakdown.other),
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

            const resWaste = hovered.lastStandingWaste || 0;
            const floatWaste = hovered.lastVisitorWaste || 0;
            const breakdownRows = Object.keys(WASTE_STREAMS)
                .filter(key => (hovered.wasteBreakdown?.[key] || 0) > 0)
                .map(key => `
                    <div class="tooltip-row"><span class="tooltip-label">${WASTE_STREAMS[key]}</span><span class="tooltip-value">${formatKg(hovered.wasteBreakdown[key])} kg/일</span></div>
                `)
                .join('');

            tooltip.innerHTML = `
                <div class="tooltip-title"><span>${hovered.type.icon}</span><span>${hovered.name}</span></div>
                <div class="tooltip-info">
                    <div class="tooltip-row"><span class="tooltip-label">유형</span><span class="tooltip-value">${hovered.type.label}</span></div>
                    <div class="tooltip-row"><span class="tooltip-label">상주/종사 인구</span><span class="tooltip-value">${hovered.resPopulation.toLocaleString()}명</span></div>
                    <div class="tooltip-row"><span class="tooltip-label">유동인구</span><span class="tooltip-value">${hovered.floatPopulation.toLocaleString()}명</span></div>
                    <div class="tooltip-divider" style="height: 1px; background: rgba(255,255,255,0.1); margin: 5px 0;"></div>
                    <div class="tooltip-row"><span class="tooltip-label">상주/종사 폐기물</span><span class="tooltip-value">${formatKg(resWaste)} kg/일</span></div>
                    <div class="tooltip-row"><span class="tooltip-label">유동 폐기물</span><span class="tooltip-value">${formatKg(floatWaste)} kg/일</span></div>
                    <div class="tooltip-row"><span class="tooltip-label">총 폐기물</span><span class="tooltip-value">${formatKg(hovered.waste)} kg/일</span></div>
                    ${breakdownRows}
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
