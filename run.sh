docker run --net lnr-network -it -d --restart=always --name lnr-client -h lnr-client -p 8080:8080 -e HOST_NAME="prod" lnr-client:0.0.0
