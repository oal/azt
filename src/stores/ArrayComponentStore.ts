import {Component, ComponentClass, ComponentStore} from "../typedefs";

export default class ArrayComponentStore implements ComponentStore {
    private components: Map<ComponentClass, Component[]> = new Map();

    private register(type: ComponentClass) {
        let array = new Array(1024);
        this.components.set(type, array);
        return array;
    }

    has(entity: number, type: typeof Component): boolean {
        return !!this.get(entity, type);
    }

    get(entity: number, type: typeof Component): Component {
        let entities = this.components.get(type);
        if (entities === null) return null;
        return entities[entity];
    }

    set(entity: number, component: Component): boolean {
        let type = component.constructor as ComponentClass;

        let array = this.components.get(type) || this.register(type);

        let newComponentWasAdded = !array[entity];

        array[entity]  = component;
        return newComponentWasAdded;
    }

    delete(entity: number, type: typeof Component): boolean {
        let array = this.components.get(type);
        if (!array) return;

        if (array[entity]) {
            array[entity] = null;
            return true;
        }
        return false;
    }

    getEntities(type: typeof Component): IterableIterator<number> {
        return entityGenerator(this.components.get(type));
    }

    getRegistered(): IterableIterator<typeof Component> {
        return this.components.keys();
    }
}

function* entityGenerator(array: Component[]) {
    let numEntities = array.length;
    for(let i = 0; i < numEntities; i++) {
        if(array[i]) yield i;
    }
}