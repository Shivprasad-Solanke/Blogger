pipeline {
    agent any

    environment {
        IMAGE_NAME = "blogger_app"
        CONTAINER_NAME = "blogger_container"
        MONGO_DATA = "/data/mongo"
        GIT_REPO = "https://github.com/Shivprasad-Solanke/Blogger.git"
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning the repository..."
                git branch: 'prod', url: "${GIT_REPO}"
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t ${IMAGE_NAME} .'
            }
        }

        stage('Stop Existing Container') {
            steps {
                echo "Stopping and removing existing container if it exists..."
                sh '''
                docker stop ${CONTAINER_NAME} || true
                docker rm ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "Running the Docker container..."
                sh '''
                docker run -d \
                --name ${CONTAINER_NAME} \
                -p 80:80 \
                -v ${MONGO_DATA}:/data/db \
                ${IMAGE_NAME}
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed. Check the logs."
        }
    }
}
