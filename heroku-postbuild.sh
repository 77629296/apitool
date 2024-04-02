#!/bin/sh

if [ $HEROKU_APP_NAME ]
then
    APITOOL_HOST="https://${HEROKU_APP_NAME}.herokuapp.com"
    APITOOL_SERVER_URL="https://${HEROKU_APP_NAME}.herokuapp.com"
fi

npm run build && npm run deploy
