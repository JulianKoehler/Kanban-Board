export class ContextException extends Error {
    constructor(context: string = 'Context', provider: string = 'Provider') {
        super(`${context} should be used within the scope of the ${provider} component`);
        this.name = 'ContextException';
    }
}

export class ActionTypeException<T> extends Error {
    constructor(actionTypes: T[] = []) {
        super(`The action type you submitted is not correct. Choose from one of the following action types:
            ${actionTypes.map(type => type)}`);
        this.name = 'ActionTypeException';
    }
}
