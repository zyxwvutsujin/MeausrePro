package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProUser;
import bitc.fullstack.meausrepro_spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // 암호화 객체 생성
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 로그인
    public Optional<MeausreProUser> findById(String id) {
        return userRepository.findById(id);
    }

    // 회원가입
    public MeausreProUser registerUser(UserRegistrationDTO registrationDTO) {
        MeausreProUser newUser = new MeausreProUser();
        newUser.setId(registrationDTO.getId());
        newUser.setPass(passwordEncoder.encode(registrationDTO.getPass())); // 패스워드 암호화
        newUser.setName(registrationDTO.getName());
        newUser.setTel(registrationDTO.getTel());
        newUser.setRole(registrationDTO.getRole());

        return userRepository.save(newUser);
    }

    // 비밀번호 확인
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
