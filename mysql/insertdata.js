const pool = require("./config");

async function saveData(data) {
    console.log(data);
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO \`user\` (\`nombre\`, \`edad\`, \`gustos\`) VALUES (?, ?, ?)`;

        const [result, fields] = await connection.query(sql, [data.name, data.age, data.gustos]);
        console.log(result);
        console.log(fields);
    } catch (err) {
        console.log(err);
    } finally {
        connection.release();
    }
}

module.exports = saveData