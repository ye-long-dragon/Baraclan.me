//temporary
import type { Skill, Experience, Project } from '../../../dataTypes/dataTypesPortfolio';

export const skills: Skill[] = [
    { skillName: 'React', focus: 'Web', img: '', descrip: 'Building component-based interfaces.' },
    { skillName: 'TypeScript', focus: 'Software', img: '', descrip: 'Typed JavaScript for safer code.' },
    { skillName: 'Embedded C++', focus: 'Hardware', img: '', descrip: 'Firmware for microcontrollers.' },
    { skillName: 'KiCad', focus: 'Hardware', img: '', descrip: 'Schematic capture and PCB layout.' },
    { skillName: 'Python', focus: 'Data', img: '', descrip: 'Scripting and data analysis.' },
    { skillName: 'TinyML', focus: 'AI', img: '', descrip: 'Running small ML models on devices.' },
];

export const experiences: Experience[] = [
    {
        type: 'Education',
        company: 'Your University',
        subDescrip: 'BS Computer Engineering',
        date: '2023 – Present',
        descrip: 'Coursework in embedded systems, electronics, and networking.',
    },
    {
        type: 'Work',
        company: 'Sample Company',
        subDescrip: 'Intern, Software',
        date: 'Summer 2026',
        descrip: 'Short description of what you worked on.',
    },
];

export const projects: Project[] = [
    {
        name: 'Sample Project One',
        img: '',
        role: 'Hardware design',
        date: '2026',
        techStack: 'ESP32, C++, KiCad',
        description: 'A short description of what it does and what you built.',
    },
    {
        name: 'Sample Project Two',
        img: '',
        role: 'Full-stack developer',
        date: '2026',
        techStack: 'React, TypeScript, Node',
        description: 'Another short description.',
    },
    {
        name: 'Sample Project Three',
        img: '',
        role: 'Firmware developer',
        date: '2025',
        techStack: 'Arduino, C++, OLED',
        description: 'A third example to see the grid fill out.',
    },
];