export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface BaseItem {
  id: string;
  skillId?: string;
}

export interface Skill extends BaseItem {
  name: string;
  description: string;
  proficiencyLevel: ProficiencyLevel;
  tags?: string[];
}

export interface Note extends BaseItem {
  title: string;
  content: string;
  createdAt: string;
}

export interface Reference extends BaseItem {
  title: string;
  description: string;
  url: string;
}
