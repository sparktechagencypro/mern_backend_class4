import  bcrypt  from 'bcrypt';


export const isPasswordValid = (password: string, hashedPassword: string): boolean => {

 return bcrypt.compareSync(password, hashedPassword);

}