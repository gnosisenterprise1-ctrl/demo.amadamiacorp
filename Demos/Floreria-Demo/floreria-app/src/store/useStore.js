import { create } from 'zustand';

import imgRedRose from '../assets/red_rose.png';
import imgWhiteRose from '../assets/white_rose.png';
import imgPinkRose from '../assets/pink_rose.png';
import imgSunflower from '../assets/sunflower.png';
import imgLily from '../assets/lily.png';
import imgTulip from '../assets/tulip.png';
import imgOrchid from '../assets/orchid.png';
import imgDaisy from '../assets/daisy.png';
import imgPeony from '../assets/peony.png';
import imgHydrangea from '../assets/hydrangea.png';
import imgCarnation from '../assets/carnation.png';
import imgFoliage from '../assets/foliage.png';

import wrapKraft from '../assets/wrap_kraft.png';
import wrapVelvet from '../assets/wrap_velvet.png';
import wrapGold from '../assets/wrap_gold.png';
import wrapSilk from '../assets/wrap_silk.png';

export const CATALOG_ITEMS = {
  F_RED_ROSE: { id: 'F_RED_ROSE', type: 'flower', name: 'Rosa Roja Premium', price: 40, color: '#A52A2A', image: imgRedRose },
  F_WHITE_ROSE: { id: 'F_WHITE_ROSE', type: 'flower', name: 'Rosa Blanca', price: 35, color: '#FFFFFF', image: imgWhiteRose },
  F_PINK_ROSE: { id: 'F_PINK_ROSE', type: 'flower', name: 'Rosa Rosada', price: 38, color: '#FFC0CB', image: imgPinkRose },
  F_SUNFLOWER: { id: 'F_SUNFLOWER', type: 'flower', name: 'Girasol', price: 60, color: '#FFD700', image: imgSunflower },
  F_LILY: { id: 'F_LILY', type: 'flower', name: 'Lily', price: 70, color: '#FFB6C1', image: imgLily },
  F_TULIP: { id: 'F_TULIP', type: 'flower', name: 'Tulipán', price: 45, color: '#FF69B4', image: imgTulip },
  F_ORCHID: { id: 'F_ORCHID', type: 'flower', name: 'Orquídea', price: 90, color: '#DA70D6', image: imgOrchid },
  F_DAISY: { id: 'F_DAISY', type: 'flower', name: 'Margarita', price: 20, color: '#F0E68C', image: imgDaisy },
  F_PEONY: { id: 'F_PEONY', type: 'flower', name: 'Peonía', price: 80, color: '#FF1493', image: imgPeony },
  F_HYDRANGEA: { id: 'F_HYDRANGEA', type: 'flower', name: 'Hortensia', price: 85, color: '#4169E1', image: imgHydrangea },
  F_CARNATION: { id: 'F_CARNATION', type: 'flower', name: 'Clavel', price: 25, color: '#FF4500', image: imgCarnation },
  F_FOLIAGE: { id: 'F_FOLIAGE', type: 'flower', name: 'Follaje Baby Breath', price: 15, color: '#2E8B57', image: imgFoliage },
};

export const WRAPPINGS = {
  W_PAPER_KRAFT: { id: 'W_PAPER_KRAFT', name: 'Papel Kraft Vintage', price: 50, color: '#D2B48C', material: 'matte', image: wrapKraft },
  W_BLACK_VELVET: { id: 'W_BLACK_VELVET', name: 'Velour Negro Elegante', price: 120, color: '#1A1A1A', material: 'velvet', image: wrapVelvet },
  W_GOLD_FOIL: { id: 'W_GOLD_FOIL', name: 'Papel Oro Laminado', price: 200, color: '#D4AF37', material: 'metallic', image: wrapGold },
  W_WHITE_SILK: { id: 'W_WHITE_SILK', name: 'Seda Blanca Mate', price: 150, color: '#F8F8FF', material: 'silk', image: wrapSilk },
};

// max flowers 15 for demo purposes
const MAX_ANCHORS = 15;

const useStore = create((set, get) => ({
  flowers: [], // Array of added flower objects { id, anchorIndex }
  wrapping: WRAPPINGS.W_PAPER_KRAFT, // default wrapping
  totalPrice: WRAPPINGS.W_PAPER_KRAFT.price,
  
  addFlower: (catalogItemId) => set((state) => {
    if (state.flowers.length >= MAX_ANCHORS) return state; // Bouquet full
    const itemInfo = CATALOG_ITEMS[catalogItemId];
    
    // Find next available anchor
    const usedAnchors = new Set(state.flowers.map(f => f.anchorIndex));
    let nextAnchorIndex = -1;
    for (let i = 0; i < MAX_ANCHORS; i++) {
      if (!usedAnchors.has(i)) {
        nextAnchorIndex = i;
        break;
      }
    }
    
    if (nextAnchorIndex === -1) return state; // sanity check
    
    const newFlowers = [...state.flowers, { item: itemInfo, anchorIndex: nextAnchorIndex, id: Math.random().toString(36).substr(2, 9) }];
    return {
      flowers: newFlowers,
      totalPrice: calculateTotal(newFlowers, state.wrapping)
    };
  }),

  setWrapping: (wrappingId) => set((state) => {
    const wrap = WRAPPINGS[wrappingId];
    return {
      wrapping: wrap,
      totalPrice: calculateTotal(state.flowers, wrap)
    };
  }),

  removeFlower: (idToRemove) => set((state) => {
    const newFlowers = state.flowers.filter(f => f.id !== idToRemove);
    return {
      flowers: newFlowers,
      totalPrice: calculateTotal(newFlowers, state.wrapping)
    };
  }),

  fillWithFoliage: () => set((state) => {
    const usedAnchors = new Set(state.flowers.map(f => f.anchorIndex));
    const foliageItems = [];
    const foliageInfo = CATALOG_ITEMS.F_FOLIAGE;
    
    for (let i = 0; i < MAX_ANCHORS; i++) {
        if (!usedAnchors.has(i)) {
            foliageItems.push({ item: foliageInfo, anchorIndex: i, id: Math.random().toString(36).substr(2, 9) });
        }
    }
    
    const newFlowers = [...state.flowers, ...foliageItems];
    return {
        flowers: newFlowers,
        totalPrice: calculateTotal(newFlowers, state.wrapping)
    };
  }),
  
  clearBouquet: () => set(() => ({
    flowers: [],
    wrapping: WRAPPINGS.W_PAPER_KRAFT,
    totalPrice: WRAPPINGS.W_PAPER_KRAFT.price
  }))
}));

function calculateTotal(flowers, wrapping) {
  const fTotal = flowers.reduce((sum, f) => sum + f.item.price, 0);
  const wTotal = wrapping ? wrapping.price : 0;
  return fTotal + wTotal;
}

export default useStore;
