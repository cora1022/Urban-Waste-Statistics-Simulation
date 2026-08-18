# Urban Waste Statistics Simulation

<p align="center">
  <a href="./README.md">한국어</a> ·
  <strong>English</strong> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.zh.md">中文</a>
</p>

<p align="center">
  <a href="https://cora1022.com/Urban-Waste-Statistics-Simulation/">
    <img src="./assets/readme-title-english-v2.png" width="960" alt="Urban Waste Statistics Simulation">
  </a>
</p>

<p align="center">
  <strong>Compare a day in the city</strong><br>
  Build and compare urban waste patterns that change with building composition and population conditions.
</p>

<p align="center">
  <a href="https://cora1022.com/Urban-Waste-Statistics-Simulation/"><strong>Start the simulation →</strong></a>
</p>

This web simulation generates synthetic data with a scale and composition similar to South Korean municipal waste statistics and visually compares cities under different conditions.

- Simulation: [cora1022.com/Urban-Waste-Statistics-Simulation](https://cora1022.com/Urban-Waste-Statistics-Simulation/)

## Project background

This repository began as an individual assignment that applies algorithms to a social problem. While researching public waste data, I could find city- and county-level totals, but it was difficult to infer the smaller units behind those totals, such as homes, shops, schools, and factories.

I therefore defined population and waste-generation rules for each building type. The simulation generates synthetic data at a scale close to official statistics from a small neighborhood up to a large city, based on conditions entered by the user. Even when Cities A and B differ greatly in size, the project does not compare totals alone. Its core is to analyze resident, worker, and visitor populations together with facility composition and per-capita waste generation.

The planning background and implementation process are documented in [Building a waste-generating city that resembles real statistics](https://cora1022.com/blog/posts/urban-waste-statistics-simulation.html).

## Demo

### City comparison and daily waste generation

Compare the building composition, population scale, and waste generation of Cities A and B, then inspect detailed statistics for individual buildings.

![Demo of city comparison and daily waste generation](./assets/simulation-demo.gif)

### Settings interface

Enter target population and waste generation for a real city, or directly adjust the number of buildings, population scale, waste-generation ratio, road layout, and building-type ratios.

![Demo of city settings and automatic fitting](./assets/settings-demo.gif)

## Key features

- Choose a single-city mode or a two-city comparison mode when entering the simulation
- Switch instantly among Korean, English, Japanese, and Simplified Chinese, with the selected language saved
- Run one city across the full screen and export its statistics in single-city mode
- Compare resident, worker, and visitor populations and daily waste generation between Cities A and B
- Presets for villas and low-rise housing, apartment complexes, old downtown areas, business districts, industrial areas, and mixed neighborhoods
- Automatically calculate population and waste multipliers from target population and target waste in tons per day
- Adjust building count, building-type weights, road layout, vehicle ratio, and waste-generation ratio
- Aggregate pay-as-you-throw waste, food waste, recyclables, bulky waste, construction waste, medical waste, and commercial waste
- Sort and download building statistics as CSV by type, waste, population, or name, with per-building tooltips

## South Korean statistics used

The coefficients and composition ratios for each building type were calibrated against the `1.2 kg/person/day` municipal waste figure from the **2023 National Waste Generation and Treatment Status** and the Ministry of Environment's **6th National Waste Statistics Survey**. Of the survey's `950.6 g/person/day` municipal waste result, the detailed composition uses `330.8 g` of pay-as-you-throw waste, `310.9 g` of food waste, and `308.8 g` of recyclables as its reference ratios.

Official figures are not multiplied equally across every building. Resident and visitor waste coefficients differ by building type, while construction, medical, and commercial special waste is added separately. The final coefficients are calibrated so that city-wide results have a scale and distribution similar to South Korean municipal waste statistics.

- Source: [Ministry of Environment — Results of the 6th National Waste Statistics Survey](https://mcee.go.kr/home/web/board/read.do?boardId=1597240&boardMasterId=939&menuId=10598)

## Calculation method

Each building receives a resident population, worker population, visitor population, and building-type coefficients to calculate daily waste generation.

```text
Municipal waste = (resident population + worker population) × standing population coefficient
                  + visitor population × visitor coefficient

Special waste = standing population × industry coefficient
                + visitor population × industry coefficient
                + building area × area coefficient

Total waste = municipal waste × daily variation coefficient
              + special waste × special variation coefficient
```

The result is first distributed into 16 detailed waste streams according to the composition ratio of each building type, then aggregated into seven disposal categories. Target population and target waste entered in settings are converted into ratios against the baseline estimate and applied to their respective multipliers.

## Data structures and algorithms

- **Arrays**: Preserve the reference order of building types, waste streams, and categories.
- **Hash tables**: Accumulate statistics by building type and totals by waste stream in objects.
- **Prefix sums and binary search**: Build prefix sums from building-type weights and select the interval containing a random value by binary search.
- **Function table**: Use the road layout number as an index to select one of seven road-generation functions.
- **Geometry algorithm**: Calculate the shortest distance between a point and a line segment to prevent buildings from overlapping roads.
- **Collision detection**: Sequentially check center distance and spacing between a new building candidate and existing buildings.
- **Proportional scaling**: Fit the total building population to the target while preserving population ratios between buildings.
- **Ratio-based distribution**: Distribute municipal and special waste into detailed streams using building-type composition ratios.

Let `n` be the number of buildings, `r` the number of roads, `k` the number of building types, and `m` the number of waste streams. The main time complexities are:

| Feature | Algorithm | Time complexity |
|---|---|---:|
| Building-type selection | Prefix sum + binary search | `O(log k)` |
| Building candidate collision check | Sequential road and building search | `O(r + n)` |
| Population calibration | Proportional scaling | `O(n)` |
| City statistics aggregation | Hash-table accumulation | `O(n + m)` |
| Detailed waste distribution | Ratio-based distribution | `O(m)` |
