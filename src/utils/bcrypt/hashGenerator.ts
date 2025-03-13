import bcrypt from 'bcrypt';

export const hashGenerator = async(pass:string) => {

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);
    
        return hash;
    } catch (error) {
        console.log(`Some Error Occured. : \n`, error)
    }
}