while getopts 'lha:' OPTION; do
  case "$OPTION" in
    l)
      echo "LinuxConfig"
    ;;
    h)
      echo "Her"
    ;;
    a)
      echo "Hated"
    ;;
  esac
done
shift "$((OPTIND -1))"
