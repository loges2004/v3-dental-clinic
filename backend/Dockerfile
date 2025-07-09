    # Use an official OpenJDK runtime as a parent image
    FROM eclipse-temurin:17-jdk

    # Set the working directory
    WORKDIR /app

    # Copy Maven wrapper and pom.xml
    COPY .mvn .mvn
    COPY mvnw pom.xml ./

    # Copy the rest of the source code
    COPY src ./src

    # Build the application
    RUN ./mvnw clean package -DskipTests

    # Expose the port your app runs on
    EXPOSE 8001

    # Run the application
    CMD ["java", "-jar", "target/dental-clinic-0.0.1-SNAPSHOT.jar"]