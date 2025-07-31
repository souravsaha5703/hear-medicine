export interface Error {
    title: string;
    description: string;
}

export interface ErrorDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    error: Error | null;
}