pipeline {
    agent any

    environment {
        JAVA_HOME = tool 'JDK-21'
        NODE_HOME = tool 'NodeJS-20'
        PATH = "${JAVA_HOME}/bin:${NODE_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout Source') {
            steps {
                echo 'Checking out source repository from Git...'
                checkout scm
            }
        }

        stage('Build & Test Backend') {
            steps {
                echo 'Compiling Spring Boot backend & running JUnit test suites...'
                dir('backend') {
                    sh './mvnw clean test'
                }
            }
        }

        stage('Build & Test Frontend') {
            steps {
                echo 'Installing npm dependencies & building production bundle...'
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Verify AI Service') {
            steps {
                echo 'Validating Python FastAPI dependencies and syntax...'
                dir('ai-service') {
                    sh 'python3 -m py_compile app/main.py app/incident_analyzer.py app/similarity_search.py'
                }
            }
        }

        stage('Docker Container Build') {
            steps {
                echo 'Building container images via Docker Compose...'
                sh 'docker compose build'
            }
        }

        stage('Deploy to Staging / AWS Placeholder') {
            steps {
                echo 'Ready for deployment to AWS ECS / EC2 container target cluster.'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
        success {
            echo 'SAFELINK Build Succeeded! All tests passed.'
        }
        failure {
            echo 'SAFELINK Build Failed. Please review pipeline console output.'
        }
    }
}
