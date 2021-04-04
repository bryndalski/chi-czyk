export {
  pozycjeWRogach,
  pozycjeWejsciowe,
  sciezkaGry,
  pozycjeKoncowe,
  pozycjeWyjsciowe,
};
const pozycjeWejsciowe = [
  [5, 40], // 9
  [60, 5], // 12
  [95, 60], //3
  [40, 95], // 6
];
const sciezkaGry = [
  [5, 60],
  [5, 50],
  [5, 40], // startowa pozycja na 9
  [13, 40],
  [22, 40],
  [31, 40],
  [40, 40],
  //
  [40, 32],
  [40, 23],
  [40, 14],
  [40, 5],
  [50, 5],
  [60, 5], // startowa pozycja na 12
  //
  [60, 14],
  [60, 23],
  [60, 32],
  [60, 40],
  //
  [69, 40],
  [78, 40],
  [86, 40],
  [95, 40],
  [95, 50],
  [95, 60], //startowa pozcyja na 3
  //
  [86, 60],
  [78, 60],
  [69, 60],
  [60, 60],
  [60, 69],
  //
  [60, 78],
  [60, 87],
  [60, 95],
  [50, 95],
  //
  [40, 95], // startowa pozycja na 6
  [40, 87],
  [40, 78],
  [40, 69],
  //
  [13, 60],
  [22, 60],
  [31, 60],
  [40, 60],
];

const pozycjeKoncowe = [
  //te śmieszne na środku
  // na 9
  [
    [13, 50],
    [22, 50],
    [31, 50],
    [40, 50],
  ],
  //na 12
  [
    [50, 40],
    [50, 32],
    [50, 23],
    [50, 14],
  ],
  // na 3
  [
    [60, 50],
    [69, 50],
    [78, 50],
    [86, 50],
  ],
  // na 6
  [
    [50, 87],
    [50, 78],
    [50, 69],
    [50, 60],
  ],
];

const pozycjeWRogach = [
  //pozycje pionków w rogach (ich macierzyste położenie)
  [
    [5, 5],
    [5, 14],
    [13, 5],
    [13, 14],
  ],
  [
    [85, 5],
    [85, 14],
    [93, 5],
    [93, 14],
  ],
  [
    [95, 95],
    [95, 87],
    [87, 95],
    [87, 87],
  ],
  [
    [5, 95],
    [5, 87],
    [13, 95],
    [13, 87],
  ],
];

const polaPozaGra = pozycjeKoncowe[0].concat(
  pozycjeKoncowe[1],
  pozycjeKoncowe[2],
  pozycjeKoncowe[3],
  pozycjeWRogach[0],
  pozycjeWRogach[1],
  pozycjeWRogach[2],
  pozycjeWRogach[3]
);

const pozycjeWyjsciowe = [
  [5, 50], // na 9
  [50, 5], // na 12
  [95, 50], // na 3
  [50, 95], // na 6
];