export const isDnDsSupported = () => {
    return 'ondrag' in document.createElement('a');
};
