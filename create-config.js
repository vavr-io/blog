const fs = require('fs');
const config_file = 'config.production.json';
const config_content = `{
    "url": "http://${process.env["DNS_ALIAS"]}",
    "server": {
        "host": "0.0.0.0",
        "port": "${process.env["PORT"]}"
    },
    "mail": {
        "transport": "${process.env["MAIL_TRANSPORT"]}",
        "options": {
            "auth": {
                "user": "${process.env["MAIL_USER"]}",
                "pass": "${process.env["MAIL_PASS"]}"
            }
        }
    },
    "database": {
        "client": "mysql",
        "connection": {
            "host": "${process.env["MYSQL_ADDON_HOST"]}",
            "port": "${process.env["MYSQL_ADDON_PORT"]}",
            "user": "${process.env["MYSQL_ADDON_USER"]}",
            "password": "${process.env["MYSQL_ADDON_PASSWORD"]}",
            "database": "${process.env["MYSQL_ADDON_DB"]}"
        }
    }
}`;

fs.writeFile(config_file, config_content, function(err) {
    if (err) {
        return console.error(err);
    }
    console.info(`Sucessfully created ${config_file}`);
});
