const connect = require('../config/db')

const getUserAccountByStatus = (status) => new Promise((resolve, reject) => {
    connect.query('select * from user where status=? and username!="admin" ORDER BY last_modified desc', [status], (err, result) => {
        if (err) reject(false)
        else {
            resolve(result)
        }
    })
})

const getUserDetailByUsername = (username) => new Promise((resolve, reject) => {
    connect.query('SELECT * FROM user a, user_detail b where a.username=b.username and a.username=?', [username], (err, result) => {
        if (err) reject(false)
        else {
            resolve(result)
        }
    })
})

const updateUserStatus = (username, status, currentDateTime) => new Promise((resolve, reject) => {
    console.log(currentDateTime)
    connect.query('update user set status=?, last_modified=? where username=?', [status, currentDateTime, username], (err, result) => {
        if (err) reject(false)
        else {
            if(result.changedRows!=0){
                console.log(result)
                resolve(true)
            }else{
                reject(false)
            }
        }
    })
})

const handleSelectDepositMore5m = (status) => new Promise((resolve,reject) =>{
    connect.query('select * from deposit where status = ? order by date desc',[status],(err,result)=>{
        if(err) reject(false);
        else{
            resolve(result);
        }
    })
})

const updateStatusToCheck = (status,id) => new Promise((resolve, reject) => {
    // console.log(status,id)
    connect.query('update deposit set status=? where id=?', [status,id], (err, result) => {
        if (err) reject(false)
        else {
            if(result.changedRows!=0){
                // console.log(result)
                resolve(true)
            }else{
                reject(false)
            }
        }
    })
})

const getUserAccountBlock = () => new Promise((resolve,reject)=>{
    connect.query('select * from user where abnormal = 2',(err,result)=>{
        if(err) reject(false);
        else{
            resolve(result);
        }
    })
})


const handleSelectEmailDepositMore5m = (phone_receiver) => new Promise((resolve,reject) =>{
    const sql = "select * from user_detail where phone = ?"
    const values = [phone_receiver];
    connect.query(sql, values, (err,result) => {
        if (err) reject(err)
        else{
            resolve(result[0].email);
        }
    })
})

module.exports = {
    getUserAccountByStatus,
    getUserDetailByUsername,
    updateUserStatus,
    handleSelectDepositMore5m,
    updateStatusToCheck,
    getUserAccountBlock,
    handleSelectEmailDepositMore5m,
}