
import { Hotel, Experience } from '@/types';

export const hotels: Hotel[] = [
  {
    id: '1',
    name: 'Sheraton Addis',
    type: 'Hotel',
    location: 'Addis Ababa',
    priceRange: '$$$$',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1542314831-068cd1dbb5eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    description: 'A landmark of luxury in the heart of Ethiopia\'s capital, offering world-class service, opulent rooms, and a range of fine dining options.',
    amenities: ['Wi-Fi', 'Pool', 'Spa', 'Gym', 'Parking', 'Restaurant'],
  },
  {
    id: '2',
    name: 'Kuriftu Resort & Spa',
    type: 'Resort',
    location: 'Bishoftu',
    priceRange: '$$$',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [],
    description: 'An idyllic escape on the shores of Lake Kuriftu, this resort is perfect for relaxation and rejuvenation, with stunning views and a renowned spa.',
    amenities: ['Wi-Fi', 'Pool', 'Spa', 'Water Park', 'Parking', 'Restaurant'],
  },
  {
    id: '3',
    name: 'Gheralta Lodge',
    type: 'Lodge',
    location: 'Tigray',
    priceRange: '$$',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1949&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [],
    description: 'Nestled amidst the breathtaking Gheralta mountains, this lodge offers a unique blend of comfort and adventure, with access to ancient rock-hewn churches.',
    amenities: ['Wi-Fi', 'Restaurant', 'Guided Tours', 'Parking'],
  },
  {
    id: '4',
    name: 'Haile Resort',
    type: 'Resort',
    location: 'Hawassa',
    priceRange: '$$$',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1445019980597-93e8ac52a5a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [],
    description: 'Owned by the legendary athlete Haile Gebrselassie, this resort on Lake Hawassa provides modern amenities and recreational activities for the whole family.',
    amenities: ['Wi-Fi', 'Pool', 'Gym', 'Parking', 'Restaurant', 'Boat Trips'],
  },
];

export const experiences: Experience[] = [
  {
    id: 'exp1',
    name: 'Addis Ababa Food Tour',
    provider: 'Taste of Addis',
    location: 'Addis Ababa',
    pricePerGuest: 50,
    category: 'Food & Drink',
    duration: '4 hours',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];
