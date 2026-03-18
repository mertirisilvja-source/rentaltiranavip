import clsA from "../assets/cars/cls-anash.JPEG";
import clsP from "../assets/cars/cls-para.jpeg";
import clsM from "../assets/cars/cls-mbrapa.jpeg";
import clsMa from "../assets/cars/cls-m1.JPEG";
import clsPa from "../assets/cars/cls-p1.JPEG";

import ferrariP from "../assets/cars/ferrari-para.JPG";
import ferrariM from "../assets/cars/ferrari-mbrapa.jpg";
import ferrariB from "../assets/cars/ferrari-brenda.JPG";

import g63WP from "../assets/cars/g63White-para.png";
import g63WM from "../assets/cars/g63White-mbrapa.png";
import g63WA from "../assets/cars/g63White-ane.png";

import gleP from "../assets/cars/gle-para.jpeg";
import gleM from "../assets/cars/gle-mbrapa.JPG";
import gleB from "../assets/cars/gle-brenda.jpg";

import gtBA from "../assets/cars/gtB-ane.JPG";
import gtBP from "../assets/cars/gtB-para.jpeg";
import gtBM from "../assets/cars/gtB-mbrapa.JPG";
import gtBpa from "../assets/cars/gtB-para-ane.JPG";
import gtBpas from "../assets/cars/gtB-pas.JPG";

import gtWA from "../assets/cars/gtW-anesore.jpg";
import gtWP from "../assets/cars/gtW-para.jpeg";
import gtWM from "../assets/cars/gtW-mes-ane.JPG";
import gtWpa from "../assets/cars/gtW-para2.jpg";

import huracanGA from "../assets/cars/huracanGri-ane.jpg";
import huracanGP from "../assets/cars/huracanGri-para.jpeg";
import huracanGB from "../assets/cars/huracanGri-brenda.JPG";

import huracanJA from "../assets/cars/huracanJeshil-ane.JPG";
import huracanJP from "../assets/cars/huracanJeshil-para.JPG";
import huracanJM from "../assets/cars/huracanJeshil-mbrapa.JPG";
import huracanJB from "../assets/cars/huracanJeshil-brenda.JPG";

import huracanKA from "../assets/cars/huracanKuq-ane.jpg";
import huracanKP from "../assets/cars/huracanKuq-para.jpeg";
import huracanKP1 from "../assets/cars/huracanKuq-para1.JPG";
import huracanKB from "../assets/cars/huracanKuq-brenda.jpeg";
import huracanKAn from "../assets/cars/huracanKuq-anesore.JPG";

import huracanPP from "../assets/cars/huracanPortokalli-para.jpg";
import huracanPB from "../assets/cars/huracanPortokalli-brenda.JPG";

import m4C from "../assets/cars/m4-cabrio.jpg";
import m4Mb from "../assets/cars/m4-mbyllur.jpg";
import m4M from "../assets/cars/m4-mbrapa.jpg";
import m4B from "../assets/cars/m4-brenda.JPG";

import r8P from "../assets/cars/r8-para.JPG";
import r8M from "../assets/cars/r8-mbrapa.JPG";
import r8B from "../assets/cars/r8-brenda.JPG";
import r8A from "../assets/cars/r8-ane.JPG";

import rollsP from "../assets/cars/rolls-para.JPG";
import rollsM from "../assets/cars/rolls-mbrapa.jpg";
import rollsB from "../assets/cars/rolls-brenda.JPG";

import rs6P from "../assets/cars/rs6-para.jpg";
import rs6M from "../assets/cars/rs6-mbrapa.JPG";
import rs6B from "../assets/cars/rs6-brenda.JPG";

import s63P from "../assets/cars/s63-para.jpeg";
import s63M from "../assets/cars/s63-mbrapa.jpg";
import s63B from "../assets/cars/s63-brenda.jpg";
import s63A from "../assets/cars/s63-ane.jpg";

import urusBM from "../assets/cars/urusB-mbrapa.jpg";
import urusBP from "../assets/cars/urusB-para.jpeg";
import urusBp1 from "../assets/cars/urusB-para1.JPG";

import urusVA from "../assets/cars/urusV-ane.jpg";
import urusVP from "../assets/cars/urusV-para.jpeg";
import urusVM from "../assets/cars/urusV-mes-ane.JPG";
import urusVB from "../assets/cars/urusV-brenda.JPG";

