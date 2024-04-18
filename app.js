const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const { EVENTS } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')
const saveData = require("./mysql/insertdata");

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = 'localhost'
const MYSQL_DB_USER = 'root'
const MYSQL_DB_PASSWORD = ''
const MYSQL_DB_NAME = 'users'
const MYSQL_DB_PORT = '3306'

const flowPrincipal = addKeyword(EVENTS.WELCOME).addAnswer('Bienvenido a tu chatbo, para empezar te pedire algunos datos, ¿estas seguro de continuar?\n\n 1️⃣ SI \n 2️⃣ NO',{capture:true},(ctx,{flowDynamic,endFlow,gotoFlow})=>{
    const response = ctx.body

    if(response == "1"){
        return gotoFlow(flowNombre)
    }else{
        return endFlow("Adios, para comenzar de hnuevo escribe cualquier cosa")
    }
})

const flowNombre = addKeyword(EVENTS.ACTION).addAnswer("¿Cual es tu nombre?",{capture:true},async(ctx,{flowDynamic,endFlow,gotoFlow,state})=>{
    await state.update({name:ctx.body})
    return gotoFlow(flowEdad)
})

const flowEdad = addKeyword(EVENTS.ACTION).addAnswer("¿Cual es tu edad?",{capture:true},async(ctx,{flowDynamic,endFlow,gotoFlow,state})=>{
    await state.update({age:ctx.body})
    return gotoFlow(flowgustos)
})


const flowgustos = addKeyword(EVENTS.ACTION).addAnswer("¿Dime que es lo que mas te gusta?",{capture:true},async(ctx,{flowDynamic,endFlow,gotoFlow,state})=>{
    await state.update({gustos:ctx.body})
    return gotoFlow(flowResult)
    
})

const flowResult = addKeyword(EVENTS.ACTION).addAction({capture:false},async(ctx,{flowDynamic,endFlow,gotoFlow,state})=>{
    const data = state.getMyState()
    await saveData(data)
    return await flowDynamic(`Nombre: ${data.name}, Edad: ${data.age}, Tus gustos son: ${data.gustos}`)
})


const main = async () => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT,
    })
    const adapterFlow = createFlow([flowPrincipal,flowNombre,flowEdad,flowgustos,flowResult])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
