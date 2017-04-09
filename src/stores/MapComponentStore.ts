import {Component, ComponentClass, ComponentStore, Entity} from "../typedefs";

export default class MapComponentStore implements ComponentStore {
    private components: Map<ComponentClass, Map<Entity, Component>> = new Map();

    private register(type: ComponentClass) {
        let map = new Map();
        this.components.set(type, map);
        return map;
    }

    has(entity: Entity, type: ComponentClass): boolean {
        return !!this.get(entity, type);
    }

    get(entity: Entity, type: ComponentClass): Component|null {
        let entities = this.components.get(type);
        if (entities === undefined) return null;
        return entities.get(entity);
    }

    set(entity: Entity, component: Component): boolean {
        let type = component.constructor as ComponentClass;

        let map = this.components.get(type) || this.register(type);

        let newComponentWasAdded = !map.has(entity);

        map.set(entity, component);
        return newComponentWasAdded;
    }

    delete(entity: Entity, type: ComponentClass): boolean {
        let map = this.components.get(type);
        if (!map) return;

        if (map.has(entity)) {
            map.delete(entity);
            return true;
        }
        return false;
    }

    getEntities(type: ComponentClass): IterableIterator<Entity> {
        let map = this.components.get(type);
        if(map === undefined) map = new Map();
        return map.keys();
    }

    getRegistered(): IterableIterator<ComponentClass> {
        return this.components.keys();
    }
}
