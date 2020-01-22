export default class Environment {
    static get secretJwt() {
        return process.env.SECRET
    }
    static get tokenExpiresIn() {
        return process.env.TOKEN_EXPIRES_IN
    }
    static get httpPort() {
        return process.env.HTTP_PORT
    }
    static get mongoUrl(){
        return process.env.MONGO_URL
    }


}