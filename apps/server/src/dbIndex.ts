import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
    user.firstName = "jhon"
    user.lastName = "doe"
    user.age = 25
    user.isAdmin = false
    user.isAuthor = true
    await AppDataSource.manager.save(user)
    
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)


}).catch(error => console.log(error))
