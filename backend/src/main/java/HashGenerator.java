import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGenerator {
    public static void main(String[] args) {
        String rawPassword = "v3@08062025"; // Your desired password
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(rawPassword);
        System.out.println("Raw Password: " + rawPassword);
        System.out.println("Hashed Password: " + hashedPassword);
    }
} 