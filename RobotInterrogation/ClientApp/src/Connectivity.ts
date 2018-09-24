import * as signalR from '@aspnet/signalr';

export async function query<TResponse>(url: string) {
    const response = await fetch(url, { credentials: 'same-origin' });
    const json = await response.json();
    return json as TResponse;
}

export function connectSignalR(url: string) {
    return new signalR.HubConnectionBuilder()
        .withUrl(url)
        .build();
}