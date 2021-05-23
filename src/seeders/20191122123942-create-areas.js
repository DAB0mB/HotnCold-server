const createAreas = {
  async up(queryInterface, Sequelize) {
    await createAreas.down(queryInterface, Sequelize);

    // See StackOverflow answer on how to collect GeoJSON data: https://gis.stackexchange.com/questions/183248/getting-polygon-boundaries-of-city-in-json-from-google-maps-api
    return queryInterface.bulkInsert('areas', [
      {
        id: '86a76d71-9228-46d4-987a-993f88544988',
        name: 'Hong Kong',
        shortName: 'Hong Kong',
        timezone: 'Asia/Hong_Kong',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((114.1331 22.2884, 114.1410 22.2910, 114.1472 22.2903, 114.1537 22.2881, 114.1616 22.2868, 114.1668 22.2833, 114.1709 22.2827, 114.1815 22.2849, 114.1836 22.2830, 114.1891 22.2856, 114.1908 22.2894, 114.1942 22.2925, 114.2018 22.2951, 114.2059 22.2944, 114.2138 22.2916, 114.2176 22.2894, 114.2234 22.2868, 114.2241 22.2843, 114.2255 22.2795, 114.2320 22.2725, 114.2334 22.2662, 114.2293 22.2598, 114.2255 22.2617, 114.2262 22.2579, 114.2286 22.2557, 114.2272 22.2516, 114.2245 22.2474, 114.2190 22.2458, 114.2100 22.2474, 114.2008 22.2388, 114.1915 22.2369, 114.1881 22.2404, 114.1874 22.2449, 114.1853 22.2458, 114.1795 22.2449, 114.1750 22.2388, 114.1723 22.2306, 114.1661 22.2331, 114.1644 22.2385, 114.1640 22.2449, 114.1596 22.2465, 114.1589 22.2439, 114.1476 22.2493, 114.1390 22.2490, 114.1338 22.2509, 114.1307 22.2551, 114.1276 22.2608, 114.1246 22.2678, 114.1218 22.2722, 114.1170 22.2760, 114.1204 22.2833, 114.1304 22.2868, 114.1331 22.2884)), ((114.1551 22.3170, 114.1592 22.3170, 114.1603 22.3078, 114.1572 22.3030, 114.1537 22.3030, 114.1541 22.2986, 114.1572 22.2979, 114.1603 22.3002, 114.1664 22.3008, 114.1682 22.2951, 114.1702 22.2929, 114.1736 22.2929, 114.1761 22.2951, 114.1798 22.2992, 114.1864 22.2995, 114.1929 22.3027, 114.1929 22.3078, 114.1912 22.3100, 114.1953 22.3205, 114.1891 22.3272, 114.1774 22.3278, 114.1633 22.3253, 114.1558 22.3208, 114.1551 22.3170)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(114.1094 22.3964)'),
        phone: '+14157993599',
        countryCode: '852',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '45a33a0f-c759-463b-ac4d-f2f9389ae363',
        name: 'Berlin, Germany',
        shortName: 'Berlin',
        timezone: 'Europe/Berlin',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((13.4787 52.6734, 13.4852 52.6591, 13.5127 52.6455, 13.5176 52.6296, 13.4985 52.6106, 13.5081 52.5921, 13.5471 52.5878, 13.5815 52.5708, 13.5853 52.5484, 13.6188 52.5429, 13.6333 52.5118, 13.6150 52.4808, 13.6669 52.4741, 13.7164 52.4621, 13.7291 52.4505, 13.7532 52.4475, 13.7164 52.3995, 13.6897 52.3833, 13.6484 52.3382, 13.6379 52.3438, 13.6459 52.3652, 13.6279 52.3817, 13.6069 52.3749, 13.5927 52.3941, 13.5356 52.3890, 13.5151 52.4014, 13.4798 52.3959, 13.4623 52.4206, 13.4187 52.4099, 13.4275 52.3868, 13.4209 52.3762, 13.3885 52.3779, 13.3872 52.3885, 13.3430 52.4076, 13.3119 52.3995, 13.2961 52.4164, 13.2750 52.4052, 13.2498 52.4049, 13.2457 52.4208, 13.1955 52.4150, 13.1248 52.3968, 13.0906 52.4118, 13.1231 52.4393, 13.1092 52.4506, 13.1175 52.4740, 13.1664 52.5101, 13.1430 52.5196, 13.1173 52.5169, 13.1306 52.5563, 13.1529 52.5727, 13.1489 52.5914, 13.1642 52.5989, 13.1921 52.5899, 13.2206 52.6281, 13.2642 52.6269, 13.2824 52.6412, 13.3083 52.6296, 13.3590 52.6235, 13.3935 52.6461, 13.4337 52.6379, 13.4508 52.6627, 13.4787 52.6734)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(13.4049 52.52)'),
        phone: '+14157993599',
        countryCode: '49',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'fca8aac6-60d1-44cf-bf42-dfd8ca89c296',
        name: 'Los Angeles, California, United States',
        shortName: 'Los Angeles',
        timezone: 'America/Los_Angeles',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((-117.6687 34.8204, -117.6468 34.2892, -117.7289 34.0208, -117.7673 34.0263, -117.8056 33.9770, -117.7837 33.9441, -117.9754 33.9441, -117.9754 33.9003, -118.0575 33.8455, -118.1178 33.7415, -118.1835 33.7634, -118.1835 33.7196, -118.2602 33.7031, -118.4135 33.7415, -118.4300 33.7743, -118.3916 33.8401, -118.4628 33.9715, -118.5450 34.0372, -118.7476 34.0318, -118.8024 33.9989, -118.9448 34.0427, -118.9393 34.0756, -118.7860 34.1687, -118.6655 34.1687, -118.6655 34.2399, -118.6326 34.2399, -118.8846 34.7931, -118.8955 34.8204, -117.6687 34.8204)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(-118.2436 34.0522)'),
        phone: '+14157993599',
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '9f892197-f556-4b56-b5bd-4a0619a9d068',
        name: 'San Francisco, California, United States',
        shortName: 'San Francisco',
        timezone: 'America/San_Francisco',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((-123.0949 37.7100, -123.1300 37.7100, -123.1800 37.7599, -123.1749 37.7950, -123.1200 37.8299, -123.0550 37.8149, -123.0300 37.7800, -122.9900 37.7749, -122.9699 37.75, -122.9600 37.75, -122.9399 37.7300, -122.9300 37.6899, -122.9399 37.6649, -122.9699 37.6400, -123.0150 37.6349, -123.0450 37.6450, -123.0750 37.6700, -123.0949 37.7100)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(-122.4194 37.7790)'),
        phone: '+14157993599',
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '0044da5b-5091-4b81-8e32-ed7c5324b5ec',
        name: 'New York, New York, United States',
        shortName: 'New York',
        timezone: 'America/New_York',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((-74.2630 40.494, -74.262 40.5129, -74.2510 40.5240, -74.2540 40.5470, -74.2349 40.5630, -74.2199 40.5630, -74.2049 40.5990, -74.2070 40.6330, -74.1910 40.6490, -74.0589 40.6570, -74.0420 40.6839, -74.0520 40.6929, -74.0430 40.7049, -74.0310 40.7019, -74.0190 40.7580, -73.9680 40.8290, -73.9219 40.9209, -73.8619 40.9059, -73.8490 40.9149, -73.8320 40.8969, -73.7429 40.8740, -73.7750 40.814, -73.6989 40.7569, -73.6950 40.738, -73.7040 40.7240, -73.7240 40.7190, -73.7210 40.6490, -73.7369 40.6439, -73.738 40.6300, -73.762 40.622, -73.7420 40.616, -73.7300 40.5960, -73.7519 40.5829, -73.756 40.5279, -73.8020 40.5279, -73.8889 40.5020, -73.9030 40.488, -73.9809 40.5150, -74.2270 40.4720, -74.2549 40.4819, -74.2630 40.494)), ((-74.0349 40.695, -74.0400 40.6940, -74.0379 40.6899, -74.0349 40.695)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(-74.006 40.7127)'),
        phone: '+14157993599',
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ee1c0644-c9c4-4b92-8809-5dbe316631cf',
        name: 'Taipei, Taiwan',
        shortName: 'Taipei',
        timezone: 'Asia/Taipei',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((121.5108 25.0977, 121.5074 25.0957, 121.5010 25.0961, 121.4964 25.0929, 121.5048 25.0854, 121.5081 25.0753, 121.5069 25.0551, 121.5026 25.0470, 121.4878 25.0420, 121.4826 25.0350, 121.4873 25.0302, 121.4900 25.0230, 121.4897 25.0153, 121.4948 25.0106, 121.5032 25.0159, 121.5094 25.0215, 121.5165 25.0215, 121.5242 25.0129, 121.5316 25.0081, 121.5335 25.0044, 121.5305 25.0003, 121.5329 24.9932, 121.5553 24.9960, 121.5757 24.9952, 121.5865 25.0017, 121.5824 25.0153, 121.5762 25.0296, 121.5940 25.0364, 121.5959 25.0471, 121.5977 25.0506, 121.6068 25.0517, 121.6205 25.0540, 121.6222 25.0585, 121.6171 25.0630, 121.6133 25.0658, 121.6184 25.0744, 121.6157 25.0803, 121.5968 25.0852, 121.5874 25.0907, 121.5867 25.0985, 121.5795 25.1034, 121.5582 25.1025, 121.5465 25.1098, 121.5441 25.1188, 121.5262 25.1210, 121.5101 25.1188, 121.5060 25.1132, 121.5108 25.0977)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(121.5654 25.033)'),
        phone: '+14157993599',
        countryCode: '886',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'e860413e-4c57-4f22-a8f3-dbe3e4e5a488',
        name: 'Tel Aviv-Yafo, Gush Dan, Israel',
        shortName: 'Tel Aviv',
        timezone: 'Asia/Jerusalem',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((34.7329 32.0036, 34.7424 32.0331, 34.7390 32.0424, 34.7464 32.0497, 34.7498 32.0566, 34.7560 32.0588, 34.7690 32.0964, 34.7676 32.0983, 34.7721 32.1092, 34.7767 32.1114, 34.7918 32.1544, 34.7890 32.1595, 34.7911 32.1659, 34.7952 32.1676, 34.7989 32.1768, 34.8047 32.1971, 34.8112 32.1984, 34.8239 32.1930, 34.8369 32.1914, 34.8479 32.1812, 34.8569 32.1777, 34.8569 32.1726, 34.8643 32.1710, 34.8604 32.1535, 34.8550 32.1484, 34.8550 32.1442, 34.8599 32.1364, 34.8671 32.1198, 34.8622 32.1137, 34.8507 32.1133, 34.8458 32.0942, 34.8458 32.0853, 34.8435 32.0735, 34.8450 32.0655, 34.8603 32.0682, 34.8677 32.0710, 34.8657 32.0464, 34.8688 32.0332, 34.8760 32.0215, 34.8608 32.0197, 34.8492 32.0224, 34.8473 32.0196, 34.8273 32.0268, 34.8119 32.0069, 34.8073 31.9942, 34.7997 31.9958, 34.7964 31.9886, 34.7794 31.9909, 34.7649 31.9967, 34.7581 31.9926, 34.7448 31.9974, 34.7329 32.0036)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(34.7818 32.0853)'),
        phone: '+14157993599',
        countryCode: '972',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '9f0968fb-6efb-49da-a192-5df393e51695',
        name: 'Cairo, Egypt',
        shortName: 'Cairo',
        timezone: 'Africa/Cairo',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((31.2218 30.0316, 31.2224 30.0329, 31.2233 30.0339, 31.2259 30.0364, 31.2273 30.0377, 31.2292 30.0408, 31.2296 30.0418, 31.2298 30.0427, 31.2299 30.0446, 31.2300 30.0476, 31.2295 30.0500, 31.2266 30.0587, 31.2262 30.0600, 31.2256 30.0618, 31.2250 30.0652, 31.2242 30.0692, 31.2240 30.0715, 31.2242 30.0730, 31.2247 30.0745, 31.2260 30.0778, 31.2275 30.0806, 31.2285 30.0828, 31.2293 30.0841, 31.2305 30.0879, 31.2311 30.0907, 31.2311 30.0930, 31.3075 30.1311, 31.3937 30.1553, 31.4121 30.1573, 31.4264 30.1581, 31.4318 30.1584, 31.4835 30.1666, 31.5924 30.1721, 31.6158 30.1889, 31.6301 30.1979, 31.8367 30.3209, 31.8713 30.2295, 31.8972 30.0659, 31.9090 29.9915, 31.9062 29.7483, 31.7984 29.7533, 31.7317 29.7692, 31.5296 29.7639, 31.4642 29.7533, 31.3299 29.7531, 31.3071 29.7634, 31.2867 29.7659, 31.2891 29.7707, 31.2902 29.7736, 31.2919 29.7783, 31.2925 29.7827, 31.2923 29.7864, 31.2924 29.7889, 31.2931 29.7917, 31.2944 29.7949, 31.2955 29.7985, 31.2958 29.8008, 31.2957 29.8030, 31.2948 29.8068, 31.2936 29.8127, 31.2929 29.8169, 31.2915 29.8227, 31.2905 29.8271, 31.2899 29.8304, 31.2900 29.8333, 31.2912 29.8369, 31.2920 29.8400, 31.2931 29.8453, 31.2930 29.8491, 31.2924 29.8534, 31.2917 29.8572, 31.2899 29.8620, 31.2878 29.8675, 31.2866 29.8721, 31.2851 29.8762, 31.2828 29.8817, 31.2819 29.8853, 31.2818 29.8889, 31.2821 29.8955, 31.2825 29.9007, 31.2832 29.9036, 31.2836 29.9077, 31.2829 29.9126, 31.2814 29.9180, 31.2795 29.9239, 31.2778 29.9286, 31.2763 29.9340, 31.2745 29.9376, 31.2730 29.9396, 31.2709 29.9424, 31.2689 29.9439, 31.2654 29.9456, 31.2602 29.9477, 31.2561 29.9499, 31.2495 29.9546, 31.2465 29.9570, 31.2411 29.9606, 31.2361 29.9634, 31.2354 29.9641, 31.2347 29.9650, 31.2339 29.9678, 31.2329 29.9727, 31.2313 29.9773, 31.2277 29.9836, 31.2264 29.9876, 31.2262 29.9888, 31.2263 29.9921, 31.2268 29.9964, 31.2266 29.9984, 31.2260 30.0006, 31.2237 30.0049, 31.2228 30.0067, 31.2211 30.0103, 31.2203 30.0136, 31.2200 30.0184, 31.2201 30.0240, 31.2211 30.0294, 31.2218 30.0316, 31.2218 30.0316)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(31.2436 30.0488)'),
        phone: '+14157993599',
        countryCode: '20',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5bb953a4-1853-47ac-8282-75614822c44b',
        name: 'Istanbul, Turkey',
        shortName: 'Istanbul',
        timezone: 'Europe/Istanbul',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((27.9757021 41.0649176, 27.9743249 41.0433936, 28.0048617 41.0401329, 28.2217474 40.7411068, 28.4603777 40.7289169, 28.7553519 40.7544158, 29.0582449 40.7679112, 29.3157265 40.7376735, 29.3160889 40.787562, 29.3273098 40.8047062, 29.3697851 40.8340219, 29.3624372 40.8512631, 29.3800976 40.8720852, 29.4069332 40.8800688, 29.4160655 40.8977971, 29.4421732 40.9005326, 29.4374215 40.9379749, 29.4699566 40.9516608, 29.5064692 40.9880709, 29.4929348 41.0083022, 29.5017892 41.0315471, 29.5580566 41.0392344, 29.597818 41.0284731, 29.6101749 41.0063767, 29.6048713 40.9861507, 29.633646 40.9709717, 29.6766905 40.9644098, 29.6920094 40.9887823, 29.7189463 41.0084263, 29.7075099 41.0342359, 29.7449109 41.0410561, 29.7606665 41.0239588, 29.833767 41.0129263, 29.8919721 41.0637352, 29.8914291 41.0924654, 29.9187285 41.098859, 29.9181844 41.1415455, 29.9380986 41.342, 29.8822197 41.343, 29.807775 41.358, 29.7287397 41.363, 29.6383586 41.3803703, 29.5730723 41.3793698, 29.4721758 41.4043838, 29.3801668 41.4133888, 29.3137467 41.4303983, 29.2010679 41.4323994, 29.1568643 41.4454067, 29.0805819 41.4554123, 29.0278991 41.4564129, 28.9573869 41.474423, 28.7792733 41.5354573, 28.7196882 41.5464634, 28.5301177 41.619, 28.4344668 41.659, 28.4151633 41.671, 28.136803 41.581617, 28.1229954 41.5656058, 28.1195135 41.5342384, 28.0770339 41.5167078, 28.0841283 41.4908267, 28.1112003 41.4658485, 28.1102428 41.428559, 28.0798834 41.3270069, 28.0767309 41.2879246, 28.0561073 41.2668975, 28.0155317 41.2522807, 27.9984993 41.2222561, 28.0221812 41.1812559, 28.0114569 41.16293, 27.9800389 41.1602001, 27.9721332 41.1244783, 27.9757021 41.0649176)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(29.052495 41.0766019)'),
        phone: '+14157993599',
        countryCode: '90',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5c8b740b-256d-4f32-be5d-19adef2fcada',
        name: 'Portsmouth, New Hampshire, United States',
        shortName: 'Portsmouth, New Hampshire',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((-70.8180 43.0626, -70.8199 43.0702, -70.8229 43.0821, -70.7828 43.0996, -70.7818 43.0983, -70.7814 43.0977, -70.7808 43.0970, -70.7804 43.0967, -70.7799 43.0963, -70.7794 43.0960, -70.7785 43.0957, -70.7773 43.0954, -70.7714 43.0946, -70.7700 43.0943, -70.7687 43.0939, -70.7681 43.0937, -70.7677 43.0935, -70.7668 43.0930, -70.7659 43.0925, -70.7653 43.0921, -70.7645 43.0914, -70.7639 43.0908, -70.7635 43.0903, -70.7624 43.0887, -70.7615 43.0872, -70.7588 43.0829, -70.7579 43.0815, -70.7575 43.0810, -70.7570 43.0805, -70.7567 43.0803, -70.7561 43.0800, -70.7556 43.0799, -70.7546 43.0798, -70.7525 43.0795, -70.7473 43.0788, -70.7456 43.0785, -70.7430 43.0779, -70.7417 43.0774, -70.7407 43.0767, -70.7403 43.0763, -70.7393 43.0753, -70.7390 43.0749, -70.7388 43.0747, -70.7387 43.0745, -70.7382 43.0739, -70.7377 43.0731, -70.7383 43.0718, -70.7381 43.0705, -70.7381 43.0701, -70.7379 43.0695, -70.7377 43.0693, -70.7373 43.0690, -70.7368 43.0687, -70.7361 43.0684, -70.7352 43.0683, -70.7341 43.0683, -70.7324 43.0685, -70.7318 43.0689, -70.7309 43.0690, -70.7299 43.0690, -70.7292 43.0688, -70.7288 43.0685, -70.7286 43.0682, -70.7284 43.0678, -70.7283 43.0673, -70.7279 43.0667, -70.7279 43.0662, -70.7280 43.0658, -70.7283 43.0652, -70.7288 43.0649, -70.7296 43.0649, -70.7302 43.0653, -70.7306 43.0655, -70.7312 43.0660, -70.7319 43.0663, -70.7329 43.0665, -70.7340 43.0666, -70.7349 43.0665, -70.7364 43.0662, -70.7372 43.0658, -70.7378 43.0655, -70.7381 43.0650, -70.7381 43.0648, -70.7380 43.0643, -70.7377 43.0632, -70.7375 43.0628, -70.7372 43.0626, -70.7364 43.0622, -70.7361 43.0617, -70.7361 43.0610, -70.7356 43.0600, -70.7351 43.0595, -70.7349 43.0592, -70.7352 43.0586, -70.7356 43.0584, -70.7376 43.0576, -70.7384 43.0571, -70.7393 43.0568, -70.7396 43.0566, -70.7399 43.0564, -70.7769 43.0186, -70.7818 43.0135, -70.8013 43.0167, -70.8099 43.0200, -70.8100 43.0207, -70.8120 43.0332, -70.8130 43.0390, -70.8134 43.0417, -70.8140 43.0454, -70.8148 43.0487, -70.8148 43.0489, -70.8150 43.0498, -70.8151 43.0503, -70.8156 43.0525, -70.8156 43.0526, -70.8157 43.0529, -70.8169 43.0581, -70.8180 43.0626)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(-70.7626 43.0718)'),
        timezone: 'Etc/GMT-4',
        phone: '+14157993599',
        countryCode: '603',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'baa09179-cdf7-43ff-962c-ae049396b7b3',
        name: 'Boston, Massachusetts, United States',
        shortName: 'Boston, Massachusetts',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((-71.1912 42.2829, -71.1855 42.2796, -71.1830 42.2758, -71.1767 42.2767, -71.1729 42.2701, -71.1744 42.2673, -71.1585 42.2551, -71.1523 42.2583, -71.1466 42.2557, -71.1426 42.2359, -71.1307 42.2279, -71.1225 42.2351, -71.1263 42.2391, -71.1093 42.2479, -71.1095 42.2554, -71.1133 42.2589, -71.1086 42.2612, -71.1027 42.2597, -71.0941 42.2671, -71.0890 42.2697, -71.0833 42.2686, -71.0771 42.2703, -71.0650 42.2706, -71.0609 42.2674, -71.0536 42.2718, -71.0555 42.2750, -71.0498 42.2781, -71.0443 42.2763, -71.0407 42.2790, -71.0396 42.2838, -71.0355 42.2877, -71.0358 42.2912, -71.0411 42.2993, -71.0416 42.3053, -71.0284 42.3088, -71.0220 42.3055, -71.0158 42.3070, -71.0098 42.3053, -71.0020 42.3088, -70.9987 42.3121, -70.9887 42.3138, -70.9819 42.3086, -70.9756 42.3001, -70.9604 42.2996, -70.9491 42.3012, -70.9375 42.3110, -70.9273 42.3101, -70.9137 42.3152, -70.9004 42.3185, -70.8867 42.3191, -70.8057 42.3350, -70.8044 42.3458, -70.8203 42.3909, -70.9487 42.3663, -70.9593 42.3631, -70.9692 42.3555, -70.9739 42.3543, -70.9842 42.3622, -70.9897 42.3641, -71.0103 42.3650, -71.0061 42.3760, -70.9951 42.3794, -70.9941 42.3843, -70.9870 42.3865, -70.9868 42.3920, -70.9952 42.3936, -71.0014 42.3967, -71.0058 42.3938, -71.0154 42.3966, -71.0168 42.3918, -71.0222 42.3863, -71.0267 42.3842, -71.0398 42.3859, -71.0445 42.3840, -71.0550 42.3869, -71.0665 42.3866, -71.0733 42.3918, -71.0807 42.3810, -71.0756 42.3801, -71.0724 42.3726, -71.0671 42.3718, -71.0737 42.3650, -71.0779 42.3587, -71.0910 42.3543, -71.1043 42.3524, -71.1140 42.3534, -71.1168 42.3553, -71.1169 42.3666, -71.1244 42.3695, -71.1292 42.3739, -71.1331 42.3727, -71.1332 42.3682, -71.1403 42.3644, -71.1444 42.3648, -71.1473 42.3616, -71.1622 42.3586, -71.1675 42.3600, -71.1739 42.3534, -71.1748 42.3503, -71.1666 42.3401, -71.1692 42.3380, -71.1675 42.3333, -71.1627 42.3338, -71.1570 42.3303, -71.1487 42.3368, -71.1414 42.3409, -71.1352 42.3459, -71.1228 42.3517, -71.1065 42.3497, -71.1055 42.3438, -71.1105 42.3404, -71.1105 42.3354, -71.1132 42.3323, -71.1167 42.3237, -71.1215 42.3238, -71.1318 42.3131, -71.1401 42.3021, -71.1521 42.2945, -71.1647 42.3038, -71.1786 42.2946, -71.1912 42.2829)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(-71.0589 42.3601)'),
        timezone: 'Etc/GMT-4',
        phone: '+14157993599',
        countryCode: '617',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '1f850328-86c8-4c56-bd52-8d56586f7302',
        name: 'Portland, Maine, United States',
        shortName: 'Portland, Maine',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((-70.3460 43.6456, -70.3314 43.6474, -70.3266 43.6480, -70.3156 43.6485, -70.3198 43.6457, -70.3130 43.6454, -70.3126 43.6457, -70.3041 43.6464, -70.3007 43.6466, -70.2970 43.6472, -70.2930 43.6473, -70.2847 43.6425, -70.2820 43.6406, -70.2801 43.6405, -70.2751 43.6420, -70.2601 43.6432, -70.2545 43.6477, -70.2405 43.6596, -70.2307 43.6596, -70.2233 43.6547, -70.2202 43.6515, -70.2166 43.6481, -70.2159 43.6339, -70.1907 43.6174, -70.1244 43.6074, -70.1172 43.6063, -70.1003 43.6250, -70.1001 43.6250, -70.0963 43.6312, -70.0902 43.6420, -70.0861 43.6489, -70.0787 43.6688, -70.0771 43.6719, -70.0769 43.6733, -70.0774 43.6761, -70.0788 43.6785, -70.0806 43.6800, -70.0956 43.6875, -70.0865 43.6969, -70.0839 43.6991, -70.0855 43.7022, -70.0902 43.7123, -70.0937 43.7139, -70.0954 43.7134, -70.0969 43.7120, -70.1158 43.6977, -70.1222 43.7010, -70.1285 43.6831, -70.1270 43.6819, -70.1287 43.6791, -70.1467 43.6568, -70.1551 43.6462, -70.1614 43.6542, -70.1776 43.6752, -70.1882 43.6889, -70.1954 43.6977, -70.2187 43.6803, -70.2266 43.6828, -70.2459 43.6905, -70.2481 43.6941, -70.2495 43.6997, -70.2550 43.7008, -70.2625 43.7019, -70.2664 43.7027, -70.2673 43.7011, -70.2682 43.7014, -70.2703 43.7000, -70.2721 43.7016, -70.2736 43.7011, -70.2741 43.7017, -70.2737 43.7027, -70.2746 43.7048, -70.2780 43.7050, -70.2767 43.7111, -70.2770 43.7134, -70.2821 43.7168, -70.2770 43.7217, -70.2779 43.7221, -70.2803 43.7223, -70.2838 43.7256, -70.2854 43.7265, -70.2859 43.7276, -70.2913 43.7259, -70.2923 43.7262, -70.2942 43.7241, -70.2961 43.7215, -70.2989 43.7211, -70.2997 43.7200, -70.3029 43.7226, -70.3035 43.7243, -70.3069 43.7240, -70.3094 43.7225, -70.3091 43.7212, -70.3110 43.7199, -70.3136 43.7186, -70.3164 43.7176, -70.3170 43.7150, -70.3176 43.7140, -70.3252 43.7077, -70.3226 43.7063, -70.3230 43.7053, -70.3292 43.6978, -70.3292 43.6957, -70.3295 43.6934, -70.3299 43.6929, -70.3323 43.6917, -70.3337 43.6905, -70.3359 43.6899, -70.3326 43.6863, -70.3338 43.6853, -70.3319 43.6839, -70.3316 43.6829, -70.3304 43.6820, -70.3299 43.6806, -70.3289 43.6792, -70.3309 43.6719, -70.3315 43.6703, -70.3330 43.6674, -70.3320 43.6675, -70.3348 43.6617, -70.3374 43.6617, -70.3411 43.6578, -70.3450 43.6535, -70.3405 43.6513, -70.3414 43.6506, -70.3459 43.6459, -70.3460 43.6456)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(-70.2568 43.6591)'),
        timezone: 'Etc/GMT-4',
        phone: '+14157993599',
        countryCode: '207',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3a4fb812-82ef-4431-9944-e465e1a157b3',
        name: 'Sydney, New South Wales, Australia',
        shortName: 'Sydney',
        polygon: Sequelize.fn('ST_GeomFromText', 'MULTIPOLYGON(((150.25 -33.69, 150.25 -33.665, 150.265 -33.65, 150.31 -33.645, 150.33 -33.66, 150.37 -33.67, 150.395 -33.665, 150.435 -33.685, 150.47 -33.68, 150.48 -33.67, 150.51 -33.68, 150.52 -33.66, 150.565 -33.635, 150.625 -33.64, 150.585 -33.605, 150.59 -33.59, 150.575 -33.57, 150.575 -33.54, 150.555 -33.53, 150.555 -33.505, 150.565 -33.49, 150.585 -33.49, 150.605 -33.47, 150.645 -33.47, 150.67 -33.48, 150.675 -33.455, 150.685 -33.445, 150.72 -33.43, 150.75 -33.435, 150.77 -33.45, 150.775 -33.44, 150.79 -33.44, 150.795 -33.425, 150.815 -33.41, 150.875 -33.425, 150.875 -33.415, 150.895 -33.4, 150.91 -33.4, 150.92 -33.385, 150.94 -33.385, 150.945 -33.365, 150.965 -33.345, 151.01 -33.35, 151.015 -33.38, 151.04 -33.385, 151.065 -33.425, 151.095 -33.43, 151.1 -33.45, 151.11 -33.445, 151.135 -33.45, 151.15 -33.44, 151.175 -33.445, 151.185 -33.465, 151.175 -33.485, 151.19 -33.485, 151.2 -33.495, 151.205 -33.52, 151.26 -33.515, 151.27 -33.535, 151.265 -33.555, 151.3 -33.55, 151.35 -33.565, 151.35 -33.595, 151.365 -33.62, 151.335 -33.685, 151.335 -33.705, 151.32 -33.72, 151.335 -33.73, 151.335 -33.755, 151.32 -33.76, 151.315 -33.78, 151.315 -33.79, 151.325 -33.795, 151.325 -33.82, 151.32 -33.835, 151.305 -33.845, 151.305 -33.905, 151.29 -33.91, 151.285 -33.98, 151.275 -33.985, 151.27 -34.01, 151.25 -34.025, 151.245 -34.045, 151.225 -34.06, 151.18 -34.055, 151.185 -34.075, 151.165 -34.115, 151.115 -34.105, 151.095 -34.085, 151.065 -34.085, 151.055 -34.07, 151.04 -34.075, 151.04 -34.095, 151.015 -34.11, 151.015 -34.155, 150.995 -34.17, 150.965 -34.155, 150.945 -34.155, 150.935 -34.135, 150.92 -34.125, 150.915 -34.115, 150.92 -34.1, 150.95 -34.085, 150.96 -34.07, 150.95 -34.06, 150.915 -34.055, 150.865 -34.105, 150.875 -34.12, 150.865 -34.165, 150.845 -34.185, 150.83 -34.185, 150.82 -34.195, 150.745 -34.185, 150.73 -34.165, 150.73 -34.135, 150.72 -34.13, 150.72 -34.115, 150.645 -34.105, 150.63 -34.09, 150.63 -34.07, 150.65 -34.02, 150.665 -34.005, 150.685 -34, 150.675 -33.99, 150.675 -33.965, 150.66 -33.98, 150.62 -33.98, 150.615 -33.99, 150.545 -33.98, 150.525 -33.965, 150.515 -33.925, 150.535 -33.91, 150.545 -33.885, 150.58 -33.87, 150.57 -33.86, 150.57 -33.83, 150.59 -33.805, 150.605 -33.8, 150.565 -33.745, 150.545 -33.735, 150.53 -33.75, 150.51 -33.75, 150.51 -33.76, 150.49 -33.775, 150.435 -33.775, 150.42 -33.76, 150.42 -33.77, 150.395 -33.79, 150.365 -33.79, 150.35 -33.775, 150.35 -33.755, 150.34 -33.76, 150.325 -33.75, 150.285 -33.755, 150.27 -33.75, 150.265 -33.735, 150.25 -33.735, 150.24 -33.72, 150.25 -33.69)),((151.265 -33.555, 151.26 -33.555, 151.265 -33.56, 151.265 -33.555)))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(151.2164 -33.8548)'),
        timezone: 'Etc/GMT+10',
        phone: '+14157993599',
        countryCode: '61',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    try {
      await queryInterface.describeTable('areas');
    }
    catch (e) {
      //First time migration
      return;
    }

    return queryInterface.bulkDelete('areas', null);
  },
};

export default createAreas;
