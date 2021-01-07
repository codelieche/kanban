
export interface ModelLog {
    user: string;
    action: string;
    action_flag: number;
    message: object | string | [];
    time_added: string;
}