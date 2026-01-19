import jewelryImg from '../../Images/Gemini_Generated_Image_1rw2m01rw2m01rw2.png';
import handmadeImg from '../../Images/Gemini_Generated_Image_20ve7e20ve7e20ve.png';
import giftsImg from '../../Images/Gemini_Generated_Image_6vh0ym6vh0ym6vh0.png';
import apparelImg from '../../Images/Gemini_Generated_Image_7c1r8c7c1r8c7c1r.png';
import personalizedImg from '../../Images/Gemini_Generated_Image_9c1k0m9c1k0m9c1k.png';
import foodImg from '../../Images/Gemini_Generated_Image_9v9d889v9d889v9d.png';
import homeImg from '../../Images/Gemini_Generated_Image_b1j2ezb1j2ezb1j2.png';
import romanceImg from '../../Images/Gemini_Generated_Image_c81wb6c81wb6c81w.png';
import techImg from '../../Images/Gemini_Generated_Image_dorjlkdorjlkdorj.png';
import booksImg from '../../Images/Gemini_Generated_Image_fv5uqqfv5uqqfv5u.png';
import experiencesImg from '../../Images/Gemini_Generated_Image_fxewi0fxewi0fxew.png';
import accessoriesImg from '../../Images/Gemini_Generated_Image_h37im2h37im2h37i.png';
import beautyImg from '../../Images/Gemini_Generated_Image_h79dhvh79dhvh79d.png';
import stationeryImg from '../../Images/Gemini_Generated_Image_izw509izw509izw5.png';
import gamesImg from '../../Images/Gemini_Generated_Image_jbjgtgjbjgtgjbjg.png';
import plantsImg from '../../Images/Gemini_Generated_Image_ktsm43ktsm43ktsm.png';
import artImg from '../../Images/Gemini_Generated_Image_m9exybm9exybm9ex.png';
import luxuryImg from '../../Images/Gemini_Generated_Image_pp469bpp469bpp46.png';
import diyImg from '../../Images/Gemini_Generated_Image_q192qpq192qpq192.png';
import coupleImg from '../../Images/Gemini_Generated_Image_svesh1svesh1sves.png';
import keepsakeImg from '../../Images/Gemini_Generated_Image_szps2szps2szps2s.png';
import spaImg from '../../Images/Gemini_Generated_Image_vb1hfdvb1hfdvb1h.png';
import petImg from '../../Images/Gemini_Generated_Image_vcz15kvcz15kvcz1.png';
import ecoImg from '../../Images/Gemini_Generated_Image_wcjntpwcjntpwcjn.png';
import subscriptionImg from '../../Images/Gemini_Generated_Image_wsz0v2wsz0v2wsz0.png';
import customArtImg from '../../Images/Gemini_Generated_Image_xd1jztxd1jztxd1j.png';
import wineChocolateImg from '../../Images/Gemini_Generated_Image_xkoxlqxkoxlqxkox.png';

