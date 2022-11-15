const { dataProcess, generateCode, formatDate, formatMoney } = require("../config/helper")
const { getNetworkProvider, createBill, getPhoneCardListByUser, getNetworkFeeByCode } = require("../models/phone_card.model")
const { getUserDetailByUserName, updateTotalValue } = require("../models/user.model")

const getPhoneCard = async (req, res) => {
    const networkProvider = dataProcess(await getNetworkProvider())
    res.render('exchange/phone_card', { title: "Phone Card", networkProvider })
}

const handleBuyPhoneCard = async (req, res) => {
    const username = req.userClaims.username
    let { name, type, amount, fee } = req.body
    console.log(name, type, amount, fee)
    const phoneCardType = [10000, 20000, 50000, 100000]
    const networkProvider = await dataProcess(await getNetworkProvider())
    const userData = await getUserDetailByUserName(username)
    const nameIndex = networkProvider.findIndex(e => e.provider_number == name)
    if (name === undefined || name === '') {
        return res.json({
            code: 1,
            message: "Please select your network provider",
        })
    } else if (nameIndex < 0) {
        return res.json({
            code: 1,
            message: "Network provider is not valid"
        })
    } else if (type === undefined || type === '') {
        return res.json({
            code: 1,
            message: "Please choose our price type",
        })
    } else if (!phoneCardType.includes(+type)) {
        return res.json({
            code: 1,
            message: "Phone card is not available",
        })
    } else if (amount === undefined || amount === '') {
        return res.json({
            code: 1,
            message: "Please select amount",
        })
    } else if (amount > 5 || amount < 1) {
        return res.json({
            code: 1,
            message: "Amount is not valid",
        })
    }
    const numAmount = +amount
    const typeNum = +type
    console.log(numAmount * typeNum)

    // Create new bill
    const tmp = []
    for (let i = 0; i < numAmount; i++) {
        tmp.push(generateCode(name))
    }
    const codeList = tmp.join(",")
    let totalBill = userData.total_value - numAmount * typeNum
    if (totalBill < 0) {
        return res.json({
            code: 1,
            message: "Your balance is not enough",
        })
    } else {
        try {
            if (await createBill(username, name, codeList, type, amount)) {
                fee = +fee
                const valueAfterFee = totalBill + totalBill * fee / 100
                await updateTotalValue(valueAfterFee, username)
                return res.json({
                    code: 0,
                    message: "Get request successful!",
                    data: codeList
                })
            }
        } catch (error) {
            res.json({
                code: 1,
                message: error.message,
            })
        }
    }
}

const getPhonecardByUser = async (req, res) => {
    const myUsername = req.query["username"]
    let username
    if (myUsername !== undefined) {
        username = myUsername
    } else {
        const userData = req.userClaims
        username = userData.username;
    }
    let data
    try {
        const providerList = await getNetworkProvider();
        const rawData = await getPhoneCardListByUser(username)
        data = rawData.map(e => ({
            id: e.id,
            provider_number: providerList.find(a => a.provider_number == e.provider_number).name,
            code: e.code,
            status: e.status,
            price: formatMoney(e.price),
            quantity: e.quantity,
            date: formatDate(e.date),
        }))

        return res.json({
            code: 0,
            message: "Get phonecard data successful",
            data
        })
    } catch (error) {
        return res.json({
            code: 1,
            message: error.message,
        })
    }
}

const getNetworkProviderFee = async (req, res) => {
    const code = req.query['code']
    const data = await getNetworkFeeByCode(code)
    console.log(data)
    res.json({
        code: 0,
        message: "Get successful",
        data
    })
}
module.exports = {
    getPhoneCard,
    handleBuyPhoneCard,
    getPhonecardByUser,
    getNetworkProviderFee
}