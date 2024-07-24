const prisma = require('./controller/prismaClient');
const bcrypt = require("bcryptjs");
require('dotenv').config();

// const prisma = new PrismaClient();

// prisma.user.create({
//     data:{
//         email: 'test@gmail.com',
//         name: 'tester',
//         passwordHash: '1234'
//     }
// })

bcrypt.hash('1234', process.env.SALT, async (err, hash) => {
    const userObj = {
      email: 'test@gmail.com',
      name: 'tester',
      passwordHash: hash,
    };
    prisma.user.create({
        data: userObj
    })

})