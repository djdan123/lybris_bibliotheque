// Clés localStorage
const STORAGE_KEYS = {
  BOOKS: 'libris_books',
  AUTHORS: 'libris_authors',
  PUBLISHERS: 'libris_publishers',
  CURRENT_USER: 'currentUser',
  USER_PROFILE: 'userProfile',
  LOANS: 'libris_loans'
};

// Données initiales
const initialBooks = [
  { id: 1, title: "Le Silence des Eaux", author: "Clarisse de Maistre", category: "Fiction", stock: 42, isbn: "978-2-07-011234-5", publisher: "Gallimard", cover: "https://picsum.photos/id/1015/300/420" },
  { id: 2, title: "L'Empire du Nord", author: "Julien Moreau", category: "Histoire", stock: 3, isbn: "978-2-07-011235-2", publisher: "Flammarion", cover: "https://picsum.photos/id/106/300/420" },
  { id: 3, title: "1984", author: "George Orwell", category: "Classique", stock: 28, isbn: "978-2-07-011236-9", publisher: "Gallimard", cover: "https://picsum.photos/id/201/300/420" },
  { id: 4, title: "Cosmos", author: "Carl Sagan", category: "Sciences", stock: 104, isbn: "978-2-07-011237-6", publisher: "Seuil", cover: "https://picsum.photos/id/133/300/420" },
];

const initialAuthors = [
  { id: 1, name: "Clarisse de Maistre", birth: "1975, Lyon", death: "", works: 12, genre: "Fiction", status: "Actif", image: "https://picsum.photos/id/64/300/300" },
  { id: 2, name: "Julien Moreau", birth: "1968, Marseille", death: "", works: 8, genre: "Histoire", status: "Actif", image: "https://picsum.photos/id/65/300/300" },
  { id: 3, name: "George Orwell", birth: "1903, Inde", death: "1950, Londres", works: 28, genre: "Classique", status: "Classique", image: "https://picsum.photos/id/66/300/300" },
];

const initialPublishers = [
  { id: 1, name: "Éditions Gallimard", location: "Paris, France", books: 12450, contact: "C. Lefebvre", type: "PREMIUM" },
  { id: 2, name: "Flammarion", location: "Lyon, France", books: 8200, contact: "H. Girard", type: "STANDARD" },
  { id: 3, name: "Éditions du Seuil", location: "Paris, France", books: 5600, contact: "R. Dubois", type: "PREMIUM" },
];

// Helpers génériques
export const getData = (key, initialData) => {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  if (initialData) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return [];
};

export const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Services spécifiques
export const getBooks = () => getData(STORAGE_KEYS.BOOKS, initialBooks);
export const saveBooks = (books) => setData(STORAGE_KEYS.BOOKS, books);

export const getAuthors = () => getData(STORAGE_KEYS.AUTHORS, initialAuthors);
export const saveAuthors = (authors) => setData(STORAGE_KEYS.AUTHORS, authors);

export const getPublishers = () => getData(STORAGE_KEYS.PUBLISHERS, initialPublishers);
export const savePublishers = (publishers) => setData(STORAGE_KEYS.PUBLISHERS, publishers);

export const getCurrentUser = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
export const setCurrentUser = (user) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
export const removeCurrentUser = () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);