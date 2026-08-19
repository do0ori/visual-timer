export const applyColorMode = (compColor: 'white' | 'black') => {
    document.documentElement.classList.toggle('dark', compColor === 'white');
};
