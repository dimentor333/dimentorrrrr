const { PrismaClient } = require('@prisma/client')

const prisma_client = new PrismaClient()

class UserService {
    
    async GetAllUsers() {
        return prisma_client.user.findMany({});
    }

    async AddUser(req) {
        const { firstName, lastName, email, numberPhone, position, jobPlace } = req.body

        try {
            var bHasEmail = await prisma_client.user.count(
                { "where": { "email": email } },
                
            ) > 0 ? true : false
            
            var bHasPhone= await prisma_client.user.count(
                { "where": { "numberPhone": numberPhone } },
                
            ) > 0 ? true : false
            if (bHasPhone) return { "ERROR" : "PHONE EXISTS" }
            if (bHasEmail) return { "ERROR" : "EMAIL EXISTS" }

            const user = await prisma_client.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    numberPhone,
                    position,
                    jobPlace,
                    aboutPC: {}
                }
            })
            console.log("user" + user)
            return user
        } catch (e) {
            console.log("e "+e)
            return e
        }

    }

    async DeleteUser(req) 
    {
        try {
            const {id} = req.body
            const user = await prisma_client.user.findFirst(
                {
                    "where": {
                        "id": id
                    }
                }
            )

            if (!user) {
                return { "ERROR": "user not found" }
            }

            const result = await prisma_client.user.delete(
                {
                    "where": {
                        "id": id
                    }
                }
            )

            return result

        } catch (e) {
            console.log(e)
        }
    }
 //   async DeleteUser(req) {
 //       {
 //           const { id } = req.body;
 //           
 //           await prisma_client.user.deleteMany({"where" : { "id": id}})
 //           return { "error" : "SUCCESS" }
 //       }
 //   }
    async UpdateUser(req)
        {
            const { id, key, val } = req.body;
            if (!key)
                return { "error": "KEY NOT PRESENT" }
    
            if (key == "id")
                return { "error": "You cannot change id" }
    
            if (key == "email" || key == "numberPhone")
            {
                var bHas = await prisma_client.user.count({"where": {"id": id}, "data": {[key]: val}}) 
                    > 0 ? true : false
                if (bHas)
                {
                    return {"error" : "ERROR - DUPLICATE"}
                }
            }
    
            var usr = await prisma_client.user.update({"where": {"id": id}, "data": {[key]: val}})
            return usr
        }
    }
module.exports = new UserService;