
export interface BookProps {
    _id?: string;
    title: string;
    genre: string;
    startedReading: Date;
    finishedReading: boolean;
    numberOfPages: number;
    latitude?: number;
    longitude?: number;
    webViewPath: string;
}