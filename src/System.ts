import {Component, ComponentClass, Entity, EntityTuple} from "./typedefs";
import EntityManager from "./EntityManager";

export default class System {
    manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    get entities(): IterableIterator<EntityTuple> {
        return null; // Return all by default.
    }

    run(dt: number) {
        for (let [entity, components] of this.entities) {
            this.update(dt, entity, components);
        }
    }

    update(dt: number, entity: Entity, components: Component[]) {
    }

    static requires(...componentTypes: ComponentClass[]): typeof System {
        return class CustomSystem extends System {
            get entities() {
                return entityGenerator(this.manager, componentTypes);
            }
        };
    }
}

function* entityGenerator(manager: EntityManager, componentTypes: ComponentClass[]) {
    let numComponents = componentTypes.length;
    let entities = manager.getEntities(componentTypes[numComponents-1]);
    for (let entity of entities) {
        let components: Component[] = [];
        let hasFailed = false;
        for (let i = 0; i < numComponents; i++) {
            let type = componentTypes[i];
            let component = manager.getComponent(entity, type);
            if (component === null) {
                hasFailed = true;
                break;
            }
            components.push(component);
        }
        if (hasFailed) continue;
        yield [entity, components] as EntityTuple;
    }
}
