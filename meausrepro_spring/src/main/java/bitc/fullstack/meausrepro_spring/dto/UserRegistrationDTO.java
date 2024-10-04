package bitc.fullstack.meausrepro_spring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationDTO {
    private String id;
    private String pass;
    private String name;
    private String tel;
    private char role;
}
