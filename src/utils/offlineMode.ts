import { Skill, Note, Reference } from '../types';

const OFFLINE_MODE_KEY = 'offline_mode';
const SKILLS_KEY = 'skills';
const NOTES_KEY = 'notes';
const REFERENCES_KEY = 'references';

// Helper function to get data from localStorage
const getStorageData = <T>(key: string, defaultValue: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

// Helper function to set data in localStorage
const setStorageData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const isOfflineMode = (): boolean => {
  return localStorage.getItem(OFFLINE_MODE_KEY) === 'true';
};

export const setOfflineMode = (enabled: boolean): void => {
  if (enabled) {
    localStorage.setItem(OFFLINE_MODE_KEY, 'true');
    initializeOfflineData();
  } else {
    localStorage.removeItem(OFFLINE_MODE_KEY);
  }
};

export const getMockUser = () => ({
  email: 'offline@local.dev',
  displayName: 'Offline User',
  uid: 'offline-123',
});

// Initialize with sample data
const initializeOfflineData = () => {
  if (!localStorage.getItem(SKILLS_KEY)) {
    const sampleSkills: Skill[] = [
      {
        id: '1',
        name: 'JavaScript',
        description: 'Modern JavaScript programming',
        proficiencyLevel: 'expert',
        tags: ['programming', 'web'],
      },
      {
        id: '2',
        name: 'React',
        description: 'Frontend development with React',
        proficiencyLevel: 'advanced',
        tags: ['frontend', 'web'],
      },
      {
        id: '3',
        name: 'TypeScript',
        description: 'Typed JavaScript development',
        proficiencyLevel: 'intermediate',
        tags: ['programming', 'web'],
      },
    ];
    setStorageData(SKILLS_KEY, sampleSkills);
  }

  if (!localStorage.getItem(NOTES_KEY)) {
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'React Hooks',
        content: 'Notes about React hooks and their usage',
        skillId: '2',
        createdAt: new Date().toISOString(),
      },
    ];
    setStorageData(NOTES_KEY, sampleNotes);
  }

  if (!localStorage.getItem(REFERENCES_KEY)) {
    const sampleReferences: Reference[] = [
      {
        id: '1',
        title: 'TypeScript Documentation',
        description: 'Official TypeScript documentation',
        url: 'https://www.typescriptlang.org/docs/',
        skillId: '3',
      },
    ];
    setStorageData(REFERENCES_KEY, sampleReferences);
  }
};

// Skills
export const getAllSkills = (): Skill[] => {
  return getStorageData<Skill>(SKILLS_KEY, []);
};

export const getSkillById = (id: string): Skill | undefined => {
  return getAllSkills().find(skill => skill.id === id);
};

export const addSkill = (skill: Omit<Skill, 'id'>): Skill => {
  const skills = getAllSkills();
  const newSkill = { ...skill, id: Date.now().toString() };
  setStorageData(SKILLS_KEY, [...skills, newSkill]);
  return newSkill;
};

export const updateSkill = (id: string, skill: Partial<Skill>): void => {
  const skills = getAllSkills();
  const index = skills.findIndex(s => s.id === id);
  if (index !== -1) {
    skills[index] = { ...skills[index], ...skill };
    setStorageData(SKILLS_KEY, skills);
  }
};

export const deleteSkill = (id: string): void => {
  const skills = getAllSkills();
  setStorageData(SKILLS_KEY, skills.filter(skill => skill.id !== id));
};

// Notes
export const getAllNotes = (): Note[] => {
  return getStorageData<Note>(NOTES_KEY, []);
};

export const getNotesBySkillId = (skillId: string): Note[] => {
  return getAllNotes().filter(note => note.skillId === skillId);
};

export const addNote = (note: Omit<Note, 'id'>): Note => {
  const notes = getAllNotes();
  const newNote = { ...note, id: Date.now().toString() };
  setStorageData(NOTES_KEY, [...notes, newNote]);
  return newNote;
};

export const updateNote = (id: string, note: Partial<Note>): void => {
  const notes = getAllNotes();
  const index = notes.findIndex(n => n.id === id);
  if (index !== -1) {
    notes[index] = { ...notes[index], ...note };
    setStorageData(NOTES_KEY, notes);
  }
};

export const deleteNote = (id: string): void => {
  const notes = getAllNotes();
  setStorageData(NOTES_KEY, notes.filter(note => note.id !== id));
};

// References
export const getAllReferences = (): Reference[] => {
  return getStorageData<Reference>(REFERENCES_KEY, []);
};

export const getReferencesBySkillId = (skillId: string): Reference[] => {
  return getAllReferences().filter(ref => ref.skillId === skillId);
};

export const addReference = (reference: Omit<Reference, 'id'>): Reference => {
  const references = getAllReferences();
  const newReference = { ...reference, id: Date.now().toString() };
  setStorageData(REFERENCES_KEY, [...references, newReference]);
  return newReference;
};

export const updateReference = (id: string, reference: Partial<Reference>): void => {
  const references = getAllReferences();
  const index = references.findIndex(r => r.id === id);
  if (index !== -1) {
    references[index] = { ...references[index], ...reference };
    setStorageData(REFERENCES_KEY, references);
  }
};

export const deleteReference = (id: string): void => {
  const references = getAllReferences();
  setStorageData(REFERENCES_KEY, references.filter(ref => ref.id !== id));
};

// Search functionality
export const searchSkills = (query: string): Skill[] => {
  const skills = getAllSkills();
  const lowercaseQuery = query.toLowerCase();
  return skills.filter(skill =>
    skill.name.toLowerCase().includes(lowercaseQuery) ||
    skill.description.toLowerCase().includes(lowercaseQuery) ||
    skill.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const searchNotes = (query: string): Note[] => {
  const notes = getAllNotes();
  const lowercaseQuery = query.toLowerCase();
  return notes.filter(note =>
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.content.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchReferences = (query: string): Reference[] => {
  const references = getAllReferences();
  const lowercaseQuery = query.toLowerCase();
  return references.filter(ref =>
    ref.title.toLowerCase().includes(lowercaseQuery) ||
    ref.description.toLowerCase().includes(lowercaseQuery)
  );
};
