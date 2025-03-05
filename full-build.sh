docker rm -f -v lnr-client
docker rmi $(docker images |grep lnr-client:0.0.0 )
sh build.sh
sh run.sh