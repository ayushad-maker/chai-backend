import express from "express"
import { getAllProducts } from "../controllers/product.controller.js";
import { Product } from "../models/product.model.js";


const router = express.Router();

router.post("/seed", async(req,res)=>{
    try {
        const sampleProducts = [
            {
      id: 1,
      name: "Ultraboost 5 Shoes - Digital Camo",
      price: 17999,
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/eb93e01133f24a74a1352acb63438cc2_9366/Ultraboost_5_Shoes_-_Digital_Camo_Black_JI1521_01_00_standard.jpg",
      link: "/shoes",
    },
    {
      id: 2,
      name: "Superstar II Shoes",
      price: 9999,
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/98e30d2eca1f4cf59e5db8f2fee64a59_9366/Superstar_II_Shoes_White_JQ4728_01_00_standard.jpg",
      link: "/shoes",
    },
    {
      id: 3,
      name: "Stan Smith Shoes",
      price: 5999,
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0e41fcd121484885ad846dfc70e802cc_9366/Stan_Smith_Shoes_Black_IG1319_01_standard.jpg",
      link: "/shoes",
    },
    {
      id:4,
      name:"Samba OG Shoes",
      price:10999,
      image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/011744ef273d4a66b9cc880b980340a2_9366/Samba_OG_Shoes_White_ID0478_01_standard.jpg",
      link:"/shoes",
    },
    {
     id:5,
     name:"Gazelle Shoes",
     price:9999,
     image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/340aeb9ac43847fea000a8da0182b561_9366/Gazelle_Shoes_Burgundy_B41645_01_standard.jpg",
     link:"/shoes", 
    },
    {
      id:6,
      name:"Forum Low CL Shoes",
      price:10999,
      image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/bb9abfcff3c448538123d690e5216d26_9366/Forum_Low_CL_Shoes_White_JI3269_01_00_standard.jpg",
      link:"/shoes"
    },
    {
     id:7,
     name:"Liverpool FC Home Jersey",
     price:8599,
     image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/165dc0b6d26448ce905ff96c05526668_9366/Liverpool_FC_25-26_Long_Sleeve_Home_Jersey_Red_JV6456_21_model.jpg",
     link:"/jersey"     
    },
    {
      id:8,
      name:"Arsenal 25/26 Third Jersey",
      price:5999,
      image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4a02015f9724a4a9391fdbded3d1b3e_9366/Arsenal_25-26_Third_Jersey_White_JI9556_21_model.jpg",
      link:"/jersey"

    },
    {
      id:9,
      name:"Manchester United Home Jersey",
      price:3599,
      image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/bb34e2d7ef774076b2384c4aecc3c090_9366/Manchester_United_24-25_Home_Jersey_Red_IU1397_HM1.jpg",
      link:"/jersey"
    },
    {
      id:10,
      name:"Real Madrid 25/26 Home Jersey",
      price:5999,
      image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7463ff6a459249d58e304d7d677ef93c_9366/Real_Madrid_Terrace_Icons_Jersey_Gender_Neutral_White_JF2581_HM1.jpg",
      link:"/jersey",
    },
    {
      id:11,
      name:"FC Bayern Terrace Icons Jersey",
      price:4799,
      image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b006eb1925974618a2df1ce4683c5611_9366/FC_Bayern_Terrace_Icons_Jersey_Burgundy_JF0595_HM1.jpg",
      link:"/jersey"
    },
    {
      id:12,
      name:"Juventus 25/26 Home Jersey",
      price:5999,
      image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fe0a2e213d8d4ce2accb8324679b8e5a_9366/Juventus_25-26_Home_Jersey_White_JJ4320_21_model.jpg",
      link:"/jersey"
    },
    {
        id:13,
        name:"adidas Stella McCartney Hoodie",
        price:11999,
        image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/68a6dec3a54e4269aba6ab3222522f84_9366/adidas_By_Stella_McCartney_Scuba_Hoodie_Grey_JM5792_HM1.jpg",
        link:"/hoodies"
    },
    {
        id:14,
        name:"Y-3 Graphic FT Hoodie",
        price:24999,
        image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/26175640b61848fcb657245c4d4a5a03_9366/Y-3_Graphic_FT_Hoodie_Grey_KB2605_21_model.jpg",
        link:"/hoodies"
    },
    {
         id:15,
        name:"Chavarria Heavyweight Hoodie",
        price:17999,
        image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/190ca1cb594d4c418cf88f04f4b361cd_9366/Chavarria_Heavyweight_Hoodie_White_JW1445_21_model.jpg",
        link:"/hoodies"
    },
    {
         id:16,
        name:"adidas Z.N.E. Full-Zip Hoodie",
        price:5999,
        image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/579cc3220b884bf68f5868244d35e57c_9366/adidas_Z.N.E._Full-Zip_Hoodie_Pink_JC5394_21_model.jpg",
        link:"/hoodies"
    },
    { 
         id:17,
        name:"Graphic Hoodie",
        price:6999,
        image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3cc1b68bacdf42bea669777443bcd66b_9366/Graphic_Hoodie_Black_JX3058_21_model.jpg",
        link:"/hoodies"
    },
    {
        id:18,
        name:"adidas by Avavav Hoodie",
        price:22999,
        image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b8f03155049744d6a02e4eb6b2daa7ec_9366/adidas_by_Avavav_Shoulderless_Hoodie_Grey_JP4849_25_outfit.jpg",
        link:"/hoodies"
    },
     {
        id:19,
        name:"adidas Pixar Coco Backpack Kids",
        price:2999,
        image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/18bebd9238fd4c0aaaec52e44c68cfb2_9366/adidas_Pixar_Coco_Backpack_Kids_Black_JM4469_01_00_standard.jpg",
        link:"/accessories" 
    },
    {
       id:20,
       name:"Adicolor Classic Mini Airliner",
       price:2999,
       image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0840b24a87224bd0b6c5eddcd66e9e13_9366/Adicolor_Classic_Mini_Airliner_Blue_JX0232_01_00_standard.jpg",
       link:"/accessories"
    },
    {
       id:21,
       name:"adidas Fortnite Beanie",
       price:2799,
       image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/1618401cef0042fc803aaea57225c8af_9366/adidas_Fortnite_Beanie_Black_JN2689_01_00_standard.jpg",
       link:"/accessories"
    },
    {
        id:22,
       name:"Clot Cord Hat by Edison Chen",
       price:7599,
       image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0d84a84f8ce04a71bf6a76e7462f140d_9366/Clot_Cord_Hat_by_Edison_Chen_Brown_JL7886_01_00_standard.jpg",
       link:"/accessories"
    },
    {
       id:23,
       name:"Y-3 Classic Logo Cap",
       price:7999,
       image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/6ee690ebbd7d456586821d20fd417298_9366/Y-3_Classic_Logo_Cap_Grey_JP1144_01_00_standard.jpg",
       link:"/accessories"
    },
    {
       id:24,
       name:"MERCEDES AMG FORMULA CAP",
       price:3299,
       image:"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2b577255827a46b1aa75808e011c5e30_9366/MERCEDES_-_AMG_PETRONAS_FORMULA_ONE_TEAM_DRIVER_CAP_Black_JW6267_HM1.jpg",
       link:"/accessories"
    }
    

    
    ];
    
    await Product.insertMany(sampleProducts)
    res.status(201).json({success:true,message:"Prodcuts seeded sucessfully."})
    } catch (error) {
    res.status(500).json({success:false,message:"sending failed",error:error.message})    
    }
});

router.get("/",getAllProducts);

export default router