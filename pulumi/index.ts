// Copyright 2016-2020, Pulumi Corporation.  All rights reserved.

import * as docker from "@pulumi/docker";
import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

// Location to deploy Cloud Run services
const location = gcp.config.region || "us-central1";

// Enable Cloud Run service for the current project
// Commented out not to disable the service at every destroy
// const enableCloudRun = new gcp.projects.Service("EnableCloudRun", {
//    service: "run.googleapis.com",
// });

// ----------------------------------------------- //
// Deploy a pre-existing Hello Cloud Run container //
// ----------------------------------------------- //
/*
const helloService = new gcp.cloudrun.Service("hello", {
    location,
    template: {
        spec: {
            containers: [
                { image: "gcr.io/cloudrun/hello" },
            ],
        },
    },
});

// Open the service to public unrestricted access
const iamHello = new gcp.cloudrun.IamMember("hello-everyone", {
    service: helloService.name,
    location,
    role: "roles/run.invoker",
    member: "allUsers",
});

// Export the URL
export const helloUrl = helloService.statuses[0].url;
*/

// -------------------------------------- //
// Deploy a custom container to Cloud Run //
// -------------------------------------- //

// Build a Docker image from our sample Ruby app and put it to Google Container Registry.
// Note: Run `gcloud auth configure-docker` in your command line to configure auth to GCR.

const imageName = "tutorial";

const cred = {
    "type": "service_account",
    "project_id": "udemyiactraining-429511",
    "private_key_id": "0473be7e0d99e0ee4caf0686e444aabf21fee1d4",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDlt8m156PlvEeo\nVbkizZGe8ky7/hC5B1m2l3O2SN/GnNs6/XcDdEFTUAuQTuGGY04hIkJwNnUY2dIq\nPyHYxYgf4078CGz0pK1vNaFNpqNz3nEW1KEUGZv3KluRriIjhmgx9yTXFxkmMJ//\nQKApJ6D2wCPPg9C7B7ksTP0q85fX32mHSselna6uClXcHFpE5JJ1sXtD80MRIdUE\nsMOhPZr2B81mfPiKEWPy7AiA6vCkpgj4mrnIDZbtrczSWMmBBTMNfhjCXze6D3xq\n44QuoVoQ92vVif8UsdkgBsFYmQs6p5SQCdE69yiKu0GqQYba6BBVso6LsX5jk9BG\n9VNoHlpXAgMBAAECggEAEF9kCgoDfXlI5i+N7XQXX+vHGlMGYBmtBD2RKrnQ8Tf2\nzCKKm/1qNoTq/hMRMeHcDLKDZ7oJ6IaF2yr6v5d8l0E9POtg0KL4FYgOAhnRZo3B\nI65t+J/GpPwo4J43oq6OuJjz0Dy+NyGaFbhGcgh4CX4yTzUG6H2pbgXiuW/5L5KD\nOjDal/V5bs26v8DEVSN0gH8obbMmVMzAoS8MuLxnUjs3REDJqKdmE1ToTVF/489I\nWxfCiqT7mqgD+YfUBjPcqiBhZSm1DJNUvvboYpDO4u1/z3sAmGYUhKlbR235igZi\nGMbokQnJFcda0bFVJcR92WzW1m5czAUIN9/SSAAFiQKBgQD9PckQ7Pix0PTlxEZZ\ngcNJUIw10QJjO7y6I2eZRYyLCSpcbnLfX+l5KuWb/xCpK3F8GeGOujubBdawMF3h\nrtjoxMBfidO3KrWtDFY2ZPYGL1E7qtXcQNcXaYSXsJeYtUKaL+IFTmwT6AqNVCG0\n0O6GHAK962Lh56zZhZtIcw7Z4wKBgQDoOGcW+KeKy+ulLIZBVETD2+Nl9Pbmve7r\nT8rzrFwN+OSX9xrRrFFPh675ILEpwGOeqVXvIOs8bq87rY4VsS+V+OLMe59Gjzhq\nWGC6KyizGCkGZ9Kosn7L3cGvuV2GCDiiEu7jjGTRr6e8/kL1xGP+o2zTykcXHpOX\nLaWOqp33/QKBgEAxulddCsngg0P/Vin4V+2sym4V9nn7OaMhuHBFDhRslV1q7hmr\nsX5ynlPF+442ogTodqH8mYF5oGt3R0UfUoLm5TESuiVzYSxltTECtM7qjbgHXUEA\n+sVHjUH6lOM0B5cYTj40G/eL2ajry8OPNveuAA/urFlBpjJZyPw7lmcrAoGAUur4\n3HnzERtZTARG+ALH/wt/+gLrOl7tdbZrKHEN+as6rIx+VgnqirRPJQOoXtkkeR3L\n4nPlqxF2np+NEW/QJwPUr+EgcUhog4iFGVSZ1sE0vOXLkZMStWa8ZyuQGnDLEAwk\normZskm/YjuD20/ByMW/8SvUEIxJdPzGldeUSl0CgYEA9ZlkoHyyMvN4J8LSfElV\ncAZzAqtw7mpM0LooV5GyKNWFEjacgaPK0a9Pv6dVLTz18/4q6rN1/V504GxA/cc9\nRUQiKi6+5lcwxQ3sD+CvhFwvoHSvxmB8NB8ReKLoywesoNqCQ6qm23Y5lxAZHSSc\n0qKSum+iBzqODlxO6IVezIg=\n-----END PRIVATE KEY-----\n",
    "client_email": "cloudrun-deployer@udemyiactraining-429511.iam.gserviceaccount.com",
    "client_id": "102610391162273980702",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/cloudrun-deployer%40udemyiactraining-429511.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }

const provider = new gcp.Provider("GCP", {
    credentials: JSON.stringify(cred)
})

const myImage = new docker.Image(imageName, {
    imageName: pulumi.interpolate`gcr.io/${gcp.config.project}/${imageName}:latest`,
    build: {
        context: "../",
        platform: "linux/amd64",

    },
},{
    provider: provider
});

// Deploy to Cloud Run. Some extra parameters like concurrency and memory are set for illustration purpose.
const angularService = new gcp.cloudrun.Service("angular", {
    location,
    template: {
        spec: {
            containers: [{
                image: myImage.imageName,
                resources: {
                    limits: {
                        memory: "1Gi",
                    },
                },
            }],
            containerConcurrency: 50,
        },
    },
},{
    provider: provider
});


// Open the service to public unrestricted access
const iamAgular = new gcp.cloudrun.IamMember("angular", {
    service: angularService.name,
    location,
    role: "roles/run.invoker",
    member: "allUsers",
},{
    provider: provider
});

// Export the URL
export const angularUrl = angularService.statuses[0].url;
