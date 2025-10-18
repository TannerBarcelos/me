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
            href: '/projects'
        },
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Blog',
            href: 'https://blog.tannerbarcelos.com',
            newTab: true
        },
        {
            text: 'Resume',
            href: 'https://drive.google.com/file/d/1v1T8hgVPnij6_8762_Vl7HfQB1efQ_7Q/view?usp=drivesdk',
            newTab: true
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
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
        text: "**Greetings!** I&apos;m a Senior Software Engineer in Silicon Valley currently working at [Visa](https://usa.visa.com/) as a Senior ML Engineer on the AI as Services team. <br /><br /> I am passionate about building scalable, performant, and user-friendly web services for AI, Data and Finance. <br /><br /> I have experience working with a variety of technologies including React, Typescript, NodeJS, Fastify, GraphQL, Golang, Postgres, MySQL, Kubernetes and more. <br /><br />I am always looking for new opportunities to learn and grow as an engineer so please feel free to reach out if you would like to connect!",
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
    projectsPerPage: 8
};

export default siteConfig;
