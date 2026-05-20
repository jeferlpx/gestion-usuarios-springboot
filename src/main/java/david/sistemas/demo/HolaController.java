package david.sistemas.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HolaController {

    @GetMapping("/hola")
    public String diHola() {
        return "¡Hola Mundo desde Spring Boot y Maven!";
    }
}