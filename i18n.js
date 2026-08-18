(function () {
    const STORAGE_KEY = 'urban-waste-language';
    const DEFAULT_LANGUAGE = 'ko';
    const LANGUAGE_META = {
        ko: { htmlLang: 'ko', locale: 'ko-KR', flagAsset: './assets/flags/ko.svg' },
        en: { htmlLang: 'en', locale: 'en-US', flagAsset: './assets/flags/en.svg' },
        ja: { htmlLang: 'ja', locale: 'ja-JP', flagAsset: './assets/flags/ja.svg' },
        zh: { htmlLang: 'zh-Hans', locale: 'zh-CN', flagAsset: './assets/flags/zh.svg' }
    };

    const TRANSLATIONS = {
        ko: {
            'app.title.comparison': '도시 폐기물 비교 시뮬레이션',
            'app.title.single': '도시 폐기물 시뮬레이션',
            'language.label': '언어',
            'entry.progressLabel': '현재 단계: 메인 메뉴',
            'entry.stepMode': '01 메인 메뉴',
            'entry.stepSimulation': '02 시뮬레이션',
            'entry.title': '도시의 하루를<br>비교해보세요',
            'entry.description': '건물 구성과 인구 조건이 달라지면 폐기물 발생량은 어떻게 바뀔까요? 분석할 도시 범위를 먼저 선택하세요.',
            'entry.modesLabel': '시뮬레이션 모드',
            'entry.comparisonTitle': '두 도시 비교',
            'entry.comparisonDescription': '서로 다른 도시 A와 B의 구성과 하루 배출량을 나란히 비교합니다.',
            'entry.defaultBadge': '기본',
            'entry.singleTitle': '단일 도시',
            'entry.singleDescription': '한 도시를 넓게 펼쳐 놓고 건물별 배출 구조를 자세히 살펴봅니다.',
            'entry.start': '시뮬레이션 시작',
            'entry.note': '선택한 모드로 시뮬레이션을 바로 시작합니다.',
            'controls.generateHint': '아직 1일 폐기물 생산 전이에요. 먼저 눌러주세요.',
            'controls.generate': '1일 폐기물 생산',
            'controls.download': '통계 다운로드',
            'controls.viewSettings': '보기 설정',
            'controls.modeSelect': '메인 메뉴',
            'controls.themeLight': '화이트',
            'controls.themeDark': '다크',
            'controls.type': '유형',
            'controls.hide': '숨김',
            'typeGuide.message': '보기 설정의 <strong>유형</strong> 버튼을 켜면 건물 색상과 일부 아이콘으로 건물 유형을 확인할 수 있어요.',
            'typeGuide.close': '건물 유형 안내 닫기',
            'comparison.label': '1일 폐기물 발생량 상대 비중',
            'comparison.cityPercent': '{city} ({percent}%)',
            'city.single': '도시',
            'city.left': '도시 A',
            'city.right': '도시 B',
            'city.random': '랜덤 도시',
            'city.settings': '⚙️ 설정',
            'city.settingsTitle': '{city} 설정',
            'stat.buildings': '건물',
            'stat.resident': '거주 인구',
            'stat.worker': '종사 인구',
            'stat.visitor': '유동 인구',
            'stat.wastePerDay': '폐기물/일',
            'unit.buildingSuffix': '동',
            'unit.peopleSuffix': '명',
            'unit.kgDay': 'kg/일',
            'unit.tonDay': '톤/일',
            'unit.vehicleSuffix': '대',
            'unit.peopleValue': '{value}명',
            'unit.buildingValue': '{value}동',
            'unit.kgDayValue': '{value}kg/일',
            'settings.title': '도시 설정',
            'settings.close': '설정 창 닫기',
            'settings.audio': '오디오',
            'settings.soundEffects': '버튼 효과음 사용',
            'settings.visualization': '건물 시각화',
            'settings.showTypes': '건물 유형 표시 (색상/아이콘)',
            'settings.actualData': '실제 도시 데이터 입력',
            'settings.targetResident': '목표 거주 인구',
            'settings.targetWorker': '목표 종사 인구',
            'settings.targetVisitor': '목표 유동 인구',
            'settings.targetWaste': '목표 폐기물 톤/일',
            'settings.exampleResident': '예: 363496',
            'settings.exampleWaste': '예: 345.5',
            'settings.optional': '선택',
            'settings.autoFit': '도시 데이터로 자동 맞춤',
            'settings.fitDefault': '거주 인구만 넣어도 인구 기준 배율을 자동 계산합니다.',
            'settings.parameters': '시뮬레이션 파라미터',
            'settings.buildingCount': '건물 개수',
            'settings.populationScale': '인구 기준 배율',
            'settings.estimateResident': '예상 거주 인구',
            'settings.estimateWorker': '예상 종사 인구',
            'settings.estimateVisitor': '예상 유동 인구',
            'settings.estimateTotal': '예상 총 인구',
            'settings.wasteRatio': '폐기물 발생 비율',
            'settings.saving': '절약형',
            'settings.koreaAverage': '대한민국 평균',
            'settings.wasteful': '막배출형',
            'settings.normalCity': '보통 도시',
            'settings.normalDescription': '대한민국 생활폐기물 평균 배출계수를 그대로 적용합니다.',
            'settings.roadStructure': '도로 구조',
            'road.0': '기본 (대각선 교차)',
            'road.1': '그리드 (격자형)',
            'road.2': '순환도로',
            'road.3': '수평 평행선',
            'road.4': '중앙 간선 + 지선',
            'road.5': '방사형 교차로',
            'road.6': '외곽 우회 + 내부 연결',
            'settings.other': '기타 설정',
            'settings.trafficRatio': '자동차 비율',
            'settings.trafficDefault': '인구 규모에 따라 자동차 수가 자동으로 정해집니다.',
            'settings.typeWeights': '건물 유형 비율 (가중치)',
            'preset.custom': '사용자 지정',
            'preset.villa': '빌라/저층 주거지',
            'preset.apartment': '아파트 단지',
            'preset.oldDowntown': '원도심/상가 밀집지',
            'preset.officeDistrict': '업무지구',
            'preset.factoryDistrict': '공장지대',
            'preset.mixedCity': '복합 생활권',
            'settings.cityControl': '도시 제어',
            'settings.rebuild': '🏙️ 도시 재구성',
            'download.title': '통계 정렬 방식 선택',
            'download.close': '통계 다운로드 창 닫기',
            'download.description': '선택한 기준으로 건물 통계를 정렬해 CSV 파일로 저장합니다. 두 도시 모드에서는 도시별로 나누어 정렬됩니다.',
            'download.sortLegend': '정렬 기준',
            'download.typeTitle': '유형별 묶음',
            'download.typeDescription': '같은 건물 유형끼리 묶고, 유형 안에서는 폐기물 발생량이 많은 순으로 정렬',
            'download.wasteTitle': '폐기물 발생량순',
            'download.wasteDescription': '건물 유형과 관계없이 하루 폐기물 발생량이 많은 건물부터 정렬',
            'download.populationTitle': '전체 인구순',
            'download.populationDescription': '거주·종사·유동 인구를 합산해 인구가 많은 건물부터 정렬',
            'download.nameTitle': '건물 이름순',
            'download.nameDescription': '건물 이름을 가나다순으로 정렬',
            'download.cancel': '취소',
            'download.save': 'CSV 파일로 저장',
            'message.randomized': '도로, 건물 수, 인구 배율, 자동차 비율, 건물 유형 비율을 새로 섞었습니다.',
            'message.trafficEstimate': '예상 인구 기준 자동차 수: 약 {count}대',
            'message.populationScale': '인구 기준 배율 {value}배',
            'message.workerScale': '종사 인구 보정 {value}배',
            'message.visitorScale': '유동 인구 보정 {value}배',
            'message.wasteScale': '폐기물 발생 배율 {value}%',
            'message.fitApplied': '{messages} 적용. 예상 거주 {resident}명, 종사 {worker}명, 유동 {visitor}명, 폐기물 {waste}톤/일.',
            'message.fitRequired': '목표 거주 인구, 종사 인구, 유동 인구 또는 폐기물 톤/일 중 하나 이상을 입력하세요.',
            'message.wasteEstimate': '{profile} 기준으로 예상 폐기물은 약 {waste}톤/일입니다.',
            'scale.savingLabel': '절약형 {percent}%',
            'scale.savingTitle': '절약하는 도시',
            'scale.savingDescription': '대한민국 평균보다 약 {diff}% 적게 배출합니다. 감량, 재사용, 분리배출이 잘 되는 도시로 가정합니다.',
            'scale.wastefulLabel': '막배출형 {percent}%',
            'scale.wastefulTitle': '막폐기하는 도시',
            'scale.wastefulDescription': '대한민국 평균보다 약 {diff}% 많이 배출합니다. 일회용품 사용과 혼합배출이 많은 도시로 가정합니다.',
            'scale.averageLabel': '대한민국 평균 {percent}%',
            'scale.averageTitle': '보통 도시',
            'scale.averageDescription': '대한민국 생활폐기물 평균 배출계수를 그대로 적용합니다. 슬라이더 중앙값 100%가 기준입니다.',
            'tooltip.buildingStats': '🏙️ 건물 유형별 통계',
            'tooltip.residentDetails': '🏠 거주 인구 상세',
            'tooltip.workerDetails': '🏢 종사 인구 상세',
            'tooltip.visitorDetails': '🏃 유동 인구 상세',
            'tooltip.wasteDetails': '♻️ 1일 폐기물 배출량 상세',
            'tooltip.categories': '배출 카테고리',
            'tooltip.materials': '세부 폐기물',
            'tooltip.types': '건물 유형별',
            'tooltip.type': '유형',
            'tooltip.standingWaste': '거주/종사 폐기물',
            'tooltip.visitorWaste': '유동 폐기물',
            'tooltip.specialWaste': '특수 폐기물',
            'tooltip.totalWaste': '총 폐기물',
            'tooltip.saturation': '포화도',
            'ratio.stats': '[{type} 통계]',
            'ratio.standingDensity': '• 거주/종사 인구 밀도: {value}',
            'ratio.visitorDensity': '• 유동 인구 밀도: {value}',
            'ratio.populationScale': '• 현재 인구 기준 배율: {value}배',
            'ratio.standingRate': '• 거주/종사 1인 1일 배출계수: {value}kg/일',
            'ratio.visitorRate': '• 방문 1인 배출계수: {value}kg/일',
            'ratio.specialWaste': '• 특수 폐기물: {value}',
            'ratio.specialApplied': '건물 유형별 별도 발생분 적용',
            'ratio.none': '없음',
            'header.residentFormula': '계산식: 주거 시설 면적 × 거주 밀도 × 인구 기준 배율\n* 주민등록인구처럼 실제 거주자를 맞추는 값',
            'header.workerFormula': '계산식: 비주거 시설 면적 × 종사자 밀도 × 인구 기준 배율 × 종사 인구 보정\n* 사업체 종사자/작업자 성격의 인구',
            'header.visitorFormula': '계산식: 건물 면적 × 방문 밀도 × 인구 기준 배율 × 유동 인구 보정\n* 방문자, 통행자, 이용자 성격의 인구',
            'header.wasteFormula': '계산식: ∑((거주+종사 인구) × 1인 1일 생활폐기물 계수 + 유동 인구 × 방문 배출계수 + 건물 유형별 특수 폐기물)\n* 단위: kg/일, 2023년 전국 생활폐기물 1.2kg/일·인과 제6차 조성비 기준 보정',
            'csv.city': '도시', 'csv.id': 'ID', 'csv.name': '이름', 'csv.type': '유형',
            'csv.populationScale': '인구기준배율', 'csv.workerScale': '종사인구보정', 'csv.visitorScale': '유동인구보정',
            'csv.resident': '거주인구(명)', 'csv.worker': '종사인구(명)', 'csv.visitor': '유동인구(명)',
            'csv.standingRate': '거주/종사계수(kg/일·인)', 'csv.visitorRate': '유동계수(kg/일·인)',
            'csv.specialWaste': '특수폐기물(kg/일)', 'csv.totalWaste': '총폐기물(kg/일)',
            'csv.capacity': '임시보관용량(kg)', 'csv.kgDaySuffix': '(kg/일)'
        },
        en: {
            'app.title.comparison': 'Urban Waste Comparison Simulation',
            'app.title.single': 'Urban Waste Simulation',
            'language.label': 'Language',
            'entry.progressLabel': 'Current step: main menu',
            'entry.stepMode': '01 MAIN MENU',
            'entry.stepSimulation': '02 SIMULATION',
            'entry.title': 'Compare a day<br>in the city',
            'entry.description': 'How does daily waste change with different building mixes and population conditions? Choose the city scope to analyze.',
            'entry.modesLabel': 'Simulation mode',
            'entry.comparisonTitle': 'Compare two cities',
            'entry.comparisonDescription': 'Compare the composition and daily waste of Cities A and B side by side.',
            'entry.defaultBadge': 'DEFAULT',
            'entry.singleTitle': 'Single city',
            'entry.singleDescription': 'Explore one city at full width and inspect the waste structure of each building.',
            'entry.start': 'Start simulation',
            'entry.note': 'The simulation starts immediately in the selected mode.',
            'controls.generateHint': 'Daily waste has not been generated yet. Start here.',
            'controls.generate': 'Generate daily waste',
            'controls.download': 'Download statistics',
            'controls.viewSettings': 'View settings',
            'controls.modeSelect': 'Main menu',
            'controls.themeLight': 'Light',
            'controls.themeDark': 'Dark',
            'controls.type': 'Types',
            'controls.hide': 'Hide',
            'typeGuide.message': 'Turn on <strong>Types</strong> in View Settings to identify building types by color and selected icons.',
            'typeGuide.close': 'Close building type guide',
            'comparison.label': 'Relative share of daily waste generation',
            'comparison.cityPercent': '{city} ({percent}%)',
            'city.single': 'City', 'city.left': 'City A', 'city.right': 'City B',
            'city.random': 'Random city', 'city.settings': '⚙️ Settings', 'city.settingsTitle': '{city} settings',
            'stat.buildings': 'Buildings', 'stat.resident': 'Residents', 'stat.worker': 'Workers', 'stat.visitor': 'Visitors', 'stat.wastePerDay': 'Waste/day',
            'unit.buildingSuffix': '', 'unit.peopleSuffix': '', 'unit.kgDay': 'kg/day', 'unit.tonDay': 't/day', 'unit.vehicleSuffix': '',
            'unit.peopleValue': '{value} people', 'unit.buildingValue': '{value} buildings', 'unit.kgDayValue': '{value} kg/day',
            'settings.title': 'City settings', 'settings.close': 'Close city settings', 'settings.audio': 'Audio', 'settings.soundEffects': 'Use button sound effects', 'settings.visualization': 'Building visualization',
            'settings.showTypes': 'Show building types (colors/icons)', 'settings.actualData': 'Enter real city data',
            'settings.targetResident': 'Target resident population', 'settings.targetWorker': 'Target worker population',
            'settings.targetVisitor': 'Target visitor population', 'settings.targetWaste': 'Target waste (t/day)',
            'settings.exampleResident': 'e.g. 363496', 'settings.exampleWaste': 'e.g. 345.5', 'settings.optional': 'Optional',
            'settings.autoFit': 'Auto-fit to city data', 'settings.fitDefault': 'Enter only the resident population to calculate the population scale automatically.',
            'settings.parameters': 'Simulation parameters', 'settings.buildingCount': 'Building count', 'settings.populationScale': 'Population scale',
            'settings.estimateResident': 'Estimated residents', 'settings.estimateWorker': 'Estimated workers',
            'settings.estimateVisitor': 'Estimated visitors', 'settings.estimateTotal': 'Estimated total population',
            'settings.wasteRatio': 'Waste generation ratio', 'settings.saving': 'Low waste', 'settings.koreaAverage': 'Korea average',
            'settings.wasteful': 'High waste', 'settings.normalCity': 'Average city',
            'settings.normalDescription': 'Applies South Korea’s average municipal waste generation factors.',
            'settings.roadStructure': 'Road layout',
            'road.0': 'Default (diagonal crossing)', 'road.1': 'Grid', 'road.2': 'Ring road', 'road.3': 'Horizontal parallels',
            'road.4': 'Central artery + branches', 'road.5': 'Radial intersection', 'road.6': 'Outer bypass + inner links',
            'settings.other': 'Other settings', 'settings.trafficRatio': 'Traffic ratio',
            'settings.trafficDefault': 'Vehicle count is calculated automatically from the population.',
            'settings.typeWeights': 'Building type ratios (weights)',
            'preset.custom': 'Custom', 'preset.villa': 'Low-rise residential', 'preset.apartment': 'Apartment complex',
            'preset.oldDowntown': 'Old downtown / retail', 'preset.officeDistrict': 'Office district',
            'preset.factoryDistrict': 'Industrial district', 'preset.mixedCity': 'Mixed neighborhood',
            'settings.cityControl': 'City controls', 'settings.rebuild': '🏙️ Rebuild city',
            'download.title': 'Choose statistics sorting', 'download.close': 'Close statistics download dialog',
            'download.description': 'Sort building statistics by the selected criterion and save them as a CSV file. In comparison mode, rows are grouped by city.',
            'download.sortLegend': 'Sort by', 'download.typeTitle': 'Group by type',
            'download.typeDescription': 'Group identical building types, then sort each group by highest waste generation.',
            'download.wasteTitle': 'Waste generation', 'download.wasteDescription': 'Sort all buildings from highest to lowest daily waste generation.',
            'download.populationTitle': 'Total population', 'download.populationDescription': 'Sort by the combined resident, worker, and visitor population.',
            'download.nameTitle': 'Building name', 'download.nameDescription': 'Sort building names alphabetically.',
            'download.cancel': 'Cancel', 'download.save': 'Save CSV file',
            'message.randomized': 'Roads, building count, population scale, traffic, and building type ratios were randomized.',
            'message.trafficEstimate': 'Estimated vehicles for this population: about {count}',
            'message.populationScale': 'Population scale {value}×', 'message.workerScale': 'Worker adjustment {value}×',
            'message.visitorScale': 'Visitor adjustment {value}×', 'message.wasteScale': 'Waste generation scale {value}%',
            'message.fitApplied': '{messages} applied. Estimated residents {resident}, workers {worker}, visitors {visitor}, waste {waste} t/day.',
            'message.fitRequired': 'Enter at least one target: residents, workers, visitors, or waste per day.',
            'message.wasteEstimate': 'Estimated waste for {profile}: about {waste} t/day.',
            'scale.savingLabel': 'Low waste {percent}%', 'scale.savingTitle': 'Waste-conscious city',
            'scale.savingDescription': 'Emits about {diff}% less than the South Korean average, assuming strong reduction, reuse, and sorting practices.',
            'scale.wastefulLabel': 'High waste {percent}%', 'scale.wastefulTitle': 'High-waste city',
            'scale.wastefulDescription': 'Emits about {diff}% more than the South Korean average, assuming more disposable products and mixed waste.',
            'scale.averageLabel': 'Korea average {percent}%', 'scale.averageTitle': 'Average city',
            'scale.averageDescription': 'Applies South Korea’s average municipal waste factors. The center value of 100% is the baseline.',
            'tooltip.buildingStats': '🏙️ Statistics by building type', 'tooltip.residentDetails': '🏠 Resident details',
            'tooltip.workerDetails': '🏢 Worker details', 'tooltip.visitorDetails': '🏃 Visitor details',
            'tooltip.wasteDetails': '♻️ Daily waste details', 'tooltip.categories': 'Waste categories',
            'tooltip.materials': 'Waste materials', 'tooltip.types': 'By building type', 'tooltip.type': 'Type',
            'tooltip.standingWaste': 'Resident/worker waste', 'tooltip.visitorWaste': 'Visitor waste',
            'tooltip.specialWaste': 'Special waste', 'tooltip.totalWaste': 'Total waste', 'tooltip.saturation': 'Capacity used',
            'ratio.stats': '[{type} statistics]', 'ratio.standingDensity': '• Resident/worker density: {value}',
            'ratio.visitorDensity': '• Visitor density: {value}', 'ratio.populationScale': '• Current population scale: {value}×',
            'ratio.standingRate': '• Resident/worker daily rate: {value} kg/day', 'ratio.visitorRate': '• Visitor rate: {value} kg/day',
            'ratio.specialWaste': '• Special waste: {value}', 'ratio.specialApplied': 'Separate type-specific generation applied', 'ratio.none': 'None',
            'header.residentFormula': 'Formula: residential area × resident density × population scale\n* Used to match the actual resident population.',
            'header.workerFormula': 'Formula: non-residential area × worker density × population scale × worker adjustment\n* Represents employees and on-site workers.',
            'header.visitorFormula': 'Formula: building area × visitor density × population scale × visitor adjustment\n* Represents visitors, passersby, and users.',
            'header.wasteFormula': 'Formula: Σ((residents + workers) × daily municipal rate + visitors × visitor rate + type-specific special waste)\n* Unit: kg/day; calibrated to South Korean municipal waste statistics.',
            'csv.city': 'City', 'csv.id': 'ID', 'csv.name': 'Name', 'csv.type': 'Type',
            'csv.populationScale': 'Population scale', 'csv.workerScale': 'Worker adjustment', 'csv.visitorScale': 'Visitor adjustment',
            'csv.resident': 'Residents', 'csv.worker': 'Workers', 'csv.visitor': 'Visitors',
            'csv.standingRate': 'Resident/worker rate (kg/day/person)', 'csv.visitorRate': 'Visitor rate (kg/day/person)',
            'csv.specialWaste': 'Special waste (kg/day)', 'csv.totalWaste': 'Total waste (kg/day)',
            'csv.capacity': 'Temporary storage capacity (kg)', 'csv.kgDaySuffix': ' (kg/day)'
        },
        ja: {
            'app.title.comparison': '都市廃棄物比較シミュレーション', 'app.title.single': '都市廃棄物シミュレーション', 'language.label': '言語',
            'entry.progressLabel': '現在のステップ：メインメニュー', 'entry.stepMode': '01 メインメニュー', 'entry.stepSimulation': '02 シミュレーション',
            'entry.title': '都市の一日を<br>比較してみましょう',
            'entry.description': '建物構成や人口条件が変わると、廃棄物発生量はどう変化するでしょうか。分析する都市の範囲を選択してください。',
            'entry.modesLabel': 'シミュレーションモード', 'entry.comparisonTitle': '2都市を比較',
            'entry.comparisonDescription': '異なる都市AとBの構成と1日の排出量を並べて比較します。', 'entry.defaultBadge': '標準',
            'entry.singleTitle': '単一都市', 'entry.singleDescription': '1つの都市を広く表示し、建物ごとの排出構造を詳しく確認します。',
            'entry.start': 'シミュレーション開始', 'entry.note': '選択したモードですぐにシミュレーションを開始します。',
            'controls.generateHint': '1日分の廃棄物はまだ生成されていません。まずここを押してください。', 'controls.generate': '1日分の廃棄物を生成',
            'controls.download': '統計をダウンロード', 'controls.viewSettings': '表示設定', 'controls.modeSelect': 'メインメニュー',
            'controls.themeLight': 'ライト', 'controls.themeDark': 'ダーク', 'controls.type': '種類', 'controls.hide': '非表示',
            'typeGuide.message': '表示設定の<strong>種類</strong>をオンにすると、色と一部のアイコンで建物の種類を確認できます。',
            'typeGuide.close': '建物種類ガイドを閉じる', 'comparison.label': '1日廃棄物発生量の相対比率',
            'comparison.cityPercent': '{city}（{percent}%）', 'city.single': '都市', 'city.left': '都市A', 'city.right': '都市B',
            'city.random': 'ランダム都市', 'city.settings': '⚙️ 設定', 'city.settingsTitle': '{city}の設定',
            'stat.buildings': '建物', 'stat.resident': '居住人口', 'stat.worker': '就業人口', 'stat.visitor': '流動人口', 'stat.wastePerDay': '廃棄物/日',
            'unit.buildingSuffix': '棟', 'unit.peopleSuffix': '人', 'unit.kgDay': 'kg/日', 'unit.tonDay': 'トン/日', 'unit.vehicleSuffix': '台',
            'unit.peopleValue': '{value}人', 'unit.buildingValue': '{value}棟', 'unit.kgDayValue': '{value}kg/日',
            'settings.title': '都市設定', 'settings.close': '都市設定を閉じる', 'settings.audio': 'オーディオ', 'settings.soundEffects': 'ボタン効果音を使用', 'settings.visualization': '建物の可視化', 'settings.showTypes': '建物種類を表示（色/アイコン）',
            'settings.actualData': '実都市データを入力', 'settings.targetResident': '目標居住人口', 'settings.targetWorker': '目標就業人口',
            'settings.targetVisitor': '目標流動人口', 'settings.targetWaste': '目標廃棄物量（トン/日）',
            'settings.exampleResident': '例：363496', 'settings.exampleWaste': '例：345.5', 'settings.optional': '任意',
            'settings.autoFit': '都市データに自動調整', 'settings.fitDefault': '居住人口だけでも人口基準倍率を自動計算します。',
            'settings.parameters': 'シミュレーションパラメータ', 'settings.buildingCount': '建物数', 'settings.populationScale': '人口基準倍率',
            'settings.estimateResident': '推定居住人口', 'settings.estimateWorker': '推定就業人口', 'settings.estimateVisitor': '推定流動人口',
            'settings.estimateTotal': '推定総人口', 'settings.wasteRatio': '廃棄物発生比率', 'settings.saving': '節約型',
            'settings.koreaAverage': '韓国平均', 'settings.wasteful': '大量排出型', 'settings.normalCity': '標準都市',
            'settings.normalDescription': '韓国の一般廃棄物平均排出係数を適用します。', 'settings.roadStructure': '道路構造',
            'road.0': '基本（斜め交差）', 'road.1': 'グリッド（格子）', 'road.2': '環状道路', 'road.3': '水平平行線',
            'road.4': '中央幹線＋支線', 'road.5': '放射状交差点', 'road.6': '外周迂回＋内部接続',
            'settings.other': 'その他の設定', 'settings.trafficRatio': '自動車比率', 'settings.trafficDefault': '人口規模から自動車数を自動計算します。',
            'settings.typeWeights': '建物種類の比率（重み）', 'preset.custom': 'カスタム', 'preset.villa': '低層住宅地',
            'preset.apartment': '集合住宅団地', 'preset.oldDowntown': '旧市街・商店街', 'preset.officeDistrict': 'オフィス街',
            'preset.factoryDistrict': '工業地域', 'preset.mixedCity': '複合生活圏', 'settings.cityControl': '都市操作', 'settings.rebuild': '🏙️ 都市を再構築',
            'download.title': '統計の並べ替え方法を選択', 'download.close': '統計ダウンロード画面を閉じる',
            'download.description': '選択した基準で建物統計を並べ替えてCSVに保存します。比較モードでは都市ごとにまとめます。',
            'download.sortLegend': '並べ替え基準', 'download.typeTitle': '種類別にまとめる',
            'download.typeDescription': '同じ建物種類をまとめ、各種類内で廃棄物発生量の多い順に並べます。',
            'download.wasteTitle': '廃棄物発生量順', 'download.wasteDescription': '建物種類に関係なく、1日の廃棄物発生量が多い順に並べます。',
            'download.populationTitle': '総人口順', 'download.populationDescription': '居住・就業・流動人口の合計が多い順に並べます。',
            'download.nameTitle': '建物名順', 'download.nameDescription': '建物名を五十音順に並べます。', 'download.cancel': 'キャンセル', 'download.save': 'CSVで保存',
            'message.randomized': '道路、建物数、人口倍率、自動車比率、建物種類比率を再設定しました。',
            'message.trafficEstimate': '推定人口に基づく自動車数：約{count}台', 'message.populationScale': '人口基準倍率 {value}倍',
            'message.workerScale': '就業人口補正 {value}倍', 'message.visitorScale': '流動人口補正 {value}倍', 'message.wasteScale': '廃棄物発生倍率 {value}%',
            'message.fitApplied': '{messages}を適用。推定居住{resident}人、就業{worker}人、流動{visitor}人、廃棄物{waste}トン/日。',
            'message.fitRequired': '目標居住人口、就業人口、流動人口、廃棄物量のいずれかを入力してください。',
            'message.wasteEstimate': '{profile}基準の推定廃棄物量は約{waste}トン/日です。',
            'scale.savingLabel': '節約型 {percent}%', 'scale.savingTitle': '節約する都市',
            'scale.savingDescription': '韓国平均より約{diff}%少なく、削減・再使用・分別が進んだ都市を想定します。',
            'scale.wastefulLabel': '大量排出型 {percent}%', 'scale.wastefulTitle': '大量排出都市',
            'scale.wastefulDescription': '韓国平均より約{diff}%多く、使い捨て品と混合排出が多い都市を想定します。',
            'scale.averageLabel': '韓国平均 {percent}%', 'scale.averageTitle': '標準都市',
            'scale.averageDescription': '韓国の一般廃棄物平均排出係数を適用します。スライダー中央の100%が基準です。',
            'tooltip.buildingStats': '🏙️ 建物種類別統計', 'tooltip.residentDetails': '🏠 居住人口の詳細',
            'tooltip.workerDetails': '🏢 就業人口の詳細', 'tooltip.visitorDetails': '🏃 流動人口の詳細',
            'tooltip.wasteDetails': '♻️ 1日廃棄物量の詳細', 'tooltip.categories': '排出カテゴリー', 'tooltip.materials': '廃棄物の内訳',
            'tooltip.types': '建物種類別', 'tooltip.type': '種類', 'tooltip.standingWaste': '居住・就業者の廃棄物',
            'tooltip.visitorWaste': '流動人口の廃棄物', 'tooltip.specialWaste': '特殊廃棄物', 'tooltip.totalWaste': '総廃棄物', 'tooltip.saturation': '充填率',
            'ratio.stats': '［{type}の統計］', 'ratio.standingDensity': '• 居住・就業人口密度：{value}', 'ratio.visitorDensity': '• 流動人口密度：{value}',
            'ratio.populationScale': '• 現在の人口基準倍率：{value}倍', 'ratio.standingRate': '• 居住・就業者1人1日排出係数：{value}kg/日',
            'ratio.visitorRate': '• 訪問者排出係数：{value}kg/日', 'ratio.specialWaste': '• 特殊廃棄物：{value}',
            'ratio.specialApplied': '建物種類別の追加発生分を適用', 'ratio.none': 'なし',
            'header.residentFormula': '計算式：住宅面積 × 居住密度 × 人口基準倍率\n* 実際の居住人口に合わせる値',
            'header.workerFormula': '計算式：非住宅面積 × 就業者密度 × 人口基準倍率 × 就業人口補正\n* 事業所の就業者・作業者を表す人口',
            'header.visitorFormula': '計算式：建物面積 × 訪問密度 × 人口基準倍率 × 流動人口補正\n* 訪問者・通行者・利用者を表す人口',
            'header.wasteFormula': '計算式：Σ((居住＋就業人口) × 1人1日係数 ＋ 流動人口 × 訪問者係数 ＋ 建物種類別特殊廃棄物)\n* 単位：kg/日。韓国の一般廃棄物統計を基準に補正',
            'csv.city': '都市', 'csv.id': 'ID', 'csv.name': '名称', 'csv.type': '種類', 'csv.populationScale': '人口基準倍率',
            'csv.workerScale': '就業人口補正', 'csv.visitorScale': '流動人口補正', 'csv.resident': '居住人口（人）',
            'csv.worker': '就業人口（人）', 'csv.visitor': '流動人口（人）', 'csv.standingRate': '居住・就業係数（kg/日・人）',
            'csv.visitorRate': '流動人口係数（kg/日・人）', 'csv.specialWaste': '特殊廃棄物（kg/日）',
            'csv.totalWaste': '総廃棄物（kg/日）', 'csv.capacity': '一時保管容量（kg）', 'csv.kgDaySuffix': '（kg/日）'
        },
        zh: {
            'app.title.comparison': '城市废弃物对比模拟', 'app.title.single': '城市废弃物模拟', 'language.label': '语言',
            'entry.progressLabel': '当前步骤：主菜单', 'entry.stepMode': '01 主菜单', 'entry.stepSimulation': '02 开始模拟',
            'entry.title': '比较城市的<br>一天', 'entry.description': '建筑构成和人口条件变化时，每日废弃物会如何变化？请先选择分析范围。',
            'entry.modesLabel': '模拟模式', 'entry.comparisonTitle': '双城市对比',
            'entry.comparisonDescription': '并排比较城市A与城市B的构成和每日排放量。', 'entry.defaultBadge': '默认',
            'entry.singleTitle': '单城市', 'entry.singleDescription': '全屏查看一座城市，并详细观察各建筑的废弃物结构。',
            'entry.start': '开始模拟', 'entry.note': '将以所选模式立即开始模拟。',
            'controls.generateHint': '尚未生成每日废弃物，请先点击这里。', 'controls.generate': '生成每日废弃物',
            'controls.download': '下载统计', 'controls.viewSettings': '视图设置', 'controls.modeSelect': '主菜单',
            'controls.themeLight': '浅色', 'controls.themeDark': '深色', 'controls.type': '类型', 'controls.hide': '隐藏',
            'typeGuide.message': '打开视图设置中的<strong>类型</strong>，即可通过颜色和部分图标识别建筑类型。',
            'typeGuide.close': '关闭建筑类型提示', 'comparison.label': '每日废弃物产生量相对占比',
            'comparison.cityPercent': '{city}（{percent}%）', 'city.single': '城市', 'city.left': '城市A', 'city.right': '城市B',
            'city.random': '随机城市', 'city.settings': '⚙️ 设置', 'city.settingsTitle': '{city}设置',
            'stat.buildings': '建筑', 'stat.resident': '居住人口', 'stat.worker': '就业人口', 'stat.visitor': '流动人口', 'stat.wastePerDay': '废弃物/日',
            'unit.buildingSuffix': '栋', 'unit.peopleSuffix': '人', 'unit.kgDay': '千克/日', 'unit.tonDay': '吨/日', 'unit.vehicleSuffix': '辆',
            'unit.peopleValue': '{value}人', 'unit.buildingValue': '{value}栋', 'unit.kgDayValue': '{value}千克/日',
            'settings.title': '城市设置', 'settings.close': '关闭城市设置', 'settings.audio': '音频', 'settings.soundEffects': '使用按钮音效', 'settings.visualization': '建筑可视化', 'settings.showTypes': '显示建筑类型（颜色/图标）',
            'settings.actualData': '输入真实城市数据', 'settings.targetResident': '目标居住人口', 'settings.targetWorker': '目标就业人口',
            'settings.targetVisitor': '目标流动人口', 'settings.targetWaste': '目标废弃物（吨/日）',
            'settings.exampleResident': '例如：363496', 'settings.exampleWaste': '例如：345.5', 'settings.optional': '选填',
            'settings.autoFit': '根据城市数据自动匹配', 'settings.fitDefault': '仅输入居住人口也可自动计算人口倍率。',
            'settings.parameters': '模拟参数', 'settings.buildingCount': '建筑数量', 'settings.populationScale': '人口倍率',
            'settings.estimateResident': '预计居住人口', 'settings.estimateWorker': '预计就业人口', 'settings.estimateVisitor': '预计流动人口',
            'settings.estimateTotal': '预计总人口', 'settings.wasteRatio': '废弃物产生比例', 'settings.saving': '节约型',
            'settings.koreaAverage': '韩国平均', 'settings.wasteful': '高排放型', 'settings.normalCity': '普通城市',
            'settings.normalDescription': '采用韩国生活废弃物平均排放系数。', 'settings.roadStructure': '道路结构',
            'road.0': '默认（斜向交叉）', 'road.1': '网格', 'road.2': '环形道路', 'road.3': '水平平行线',
            'road.4': '中央干道＋支路', 'road.5': '放射状路口', 'road.6': '外围绕行＋内部连接',
            'settings.other': '其他设置', 'settings.trafficRatio': '汽车比例', 'settings.trafficDefault': '根据人口规模自动计算汽车数量。',
            'settings.typeWeights': '建筑类型比例（权重）', 'preset.custom': '自定义', 'preset.villa': '低层住宅区',
            'preset.apartment': '公寓小区', 'preset.oldDowntown': '老城区/商业区', 'preset.officeDistrict': '办公区',
            'preset.factoryDistrict': '工业区', 'preset.mixedCity': '综合生活区', 'settings.cityControl': '城市控制', 'settings.rebuild': '🏙️ 重建城市',
            'download.title': '选择统计排序方式', 'download.close': '关闭统计下载窗口',
            'download.description': '按所选标准对建筑统计进行排序并保存为CSV。对比模式下将按城市分组。',
            'download.sortLegend': '排序标准', 'download.typeTitle': '按类型分组',
            'download.typeDescription': '将相同建筑类型分组，并在组内按废弃物产生量从高到低排序。',
            'download.wasteTitle': '按废弃物产生量', 'download.wasteDescription': '不区分建筑类型，按每日废弃物产生量从高到低排序。',
            'download.populationTitle': '按总人口', 'download.populationDescription': '按居住、就业和流动人口总和从高到低排序。',
            'download.nameTitle': '按建筑名称', 'download.nameDescription': '按建筑名称排序。', 'download.cancel': '取消', 'download.save': '保存CSV文件',
            'message.randomized': '已重新随机生成道路、建筑数量、人口倍率、汽车比例和建筑类型比例。',
            'message.trafficEstimate': '按预计人口计算的汽车数量：约{count}辆', 'message.populationScale': '人口倍率 {value}倍',
            'message.workerScale': '就业人口校正 {value}倍', 'message.visitorScale': '流动人口校正 {value}倍', 'message.wasteScale': '废弃物产生倍率 {value}%',
            'message.fitApplied': '已应用{messages}。预计居住{resident}人、就业{worker}人、流动{visitor}人，废弃物{waste}吨/日。',
            'message.fitRequired': '请至少输入目标居住人口、就业人口、流动人口或每日废弃物中的一项。',
            'message.wasteEstimate': '按{profile}计算，预计废弃物约为{waste}吨/日。',
            'scale.savingLabel': '节约型 {percent}%', 'scale.savingTitle': '节约型城市',
            'scale.savingDescription': '比韩国平均水平少约{diff}%，假定城市具备良好的减量、再利用和分类习惯。',
            'scale.wastefulLabel': '高排放型 {percent}%', 'scale.wastefulTitle': '高排放城市',
            'scale.wastefulDescription': '比韩国平均水平多约{diff}%，假定一次性用品和混合投放较多。',
            'scale.averageLabel': '韩国平均 {percent}%', 'scale.averageTitle': '普通城市',
            'scale.averageDescription': '采用韩国生活废弃物平均排放系数，滑块中央的100%为基准。',
            'tooltip.buildingStats': '🏙️ 按建筑类型统计', 'tooltip.residentDetails': '🏠 居住人口详情',
            'tooltip.workerDetails': '🏢 就业人口详情', 'tooltip.visitorDetails': '🏃 流动人口详情',
            'tooltip.wasteDetails': '♻️ 每日废弃物详情', 'tooltip.categories': '排放类别', 'tooltip.materials': '废弃物明细',
            'tooltip.types': '按建筑类型', 'tooltip.type': '类型', 'tooltip.standingWaste': '居住/就业人口废弃物',
            'tooltip.visitorWaste': '流动人口废弃物', 'tooltip.specialWaste': '特殊废弃物', 'tooltip.totalWaste': '废弃物总量', 'tooltip.saturation': '容量占用率',
            'ratio.stats': '【{type}统计】', 'ratio.standingDensity': '• 居住/就业人口密度：{value}', 'ratio.visitorDensity': '• 流动人口密度：{value}',
            'ratio.populationScale': '• 当前人口倍率：{value}倍', 'ratio.standingRate': '• 居住/就业人口每日排放系数：{value}千克/日',
            'ratio.visitorRate': '• 访客排放系数：{value}千克/日', 'ratio.specialWaste': '• 特殊废弃物：{value}',
            'ratio.specialApplied': '应用建筑类型的额外产生量', 'ratio.none': '无',
            'header.residentFormula': '公式：住宅面积 × 居住密度 × 人口倍率\n* 用于匹配实际居住人口',
            'header.workerFormula': '公式：非住宅面积 × 就业密度 × 人口倍率 × 就业人口校正\n* 表示企业就业者和作业人员',
            'header.visitorFormula': '公式：建筑面积 × 访问密度 × 人口倍率 × 流动人口校正\n* 表示访客、过路者和使用者',
            'header.wasteFormula': '公式：Σ((居住＋就业人口) × 每人每日系数 ＋ 流动人口 × 访客系数 ＋ 各建筑类型特殊废弃物)\n* 单位：千克/日；以韩国生活废弃物统计为基准校正',
            'csv.city': '城市', 'csv.id': 'ID', 'csv.name': '名称', 'csv.type': '类型', 'csv.populationScale': '人口倍率',
            'csv.workerScale': '就业人口校正', 'csv.visitorScale': '流动人口校正', 'csv.resident': '居住人口（人）',
            'csv.worker': '就业人口（人）', 'csv.visitor': '流动人口（人）', 'csv.standingRate': '居住/就业系数（千克/日·人）',
            'csv.visitorRate': '流动人口系数（千克/日·人）', 'csv.specialWaste': '特殊废弃物（千克/日）',
            'csv.totalWaste': '废弃物总量（千克/日）', 'csv.capacity': '临时储存容量（千克）', 'csv.kgDaySuffix': '（千克/日）'
        }
    };

    const LOCALIZED_LABELS = {
        buildingTypes: {
            ko: ['주거 시설', '음식점/카페', '상점/마트', '학교/교육시설', '산업/공장', '의료/병원', '업무/오피스', '공원/녹지', '공사 현장', '공공 기관'],
            en: ['Residential', 'Restaurant/Cafe', 'Shop/Market', 'School/Education', 'Industrial/Factory', 'Medical/Hospital', 'Office', 'Park/Green space', 'Construction site', 'Government/Public'],
            ja: ['住宅施設', '飲食店/カフェ', '店舗/スーパー', '学校/教育施設', '工業/工場', '医療/病院', '業務/オフィス', '公園/緑地', '工事現場', '公共機関'],
            zh: ['住宅设施', '餐厅/咖啡馆', '商店/超市', '学校/教育设施', '工业/工厂', '医疗/医院', '办公设施', '公园/绿地', '施工现场', '公共机构']
        },
        wasteStreams: {
            ko: ['음식물쓰레기', '종이류', '비닐류', '플라스틱류', '유리병', '캔/고철류', '스티로폼', '의류/섬유류', '위생용품', '일반 가연성', '불연성 생활폐기물', '가구류', '가전류', '건설폐기물', '의료폐기물', '사업장 일반폐기물'],
            en: ['Food waste', 'Paper', 'Vinyl film', 'Plastic', 'Glass bottles', 'Cans/Metal', 'Styrofoam', 'Clothing/Textiles', 'Sanitary products', 'Mixed combustible', 'Mixed non-combustible', 'Furniture', 'Appliances', 'Construction waste', 'Medical waste', 'Commercial waste'],
            ja: ['食品廃棄物', '紙類', 'ビニール類', 'プラスチック類', 'ガラス瓶', '缶/金属類', '発泡スチロール', '衣類/繊維類', '衛生用品', '一般可燃物', '不燃性一般廃棄物', '家具類', '家電類', '建設廃棄物', '医療廃棄物', '事業系一般廃棄物'],
            zh: ['厨余垃圾', '纸类', '薄膜类', '塑料类', '玻璃瓶', '金属罐/废铁', '泡沫塑料', '衣物/纺织品', '卫生用品', '一般可燃物', '不可燃生活废弃物', '家具类', '家电类', '建筑废弃物', '医疗废弃物', '一般商业废弃物']
        },
        wasteCategories: {
            ko: ['종량제봉투 대상 폐기물', '음식물류 폐기물', '재활용가능자원', '대형폐기물', '건설폐기물', '의료폐기물', '사업장 일반폐기물'],
            en: ['Standard-bag waste', 'Food waste', 'Recyclables', 'Bulky waste', 'Construction waste', 'Medical waste', 'Commercial waste'],
            ja: ['指定袋対象廃棄物', '食品廃棄物', '資源ごみ', '粗大ごみ', '建設廃棄物', '医療廃棄物', '事業系一般廃棄物'],
            zh: ['计量袋废弃物', '厨余垃圾', '可回收物', '大件垃圾', '建筑废弃物', '医疗废弃物', '一般商业废弃物']
        }
    };

    const BUILDING_NAMES = {
        ko: {
            prefixes: ['푸른', '빛나는', '오래된', '중앙', '강변', '숲속', '행복한', '스마트', '미래', '평화'],
            suffixes: {
                RESIDENTIAL: ['아파트', '빌라', '맨션', '주택'], COMMERCIAL_FOOD: ['식당', '카페', '베이커리', '키친'],
                COMMERCIAL_RETAIL: ['상점', '마트', '백화점', '센터'], SCHOOL: ['학교', '학원', '교육관', '캠퍼스'],
                INDUSTRIAL: ['공장', '플랜트', '제조창', '산업단지'], MEDICAL: ['병원', '의원', '클리닉', '센터'],
                OFFICE: ['타워', '빌딩', '오피스', '스퀘어'], PARK: ['공원', '쉼터', '정원', '스퀘어'],
                CONSTRUCTION: ['현장', '구역', '단지', '지구'], GOVERNMENT: ['청사', '본부', '지원센터', '공사']
            }
        },
        en: {
            prefixes: ['Blue', 'Bright', 'Heritage', 'Central', 'Riverside', 'Forest', 'Happy', 'Smart', 'Future', 'Peace'],
            suffixes: {
                RESIDENTIAL: ['Apartments', 'Villas', 'Residences', 'Homes'], COMMERCIAL_FOOD: ['Restaurant', 'Cafe', 'Bakery', 'Kitchen'],
                COMMERCIAL_RETAIL: ['Shop', 'Market', 'Department Store', 'Center'], SCHOOL: ['School', 'Academy', 'Education Hall', 'Campus'],
                INDUSTRIAL: ['Factory', 'Plant', 'Works', 'Industrial Park'], MEDICAL: ['Hospital', 'Medical Center', 'Clinic', 'Health Center'],
                OFFICE: ['Tower', 'Building', 'Office', 'Square'], PARK: ['Park', 'Rest Area', 'Garden', 'Square'],
                CONSTRUCTION: ['Site', 'Zone', 'Complex', 'District'], GOVERNMENT: ['Government Hall', 'Headquarters', 'Service Center', 'Public Agency']
            }
        },
        ja: {
            prefixes: ['青い', '光の', '歴史ある', '中央', '川辺', '森の', '幸せ', 'スマート', '未来', '平和'],
            suffixes: {
                RESIDENTIAL: ['アパート', 'ヴィラ', 'マンション', '住宅'], COMMERCIAL_FOOD: ['レストラン', 'カフェ', 'ベーカリー', 'キッチン'],
                COMMERCIAL_RETAIL: ['商店', 'スーパー', '百貨店', 'センター'], SCHOOL: ['学校', '学習塾', '教育館', 'キャンパス'],
                INDUSTRIAL: ['工場', 'プラント', '製造所', '産業団地'], MEDICAL: ['病院', '医院', 'クリニック', '医療センター'],
                OFFICE: ['タワー', 'ビル', 'オフィス', 'スクエア'], PARK: ['公園', '休憩所', '庭園', 'スクエア'],
                CONSTRUCTION: ['工事現場', '区域', '団地', '地区'], GOVERNMENT: ['庁舎', '本部', '支援センター', '公社']
            }
        },
        zh: {
            prefixes: ['蓝色', '光明', '古城', '中央', '滨江', '森林', '幸福', '智慧', '未来', '和平'],
            suffixes: {
                RESIDENTIAL: ['公寓', '别墅', '住宅楼', '住宅'], COMMERCIAL_FOOD: ['餐厅', '咖啡馆', '面包店', '厨房'],
                COMMERCIAL_RETAIL: ['商店', '超市', '百货商场', '中心'], SCHOOL: ['学校', '培训学院', '教育馆', '校园'],
                INDUSTRIAL: ['工厂', '工业设施', '制造厂', '工业园'], MEDICAL: ['医院', '诊所', '医疗中心', '健康中心'],
                OFFICE: ['大厦', '写字楼', '办公楼', '广场'], PARK: ['公园', '休息区', '花园', '广场'],
                CONSTRUCTION: ['施工现场', '区域', '园区', '地区'], GOVERNMENT: ['政府大楼', '总部', '服务中心', '公共机构']
            }
        }
    };

    let currentLanguage = DEFAULT_LANGUAGE;

    function normalizeLanguage(language) {
        const normalized = String(language || '').toLowerCase();
        if (normalized.startsWith('en')) return 'en';
        if (normalized.startsWith('ja')) return 'ja';
        if (normalized.startsWith('zh')) return 'zh';
        return 'ko';
    }

    function t(key, variables = {}) {
        const template = TRANSLATIONS[currentLanguage]?.[key] ?? TRANSLATIONS.ko[key] ?? key;
        return String(template).replace(/\{(\w+)\}/g, (_, variable) => (
            Object.prototype.hasOwnProperty.call(variables, variable) ? variables[variable] : `{${variable}}`
        ));
    }

    function applyStaticTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            element.textContent = t(element.dataset.i18n);
        });
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            element.innerHTML = t(element.dataset.i18nHtml);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
        });
        document.querySelectorAll('[data-language-button]').forEach(button => {
            const isSelected = button.dataset.languageButton === currentLanguage;
            button.classList.toggle('is-selected', isSelected);
            button.setAttribute('aria-checked', String(isSelected));
        });
        const currentFlag = document.querySelector('[data-current-language-flag]');
        if (currentFlag) currentFlag.src = LANGUAGE_META[currentLanguage].flagAsset;
    }

    function setLanguage(language, options = {}) {
        const nextLanguage = normalizeLanguage(language);
        currentLanguage = nextLanguage;
        document.documentElement.lang = LANGUAGE_META[nextLanguage].htmlLang;
        if (options.persist !== false) {
            try {
                window.localStorage.setItem(STORAGE_KEY, nextLanguage);
            } catch (error) {
                // Storage can be unavailable for local files or strict privacy settings.
            }
        }
        applyStaticTranslations();
        document.dispatchEvent(new CustomEvent('app-language-change', { detail: { language: nextLanguage } }));
    }

    function initialize() {
        let savedLanguage = null;
        try {
            savedLanguage = window.localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            // Fall back to the browser language when storage is unavailable.
        }
        setLanguage(savedLanguage || DEFAULT_LANGUAGE, { persist: false });
    }

    function getLanguage() {
        return currentLanguage;
    }

    function getLocale() {
        return LANGUAGE_META[currentLanguage].locale;
    }

    function getLocalizedLabel(group, index) {
        return LOCALIZED_LABELS[group]?.[currentLanguage]?.[index]
            ?? LOCALIZED_LABELS[group]?.ko?.[index]
            ?? '';
    }

    function getBuildingName(typeKey, prefixIndex, suffixIndex) {
        const catalog = BUILDING_NAMES[currentLanguage] || BUILDING_NAMES.ko;
        const fallbackCatalog = BUILDING_NAMES.ko;
        const prefix = catalog.prefixes[prefixIndex] ?? fallbackCatalog.prefixes[prefixIndex] ?? '';
        const suffixes = catalog.suffixes[typeKey] || fallbackCatalog.suffixes[typeKey] || ['Building'];
        const suffix = suffixes[suffixIndex % suffixes.length] || suffixes[0];
        return currentLanguage === 'ja' || currentLanguage === 'zh'
            ? `${prefix}${suffix}`
            : `${prefix} ${suffix}`;
    }

    function hasTranslation(language, key) {
        return Object.prototype.hasOwnProperty.call(TRANSLATIONS[language] || {}, key);
    }

    window.AppI18n = {
        initialize,
        setLanguage,
        getLanguage,
        getLocale,
        getLocalizedLabel,
        getBuildingName,
        hasTranslation,
        t
    };
})();
