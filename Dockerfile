FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY target/demo-0.0.1-SNAPSHOT.jar app.jar

COPY uploads /app/uploads

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]