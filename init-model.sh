while getopts 'lhafkd' OPTION; do
  case "$OPTION" in
    l)
      echo "initalize the all aplication"
      pm2 start ecosystem.config.js
    ;;
    h)
      echo "migration"
      psql -U doubletelegram -d doubletelegram -h localhost -p 5932 -W -f ./inital.sql
      psql -U doubletelegram -d doubletelegram -h localhost -p 5932 -W -f ./initalChannelConfig.sql
    ;;
    a)
      echo "Hated"
      psql -U doubletelegram -d doubletelegram -h localhost -p 5932 -W
    ;;
    f)
    
    ;;
  esac
done
shift "$((OPTIND -1))"

