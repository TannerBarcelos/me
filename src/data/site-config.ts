export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
    newTab?: boolean;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    title: 'Tanner Barcelos',
    description: 'My personal website and blog',
    image: {
        src: '/dante-preview.jpg',
        alt: 'Dante - Astro.js and Tailwind CSS theme'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'About Me',
            href: '/about'
        },
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
    ],
    socialLinks: [
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/in/tanner-barcelos-695619a1/'
        },
        {
            text: 'GitHub',
            href: 'https://www.github.com/tannerbarcelos'
        }
    ],
    hero: {
        text: "**Greetings!** I'm Tanner Barcelos. I am a Senior Full-Stack Engineer in Silicon Valley currently working at [Visa](https://usa.visa.com/) as a Senior Full Stack ML Engineer on the Hyperscale AI Platform team. <br /> I am passionate about building scalable, performant, and user-friendly web applications. I have experience working with a variety of technologies including React, Node.js, TypeScript, GraphQL, and AWS. I am always looking for new opportunities to learn and grow as an engineer. I am also a huge fan of the outdoors and enjoy hiking, camping, and backpacking in my free time. <br /> I am always looking for new opportunities to learn and grow as an engineer.",
        image: {
            src: '/hero.jpeg',
            alt: 'A person sitting at a desk in front of a computer'
        },
        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            },
            {
                text: 'Read my Blog',
                href: 'https://blog.tannerbarcelos.com',
                newTab: true
            }
        ]
    },
    projectsPerPage: 8
};

export default siteConfig;
