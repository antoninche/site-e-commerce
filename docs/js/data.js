// Données produits + liens Nike.
// Prix vérifiés via pages Nike FR (ils peuvent changer avec le temps).

window.PRODUCTS = [
  {
    id: "af1-07-w",
    name: "Nike Air Force 1 '07",
    gender: "Femme",
    category: "Chaussures",
    badge: "Best-seller",
    price: 119.99, // Nike FR
    sizes: ["35.5","36","36.5","37.5","38","39","40","40.5","41","42"],
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Nike_Air_Force_one.jpg?width=1200",
    nikeUrl: "https://www.nike.com/fr/t/chaussure-air-force-1-07-pour-67bFZC/DD8959-001",
    color: "Blanc",
  },
  {
    id: "dunk-low-w",
    name: "Nike Dunk Low",
    gender: "Femme",
    category: "Chaussures",
    badge: "Best-seller",
    price: 129.99, // Nike FR
    sizes: ["35.5","36","36.5","37.5","38","39","40","40.5","41","42"],
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Panda_Nike_Dunk.jpg?width=1200",
    nikeUrl: "https://www.nike.com/fr/t/chaussure-dunk-low-pour-sVmxmz",
    color: "Noir/Blanc",
  },
  {
    id: "airmax90-m",
    name: "Nike Air Max 90",
    gender: "Homme",
    category: "Chaussures",
    badge: "Best-seller",
    price: 149.99, // Nike FR
    sizes: ["40","40.5","41","42","42.5","43","44","44.5","45","46"],
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Nike_Air_Max_90.jpg?width=1200",
    nikeUrl: "https://www.nike.com/fr/t/chaussure-air-max-90-pour-dlXJdc/CN8490-002",
    color: "Noir",
  },
  {
    id: "p6000-u",
    name: "Nike P-6000",
    gender: "Unisexe",
    category: "Chaussures",
    badge: "Nouveau",
    price: 109.99, // Nike FR
    sizes: ["36","37","38","39","40","41","42","43","44","45"],
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Nike_Air_Max_90_Infrared_(4805905007).jpg?width=1200",
    nikeUrl: "https://www.nike.com/fr/t/chaussure-p-6000-QWUMN8t7/FD9876-101",
    color: "Mix",
  },
  {
    id: "tee-sportswear-m",
    name: "T-shirt Nike Sportswear",
    gender: "Homme",
    category: "Hauts",
    badge: "Nouveau",
    price: 29.99, // Nike FR
    sizes: ["XS","S","M","L","XL","XXL"],
    img: "https://cdn.pixabay.com/photo/2024/07/23/19/26/ai-generated-8919598_1280.png",
    nikeUrl: "https://www.nike.com/fr/t/t-shirt-sportswear-HPobmhSd",
    color: "Noir",
  },
  {
    id: "club-fleece-hoodie-m",
    name: "Sweat à capuche Nike Sportswear Club Fleece",
    gender: "Homme",
    category: "Hauts",
    badge: "Best-seller",
    price: 64.99, // Nike FR
    sizes: ["XS","S","M","L","XL","XXL"],
    img: "https://cdn.pixabay.com/photo/2022/03/31/21/07/man-7103681_1280.jpg",
    nikeUrl: "https://www.nike.com/fr/t/sweat-a-capuche-sportswear-club-fleece-1DJb7j",
    color: "Noir",
  },
  {
    id: "tech-fleece-windrunner-m",
    name: "Sweat à capuche zippé Nike Tech Fleece Windrunner",
    gender: "Homme",
    category: "Hauts",
    badge: "Nouveau",
    price: 119.99, // Nike FR
    sizes: ["XS","S","M","L","XL","XXL"],
    img: "https://images.pexels.com/photos/5878659/pexels-photo-5878659.jpeg?cs=srgb&dl=pexels-shkrabaanthony-5878659.jpg&fm=jpg",
    nikeUrl: "https://www.nike.com/fr/t/sweat-a-capuche-et-zip-sportswear-tech-fleece-windrunner-pour-9zh7sm",
    color: "Noir",
  },
  {
    id: "club-fleece-jogger-m",
    name: "Pantalon Nike Sportswear Club Fleece",
    gender: "Homme",
    category: "Pantalons",
    badge: "Best-seller",
    price: 54.99, // Nike FR
    sizes: ["XS","S","M","L","XL","XXL"],
    img: "https://cdn.pixabay.com/photo/2020/05/12/00/11/sweatpants-5169714_1280.jpg",
    nikeUrl: "https://www.nike.com/fr/t/pantalon-sportswear-club-fleece-pour-cDFT2Z",
    color: "Gris/Noir",
  },
  {
    id: "tech-fleece-jogger-m",
    name: "Pantalon de jogging Nike Sportswear Tech Fleece",
    gender: "Homme",
    category: "Pantalons",
    badge: "Best-seller",
    price: 99.99, // Nike FR
    sizes: ["XS","S","M","L","XL","XXL","3XL"],
    img: "https://cdn.pixabay.com/photo/2016/11/19/17/28/jeans-1840968_1280.jpg",
    nikeUrl: "https://www.nike.com/fr/t/pantalon-de-jogging-sportswear-tech-fleece-pour-3Gs9zz/FB8002-435",
    color: "Gris",
  },
  {
    id: "pro-short-m",
    name: "Short de fitness Nike Pro Dri-FIT",
    gender: "Homme",
    category: "Shorts",
    badge: "Nouveau",
    price: 34.99, // Nike FR
    sizes: ["S","M","L","XL","XXL","3XL"],
    img: "https://images.pexels.com/photos/7880127/pexels-photo-7880127.jpeg?cs=srgb&dl=pexels-mart-production-7880127.jpg&fm=jpg",
    nikeUrl: "https://www.nike.com/fr/t/short-de-fitness-pro-dri-fit-pour-vPKn5N",
    color: "Noir",
  },
  {
    id: "one-capri-w",
    name: "Legging corsaire taille haute Nike One",
    gender: "Femme",
    category: "Leggings",
    badge: "Best-seller",
    price: 44.99, // Nike FR
    sizes: ["XS","S","M","L","XL"],
    img: "https://cdn.pixabay.com/photo/2015/10/01/00/03/sport-966100_1280.jpg",
    nikeUrl: "https://www.nike.com/fr/t/legging-corsaire-taille-haute-one-pour-1rJ0ZMZt",
    color: "Noir",
  },
  {
    id: "windrunner-w",
    name: "Veste à zip tissée ample UV Nike Windrunner",
    gender: "Femme",
    category: "Hauts",
    badge: "Nouveau",
    price: 99.99, // Nike FR
    sizes: ["XS","S","M","L","XL"],
    img: "https://cdn.pixabay.com/photo/2017/08/07/14/02/people-2604149_1280.jpg",
    nikeUrl: "https://www.nike.com/fr/t/veste-a-zip-tissee-ample-uv-windrunner-pour-d4phjwfj",
    color: "Noir",
  },
  {
    id: "heritage-waistbag-u",
    name: "Sac banane Nike Heritage",
    gender: "Unisexe",
    category: "Accessoires",
    badge: "Best-seller",
    price: 24.99, // Nike FR
    sizes: ["Unique"],
    img: "https://cdn.pixabay.com/photo/2020/06/22/04/46/nike-5330276_1280.jpg",
    nikeUrl: "https://www.nike.com/fr/t/sac-banane-heritage-RHrnz0/DB0488-010",
    color: "Noir",
  },
];

window.getProductById = function(productId){
  return window.PRODUCTS.find(p => p.id === productId) || null;
};