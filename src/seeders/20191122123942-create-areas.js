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
