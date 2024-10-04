package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.dto.UserRegistrationDTO;
import bitc.fullstack.meausrepro_spring.model.MeausreProUser;
import bitc.fullstack.meausrepro_spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/meausrepro/user")
public class AuthController {
    @Autowired
    private UserService userService;

    // 회원가입
    @PostMapping("/register")
    public MeausreProUser register(@RequestBody UserRegistrationDTO registrationDTO) {
        return userService.registerUser(registrationDTO);
    }
}
