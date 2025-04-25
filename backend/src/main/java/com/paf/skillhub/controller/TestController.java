package main.java.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class TestController {

    @GetMapping("/test")
    public String testSecuredEndpoint() {
        return "✅ This is a protected API! You have a valid token!";
    }
}
