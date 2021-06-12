
export interface ModelLog {
    user: string;
    action: number;
    action_verbose: string;
    content:  Record<string, unknown> | string | [];
    time_added: string;
    address?: string | null;
}