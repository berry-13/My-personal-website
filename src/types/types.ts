import type { ReactNode } from "react";

export interface Repository {
    name: string;
    stargazers_count: number;
    description: string;
    language: string;
    forks_count: number;
    html_url: string;
}

export interface SectionProps {
    title: string;
    children: ReactNode;
    emoji?: string;
}

export interface ExternalLinkProps {
    href: string;
    children: ReactNode;
}

export interface RepoGridProps {
    libreRepo: Repository[];
    topRepos: Repository[];
    isLoading?: boolean;
    isError?: boolean;
}

export interface IndexProps {
    topRepos?: Repository[];
    libreRepo?: Repository[];
}
