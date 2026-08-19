import { editorDialContainerClassName } from './editorDialStyles';

describe('editor dial surface', () => {
    test('uses the shared translucent surface used by timer editors', () => {
        expect(editorDialContainerClassName).toContain('rounded-3xl');
        expect(editorDialContainerClassName).toContain('bg-white/40');
        expect(editorDialContainerClassName).toContain('dark:bg-black/20');
        expect(editorDialContainerClassName).toContain('backdrop-blur-md');
    });
});