export const cars = [
  {
    id: "cls-63s-amg",
    brand: "Mercedes-Benz",
    model: "CLS 63s AMG 4MATIC",
    year: 2017,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 5,
    pricePerDay: 250,
    available: true,
    images: [clsP, clsA, clsM, clsMa, clsPa],
  },
  {
    id: "gle-coupe",
    brand: "Mercedes-Benz",
    model: "Gle Coupe",
    year: 2021,
    fuelKey: "carSpecs.fuel.diesel",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 5,
    pricePerDay: 350,
    available: true,
    images: [gleP, gleM, gleB],
  },
  {
    id: "s63-coupe-amg",
    brand: "Mercedes-Benz",
    model: "S63 Coupe",
    year: 2019,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 5,
    pricePerDay: 400,
    available: true,
    images: [s63P, s63M, s63B, s63A],
  },
  {
    id: "gt63s-amg-black",
    brand: "Mercedes-Benz",
    model: "Gt 63s AMG",
    year: 2020,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 5,
    pricePerDay: 500,
    available: true,
    images: [gtBP, gtBpa, gtBpas, gtBM, gtBA],
  },
  {
    id: "gt63s-amg-white",
    brand: "Mercedes-Benz",
    model: "Gt 63s AMG",
    year: 2020,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 5,
    pricePerDay: 500,
    available: true,
    images: [gtWP, gtWpa, gtWM, gtWA],
  },
  {
    id: "m4-cabrio",
    brand: "BMW",
    model: "M4 Cabrio",
    year: 2024,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 4,
    pricePerDay: 500,
    available: true,
    images: [m4C, m4Mb, m4M, m4B],
  },
  {
    id: "audi-rs6",
    brand: "Audi",
    model: "RS6 Avant",
    year: 2025,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 5,
    pricePerDay: 500,
    available: true,
    images: [rs6P, rs6M, rs6B],
  },
  {
    id: "g63-amg-white",
    brand: "Mercedes-Benz",
    model: "G-Class 63 AMG",
    year: 2021,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 5,
    pricePerDay: 800,
    available: true,
    images: [g63WP, g63WM, g63WA],
  },
  {
    id: "rolls-royce-ghost",
    brand: "Rolls-Royce",
    model: "Ghost",
    year: 2017,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 5,
    pricePerDay: 1000,
    available: true,
    images: [rollsP, rollsM, rollsB],
  },
  {
    id: "audi-r8-spider",
    brand: "Audi",
    model: "R8 Spider",
    year: 2022,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 2,
    pricePerDay: 1200,
    available: true,
    images: [r8P, r8M, r8B, r8A],
  },
  {
    id: "urus-blue",
    brand: "Lamborghini",
    model: "Urus",
    year: 2020,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 5,
    pricePerDay: 1500,
    available: true,
    images: [urusBP, urusBM, urusBp1],
  },
  {
    id: "urus-yellow",
    brand: "Lamborghini",
    model: "Urus",
    year: 2020,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 5,
    pricePerDay: 1500,
    available: true,
    images: [urusVP, urusVM, urusVB, urusVA],
  },
  {
    id: "huracan-jeshil",
    brand: "Lamborghini",
    model: "Huracan",
    year: 2018,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 2,
    pricePerDay: 1800,
    available: true,
    images: [huracanJP, huracanJM, huracanJA, huracanJB],
  },
  {
    id: "huracan-kuq",
    brand: "Lamborghini",
    model: "Huracan",
    year: 2018,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 2,
    pricePerDay: 1800,
    available: true,
    images: [huracanKP, huracanKP1, huracanKA, huracanKAn, huracanKB],
  },
  {
    id: "huracan-gri",
    brand: "Lamborghini",
    model: "Huracan",
    year: 2018,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 2,
    pricePerDay: 1800,
    available: true,
    images: [huracanGP, huracanGB, huracanGA],
  },
  {
    id: "huracan-portokalli",
    brand: "Lamborghini",
    model: "Huracan",
    year: 2018,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 2,
    pricePerDay: 1800,
    available: true,
    images: [huracanPP, huracanPB],
  },
  {
    id: "ferrari-488-spider",
    brand: "Ferrari",
    model: "488 Spider",
    year: 2018,
    fuelKey: "carSpecs.fuel.petrol",
    gearboxKey: "carSpecs.gearbox.automatic",
    seats: 2,
    pricePerDay: 1800,
    available: true,
    images: [ferrariP, ferrariM, ferrariB],
  },
];
