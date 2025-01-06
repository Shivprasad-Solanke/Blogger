pipeline {
    agent any

    environment {
        IMAGE_NAME = "blogger_app"
        CONTAINER_NAME = "blogger_container"
        MONGO_DATA = "/data/mongo"
        GIT_REPO = "https://github.com/Shivprasad-Solanke/Blogger.git"
        DOCKER_COMPOSE = '/usr/bin/docker-compose'  // Path to Docker Compose binary
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning the repository..."
                git branch: 'prod', url: "${GIT_REPO}"
            }
        }

        stage('Build Docker Images with Docker Compose') {
            steps {
                echo "Building Docker images using Docker Compose..."
                sh '''
                ${DOCKER_COMPOSE} -f docker-compose.yml build
                '''
            }
        }

        stage('Stop Existing Containers') {
            steps {
                echo "Stopping and removing existing containers if they exist..."
                sh '''
                ${DOCKER_COMPOSE} down || true
                '''
            }
        }

        stage('Start Services') {
            steps {
                echo "Starting Docker Compose services..."
                sh '''
                ${DOCKER_COMPOSE} up -d
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
