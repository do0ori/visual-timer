type ServiceWorkerMessage = Record<string, unknown>;

export const postServiceWorkerMessage = async (
    message: ServiceWorkerMessage,
    serviceWorker: Pick<ServiceWorkerContainer, 'controller' | 'ready'> = navigator.serviceWorker
) => {
    if (serviceWorker.controller) {
        serviceWorker.controller.postMessage(message);
        return true;
    }

    const registration = await serviceWorker.ready;
    if (!registration.active) return false;

    registration.active.postMessage(message);
    return true;
};
