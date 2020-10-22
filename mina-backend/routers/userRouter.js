import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import User from '../models/user.js';
//we have to import bcryptjs so the authentication process works
import bcrypt from 'bcryptjs';
import {
    generateToken
} from '../utils.js';


//we use express.router() to make our code modular instead of creating all the routes inside the server.js
const userRouter = express.Router();

//now we have to define a get method for our seeding API. We wrap the whole sync callback function inside an expressAsyncHandler fumction that comes from an npm pacage with the same name that needs to be installed and imported. We use this packeage to show potential errors for our routers to the users by adding code in our server.js file.
userRouter.get(
    '/seed',
    expressAsyncHandler(async (req, res) => {
        //this ensures all the users will be removed before seeding the database with new users
        // await User.remove({});
        //after creating sample users we can now retrive them using this get method and isnert all of them in our data or seeder file into the users collection in MongoDB at the same time
        const createdUsers = await User.insertMany(data.users);
        //after adding the users we send back the newly created users
        res.send({
            createdUsers
        });
    })
);

//creating a signin router. Since we need to create a token when we send back sign in data to autenticate user we use the post method for this route. You cannot type this route in your browser and access it since it's a post route so we will need to use services like Postman to test it out. 
userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    //sending an ajax request to check the user's email in the database. req.body.email is used to get the email inside the body of this ajax request and compare it with the emails in the database.
    const user = await User.findOne({
        email: req.body.email
    });
    if (user) {
        //if we already have a user with this email check to see whether the password typed is correct or not. To do this we use a bcrypt package method called compareSync. req.body.password signifies the user's entered password. user.password refers to the hashed password in the databse used to compare with the entered password.
        if (bcrypt.compareSync(req.body.password, user.password)) {
            //sending back some user data 
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                //we also send back a token that will be used to autenticate the user. This token will be generated by json web token. 
                token: generateToken(user)
            });
            return;
        } 
    } 
    res.status(401).send({
        message: 'Invalid email address or password'
    });
    
}));

//and export user router
export default userRouter;