const categories = [
  'Jewelry', 'Handmade', 'Gifts', 'Apparel', 'Personalized', 'Food', 'Home',
  'Romance', 'Tech', 'Books', 'Experiences', 'Accessories',
  'Beauty', 'Stationery', 'Games', 'Plants', 'Art',
  'Luxury Gifts', 'DIY Kits', 'Couple Sets', 'Memory Keepsakes', 'Spa & Relaxation',
  'Pet Valentine', 'Eco-Friendly', 'Subscription Boxes', 'Custom Art', 'Wine & Chocolate'
];
const queries = {
  Jewelry: 'jewelry,necklace,valentine',
  Handmade: 'handmade,craft,artisan,valentine',
  Gifts: 'gift,valentine,present,romance',
  Apparel: 'apparel,clothing,couple,hoodie',
  Personalized: 'personalized,engraved,custom,valentine',
  Food: 'chocolate,dessert,sweets,valentine',
  Home: 'home-decor,candle,cozy,valentine'
};
const descriptions = {
  Jewelry: "Elegant pieces crafted to celebrate love and connection.",
  Handmade: "Artisan creations made with care and attention.",
  Gifts: "Thoughtful surprises perfect for special moments.",
  Apparel: "Cozy styles to match and share together.",
  Personalized: "Customize to make memories uniquely yours.",
  Food: "Sweet treats to delight and indulge.",
  Home: "Warm accents to set a romantic mood.",
  Romance: "Romantic picks to spark connection and sweet moments.",
  Tech: "Gadgets and accessories for modern love.",
  Books: "Stories and journals to share and cherish.",
  Experiences: "Memorable activities to enjoy together.",
  Accessories: "Stylish extras to complete the look.",
  Beauty: "Self-care and grooming for date-ready vibes.",
  Stationery: "Cards and paper goods for heartfelt notes.",
  Games: "Fun challenges and play for couples.",
  Plants: "Green gifts to grow together.",
  Art: "Creative pieces to decorate with love.",
  'Luxury Gifts': "High-end treasures for unforgettable gestures.",
  'DIY Kits': "Create together with step-by-step craft kits.",
  'Couple Sets': "Perfectly paired items made for two.",
  'Memory Keepsakes': "Stylish ways to preserve special moments.",
  'Spa & Relaxation': "Relaxing essentials for a calm retreat.",
  'Pet Valentine': "Adorable gifts to spoil your furry love.",
  'Eco-Friendly': "Sustainable choices that show you care.",
  'Subscription Boxes': "Monthly surprises curated with love.",
  'Custom Art': "Unique artwork tailored to your story.",
  'Wine & Chocolate': "Romantic pairings of fine wine and chocolate."
};
const names = {
  Jewelry: [
    "Heart Pendant Necklace","Infinity Love Necklace","Rose Gold Locket","Engraved Bar Necklace","Crystal Teardrop Earrings",
    "Pearl Stud Earrings","Couples Ring Set","Birthstone Bracelet","Dainty Chain Bracelet","Charm Bracelet",
    "Solitaire Pendant","Knot Ring","Cuff Bracelet","Stackable Rings","Nameplate Necklace",
    "Moon & Star Necklace","Beaded Anklet","Tennis Bracelet","Hoop Earrings","Initial Pendant"
  ],
  Handmade: [
    "Rose Bear","Crochet Heart Keychain","Hand-painted Mug","Pressed Flower Frame","Knitted Scarf",
    "Macrame Wall Hanging","Handmade Soap Set","Leather Journal","Resin Coaster Set","Clay Trinket Dish",
    "Dried Flower Bouquet","Embroidered Tote","Beaded Phone Charm","Hand-poured Candle","Origami Love Box",
    "Wood Photo Stand","Woven Basket","Felt Rose Corsage","Rope Plant Hanger","Hand-sewn Plush Heart"
  ],
  Gifts: [
    "Love Letters Box","Photo Memory Album","Couple Quiz Game","Surprise Gift Box","Message in a Bottle",
    "Date Night Cards","Scratch-off Adventure Poster","Polaroid Film Set","Stainless Travel Mug","Bluetooth Mini Speaker",
    "Personalized Calendar","Story of Us Book","Wine Accessories Kit","Hot Cocoa Gift Set","Spa Gift Basket",
    "Bath Bomb Kit","Aromatherapy Diffuser","Keepsake Trinket Box","Greeting Card Pack","Mini Succulent Set"
  ],
  Apparel: [
    "Matching Hoodies","Couple T-Shirts","Satin Pajama Set","Cozy Knit Sweater","Embroidered Hat",
    "Silk Robe","Flannel Lounge Pants","Fleece Blanket Poncho","Graphic Tee","Varsity Jacket",
    "Denim Couple Jacket","Cotton Socks Pack","Scarf & Beanie Set","Summer Dress","Button-up Shirt",
    "Lightweight Cardigan","Yoga Set","Baseball Cap","Windbreaker","Pullover Hoodie"
  ],
  Personalized: [
    "Custom Star Map","Engraved Keychain","Photo Crystal","Monogram Throw Pillow","Custom Photo Mug",
    "Personalized Notebook","Custom Phone Case","Engraved Wallet","Name Necklace","Coordinates Bracelet",
    "Photo Puzzle","Personalized Apron","Custom Night Light","Nameplate Door Sign","Custom Doormat",
    "Pet Portrait Print","Custom Calendar","Engraved Pen","Custom Flask","Personalized Cutting Board"
  ],
  Food: [
    "Luxury Chocolate Box","Macaron Assortment","Gourmet Truffle Set","Heart-shaped Cookies","Artisanal Honey Jar",
    "Strawberry Jam Duo","Specialty Tea Sampler","Coffee Lover Kit","Red Velvet Cupcakes","Chocolate-dipped Strawberries",
    "Caramel Popcorn Tin","Cheese and Crackers Set","Mini Cheesecake Bites","Brownie Gift Box","Marshmallow Treats",
    "Hot Sauce Pair","Olive Oil Tasting Set","Fruit Basket","Nuts Mix Jar","Candy Heart Tin"
  ],
  Home: [
    "Scented Candle Set","String Lights","Velvet Throw Pillow","Cozy Knit Blanket","Ceramic Vase",
    "Picture Frame Set","Table Runner","Rose Diffuser","Wall Art Print","Decorative Tray",
    "Ceramic Planter","Crystal Decor Bowl","Reed Diffuser Set","Lantern Candle Holder","Gold Mirror",
    "Desk Organizer","Bookends Pair","Floor Lamp","Curtain Fairy Lights","Room Mist Spray"
  ],
  Romance: Array.from({ length: 20 }, (_, i) => `Romance Gift ${i + 1}`),
  Tech: Array.from({ length: 20 }, (_, i) => `Tech Love Gadget ${i + 1}`),
  Books: Array.from({ length: 20 }, (_, i) => `Couple Book ${i + 1}`),
  Experiences: Array.from({ length: 20 }, (_, i) => `Date Experience ${i + 1}`),
  Accessories: Array.from({ length: 20 }, (_, i) => `Love Accessory ${i + 1}`),
  Beauty: Array.from({ length: 20 }, (_, i) => `Beauty Care Set ${i + 1}`),
  Stationery: Array.from({ length: 20 }, (_, i) => `Love Stationery ${i + 1}`),
  Games: Array.from({ length: 20 }, (_, i) => `Couple Game ${i + 1}`),
  Plants: Array.from({ length: 20 }, (_, i) => `Love Plant ${i + 1}`),
  Art: Array.from({ length: 20 }, (_, i) => `Love Art Print ${i + 1}`)
  ,
  'Luxury Gifts': Array.from({ length: 20 }, (_, i) => `Luxury Gift ${i + 1}`),
  'DIY Kits': Array.from({ length: 20 }, (_, i) => `DIY Kit ${i + 1}`),
  'Couple Sets': Array.from({ length: 20 }, (_, i) => `Couple Set ${i + 1}`),
  'Memory Keepsakes': Array.from({ length: 20 }, (_, i) => `Keepsake ${i + 1}`),
  'Spa & Relaxation': Array.from({ length: 20 }, (_, i) => `Spa Relax ${i + 1}`),
  'Pet Valentine': Array.from({ length: 20 }, (_, i) => `Pet Valentine ${i + 1}`),
  'Eco-Friendly': Array.from({ length: 20 }, (_, i) => `Eco Gift ${i + 1}`),
  'Subscription Boxes': Array.from({ length: 20 }, (_, i) => `Subscription Box ${i + 1}`),
  'Custom Art': Array.from({ length: 20 }, (_, i) => `Custom Art ${i + 1}`),
  'Wine & Chocolate': Array.from({ length: 20 }, (_, i) => `Wine & Chocolate ${i + 1}`)
};
const basePrices = {
  Jewelry: 50,
  Handmade: 25,
  Gifts: 30,
  Apparel: 40,
  Personalized: 35,
  Food: 20,
  Home: 28,
  Romance: 38,
  Tech: 60,
  Books: 22,
  Experiences: 75,
  Accessories: 27,
  Beauty: 32,
  Stationery: 18,
  Games: 29,
  Plants: 24,
  Art: 33
  ,
  'Luxury Gifts': 80,
  'DIY Kits': 22,
  'Couple Sets': 38,
  'Memory Keepsakes': 32,
  'Spa & Relaxation': 30,
  'Pet Valentine': 24,
  'Eco-Friendly': 28,
  'Subscription Boxes': 45,
  'Custom Art': 50,
  'Wine & Chocolate': 40
};

