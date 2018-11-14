import * as signalR from '@aspnet/signalr';

export async function queryString(url: string) {
    const response = await fetch(url, { credentials: 'same-origin' });
    return await response.text();
}

export async function queryJson<TResponse>(url: string) {
    const response = await fetch(url, { credentials: 'same-origin' });
    const json = await response.json();
    return json as TResponse;
}

export function connectSignalR(url: string) {
    const transportType = inCompatibilityMode()
        ? signalR.HttpTransportType.LongPolling
        : signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling

    return new signalR.HubConnectionBuilder()
        .withUrl(url, transportType)
        .build();
}

export function setCompatibilityMode(enabled: boolean) {
    localStorage.setItem('compatiblity', enabled ? '1' : '0');
}

export function inCompatibilityMode() {
    return localStorage.getItem('compatiblity') === '1';
}