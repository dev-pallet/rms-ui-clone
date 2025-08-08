ENV="$1"
TAG_NAME="warehouseui"
APP_NAME=""


helpFunction()
{
   echo $ENV
   echo ""
   echo "Usage: $0 -e envrionment"
   echo -e "\t-e envrionment is either staging or production"
   exit 1 # Exit script after printing help
}

echo $ENV

while getopts "e:" opt
do
   case "$opt" in
      e ) ENV="$OPTARG" ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

Print helpFunction in case parameters are empty
if [ -z "$ENV" ]
then
   echo "Some or all of the parameters are empty";
   helpFunction
fi

echo "Building image for  $ENV .... \n"

if [ $ENV == "production" ]
then
  TAG_NAME+="_production"
  APP_NAME="twinleaves-prod"
else
 TAG_NAME+="_staging"
 APP_NAME="twinleaves"
fi

echo "TAG NAME: $TAG_NAME \n"

# Begin script in case all parameters are correct
echo "Building Docker Image.... \n"

docker build --build-arg DOCKER_ENV=production -t $TAG_NAME .

docker tag $TAG_NAME gcr.io/$APP_NAME/$TAG_NAME
echo $APP_NAME
docker push gcr.io/$APP_NAME/$TAG_NAME