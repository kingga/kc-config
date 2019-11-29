import IContainer from '@kingga/kc-container/src/contracts/IContainer';
export default class ServiceProvider {
    protected container: IContainer;
    constructor(container: IContainer);
    register(): void;
}
