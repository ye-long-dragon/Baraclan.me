export interface Skill {
    skillName: string;
    img: string;
    descrip: string;
}

export interface Experience {
    type: 'Education' | 'Work';
    company: string;
    subDescrip: string;
    date: string;
    descrip: string;
}

export interface Project {
    name: string;
    img: string;
    role: string;
    date: string;
    techStack: string;
    description: string;
}