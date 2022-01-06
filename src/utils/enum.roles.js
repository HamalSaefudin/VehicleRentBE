const ROLE = {
    ADMIN:{
        name:'Admin',
        permission:['User.createUser','User.editUser']
    },
    BASIC:{
        name:'Basic',
        permission:['User.viewUser']
    },
}

module.exports = {
    ROLE:ROLE
}