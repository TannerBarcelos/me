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
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    projectsPerPage?: number;
    readsPerPage?: number;
};

const siteConfig: SiteConfig = {
    title: 'Tanner Barcelos',
    description: 'My personal website and blog',
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Projects',
            href: '/projects/'
        },
        {
            text: 'Stack',
            href: '/stack'
        },
        {
            text: 'Bookshelf',
            href: '/reads/shelf/technical/'
        },
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Blog',
            href: 'https://blog.tannerbarcelos.com',
            newTab: true
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Stack',
            href: '/stack'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Resume',
            href: 'https://drive.google.com/file/d/1_boaCqTE2CgyBFrr7qtSEl6dvAHLKtaO/view?usp=sharing',
            newTab: true
        }
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
        text: "I&apos;m a Senior Full Stack Engineer on the AI Studio team at [Visa](https://usa.visa.com/), building AI-powered products, multi-agent systems, and the ML platforms behind them.",
        actions: [
            {
                text: 'Reach Out',
                href: '/contact'
            },
            {
                text: 'Blog',
                href: 'https://blog.tannerbarcelos.com',
                newTab: true
            }
        ]
    },
    projectsPerPage: 8,
    readsPerPage: 20
};

export default siteConfig;
