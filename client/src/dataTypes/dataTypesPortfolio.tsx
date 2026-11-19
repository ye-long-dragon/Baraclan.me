export interface Skill {
  id?: string;
  _id?: string;
  skillName: string;
  focus: 'Software' | 'Hardware' | 'Data' | 'AI' | 'Web';
  img: string;
  descrip: string;
}

export interface Experience {
  id?: string;
  _id?: string;
  type: 'Education' | 'Work';
  company: string;
  subDescrip: string;
  date: string;
  descrip: string;
}

export interface Project {
  id?: string;
  _id?: string;
  name: string;
  img: string;
  role: string;
  date: string;
  techStack: string;
  description: string;
}

export interface PortfolioData {
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
}
