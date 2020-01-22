import bcrypt from 'bcryptjs'

export const getHash = async (input: string) => {
    const hash = bcrypt.hash(input, 12)
    return hash;
};


export const comparePasswords = async (password: string, userPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, userPassword)
}

