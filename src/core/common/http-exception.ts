export class HttpException extends Error {
    status: number = 400;
    messages: string[];

    constructor(messages: string[]){
        super(messages[0]);
        this.messages = messages
    }
}

