export function constructMemory(memoryResource: Record<string, any> | null) {

    let memory = 'User memory not found.';
    if (memoryResource &&
        memoryResource.contents &&
        memoryResource.contents.length > 0) {

        let memoryObject = []
        try {
            memoryObject = JSON.parse(memoryResource?.contents[0]?.text!)
            if (Array.isArray(memoryObject)) {
                memory = memoryObject.map((i: string, key: number) => { return `${key}: ${i}` }).join('\n');
            }
            else if (typeof memoryObject === 'object') {
                memory = Object.entries(memoryObject).map(([key, value]) => `${key}: ${value}`).join('\n');
            }
            return memory;
        } catch (error) {
            console.error("Failed to parse memory resource contents: " + (error as Error).message);
            return memory;
        }

    }
}