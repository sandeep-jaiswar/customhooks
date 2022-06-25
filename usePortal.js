export default function usePortal(id) {
    const root = document.getElementById(id);
    const portal = document.createElement('div');
    if (!root) {
        throw new Error(`No element found with id "${id}"`);
    }

    return {
        mount: (element) => {
            portal.appendChild(element);
            root.appendChild(portal);
        },
        unmount: () => {
            root.removeChild(portal);
        },
    };
}