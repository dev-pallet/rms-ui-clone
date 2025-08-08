# Deployment

To deploy to cloud run

```bash
docker build --build-arg DOCKER_ENV=production -t <TAG NAME> .
docker tag <TAG NAME> gcr.io/<PROJECT NAME>/<TAG NAME>
docker push gcr.io/<PROJECT NAME>/<TAG NAME>


```

### Troubleshooting

if the push errors try the below command

```bash
gcloud auth configure-docker

```