export const CATEGORY_IMAGES = {
  Jewelry: jewelryImg,
  Handmade: handmadeImg,
  Gifts: giftsImg,
  Apparel: apparelImg,
  Personalized: personalizedImg,
  Food: foodImg,
  Home: homeImg,
  Romance: romanceImg,
  Tech: techImg,
  Books: booksImg,
  Experiences: experiencesImg,
  Accessories: accessoriesImg,
  Beauty: beautyImg,
  Stationery: stationeryImg,
  Games: gamesImg,
  Plants: plantsImg,
  Art: artImg,
  'Luxury Gifts': luxuryImg,
  'DIY Kits': diyImg,
  'Couple Sets': coupleImg,
  'Memory Keepsakes': keepsakeImg,
  'Spa & Relaxation': spaImg,
  'Pet Valentine': petImg,
  'Eco-Friendly': ecoImg,
  'Subscription Boxes': subscriptionImg,
  'Custom Art': customArtImg,
  'Wine & Chocolate': wineChocolateImg
};
const toTags = (cat, name) => {
  const n = name.toLowerCase();
  const tags = [cat.toLowerCase(), 'valentine'];
  if (cat === 'Jewelry') {
    if (n.includes('necklace')) tags.push('necklace');
    else if (n.includes('earring')) tags.push('earrings');
    else if (n.includes('ring')) tags.push('ring');
    else if (n.includes('bracelet')) tags.push('bracelet');
    else tags.push('accessory');
  } else if (cat === 'Handmade') {
    if (n.includes('candle')) tags.push('candle');
    else if (n.includes('soap')) tags.push('soap');
    else if (n.includes('knit') || n.includes('scarf')) tags.push('knitting');
    else if (n.includes('macrame')) tags.push('macrame');
    else if (n.includes('leather')) tags.push('leather');
    else if (n.includes('resin')) tags.push('resin');
    else tags.push('craft');
  } else if (cat === 'Gifts') {
    if (n.includes('album') || n.includes('photo')) tags.push('photo');
    else if (n.includes('box')) tags.push('giftbox');
    else if (n.includes('mug')) tags.push('mug');
    else if (n.includes('speaker')) tags.push('speaker');
    else tags.push('gift');
  } else if (cat === 'Apparel') {
    if (n.includes('hoodie')) tags.push('hoodie');
    else if (n.includes('t-shirt') || n.includes('tee')) tags.push('tshirt');
    else if (n.includes('pajama')) tags.push('pajama');
    else if (n.includes('sweater')) tags.push('sweater');
    else if (n.includes('jacket')) tags.push('jacket');
    else if (n.includes('dress')) tags.push('dress');
    else if (n.includes('cardigan')) tags.push('cardigan');
    else tags.push('clothing');
  } else if (cat === 'Personalized') {
    if (n.includes('engraved')) tags.push('engraved');
    else if (n.includes('custom')) tags.push('custom');
    else if (n.includes('photo')) tags.push('photo');
    else if (n.includes('name')) tags.push('name');
    else tags.push('personalized');
  } else if (cat === 'Food') {
    if (n.includes('chocolate')) tags.push('chocolate');
    else if (n.includes('macaron')) tags.push('macaron');
    else if (n.includes('truffle')) tags.push('truffle');
    else if (n.includes('cookie')) tags.push('cookies');
    else if (n.includes('honey')) tags.push('honey');
    else if (n.includes('jam')) tags.push('jam');
    else if (n.includes('tea')) tags.push('tea');
    else if (n.includes('coffee')) tags.push('coffee');
    else if (n.includes('cupcake')) tags.push('cupcakes');
    else if (n.includes('strawberry')) tags.push('strawberries');
    else if (n.includes('popcorn')) tags.push('popcorn');
    else if (n.includes('cheese')) tags.push('cheese');
    else if (n.includes('brownie')) tags.push('brownie');
    else if (n.includes('marshmallow')) tags.push('marshmallow');
    else if (n.includes('sauce')) tags.push('sauce');
    else if (n.includes('oil')) tags.push('oil');
    else if (n.includes('fruit')) tags.push('fruit');
    else if (n.includes('nut')) tags.push('nuts');
    else if (n.includes('candy')) tags.push('candy');
    else tags.push('dessert');
  } else if (cat === 'Home') {
    if (n.includes('candle')) tags.push('candle');
    else if (n.includes('light')) tags.push('lights');
    else if (n.includes('pillow')) tags.push('pillow');
    else if (n.includes('blanket')) tags.push('blanket');
    else if (n.includes('vase')) tags.push('vase');
    else if (n.includes('frame')) tags.push('frame');
    else if (n.includes('diffuser')) tags.push('diffuser');
    else if (n.includes('art')) tags.push('art');
    else if (n.includes('tray')) tags.push('tray');
    else if (n.includes('planter')) tags.push('planter');
    else if (n.includes('mirror')) tags.push('mirror');
    else if (n.includes('organizer')) tags.push('organizer');
    else if (n.includes('lamp')) tags.push('lamp');
    else if (n.includes('curtain')) tags.push('curtain');
    else if (n.includes('spray')) tags.push('spray');
    else tags.push('decor');
  } else {
    if (n.includes('gift')) tags.push('gift');
    else if (n.includes('set')) tags.push('set');
    else if (n.includes('print')) tags.push('print');
    else if (n.includes('experience')) tags.push('experience');
  }
  return tags.join(',');
};
const makeDescription = (cat, name, index) => {
  const base = descriptions[cat] || "Specially curated for romantic moments.";
  const extras = [
    "Perfect for a cozy date night.",
    "A sweet way to say I love you.",
    "Ideal for surprising your favorite person.",
    "Adds a little magic to your evening.",
    "Thoughtful pick for unforgettable moments."
  ];
  const extra = extras[index % extras.length];
  return `${name} – ${base} ${extra}`;
};
export const MOCK_PRODUCTS = categories.flatMap((cat, ci) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: ci * 100 + i + 1,
    name: names[cat][i],
    price: Number((basePrices[cat] + (i % 10) * 2 + ci * 3).toFixed(2)),
    category: cat,
    image: CATEGORY_IMAGES[cat] || `https://placehold.co/800x800/ffffff/cc1d4f/png?text=${encodeURIComponent(names[cat][i])}`,
    description: makeDescription(cat, names[cat][i], i),
    tags: toTags(cat, names[cat][i]).split(',')
  }))
);
