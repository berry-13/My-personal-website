export interface Repository {
    name: string;
    stargazers_count: number;
    description: string;
    language: string;
    forks_count: number;
}

export interface SectionProps {
    title: string;
    children: React.ReactNode;
    emoji?: string;
}

export interface ExternalLinkProps {
    href: string;
    children: React.ReactNode;
}

export interface RepoGridProps {
    libreRepo: any[];
    topRepos: any[];
    isLoading?: boolean;
    isError?: boolean;
}

export interface IndexProps {
    topRepos: Repository[];
    libreRepo: Repository[];
}
