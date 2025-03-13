import bcrypt from 'bcrypt'
export const checkPass = async(plainPass:string, hashPass:string) => { 

    try {
        const result = await bcrypt.compare(plainPass, hashPass);
        return result;
    } catch (error) {
        console.log(`Some error Occured. :`, error);
    }
}