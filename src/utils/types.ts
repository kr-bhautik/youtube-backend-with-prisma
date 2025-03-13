export interface loginBodyInterface{
    email:string,
    password:string
}

export interface registerBodyInterface {
    name: string,
    email: string,
    password: string,
    age: number
}

export interface userInteface extends Document{

    userId: number,
    name: string,
    email: string,
    password: string,
    age: string,
    createdAt: string
}